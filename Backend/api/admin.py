from django.contrib import admin
from .models import (
    Product,
    PantryLocation,
    InventoryItem,
    Meal,
    MealIngredient,
    MealPlan,
    MealPlanEntry,
    ShoppingList,
    ShoppingListItem,
    InventoryAudit,
    DinnerPlan,
)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "brand", "category", "default_unit", "typical_package_size")
    search_fields = ("name", "brand", "category")
    list_filter = ("category",)
    ordering = ("name",)


@admin.register(PantryLocation)
class PantryLocationAdmin(admin.ModelAdmin):
    list_display = ("name", "user", "description")
    search_fields = ("name", "user__username")
    list_filter = ("user",)


@admin.register(InventoryItem)
class InventoryItemAdmin(admin.ModelAdmin):
    list_display = ("product", "user", "quantity", "unit", "location", "source", "updated_at")
    list_filter = ("user", "location", "source")
    search_fields = ("product__name", "user__username")
    readonly_fields = ("created_at", "updated_at")


class MealIngredientInline(admin.TabularInline):
    model = MealIngredient
    extra = 1


@admin.register(Meal)
class MealAdmin(admin.ModelAdmin):
    list_display = ("name", "user", "created_at", "updated_at")
    list_filter = ("user",)
    search_fields = ("name", "description", "user__username")
    inlines = [MealIngredientInline]
    readonly_fields = ("created_at", "updated_at")


class MealPlanEntryInline(admin.TabularInline):
    model = MealPlanEntry
    extra = 1


@admin.register(MealPlan)
class MealPlanAdmin(admin.ModelAdmin):
    list_display = ("title", "user", "period_start", "period_end", "created_at")
    list_filter = ("user",)
    search_fields = ("title", "user__username")
    inlines = [MealPlanEntryInline]
    readonly_fields = ("created_at", "updated_at")


class ShoppingListItemInline(admin.TabularInline):
    model = ShoppingListItem
    extra = 1


@admin.register(ShoppingList)
class ShoppingListAdmin(admin.ModelAdmin):
    list_display = ("title", "user", "type", "status", "period_month", "created_at")
    list_filter = ("user", "type", "status")
    search_fields = ("title", "user__username")
    inlines = [ShoppingListItemInline]
    readonly_fields = ("created_at", "updated_at")


@admin.register(InventoryAudit)
class InventoryAuditAdmin(admin.ModelAdmin):
    list_display = ("user", "matched_list", "created_at")
    list_filter = ("user",)
    readonly_fields = ("result_json", "created_at", "updated_at")
    search_fields = ("user__username",)


@admin.register(DinnerPlan)
class DinnerPlanAdmin(admin.ModelAdmin):
    list_display = ("user", "created_at")
    readonly_fields = ("llm_request_json", "llm_response_json", "created_at", "updated_at")
    search_fields = ("user__username",)
