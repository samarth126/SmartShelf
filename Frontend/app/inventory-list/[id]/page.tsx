"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Box, Package2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { InventoryList } from "@/components/Services/Inventory_list.service"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function InventoryListPage({ params }: { params: { id: string } }) {
  const [inventoryList, setInventoryList] = useState<InventoryList | null>(null)

  useEffect(() => {
    // Get the list from local storage
    const lists = localStorage.getItem('inventory_lists')
    if (lists) {
      const parsedLists = JSON.parse(lists)
      const list = parsedLists.find((l: InventoryList) => l.id === parseInt(params.id))
      if (list) {
        setInventoryList(list)
      }
    }
  }, [params.id])

  if (!inventoryList) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Link href="/stock-box">
            <Button variant="ghost" size="icon" className="text-primary">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="flex items-center gap-3 text-3xl font-bold text-foreground">
              <Box className="h-8 w-8 text-primary" />
              {inventoryList.name}
            </h1>
            <p className="text-muted-foreground">{inventoryList.purpose}</p>
          </div>
        </div>

        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle>Items in List</CardTitle>
            <CardDescription>Created on {new Date(inventoryList.created_at).toLocaleDateString()}</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] pr-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {inventoryList.inventory_items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-4 rounded-lg border border-border bg-card p-4 transition-all hover:border-primary hover:shadow-lg hover:shadow-primary/10"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Package2 className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                      {item.brand && (
                        <p className="text-sm text-muted-foreground">Brand: {item.brand}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
