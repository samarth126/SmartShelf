# api/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    InventoryItemViewSet,
    InventoryListViewSet,
    ShoppingListViewSet,
    CreatePlanView, 
      InventoryListItemsView,  # <- keep import
      StockMatchingView
)

# Router for ViewSets only
router = DefaultRouter()
router.register(r'inventory-items', InventoryItemViewSet, basename='inventoryitem')
router.register(r'inventory-lists', InventoryListViewSet, basename='inventorylist')
router.register(r'shopping-lists', ShoppingListViewSet, basename='shoppinglist')

# Combine router URLs + APIView URL
urlpatterns = [
    path('', include(router.urls)),                  # all router-based endpoints
    path('create_plan/', CreatePlanView.as_view(), name='create_plan'),  # <-- direct APIView
    path('stock-matching/', StockMatchingView.as_view(), name='stock-matching'),  # <-- direct APIView
    path('inventory-lists-all/', InventoryListItemsView.as_view(), name='inventory_lists_all'),
]
