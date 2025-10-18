"use client"

import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ClipboardList, Calendar, Package, ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

// Placeholder data for all lists
const PLACEHOLDER_LISTS = [
  {
    id: "1",
    name: "Weekly Groceries",
    type: "manual",
    itemCount: 12,
    created_at: new Date().toISOString(),
    items: [
      { id: 1, name: "Milk", quantity: "2 gallons", checked: false },
      { id: 2, name: "Eggs", quantity: "1 dozen", checked: true },
      { id: 3, name: "Bread", quantity: "2 loaves", checked: false },
      { id: 4, name: "Butter", quantity: "1 lb", checked: false },
      { id: 5, name: "Cheese", quantity: "8 oz", checked: true },
      { id: 6, name: "Yogurt", quantity: "6 pack", checked: false },
      { id: 7, name: "Apples", quantity: "2 lbs", checked: false },
      { id: 8, name: "Bananas", quantity: "1 bunch", checked: true },
      { id: 9, name: "Carrots", quantity: "1 bag", checked: false },
      { id: 10, name: "Lettuce", quantity: "1 head", checked: false },
      { id: 11, name: "Tomatoes", quantity: "4 pieces", checked: false },
      { id: 12, name: "Onions", quantity: "3 pieces", checked: false },
    ],
  },
  {
    id: "2",
    name: "BBQ Party Supplies",
    type: "ai-generated",
    itemCount: 15,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    items: [
      { id: 13, name: "Burger Buns", quantity: "24 pack", checked: false },
      { id: 14, name: "Ground Beef", quantity: "5 lbs", checked: false },
      { id: 15, name: "Cheese Slices", quantity: "2 packs", checked: true },
      { id: 16, name: "Lettuce", quantity: "2 heads", checked: false },
      { id: 17, name: "Tomatoes", quantity: "8 pieces", checked: false },
      { id: 18, name: "Onions", quantity: "4 pieces", checked: false },
      { id: 19, name: "Pickles", quantity: "1 jar", checked: false },
      { id: 20, name: "Ketchup", quantity: "2 bottles", checked: true },
      { id: 21, name: "Mustard", quantity: "1 bottle", checked: false },
      { id: 22, name: "BBQ Sauce", quantity: "2 bottles", checked: false },
      { id: 23, name: "Hot Dog Buns", quantity: "16 pack", checked: false },
      { id: 24, name: "Hot Dogs", quantity: "2 packs", checked: false },
      { id: 25, name: "Potato Chips", quantity: "3 bags", checked: false },
      { id: 26, name: "Soda", quantity: "12 pack", checked: false },
      { id: 27, name: "Ice", quantity: "2 bags", checked: false },
    ],
  },
  {
    id: "3",
    name: "Meal Prep Essentials",
    type: "ai-generated",
    itemCount: 10,
    created_at: new Date(Date.now() - 172800000).toISOString(),
    items: [
      { id: 28, name: "Chicken Breast", quantity: "3 lbs", checked: false },
      { id: 29, name: "Brown Rice", quantity: "2 bags", checked: false },
      { id: 30, name: "Broccoli", quantity: "4 heads", checked: false },
      { id: 31, name: "Sweet Potatoes", quantity: "5 lbs", checked: true },
      { id: 32, name: "Olive Oil", quantity: "1 bottle", checked: false },
      { id: 33, name: "Garlic", quantity: "2 bulbs", checked: false },
      { id: 34, name: "Soy Sauce", quantity: "1 bottle", checked: false },
      { id: 35, name: "Meal Prep Containers", quantity: "20 pack", checked: true },
      { id: 36, name: "Spinach", quantity: "2 bags", checked: false },
      { id: 37, name: "Bell Peppers", quantity: "6 pieces", checked: false },
    ],
  },
  {
    id: "4",
    name: "Pantry Restock",
    type: "manual",
    itemCount: 8,
    created_at: new Date(Date.now() - 259200000).toISOString(),
    items: [
      { id: 38, name: "Coke", quantity: "12 pack", checked: false },
      { id: 39, name: "Fanta", quantity: "6 pack", checked: false },
      { id: 40, name: "Funyuns", quantity: "2 bags", checked: true },
      { id: 41, name: "Vegetable Oil", quantity: "1 gallon", checked: false },
      { id: 42, name: "Salt", quantity: "1 container", checked: false },
      { id: 43, name: "Black Pepper", quantity: "1 container", checked: false },
      { id: 44, name: "Sugar", quantity: "5 lbs", checked: false },
      { id: 45, name: "Flour", quantity: "10 lbs", checked: false },
    ],
  },
  {
    id: "5",
    name: "Breakfast Items",
    type: "manual",
    itemCount: 9,
    created_at: new Date(Date.now() - 345600000).toISOString(),
    items: [
      { id: 46, name: "Cereal", quantity: "2 boxes", checked: false },
      { id: 47, name: "Oatmeal", quantity: "1 container", checked: false },
      { id: 48, name: "Pancake Mix", quantity: "1 box", checked: true },
      { id: 49, name: "Maple Syrup", quantity: "1 bottle", checked: false },
      { id: 50, name: "Coffee", quantity: "1 bag", checked: false },
      { id: 51, name: "Orange Juice", quantity: "1 gallon", checked: false },
      { id: 52, name: "Bacon", quantity: "1 lb", checked: false },
      { id: 53, name: "Bagels", quantity: "6 pack", checked: false },
      { id: 54, name: "Cream Cheese", quantity: "8 oz", checked: false },
    ],
  },
  {
    id: "6",
    name: "Snack Attack",
    type: "ai-generated",
    itemCount: 11,
    created_at: new Date(Date.now() - 432000000).toISOString(),
    items: [
      { id: 55, name: "Doritos", quantity: "3 bags", checked: false },
      { id: 56, name: "Pretzels", quantity: "2 bags", checked: false },
      { id: 57, name: "Popcorn", quantity: "6 pack", checked: false },
      { id: 58, name: "Granola Bars", quantity: "12 pack", checked: true },
      { id: 59, name: "Trail Mix", quantity: "2 bags", checked: false },
      { id: 60, name: "Crackers", quantity: "2 boxes", checked: false },
      { id: 61, name: "Hummus", quantity: "2 containers", checked: false },
      { id: 62, name: "String Cheese", quantity: "12 pack", checked: false },
      { id: 63, name: "Apple Sauce", quantity: "6 pack", checked: false },
      { id: 64, name: "Fruit Snacks", quantity: "20 pack", checked: false },
      { id: 65, name: "Cookies", quantity: "2 packs", checked: false },
    ],
  },
]

