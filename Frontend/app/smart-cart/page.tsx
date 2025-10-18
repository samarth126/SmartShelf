"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft, Plus, Send, ShoppingCart, Trash2 } from "lucide-react"
import Link from "next/link"

interface GroceryItem {
  id: string
  name: string
  checked: boolean
}

export default function SmartCartPage() {
  const [groceryList, setGroceryList] = useState<GroceryItem[]>([
    { id: "1", name: "Milk", checked: false },
    { id: "2", name: "Eggs", checked: false },
    { id: "3", name: "Bread", checked: false },
    { id: "4", name: "Chicken", checked: false },
    { id: "5", name: "Rice", checked: false },
    { id: "6", name: "Tomatoes", checked: false },
    { id: "7", name: "Cheese", checked: false },
    { id: "8", name: "Yogurt", checked: false },
  ])
  const [message, setMessage] = useState("")

  const shoppingList = groceryList.filter((item) => item.checked)

  const toggleItem = (id: string) => {
    setGroceryList(groceryList.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)))
  }

  const removeFromCart = (id: string) => {
    setGroceryList(groceryList.map((item) => (item.id === id ? { ...item, checked: false } : item)))
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-secondary">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="flex items-center gap-3 text-3xl font-bold text-foreground">
              <ShoppingCart className="h-8 w-8 text-secondary" />
              Smart Cart
            </h1>
            <p className="text-muted-foreground">Build your intelligent shopping list</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Chat Interface - Left Side */}
          <Card className="border-2 border-secondary/20 lg:col-span-1">
            <CardHeader>
              <CardTitle>AI Assistant</CardTitle>
              <CardDescription>Get smart suggestions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-[600px] flex-col">
                <ScrollArea className="flex-1 pr-4">
                  <div className="space-y-4">
                    <div className="rounded-lg bg-muted p-4">
                      <p className="text-sm text-foreground">
                        Hi! I can help you build your shopping list. Check items you need, or ask me for suggestions
                        based on your inventory.
                      </p>
                    </div>
                  </div>
                </ScrollArea>

                <div className="mt-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="shrink-0 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground bg-transparent"
                  >
                    <Plus className="h-5 w-5" />
                  </Button>
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask for suggestions..."
                    className="flex-1 border-secondary/30 focus-visible:ring-secondary"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && message.trim()) {
                        setMessage("")
                      }
                    }}
                  />
                  <Button size="icon" className="shrink-0 bg-secondary text-secondary-foreground hover:bg-secondary/90">
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right Side - Checklist and Shopping Cart */}
          <div className="space-y-6 lg:col-span-2">
            {/* Grocery Checklist */}
            <Card className="border-2 border-secondary/20">
              <CardHeader>
                <CardTitle>Grocery Checklist</CardTitle>
                <CardDescription>Check items you need to buy</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[280px] pr-4">
                  <div className="space-y-3">
                    {groceryList.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition-all hover:border-secondary hover:shadow-md"
                      >
                        <Checkbox
                          id={item.id}
                          checked={item.checked}
                          onCheckedChange={() => toggleItem(item.id)}
                          className="border-secondary data-[state=checked]:bg-secondary data-[state=checked]:text-secondary-foreground"
                        />
                        <label
                          htmlFor={item.id}
                          className={`flex-1 cursor-pointer text-sm font-medium ${
                            item.checked ? "text-muted-foreground line-through" : "text-foreground"
                          }`}
                        >
                          {item.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Shopping Cart */}
            <Card className="border-2 border-secondary/20">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Your Shopping Cart</span>
                  <span className="text-sm font-normal text-muted-foreground">{shoppingList.length} items</span>
                </CardTitle>
                <CardDescription>Items ready to purchase</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[240px] pr-4">
                  {shoppingList.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-center text-muted-foreground">
                      <p>No items in cart. Check items above to add them.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {shoppingList.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between rounded-lg border border-secondary/30 bg-secondary/5 p-3"
                        >
                          <span className="font-medium text-foreground">{item.name}</span>
                          <Button
                            onClick={() => removeFromCart(item.id)}
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
