"use client"

import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChefHat, ListChecks, ScanLine, Utensils, Sparkles, ArrowRight, TrendingUp, Clock } from "lucide-react"
import Link from "next/link"

const PLACEHOLDER_LISTS = [
  {
    id: 1,
    name: "Weekly Groceries",
    items: [
      { id: 1, name: "Milk", quantity: "2 gallons" },
      { id: 2, name: "Eggs", quantity: "1 dozen" },
      { id: 3, name: "Bread", quantity: "2 loaves" },
    ],
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: "BBQ Party Supplies",
    items: [
      { id: 4, name: "Burger Buns", quantity: "24 pack" },
      { id: 5, name: "Ground Beef", quantity: "5 lbs" },
      { id: 6, name: "Cheese Slices", quantity: "2 packs" },
    ],
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 3,
    name: "Meal Prep Essentials",
    items: [
      { id: 7, name: "Chicken Breast", quantity: "3 lbs" },
      { id: 8, name: "Brown Rice", quantity: "2 bags" },
      { id: 9, name: "Broccoli", quantity: "4 heads" },
    ],
    created_at: new Date(Date.now() - 172800000).toISOString(),
  },
]

export default function DashboardPage() {
  const stats = {
    activeLists: 5,
    itemsTracked: 42,
    mealsPlanned: 8,
  }
  const recentLists = PLACEHOLDER_LISTS

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            AI-Powered Pantry Management
          </div>
          <h1 className="mb-4 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Welcome to SmartShelf
          </h1>
          <p className="mx-auto max-w-2xl text-pretty text-lg text-muted-foreground">
            Your intelligent kitchen assistant that helps you manage groceries, plan meals, and never run out of
            essentials.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="group transition-all hover:shadow-lg">
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <ChefHat className="h-6 w-6" />
              </div>
              <CardTitle>Meal Planner</CardTitle>
              <CardDescription>
                Plan your meals and get AI-generated shopping lists with exact quantities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/meal-planner">
                <Button variant="ghost" className="w-full justify-between">
                  Start Planning
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group transition-all hover:shadow-lg">
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10 text-secondary transition-colors group-hover:bg-secondary group-hover:text-secondary-foreground">
                <ListChecks className="h-6 w-6" />
              </div>
              <CardTitle>Manual Lists</CardTitle>
              <CardDescription>Create and manage custom shopping lists for any occasion</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/manual-lists">
                <Button variant="ghost" className="w-full justify-between">
                  Create List
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group transition-all hover:shadow-lg">
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                <ScanLine className="h-6 w-6" />
              </div>
              <CardTitle>Inventory Check</CardTitle>
              <CardDescription>Upload shelf photos and AI will tell you what needs restocking</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/inventory">
                <Button variant="ghost" className="w-full justify-between">
                  Check Inventory
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group transition-all hover:shadow-lg">
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Utensils className="h-6 w-6" />
              </div>
              <CardTitle>Meal Suggestions</CardTitle>
              <CardDescription>Show what you have and get personalized dinner ideas from AI</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/meal-suggestions">
                <Button variant="ghost" className="w-full justify-between">
                  Get Suggestions
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Stats and Recent Activity */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Quick Stats */}
          <div className="space-y-6 lg:col-span-2">
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription className="flex items-center gap-2">
                    <ListChecks className="h-4 w-4" />
                    Active Lists
                  </CardDescription>
                  <CardTitle className="text-3xl">
                    <span className="flex items-baseline gap-2">
                      {stats.activeLists}
                      <span className="flex items-center gap-1 text-sm font-normal text-green-600">
                        <TrendingUp className="h-3 w-3" />
                        Active
                      </span>
                    </span>
                  </CardTitle>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardDescription className="flex items-center gap-2">
                    <ScanLine className="h-4 w-4" />
                    Items Tracked
                  </CardDescription>
                  <CardTitle className="text-3xl">{stats.itemsTracked}</CardTitle>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardDescription className="flex items-center gap-2">
                    <ChefHat className="h-4 w-4" />
                    Meals Planned
                  </CardDescription>
                  <CardTitle className="text-3xl">{stats.mealsPlanned}</CardTitle>
                </CardHeader>
              </Card>
            </div>

            {/* Recent Lists */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Shopping Lists</CardTitle>
                <CardDescription>Your most recently created lists</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentLists.map((list) => (
                    <div key={list.id} className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <h4 className="font-medium text-foreground">{list.name}</h4>
                        <p className="text-sm text-muted-foreground">{list.items.length} items</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {new Date(list.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Get started with SmartShelf</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/meal-planner">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <ChefHat className="h-4 w-4" />
                  Plan This Week's Meals
                </Button>
              </Link>
              <Link href="/manual-lists">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <ListChecks className="h-4 w-4" />
                  Create Shopping List
                </Button>
              </Link>
              <Link href="/inventory">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <ScanLine className="h-4 w-4" />
                  Check My Pantry
                </Button>
              </Link>
              <Link href="/meal-suggestions">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Utensils className="h-4 w-4" />
                  Get Meal Ideas
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
