from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, mixins, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import *
from .serializers import *
# from .services.planners import PlannerService
# from .services.llm import LLMService
# from .services.matchers import MatcherService

class IsOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return getattr(obj, "user_id", None) == request.user.id

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by("name")
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]

class MealViewSet(viewsets.ModelViewSet):
    serializer_class = MealSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Meal.objects.filter(user=self.request.user).order_by("-updated_at")

class InventoryItemViewSet(viewsets.ModelViewSet):
    serializer_class = InventoryItemSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        return InventoryItem.objects.filter(user=self.request.user).select_related("product")

class ShoppingListViewSet(viewsets.ModelViewSet):
    serializer_class = ShoppingListSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        return ShoppingList.objects.filter(user=self.request.user).prefetch_related("items__product")

    @action(detail=True, methods=["post"], url_path="generate-from-mealplan")
    def generate_from_mealplan(self, request, pk=None):
        mp_id = request.data.get("meal_plan_id")
        if not mp_id:
            return Response({"detail": "meal_plan_id required"}, status=400)
        try:
            mp = MealPlan.objects.get(id=mp_id, user=request.user)
        except MealPlan.DoesNotExist:
            return Response({"detail": "not found"}, status=404)
        sl = PlannerService.generate_monthly_list(request.user, mp)
        return Response(ShoppingListSerializer(sl).data)

class InventoryAuditViewSet(viewsets.GenericViewSet, mixins.CreateModelMixin, mixins.RetrieveModelMixin):
    queryset = InventoryAudit.objects.all()
    permission_classes = [permissions.IsAuthenticated, IsOwner]
    serializer_class = serializers.ModelSerializer  # simple placeholder

    def create(self, request, *args, **kwargs):
        image = request.FILES.get("image")
        matched_list_id = request.data.get("matched_list_id")
        if not image or not matched_list_id:
            return Response({"detail": "image and matched_list_id required"}, status=400)
        sl = ShoppingList.objects.get(id=matched_list_id, user=request.user)
        audit = InventoryAudit.objects.create(user=request.user, image=image, matched_list=sl)

        # Run VLM (sync for hackathon simplicity)
        llm = LLMService()
        candidate = [
            {"product_id": item.product_id, "name": item.product.name, "unit": item.unit}
            for item in sl.items.select_related("product")
        ]
        result = llm.analyze_inventory_image(audit.image.path, candidate)
        audit.result_json = result
        audit.summary = f"Analyzed against list {sl.id}"
        audit.save()

        MatcherService.apply_audit_to_list(sl, result)
        return Response({"audit_id": audit.id, "result": result})

class DinnerPlanViewSet(viewsets.GenericViewSet, mixins.CreateModelMixin, mixins.RetrieveModelMixin):
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=["post"], url_path="from-inventory")
    def from_inventory(self, request):
        image = request.FILES.get("image")
        inv = InventoryItem.objects.filter(user=request.user).select_related("product")
        inv_payload = [
            {"product_id": x.product_id, "name": x.product.name, "qty": float(x.quantity), "unit": x.unit}
            for x in inv
        ]
        llm = LLMService()
        result = llm.dinner_from_inventory(inv_payload)
        dp = DinnerPlan.objects.create(user=request.user, image=image if image else None,
                                       llm_request_json={"inventory": inv_payload},
                                       llm_response_json=result,
                                       summary=result.get("summary", ""))
        return Response({"dinner_plan_id": dp.id, **result})