from django.contrib import admin
from .models import InventoryItem, InventoryList, ShoppingList


@admin.register(InventoryItem)
class InventoryItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'quantity', 'brand')
    search_fields = ('name', 'brand')
    ordering = ('name',)


@admin.register(InventoryList)
class InventoryListAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'purpose', 'created_at')
    search_fields = ('name', 'purpose')
    filter_horizontal = ('inventory_items',)
    ordering = ('-created_at',)


@admin.register(ShoppingList)
class ShoppingListAdmin(admin.ModelAdmin):
    list_display = ('id', 'item_name', 'brand', 'quantity_needed', 'created_at')
    search_fields = ('item_name', 'brand')
    ordering = ('-created_at',)
