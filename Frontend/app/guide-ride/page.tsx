"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Box, ShoppingCart, PartyPopper, Info, Zap, Target, Trophy } from "lucide-react"
import Link from "next/link"

export default function GuideRidePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="flex items-center gap-3 text-3xl font-bold text-foreground">
              <Info className="h-8 w-8 text-muted-foreground" />
              Guide Ride
            </h1>
            <p className="text-muted-foreground">Learn how to master SmartShelf</p>
          </div>
        </div>

        {/* Welcome Section */}
        <Card className="mb-8 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Zap className="h-6 w-6 text-primary" />
              Welcome to SmartShelf!
            </CardTitle>
            <CardDescription className="text-base">
              Your ultimate grocery management companion designed specifically for students
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="leading-relaxed text-foreground">
              SmartShelf gamifies grocery management to make it fun and efficient. Navigate through different "modes" to
              track inventory, build smart shopping lists, and plan amazing parties. Let's explore each feature!
            </p>
          </CardContent>
        </Card>

        {/* Feature Guides */}
        <div className="space-y-6">
          {/* Stock Box Guide */}
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Box className="h-6 w-6" />
                </div>
                Stock Box
              </CardTitle>
              <CardDescription>Track your inventory with ease</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Upload Your Bills</h4>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      Simply snap a photo of your grocery receipt and upload it. The AI will automatically organize your
                      purchases.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Track Over Time</h4>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      Bills are automatically named by date (e.g., "Oct 5", "Nov 21") so you can track your shopping
                      history.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Chat with AI</h4>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      Ask questions about your inventory, get insights on spending patterns, or find out what you need
                      to restock.
                    </p>
                  </div>
                </div>
              </div>
              <Link href="/stock-box">
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Try Stock Box</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Smart Cart Guide */}
          <Card className="border-2 border-secondary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                  <ShoppingCart className="h-6 w-6" />
                </div>
                Smart Cart
              </CardTitle>
              <CardDescription>Build intelligent shopping lists</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary/20 text-xs font-bold text-secondary">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Check What You Need</h4>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      Browse your grocery checklist and mark items you need to buy. It's that simple!
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary/20 text-xs font-bold text-secondary">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Auto-Generate Shopping List</h4>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      Checked items automatically appear in your shopping cart below, ready for your next store trip.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary/20 text-xs font-bold text-secondary">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Get AI Suggestions</h4>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      Use the chat to ask for recommendations based on your inventory and dietary preferences.
                    </p>
                  </div>
                </div>
              </div>
              <Link href="/smart-cart">
                <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90">
                  Try Smart Cart
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Feast Beast Guide */}
          <Card className="border-2 border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <PartyPopper className="h-6 w-6" />
                </div>
                Feast Beast
              </CardTitle>
              <CardDescription>Plan parties like a pro</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/20 text-xs font-bold text-accent">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Enter Party Details</h4>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      Tell us how many guests you're expecting and what type of event you're hosting.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/20 text-xs font-bold text-accent">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Get AI-Powered Plans</h4>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      Receive personalized shopping lists with quantities calculated for your guest count.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/20 text-xs font-bold text-accent">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Refine Your Plan</h4>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      Chat with the AI to adjust for dietary restrictions, themes, or special requests.
                    </p>
                  </div>
                </div>
              </div>
              <Link href="/feast-beast">
                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">Try Feast Beast</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Tips Section */}
        <Card className="mt-8 border-2 border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Pro Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Target className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <p className="text-sm leading-relaxed text-foreground">
                  <strong>Upload bills regularly</strong> to keep your inventory up-to-date and get better AI
                  suggestions.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <Target className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
                <p className="text-sm leading-relaxed text-foreground">
                  <strong>Use Smart Cart before shopping</strong> to create organized lists and never forget items
                  again.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <Target className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <p className="text-sm leading-relaxed text-foreground">
                  <strong>Plan parties in advance</strong> with Feast Beast to avoid last-minute stress and
                  overspending.
                </p>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
