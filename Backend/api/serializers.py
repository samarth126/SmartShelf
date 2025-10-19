from rest_framework import serializers
from .models import InventoryItem, InventoryList, ShoppingList



# --- Inventory Item Serializer ---
class InventoryItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryItem
        fields = ['id', 'name', 'quantity', 'brand']


# --- Inventory List Serializer ---
class InventoryListSerializer(serializers.ModelSerializer):
    inventory_items = InventoryItemSerializer(many=True, read_only=True)
    item_ids = serializers.PrimaryKeyRelatedField(
        many=True, queryset=InventoryItem.objects.all(), write_only=True, source='inventory_items'
    )

    class Meta:
        model = InventoryList
        fields = ['id', 'name', 'purpose', 'inventory_items', 'item_ids', 'created_at']


# --- Shopping List Serializer ---
class ShoppingListSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShoppingList
        fields = ['id', 'item_name', 'brand', 'quantity_needed', 'created_at']


class CreatePlanSerializer(serializers.Serializer):
    text = serializers.CharField()
    image = serializers.ImageField(required=False)

class StockListMatchingSerializer(serializers.Serializer):
    image = serializers.ImageField(required=False)
    list_id = serializers.IntegerField(required=False)