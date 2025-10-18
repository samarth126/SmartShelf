from django.db import models

# Table 1: Inventory Items
class InventoryItem(models.Model):
    name = models.CharField(max_length=100, default="Untitled Item")
    quantity = models.FloatField(default=0)
    brand = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"{self.name} ({self.quantity})"


# Table 2: Inventory List (for meal or purpose)
class InventoryList(models.Model):
    name = models.CharField(max_length=100)
    purpose = models.CharField(max_length=200, blank=True, null=True)
    inventory_items = models.ManyToManyField(InventoryItem, related_name='inventory_lists')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name}"


# Table 3: Shopping List (for needed items)
class ShoppingList(models.Model):
    item_name = models.CharField(max_length=100)
    brand = models.CharField(max_length=100, blank=True, null=True)
    quantity_needed = models.FloatField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.item_name} ({self.quantity_needed})"
