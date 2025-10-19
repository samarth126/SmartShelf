"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import InventoryListService, { InventoryList } from "@/components/Services/Inventory_list.service"
import { useRouter } from "next/navigation"
import StockBoxService from "@/components/Services/StockBox.service"
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

interface ChatMessage {
  id: string
  text: string
  isUser: boolean
  timestamp: string
}

export default function StockBoxPage() {
  const router = useRouter()
  const [inventoryLists, setInventoryLists] = useState<InventoryList[]>([])
  const [message, setMessage] = useState("")
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      text: "Hello! I'm your SmartShelf assistant. Upload a bill or ask me anything about your inventory.",
      isUser: false,
      timestamp: new Date().toISOString()
    }
  ])
  
  useEffect(() => {
    const fetchInventoryLists = async () => {
      try {
        const data = await InventoryListService.get_inventory_lists()
        setInventoryLists(data.inventory_lists)
        // Store in localStorage for the detail page
        localStorage.setItem('inventory_lists', JSON.stringify(data.inventory_lists))
      } catch (error) {
        console.error("Error fetching inventory lists:", error)
      }
    }
    
    fetchInventoryLists()
  }, [])

  const handleImageUpload = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        try {
          const date = new Date()
          const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
          const billName = `${monthNames[date.getMonth()]} ${date.getDate()}`
          
        
          // Get any text from the message input
          const currentMessage = message.trim()
          
          // Upload to server with both image and text
          const response = await StockBoxService.uploadBillImage(file, currentMessage)
          
          // Clear the message input if it was used
          if (currentMessage) {
            setMessage("")
          }
          
          // Add system message about successful upload
          setChatMessages(prev => [...prev, {
            id: Date.now().toString(),
            text: `Successfully processed bill from ${billName}${currentMessage ? ' with note: ' + currentMessage : ''}. ${response.message || ''}`,
            isUser: false,
            timestamp: new Date().toISOString()
          }])
        } catch (error) {
          console.error('Error uploading bill:', error)
          setChatMessages(prev => [...prev, {
            id: Date.now().toString(),
            text: 'Sorry, there was an error processing your bill. Please try again.',
            isUser: false,
            timestamp: new Date().toISOString()
          }])
        }
      }
    }
    input.click()
  }

  const handleSendMessage = async () => {
    if (!message.trim()) return

    const userMessage = {
      id: Date.now().toString(),
      text: message,
      isUser: true,
      timestamp: new Date().toISOString()
    }

    setChatMessages(prev => [...prev, userMessage])
    setMessage("")

    try {
      const response = await StockBoxService.sendMessage(message)
      setChatMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: response.message || 'Thank you for your message.',
        isUser: false,
        timestamp: new Date().toISOString()
      }])
    } catch (error) {
      console.error('Error sending message:', error)
      setChatMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, there was an error processing your message. Please try again.',
        isUser: false,
        timestamp: new Date().toISOString()
      }])
    }
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
            {/* Inventory Lists */}
            <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
              <span>Your Inventory Lists</span>
              </CardTitle>
              <CardDescription>All your inventory lists</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-3">
                {inventoryLists.map((list) => (
                <div
                  key={list.id}
                  onClick={() => router.push(`/inventory-list/${list.id}`)}
                  className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 transition-all hover:border-primary hover:shadow-lg hover:shadow-primary/10 cursor-pointer"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <ImageIcon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{list.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {list.inventory_items.length} items • Created {new Date(list.created_at).toLocaleDateString()}
                    </p>
                    {list.purpose && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{list.purpose}</p>
                    )}
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
                    {chatMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`rounded-lg p-4 ${
                          msg.isUser
                            ? 'bg-primary text-primary-foreground ml-8'
                            : 'bg-muted text-foreground mr-8'
                        }`}
                      >
                        <p className="text-sm">{msg.text}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    ))}
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
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button 
                    size="icon" 
                    className="shrink-0 bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                  >
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
