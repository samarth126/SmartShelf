from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import InventoryItemViewSet, InventoryListViewSet, ShoppingListViewSet
router = DefaultRouter()
router.register(r'inventory-items', InventoryItemViewSet, basename='inventoryitem')
router.register(r'inventory-lists', InventoryListViewSet, basename='inventorylist')
router.register(r'shopping-lists', ShoppingListViewSet, basename='shoppinglist')
# router.register(r'create-plan', CreatePlanView, basename='createplan')

urlpatterns = [
    path('', include(router.urls)),
]
