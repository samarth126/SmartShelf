"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft, Plus, Send, ImageIcon, Box } from "lucide-react"
import Link from "next/link"

interface Bill {
  id: string
  name: string
  date: string
}

export default function StockBoxPage() {
  const [bills, setBills] = useState<Bill[]>([
    { id: "1", name: "Oct 5", date: "2024-10-05" },
    { id: "2", name: "Oct 21", date: "2024-10-21" },
    { id: "3", name: "Nov 5", date: "2024-11-05" },
  ])
  const [message, setMessage] = useState("")

  const handleImageUpload = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const date = new Date()
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        const billName = `${monthNames[date.getMonth()]} ${date.getDate()}`
        setBills([...bills, { id: Date.now().toString(), name: billName, date: date.toISOString() }])
      }
    }
    input.click()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-primary">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="flex items-center gap-3 text-3xl font-bold text-foreground">
              <Box className="h-8 w-8 text-primary" />
              Stock Box
            </h1>
            <p className="text-muted-foreground">Upload bills and track your inventory</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Bills List */}
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Your Bills</span>
                <Button
                  onClick={handleImageUpload}
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Upload Bill
                </Button>
              </CardTitle>
              <CardDescription>All your uploaded grocery bills</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-3">
                  {bills.map((bill) => (
                    <div
                      key={bill.id}
                      className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 transition-all hover:border-primary hover:shadow-lg hover:shadow-primary/10"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <ImageIcon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{bill.name}</h3>
                        <p className="text-sm text-muted-foreground">{new Date(bill.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Interface */}
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle>AI Assistant</CardTitle>
              <CardDescription>Ask questions about your inventory</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-[500px] flex-col">
                <ScrollArea className="flex-1 pr-4">
                  <div className="space-y-4">
                    <div className="rounded-lg bg-muted p-4">
                      <p className="text-sm text-foreground">
                        Hello! I'm your SmartShelf assistant. Upload a bill or ask me anything about your inventory.
                      </p>
                    </div>
                  </div>
                </ScrollArea>

                <div className="mt-4 flex gap-2">
                  <Button
                    onClick={handleImageUpload}
                    variant="outline"
                    size="icon"
                    className="shrink-0 border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                  >
                    <Plus className="h-5 w-5" />
                  </Button>
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask about your inventory..."
                    className="flex-1 border-primary/30 focus-visible:ring-primary"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && message.trim()) {
                        setMessage("")
                      }
                    }}
                  />
                  <Button size="icon" className="shrink-0 bg-primary text-primary-foreground hover:bg-primary/90">
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
