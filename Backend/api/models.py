# Create your models here.
from django.conf import settings
from django.db import models
from django.utils import timezone
from .enums import Unit, ShoppingListType, ShoppingItemStatus

User = settings.AUTH_USER_MODEL

class Timestamped(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

class Product(Timestamped):
    name = models.CharField(max_length=200)
    brand = models.CharField(max_length=120, blank=True)
    upc = models.CharField(max_length=64, blank=True)
    default_unit = models.CharField(max_length=8, choices=Unit.choices, default=Unit.EACH)
    typical_package_size = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    category = models.CharField(max_length=120, blank=True)

    def __str__(self):
        return self.name

class PantryLocation(Timestamped):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=120)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

class InventoryItem(Timestamped):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    location = models.ForeignKey(PantryLocation, on_delete=models.SET_NULL, null=True, blank=True)
    quantity = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    unit = models.CharField(max_length=8, choices=Unit.choices)
    source = models.CharField(max_length=16, default="manual")  # manual|vision

class Meal(Timestamped):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    tags = models.JSONField(default=list, blank=True)

    def __str__(self):
        return self.name

class MealIngredient(models.Model):
    meal = models.ForeignKey(Meal, on_delete=models.CASCADE, related_name="ingredients")
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    unit = models.CharField(max_length=8, choices=Unit.choices)
    optional = models.BooleanField(default=False)

class MealPlan(Timestamped):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    period_start = models.DateField()
    period_end = models.DateField()

class MealPlanEntry(models.Model):
    meal_plan = models.ForeignKey(MealPlan, on_delete=models.CASCADE, related_name="entries")
    meal = models.ForeignKey(Meal, on_delete=models.CASCADE)
    servings = models.PositiveIntegerField(default=1)
    cadence = models.CharField(max_length=16, default="weekly")  # simple for v1

class ShoppingList(Timestamped):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    type = models.CharField(max_length=8, choices=ShoppingListType.choices, default=ShoppingListType.MANUAL)
    status = models.CharField(max_length=16, default="draft")
    period_month = models.CharField(max_length=7, blank=True)  # e.g., 2025-10
    generated_from = models.ForeignKey(MealPlan, on_delete=models.SET_NULL, null=True, blank=True)

class ShoppingListItem(models.Model):
    shopping_list = models.ForeignKey(ShoppingList, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    required_qty = models.DecimalField(max_digits=10, decimal_places=2)
    unit = models.CharField(max_length=8, choices=Unit.choices)
    status = models.CharField(max_length=12, choices=ShoppingItemStatus.choices, default=ShoppingItemStatus.MISSING)
    source = models.CharField(max_length=8, default="manual")
    notes = models.CharField(max_length=240, blank=True)

class InventoryAudit(Timestamped):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    image = models.ImageField(upload_to="audits/%Y/%m/%d/")
    matched_list = models.ForeignKey(ShoppingList, on_delete=models.SET_NULL, null=True, blank=True)
    result_json = models.JSONField(default=dict, blank=True)
    summary = models.TextField(blank=True)

class DinnerPlan(Timestamped):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    image = models.ImageField(upload_to="dinners/%Y/%m/%d/", null=True, blank=True)
    llm_request_json = models.JSONField(default=dict, blank=True)
    llm_response_json = models.JSONField(default=dict, blank=True)
    summary = models.TextField(blank=True)
