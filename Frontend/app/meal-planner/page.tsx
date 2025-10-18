"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChefHat, Plus, X, Loader2, ShoppingCart } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

const mealPlanSchema = z.object({
  planName: z.string().min(1, "Plan name is required"),
  meals: z.array(z.string().min(1, "Meal cannot be empty")).min(1, "Add at least one meal"),
})

type MealPlanForm = z.infer<typeof mealPlanSchema>

const PLACEHOLDER_SHOPPING_LIST = {
  id: 1,
  name: "This Week's Meals",
  items: [
    { id: 1, name: "Spaghetti Pasta", quantity: "2 boxes (16 oz each)" },
    { id: 2, name: "Ground Beef", quantity: "2 lbs" },
    { id: 3, name: "Tomato Sauce", quantity: "3 cans (24 oz each)" },
    { id: 4, name: "Garlic", quantity: "2 bulbs" },
    { id: 5, name: "Onions", quantity: "3 medium" },
    { id: 6, name: "Parmesan Cheese", quantity: "8 oz" },
    { id: 7, name: "Chicken Breast", quantity: "4 lbs" },
    { id: 8, name: "Bell Peppers", quantity: "6 mixed colors" },
    { id: 9, name: "Soy Sauce", quantity: "1 bottle (10 oz)" },
    { id: 10, name: "Rice", quantity: "2 lbs" },
    { id: 11, name: "Salmon Fillets", quantity: "4 pieces (6 oz each)" },
    { id: 12, name: "Lemon", quantity: "4 pieces" },
    { id: 13, name: "Fresh Herbs", quantity: "1 bunch each (parsley, dill)" },
  ],
  created_at: new Date().toISOString(),
}

export default function MealPlannerPage() {
  const [meals, setMeals] = useState<string[]>([""])
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedList, setGeneratedList] = useState<typeof PLACEHOLDER_SHOPPING_LIST | null>(null)

  const form = useForm<MealPlanForm>({
    resolver: zodResolver(mealPlanSchema),
    defaultValues: {
      planName: "",
      meals: [""],
    },
  })

  const addMeal = () => {
    setMeals([...meals, ""])
    form.setValue("meals", [...meals, ""])
  }

  const removeMeal = (index: number) => {
    const newMeals = meals.filter((_, i) => i !== index)
    setMeals(newMeals)
    form.setValue("meals", newMeals)
  }

  const updateMeal = (index: number, value: string) => {
    const newMeals = [...meals]
    newMeals[index] = value
    setMeals(newMeals)
    form.setValue("meals", newMeals)
  }

  const onSubmit = async (data: MealPlanForm) => {
    setIsGenerating(true)
    setTimeout(() => {
      setGeneratedList({
        ...PLACEHOLDER_SHOPPING_LIST,
        name: data.planName,
      })
      setIsGenerating(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ChefHat className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Meal Planner</h1>
              <p className="text-muted-foreground">Plan your meals and get an AI-generated shopping list</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Meal Planning Form */}
          <Card>
            <CardHeader>
              <CardTitle>Create Meal Plan</CardTitle>
              <CardDescription>Add your meals and we'll generate a shopping list with quantities</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="planName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Plan Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., This Week's Meals" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Meals</Label>
                      <Button type="button" variant="outline" size="sm" onClick={addMeal}>
                        <Plus className="h-4 w-4" />
                        Add Meal
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {meals.map((meal, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            placeholder={`Meal ${index + 1} (e.g., Spaghetti Carbonara)`}
                            value={meal}
                            onChange={(e) => updateMeal(index, e.target.value)}
                          />
                          {meals.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeMeal(index)}
                              className="shrink-0"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isGenerating}>
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Generating List...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-4 w-4" />
                        Generate Shopping List
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Generated Shopping List */}
          <Card>
            <CardHeader>
              <CardTitle>Shopping List</CardTitle>
              <CardDescription>
                {generatedList ? "Your AI-generated shopping list" : "Your list will appear here"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {generatedList ? (
                <div className="space-y-4">
                  <div className="rounded-lg bg-muted/50 p-4">
                    <h3 className="mb-3 font-semibold text-foreground">{generatedList.name}</h3>
                    <div className="max-h-[400px] space-y-2 overflow-y-auto">
                      {generatedList.items.map((item) => (
                        <div key={item.id} className="flex items-start gap-3 rounded-md bg-background p-3">
                          <div className="flex-1">
                            <p className="font-medium text-foreground">{item.name}</p>
                            <p className="text-sm text-muted-foreground">{item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 bg-transparent">
                      Save List
                    </Button>
                    <Button variant="outline" className="flex-1 bg-transparent">
                      Export
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex min-h-[300px] items-center justify-center rounded-lg border-2 border-dashed">
                  <div className="text-center">
                    <ShoppingCart className="mx-auto mb-3 h-12 w-12 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">Add meals and generate your shopping list</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
