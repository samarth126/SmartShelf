
from rest_framework import serializers
from .models import *

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = "__all__"

class MealIngredientSerializer(serializers.ModelSerializer):
    product_detail = ProductSerializer(source="product", read_only=True)

    class Meta:
        model = MealIngredient
        fields = ["id", "product", "product_detail", "quantity", "unit", "optional"]

class MealSerializer(serializers.ModelSerializer):
    ingredients = MealIngredientSerializer(many=True)

    class Meta:
        model = Meal
        fields = ["id", "name", "description", "tags", "ingredients", "created_at", "updated_at"]

    def create(self, validated_data):
        ings = validated_data.pop("ingredients", [])
        meal = Meal.objects.create(user=self.context["request"].user, **validated_data)
        for ing in ings:
            MealIngredient.objects.create(meal=meal, **ing)
        return meal

    def update(self, instance, validated_data):
        ings = validated_data.pop("ingredients", None)
        for k, v in validated_data.items():
            setattr(instance, k, v)
        instance.save()
        if ings is not None:
            instance.ingredients.all().delete()
            for ing in ings:
                MealIngredient.objects.create(meal=instance, **ing)
        return instance

class InventoryItemSerializer(serializers.ModelSerializer):
    product_detail = ProductSerializer(source="product", read_only=True)

    class Meta:
        model = InventoryItem
        fields = "__all__"
        read_only_fields = ["user"]

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        return super().create(validated_data)

class ShoppingListItemSerializer(serializers.ModelSerializer):
    product_detail = ProductSerializer(source="product", read_only=True)

    class Meta:
        model = ShoppingListItem
        fields = "__all__"

class ShoppingListSerializer(serializers.ModelSerializer):
    items = ShoppingListItemSerializer(many=True)

    class Meta:
        model = ShoppingList
        fields = ["id", "title", "type", "status", "period_month", "generated_from", "items", "created_at", "updated_at"]

    def create(self, validated_data):
        items = validated_data.pop("items", [])
        sl = ShoppingList.objects.create(user=self.context["request"].user, **validated_data)
        for it in items:
            ShoppingListItem.objects.create(shopping_list=sl, **it)
        return sl