export default function AllListsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-2">
            <ClipboardList className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight text-foreground">My Lists</h1>
          </div>
          <p className="text-lg text-muted-foreground">View and manage all your shopping lists in one place</p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Lists</CardDescription>
              <CardTitle className="text-3xl">{PLACEHOLDER_LISTS.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Items</CardDescription>
              <CardTitle className="text-3xl">
                {PLACEHOLDER_LISTS.reduce((sum, list) => sum + list.itemCount, 0)}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>AI Generated</CardDescription>
              <CardTitle className="text-3xl">
                {PLACEHOLDER_LISTS.filter((list) => list.type === "ai-generated").length}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Lists Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PLACEHOLDER_LISTS.map((list) => {
            const checkedItems = list.items.filter((item) => item.checked).length
            const progress = Math.round((checkedItems / list.itemCount) * 100)

            return (
              <Link key={list.id} href={`/lists/${list.id}`}>
                <Card className="group transition-all hover:shadow-lg hover:border-primary/50">
                  <CardHeader>
                    <div className="mb-2 flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <ClipboardList className="h-6 w-6" />
                      </div>
                      <Badge variant={list.type === "ai-generated" ? "default" : "secondary"}>
                        {list.type === "ai-generated" ? (
                          <span className="flex items-center gap-1">
                            <Sparkles className="h-3 w-3" />
                            AI
                          </span>
                        ) : (
                          "Manual"
                        )}
                      </Badge>
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors">{list.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      {list.itemCount} items
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Progress Bar */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium text-foreground">{progress}%</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                          <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {checkedItems} of {list.itemCount} items checked
                        </p>
                      </div>

                      {/* Date */}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {new Date(list.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>

                      {/* View Button */}
                      <Button
                        variant="ghost"
                        className="w-full justify-between group-hover:bg-primary group-hover:text-primary-foreground"
                      >
                        View Details
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </main>
    </div>
  )
}
