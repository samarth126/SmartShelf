"use client"

import type React from "react"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Utensils, Upload, Loader2, Camera, Sparkles, ShoppingCart } from "lucide-react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"

const PLACEHOLDER_SUGGESTIONS = {
  suggestions: [
    {
      meal_name: "Creamy Chicken Alfredo",
      description:
        "A rich and indulgent pasta dish with tender chicken breast in a creamy parmesan sauce. Perfect for a comforting dinner that comes together in under 30 minutes.",
      missing_items: ["Heavy Cream", "Parmesan Cheese", "Fettuccine Pasta"],
    },
    {
      meal_name: "Vegetable Stir-Fry with Rice",
      description:
        "A colorful and healthy stir-fry loaded with fresh vegetables in a savory sauce. Quick to prepare and packed with nutrients, served over fluffy white rice.",
      missing_items: ["Soy Sauce", "Sesame Oil"],
    },
    {
      meal_name: "Mediterranean Salmon Bowl",
      description:
        "Grilled salmon served over quinoa with fresh vegetables, olives, and a tangy lemon-herb dressing. A light yet satisfying meal full of omega-3s and Mediterranean flavors.",
      missing_items: ["Salmon Fillet", "Quinoa", "Kalamata Olives", "Feta Cheese"],
    },
  ],
}

export default function MealSuggestionsPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [suggestions, setSuggestions] = useState<typeof PLACEHOLDER_SUGGESTIONS | null>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result as string)
        setSuggestions(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const generateSuggestions = async () => {
    if (!selectedImage) return

    setIsGenerating(true)
    setTimeout(() => {
      setSuggestions(PLACEHOLDER_SUGGESTIONS)
      setIsGenerating(false)
    }, 2500)
  }

  const clearImage = () => {
    setSelectedImage(null)
    setSuggestions(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Utensils className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Meal Suggestions</h1>
              <p className="text-muted-foreground">Show us what you have and get personalized dinner ideas from AI</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Image Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Ingredients Photo</CardTitle>
              <CardDescription>Take a photo of your available ingredients</CardDescription>
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
                        alt="Uploaded ingredients"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={generateSuggestions} disabled={isGenerating} className="flex-1">
                        {isGenerating ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Generating Ideas...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4" />
                            Get Meal Ideas
                          </>
                        )}
                      </Button>
                      <Button variant="outline" onClick={clearImage} disabled={isGenerating}>
                        <Upload className="h-4 w-4" />
                        New Photo
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Suggestions Section */}
          <Card>
            <CardHeader>
              <CardTitle>AI Meal Suggestions</CardTitle>
              <CardDescription>
                {suggestions ? "Personalized recipes based on your ingredients" : "Suggestions will appear here"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {suggestions ? (
                <div className="max-h-[500px] space-y-4 overflow-y-auto">
                  {suggestions.suggestions.map((suggestion, index) => (
                    <div key={index} className="rounded-lg border bg-card p-4 transition-all hover:shadow-md">
                      <div className="mb-3 flex items-start justify-between">
                        <h3 className="text-lg font-semibold text-foreground">{suggestion.meal_name}</h3>
                        <Badge variant="secondary" className="shrink-0">
                          <Sparkles className="mr-1 h-3 w-3" />
                          AI
                        </Badge>
                      </div>

                      <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{suggestion.description}</p>

                      {suggestion.missing_items.length > 0 && (
                        <div className="rounded-md bg-muted/50 p-3">
                          <p className="mb-2 text-xs font-medium text-foreground">You'll need to buy:</p>
                          <div className="flex flex-wrap gap-2">
                            {suggestion.missing_items.map((item, itemIndex) => (
                              <Badge key={itemIndex} variant="outline" className="text-xs">
                                {item}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <Button variant="outline" size="sm" className="mt-3 w-full bg-transparent">
                        <ShoppingCart className="h-4 w-4" />
                        Add Missing Items to List
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex min-h-[400px] items-center justify-center rounded-lg border-2 border-dashed">
                  <div className="text-center">
                    <Utensils className="mx-auto mb-3 h-12 w-12 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">Upload a photo to get meal suggestions</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* How It Works Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <span className="font-bold">1</span>
                </div>
                <div>
                  <h4 className="mb-1 font-medium text-foreground">Upload Photo</h4>
                  <p className="text-sm text-muted-foreground">
                    Take a photo of your fridge, pantry, or ingredients on your counter
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <span className="font-bold">2</span>
                </div>
                <div>
                  <h4 className="mb-1 font-medium text-foreground">AI Analysis</h4>
                  <p className="text-sm text-muted-foreground">
                    Our AI identifies your ingredients and generates creative meal ideas
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <span className="font-bold">3</span>
                </div>
                <div>
                  <h4 className="mb-1 font-medium text-foreground">Get Cooking</h4>
                  <p className="text-sm text-muted-foreground">
                    Choose a recipe and add any missing ingredients to your shopping list
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
