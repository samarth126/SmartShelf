"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft, Upload, ShoppingCart, Store, DollarSign, Package, CheckCircle2, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import InventoryListService, { type InventoryList } from "@/components/Services/Inventory_list.service"
import StockMatchingService from "@/components/Services/stock-matching.service"

interface MatchingResult {
  message: string
  list_id: number
  list_name: string
  restock_list: string[]
  cheapest_info: {
    store: string
    estimated_total_cost: number
  }
  total_missing_items: number
}

export default function SmartCartPage() {
  const [inventoryLists, setInventoryLists] = useState<InventoryList[]>([])
  const [selectedListId, setSelectedListId] = useState<number | null>(null)
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [matchingResult, setMatchingResult] = useState<MatchingResult | null>(null)

  useEffect(() => {
    // Fetch inventory lists on mount
    const fetchInventoryLists = async () => {
      try {
        const data = await InventoryListService.get_inventory_lists()
        setInventoryLists(data.inventory_lists)
      } catch (error) {
        console.error("Error fetching inventory lists:", error)
      }
    }

    fetchInventoryLists()
  }, [])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async () => {
    if (!uploadedImage || !selectedListId) {
      alert("Please upload an image and select a list")
      return
    }

    setLoading(true)
    try {
      const result = await StockMatchingService.match_stock(uploadedImage, selectedListId)
      setMatchingResult(result)
    } catch (error) {
      console.error("Error matching stock:", error)
      alert("Failed to match stock. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setMatchingResult(null)
    setUploadedImage(null)
    setImagePreview(null)
    setSelectedListId(null)
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
            <p className="text-muted-foreground">AI-powered stock matching and shopping assistant</p>
          </div>
        </div>

        {!matchingResult ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Left Side - Upload Image */}
            <Card className="border-2 border-secondary/20">
              <CardHeader>
                <CardTitle>Upload Stock Image</CardTitle>
                <CardDescription>Take a photo of your current stock or pantry</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-secondary/30 bg-secondary/5 p-8 transition-colors hover:border-secondary/50">
                    {imagePreview ? (
                      <div className="relative h-64 w-full">
                        <Image
                          src={imagePreview || "/placeholder.svg"}
                          alt="Uploaded stock"
                          fill
                          className="rounded-lg object-contain"
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-4 text-center">
                        <Upload className="h-16 w-16 text-secondary/50" />
                        <div>
                          <p className="text-sm font-medium text-foreground">Upload your stock image</p>
                          <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="image-upload" className="cursor-pointer">
                      <Input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="cursor-pointer"
                      />
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Right Side - Select List */}
            <Card className="border-2 border-secondary/20">
              <CardHeader>
                <CardTitle>Select Inventory List</CardTitle>
                <CardDescription>Choose which list to compare against</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-3">
                    {inventoryLists.map((list) => (
                      <div
                        key={list.id}
                        onClick={() => setSelectedListId(list.id)}
                        className={`cursor-pointer rounded-lg border-2 p-4 transition-all hover:shadow-md ${
                          selectedListId === list.id
                            ? "border-secondary bg-secondary/10"
                            : "border-border bg-card hover:border-secondary/50"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground">{list.name}</h3>
                            <p className="text-sm text-muted-foreground">{list.purpose}</p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              Created: {new Date(list.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          {selectedListId === list.id && <CheckCircle2 className="h-6 w-6 text-secondary" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Results Display */
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="border-2 border-secondary/20 bg-gradient-to-br from-secondary/10 to-secondary/5">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Package className="h-5 w-5 text-secondary" />
                    Missing Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-foreground">{matchingResult.total_missing_items}</p>
                  <p className="text-sm text-muted-foreground">Items to restock</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-secondary/20 bg-gradient-to-br from-green-500/10 to-green-500/5">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Store className="h-5 w-5 text-green-600" />
                    Best Store
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-foreground">{matchingResult.cheapest_info.store}</p>
                  <p className="text-sm text-muted-foreground">Cheapest option</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-secondary/20 bg-gradient-to-br from-blue-500/10 to-blue-500/5">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <DollarSign className="h-5 w-5 text-blue-600" />
                    Estimated Cost
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-foreground">
                    ${matchingResult.cheapest_info.estimated_total_cost.toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">Total at {matchingResult.cheapest_info.store}</p>
                </CardContent>
              </Card>
            </div>

            {/* Restock List */}
            <Card className="border-2 border-secondary/20">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Restock List for {matchingResult.list_name}</span>
                  <Button onClick={handleReset} variant="outline" size="sm">
                    Start New Match
                  </Button>
                </CardTitle>
                <CardDescription>Items you need to purchase</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {matchingResult.restock_list.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 rounded-lg border border-secondary/30 bg-card p-3 transition-all hover:border-secondary hover:shadow-md"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/10 text-sm font-semibold text-secondary">
                          {index + 1}
                        </div>
                        <span className="flex-1 text-sm font-medium text-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Submit Button */}
        {!matchingResult && (
          <div className="mt-6 flex justify-center">
            <Button
              onClick={handleSubmit}
              disabled={!uploadedImage || !selectedListId || loading}
              size="lg"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing Stock...
                </>
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Match Stock & Find Deals
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
