"use client"

import type React from "react"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScanLine, Upload, Loader2, CheckCircle2, XCircle, Camera } from "lucide-react"
import Image from "next/image"

const PLACEHOLDER_INVENTORY = {
  results: [
    { item: "Milk", status: "available", confidence: 0.95 },
    { item: "Eggs", status: "available", confidence: 0.92 },
    { item: "Bread", status: "missing", confidence: 0.88 },
    { item: "Butter", status: "available", confidence: 0.91 },
    { item: "Cheese", status: "available", confidence: 0.89 },
    { item: "Yogurt", status: "missing", confidence: 0.85 },
    { item: "Orange Juice", status: "available", confidence: 0.93 },
    { item: "Cereal", status: "missing", confidence: 0.87 },
    { item: "Coffee", status: "available", confidence: 0.94 },
    { item: "Sugar", status: "missing", confidence: 0.82 },
  ],
}

export default function InventoryPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [inventoryResults, setInventoryResults] = useState<typeof PLACEHOLDER_INVENTORY | null>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result as string)
        setInventoryResults(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const analyzeInventory = async () => {
    if (!selectedImage) return

    setIsAnalyzing(true)
    setTimeout(() => {
      setInventoryResults(PLACEHOLDER_INVENTORY)
      setIsAnalyzing(false)
    }, 2500)
  }

  const clearImage = () => {
    setSelectedImage(null)
    setInventoryResults(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <ScanLine className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Inventory Check</h1>
              <p className="text-muted-foreground">
                Upload a photo of your pantry and AI will identify what needs restocking
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Image Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Shelf Photo</CardTitle>
              <CardDescription>Take a clear photo of your pantry, fridge, or shelves</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {!selectedImage ? (
                  <label className="flex min-h-[400px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/20 transition-colors hover:bg-muted/40">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      capture="environment"
                    />
                    <Camera className="mb-4 h-16 w-16 text-muted-foreground/50" />
                    <p className="mb-2 text-sm font-medium text-foreground">Click to upload or take a photo</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG, WEBP up to 10MB</p>
                  </label>
                ) : (
                  <div className="space-y-4">
                    <div className="relative aspect-video overflow-hidden rounded-lg border">
                      <Image
                        src={selectedImage || "/placeholder.svg"}
                        alt="Uploaded shelf"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={analyzeInventory} disabled={isAnalyzing} className="flex-1">
                        {isAnalyzing ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <ScanLine className="h-4 w-4" />
                            Analyze Inventory
                          </>
                        )}
                      </Button>
                      <Button variant="outline" onClick={clearImage} disabled={isAnalyzing}>
                        <Upload className="h-4 w-4" />
                        New Photo
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card>
            <CardHeader>
              <CardTitle>Analysis Results</CardTitle>
              <CardDescription>
                {inventoryResults ? "Items detected in your photo" : "Results will appear here"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {inventoryResults ? (
                <div className="space-y-4">
                  <div className="grid gap-3">
                    {/* Available Items */}
                    <div className="rounded-lg bg-green-500/10 p-4">
                      <h3 className="mb-3 flex items-center gap-2 font-semibold text-green-700 dark:text-green-400">
                        <CheckCircle2 className="h-5 w-5" />
                        Available Items
                      </h3>
                      <div className="space-y-2">
                        {inventoryResults.results
                          .filter((item) => item.status === "available")
                          .map((item, index) => (
                            <div key={index} className="flex items-center justify-between rounded-md bg-background p-3">
                              <span className="font-medium text-foreground">{item.item}</span>
                              <span className="text-sm text-muted-foreground">
                                {Math.round(item.confidence * 100)}% confident
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Missing Items */}
                    <div className="rounded-lg bg-red-500/10 p-4">
                      <h3 className="mb-3 flex items-center gap-2 font-semibold text-red-700 dark:text-red-400">
                        <XCircle className="h-5 w-5" />
                        Needs Restocking
                      </h3>
                      <div className="space-y-2">
                        {inventoryResults.results
                          .filter((item) => item.status === "missing")
                          .map((item, index) => (
                            <div key={index} className="flex items-center justify-between rounded-md bg-background p-3">
                              <span className="font-medium text-foreground">{item.item}</span>
                              <span className="text-sm text-muted-foreground">
                                {Math.round(item.confidence * 100)}% confident
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full bg-transparent">
                    Create Shopping List from Missing Items
                  </Button>
                </div>
              ) : (
                <div className="flex min-h-[400px] items-center justify-center rounded-lg border-2 border-dashed">
                  <div className="text-center">
                    <ScanLine className="mx-auto mb-3 h-12 w-12 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">Upload a photo to see analysis results</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tips Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Tips for Best Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Camera className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="mb-1 font-medium text-foreground">Good Lighting</h4>
                  <p className="text-sm text-muted-foreground">
                    Ensure your shelves are well-lit and items are visible
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <ScanLine className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="mb-1 font-medium text-foreground">Clear View</h4>
                  <p className="text-sm text-muted-foreground">Take photos straight-on with minimal obstructions</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="mb-1 font-medium text-foreground">Organized Shelves</h4>
                  <p className="text-sm text-muted-foreground">Arrange items so labels are facing forward</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
