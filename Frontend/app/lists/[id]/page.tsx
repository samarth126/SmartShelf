"use client"

import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Calendar, Package, Sparkles, Download, Share2, Trash2, CheckCircle2, Circle } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useParams } from "next/navigation"

// Same placeholder data as in the lists page
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

export default function ListDetailPage() {
  const params = useParams()
  const listId = params.id as string

  // Find the list by ID
  const list = PLACEHOLDER_LISTS.find((l) => l.id === listId)

  // State for managing checked items
  const [items, setItems] = useState(list?.items || [])

  if (!list) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">List not found</h1>
            <Link href="/lists">
              <Button className="mt-4">Back to Lists</Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  const toggleItem = (itemId: number) => {
    setItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, checked: !item.checked } : item)))
  }

  const checkedItems = items.filter((item) => item.checked).length
  const progress = Math.round((checkedItems / items.length) * 100)

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link href="/lists">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to Lists
          </Button>
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <div className="mb-2 flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">{list.name}</h1>
                <Badge variant={list.type === "ai-generated" ? "default" : "secondary"}>
                  {list.type === "ai-generated" ? (
                    <span className="flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      AI Generated
                    </span>
                  ) : (
                    "Manual"
                  )}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(list.created_at).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Package className="h-4 w-4" />
                  {list.itemCount} items
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Progress Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Shopping Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {checkedItems} of {items.length} items completed
                  </span>
                  <span className="text-lg font-bold text-foreground">{progress}%</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Items List */}
        <Card>
          <CardHeader>
            <CardTitle>Items</CardTitle>
            <CardDescription>Check off items as you shop</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-4 rounded-lg border p-4 transition-all ${
                    item.checked ? "bg-muted/50 opacity-60" : "bg-card hover:bg-muted/30"
                  }`}
                >
                  <Checkbox id={`item-${item.id}`} checked={item.checked} onCheckedChange={() => toggleItem(item.id)} />
                  <div className="flex flex-1 items-center justify-between">
                    <div className="flex items-center gap-3">
                      {item.checked ? (
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground" />
                      )}
                      <label
                        htmlFor={`item-${item.id}`}
                        className={`cursor-pointer text-base font-medium ${
                          item.checked ? "text-muted-foreground line-through" : "text-foreground"
                        }`}
                      >
                        {item.name}
                      </label>
                    </div>
                    <span className="text-sm text-muted-foreground">{item.quantity}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
