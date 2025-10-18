from django.db import models

class Unit(models.TextChoices):
    EACH = "ea", "each"
    G = "g", "gram"
    KG = "kg", "kilogram"
    ML = "ml", "milliliter"
    L = "l", "liter"
    OZ = "oz", "ounce"
    LB = "lb", "pound"
    CUP = "cup", "cup"
    TBSP = "tbsp", "tablespoon"
    TSP = "tsp", "teaspoon"

class ShoppingListType(models.TextChoices):
    AUTO = "auto", "Auto"
    MANUAL = "manual", "Manual"

class ShoppingItemStatus(models.TextChoices):
    MISSING = "missing", "Missing"
    LOW = "low", "Low"
    OK = "ok", "OK"
    PURCHASED = "purchased", "Purchased"
    