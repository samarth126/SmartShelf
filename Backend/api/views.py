from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import InventoryItem, InventoryList, ShoppingList
from .serializers import (
    InventoryItemSerializer,
    InventoryListSerializer,
    ShoppingListSerializer,
    CreatePlanSerializer,
    StockListMatchingSerializer,
    PartyPlanningSerializer
)
from .Services.planning_list_gen import send_to_gemini

from .Services.stock_matching_service import match_stock_with_list

from .Services.feastbeast import plan_party_with_inventory

# --- Inventory Item CRUD ---
class InventoryItemViewSet(viewsets.ModelViewSet):
    queryset = InventoryItem.objects.all()
    serializer_class = InventoryItemSerializer
    permission_classes = [permissions.AllowAny]


# --- Inventory List CRUD ---
class InventoryListViewSet(viewsets.ModelViewSet):
    queryset = InventoryList.objects.all()
    serializer_class = InventoryListSerializer
    permission_classes = [permissions.AllowAny]


# --- Shopping List CRUD ---
class ShoppingListViewSet(viewsets.ModelViewSet):
    queryset = ShoppingList.objects.all()
    serializer_class = ShoppingListSerializer
    permission_classes = [permissions.AllowAny]


# --- AI Plan Creation ---
class CreatePlanView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = CreatePlanSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        text_input = serializer.validated_data.get('text')
        image_file = serializer.validated_data.get('image', None)

        # ✅ Send to Gemini
        gemini_response = send_to_gemini(image_file, text_input)

        if "error" in gemini_response:
            return Response(gemini_response, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        shopping_data = gemini_response.get("shopping_list", [])
        if not shopping_data:
            return Response({"error": "No shopping list returned from Gemini"}, status=status.HTTP_400_BAD_REQUEST)

        # ✅ Create InventoryList
        inventory_list = InventoryList.objects.create(
            name=text_input[:50],
            purpose=text_input[:150]
        )

        created_items = []
        for item_data in shopping_data:
            name = item_data.get("item", "").strip()
            quantity = item_data.get("quantity", "").strip()
            if not name:
                continue

            item_obj, _ = InventoryItem.objects.get_or_create(name=name)
            item_obj.quantity = quantity
            item_obj.save()
            inventory_list.inventory_items.add(item_obj)
            created_items.append({
                "name": item_obj.name,
                "quantity": item_obj.quantity
            })

        inventory_list.save()

        return Response({
            "message": "Plan created successfully",
            "inventory_list": {
                "id": inventory_list.id,
                "name": inventory_list.name,
                "purpose": inventory_list.purpose,
                "created_at": inventory_list.created_at,
                "items": created_items
            }
        }, status=status.HTTP_201_CREATED)


# --- GET all lists or items of specific list ---
class InventoryListItemsView(APIView):
    """
    GET /api/inventory-lists-all/  -> returns all inventory lists
    GET /api/inventory-lists-all/?list_id=3  -> returns all items of a specific list
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        list_id = request.query_params.get("list_id")

        # If list_id provided → return items of that list
        if list_id:
            try:
                inventory_list = InventoryList.objects.get(id=list_id)
            except InventoryList.DoesNotExist:
                return Response({"error": "List not found"}, status=status.HTTP_404_NOT_FOUND)

            items = inventory_list.inventory_items.all()
            items_data = InventoryItemSerializer(items, many=True).data

            return Response({
                "list_id": inventory_list.id,
                "list_name": inventory_list.name,
                "purpose": inventory_list.purpose,
                "created_at": inventory_list.created_at,
                "items": items_data
            }, status=status.HTTP_200_OK)

        # Otherwise → return all lists
        all_lists = InventoryList.objects.all().order_by("-created_at")
        lists_data = InventoryListSerializer(all_lists, many=True).data

        return Response({
            "count": len(lists_data),
            "inventory_lists": lists_data
        }, status=status.HTTP_200_OK)




# --- Stock Matching View ---
class StockMatchingView(APIView):
    """
    POST /api/stock-matching/
    Compares stock image with an inventory list to find missing items
    and suggests cheapest places to buy them.
    
    Required fields:
        - image: Image of current stock/pantry
        - list_id: ID of the inventory list to compare against
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = StockListMatchingSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        image_file = serializer.validated_data.get('image', None)
        list_id = serializer.validated_data.get('list_id', None)

        # Validate required fields
        if not image_file:
            return Response(
                {"error": "Image is required for stock matching"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not list_id:
            return Response(
                {"error": "list_id is required to compare stock"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get the inventory list
        try:
            inventory_list = InventoryList.objects.get(id=list_id)
        except InventoryList.DoesNotExist:
            return Response(
                {"error": f"Inventory list with id {list_id} not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        # Get all items in the list
        items = inventory_list.inventory_items.all()
        items_data = InventoryItemSerializer(items, many=True).data

        if not items_data:
            return Response(
                {"error": "The selected inventory list has no items to compare"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Send to Gemini for stock matching
        gemini_response = match_stock_with_list(
            image_file=image_file,
            list_id=list_id,
            inventory_list_items=items_data
        )

        if "error" in gemini_response:
            return Response(
                gemini_response,
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # Validate response structure
        restock_list = gemini_response.get("restock_list", [])
        cheapest_info = gemini_response.get("cheapest_info", {})

        return Response({
            "message": "Stock matching completed successfully",
            "list_id": list_id,
            "list_name": inventory_list.name,
            "restock_list": restock_list,
            "cheapest_info": cheapest_info,
            "total_missing_items": len(restock_list)
        }, status=status.HTTP_200_OK)

class PartyPlanningView(APIView):
    """
    POST /api/plan-party/
    Plans a party based on inventory and party details, and suggests additional items needed.
    
    Required fields:
        - list_id: ID of the inventory list
        - party_prompt: Description of dishes and number of guests
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = PartyPlanningSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        list_id = serializer.validated_data.get("list_id")
        party_prompt = serializer.validated_data.get("party_prompt")

        # Fetch inventory list
        try:
            inventory_list = InventoryList.objects.get(id=list_id)
        except InventoryList.DoesNotExist:
            return Response({"error": "Inventory list not found"}, status=status.HTTP_404_NOT_FOUND)

        # Get items in the inventory list
        items = inventory_list.inventory_items.all()
        if not items.exists():
            return Response({"error": "Selected inventory list has no items"}, status=status.HTTP_400_BAD_REQUEST)

        items_data = InventoryItemSerializer(items, many=True).data

        # Call party planning service
        gemini_response = plan_party_with_inventory(
            list_id=list_id,
            party_prompt=party_prompt,
            inventory_list_items=items_data
        )

        if "error" in gemini_response:
            return Response(gemini_response, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({
            "message": "Party planning completed successfully",
            "list_id": list_id,
            "list_name": inventory_list.name,
            "party_shopping_list": gemini_response.get("party_shopping_list", []),
            "cheapest_info": gemini_response.get("cheapest_info", {}),
            "total_missing_items": len(gemini_response.get("party_shopping_list", []))
        }, status=status.HTTP_200_OK)