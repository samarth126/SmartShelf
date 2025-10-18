"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ListChecks, Plus, X, Save, Trash2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"

const manualListSchema = z.object({
  listName: z.string().min(1, "List name is required"),
  items: z
    .array(
      z.object({
        name: z.string().min(1, "Item name is required"),
        quantity: z.string().min(1, "Quantity is required"),
      }),
    )
    .min(1, "Add at least one item"),
})

type ManualListForm = z.infer<typeof manualListSchema>

interface ListItem {
  name: string
  quantity: string
  checked: boolean
}

interface SavedList {
  id: number
  name: string
  items: { id: number; name: string; quantity: string }[]
}

const INITIAL_SAVED_LISTS: SavedList[] = [
  {
    id: 1,
    name: "Weekend BBQ",
    items: [
      { id: 1, name: "Burger Buns", quantity: "24 pack" },
      { id: 2, name: "Ground Beef", quantity: "5 lbs" },
      { id: 3, name: "Cheese Slices", quantity: "2 packs" },
      { id: 4, name: "Lettuce", quantity: "2 heads" },
      { id: 5, name: "Tomatoes", quantity: "6 pieces" },
    ],
  },
  {
    id: 2,
    name: "Breakfast Essentials",
    items: [
      { id: 6, name: "Eggs", quantity: "2 dozen" },
      { id: 7, name: "Bacon", quantity: "2 lbs" },
      { id: 8, name: "Orange Juice", quantity: "1 gallon" },
      { id: 9, name: "Pancake Mix", quantity: "2 boxes" },
    ],
  },
]

export default function ManualListsPage() {
  const [items, setItems] = useState<ListItem[]>([{ name: "", quantity: "", checked: false }])
  const [savedLists, setSavedLists] = useState<SavedList[]>(INITIAL_SAVED_LISTS)
  const [isSaving, setIsSaving] = useState(false)

  const form = useForm<ManualListForm>({
    resolver: zodResolver(manualListSchema),
    defaultValues: {
      listName: "",
      items: [{ name: "", quantity: "" }],
    },
  })

  const addItem = () => {
    const newItems = [...items, { name: "", quantity: "", checked: false }]
    setItems(newItems)
    form.setValue(
      "items",
      newItems.map(({ name, quantity }) => ({ name, quantity })),
    )
  }

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index)
    setItems(newItems)
    form.setValue(
      "items",
      newItems.map(({ name, quantity }) => ({ name, quantity })),
    )
  }

  const updateItem = (index: number, field: "name" | "quantity", value: string) => {
    const newItems = [...items]
    newItems[index][field] = value
    setItems(newItems)
    form.setValue(
      "items",
      newItems.map(({ name, quantity }) => ({ name, quantity })),
    )
  }

  const toggleItemCheck = (index: number) => {
    const newItems = [...items]
    newItems[index].checked = !newItems[index].checked
    setItems(newItems)
  }

  const onSubmit = async (data: ManualListForm) => {
    setIsSaving(true)
    setTimeout(() => {
      const newList: SavedList = {
        id: Date.now(),
        name: data.listName,
        items: data.items
          .filter((item) => item.name.trim() !== "")
          .map((item, index) => ({
            id: Date.now() + index,
            name: item.name,
            quantity: item.quantity,
          })),
      }
      setSavedLists([newList, ...savedLists])

      // Reset form
      form.reset()
      setItems([{ name: "", quantity: "", checked: false }])
      setIsSaving(false)
    }, 1000)
  }

  const deleteList = (listId: number) => {
    setSavedLists(savedLists.filter((list) => list.id !== listId))
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
              <ListChecks className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Manual Shopping Lists</h1>
              <p className="text-muted-foreground">Create custom shopping lists for any occasion</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
          {/* List Creation Form */}
          <Card>
            <CardHeader>
              <CardTitle>Create New List</CardTitle>
              <CardDescription>Add items manually with custom quantities</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="listName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>List Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Weekend BBQ, Party Supplies" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Items</Label>
                      <Button type="button" variant="outline" size="sm" onClick={addItem}>
                        <Plus className="h-4 w-4" />
                        Add Item
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {items.map((item, index) => (
                        <div key={index} className="flex gap-2">
                          <div className="flex items-center">
                            <Checkbox
                              checked={item.checked}
                              onCheckedChange={() => toggleItemCheck(index)}
                              className="mr-2"
                            />
                          </div>
                          <Input
                            placeholder="Item name"
                            value={item.name}
                            onChange={(e) => updateItem(index, "name", e.target.value)}
                            className={item.checked ? "line-through opacity-50" : ""}
                          />
                          <Input
                            placeholder="Qty"
                            value={item.quantity}
                            onChange={(e) => updateItem(index, "quantity", e.target.value)}
                            className={`w-32 ${item.checked ? "line-through opacity-50" : ""}`}
                          />
                          {items.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItem(index)}
                              className="shrink-0"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isSaving}>
                    <Save className="h-4 w-4" />
                    {isSaving ? "Saving..." : "Save List"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Saved Lists */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Saved Lists</CardTitle>
                <CardDescription>Your custom shopping lists</CardDescription>
              </CardHeader>
              <CardContent>
                {savedLists.length > 0 ? (
                  <div className="space-y-3">
                    {savedLists.map((list) => (
                      <div key={list.id} className="rounded-lg border bg-card p-4">
                        <div className="mb-3 flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-foreground">{list.name}</h3>
                            <p className="text-sm text-muted-foreground">{list.items.length} items</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteList(list.id)}
                            className="h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="space-y-1">
                          {list.items.slice(0, 3).map((item) => (
                            <p key={item.id} className="text-sm text-muted-foreground">
                              • {item.name} - {item.quantity}
                            </p>
                          ))}
                          {list.items.length > 3 && (
                            <p className="text-sm text-muted-foreground">+ {list.items.length - 3} more items</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex min-h-[200px] items-center justify-center rounded-lg border-2 border-dashed">
                    <div className="text-center">
                      <ListChecks className="mx-auto mb-3 h-12 w-12 text-muted-foreground/50" />
                      <p className="text-sm text-muted-foreground">No saved lists yet</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
