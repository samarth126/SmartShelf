from rest_framework import viewsets, permissions
from .models import InventoryItem, InventoryList, ShoppingList
from .serializers import  InventoryItemSerializer, InventoryListSerializer, ShoppingListSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

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



# class CreatePlanView(APIView):
#     def post(self, request, *args, **kwargs):
#         serializer = CreatePlanSerializer(data=request.data)
#         if not serializer.is_valid():
#             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#         text_input = serializer.validated_data.get('text')
#         image_file = serializer.validated_data.get('image')

#         # Print or log the data
#         print("Received Text:", text_input)

#         if image_file:
#             print("Received Image Name:", image_file.name)
#             print("Content Type:", image_file.content_type)
#             print("Image Size:", image_file.size, "bytes")
#         else:
#             print("No image provided.")

#         # Optionally, return a confirmation response
#         return Response({
#             "message": "Data received successfully",
#             "text": text_input,
#             "image": image_file.name if image_file else None
#         }, status=status.HTTP_200_OK)