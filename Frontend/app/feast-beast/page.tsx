"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, PartyPopper, Send, Sparkles } from "lucide-react"
import Link from "next/link"

export default function FeastBeastPage() {
  const [guestCount, setGuestCount] = useState("")
  const [eventType, setEventType] = useState("")
  const [message, setMessage] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])

  const handleGeneratePlan = () => {
    if (guestCount && eventType) {
      setSuggestions([
        `For ${guestCount} guests at your ${eventType}, here's what you'll need:`,
        "• Main dishes: 3-4 different options",
        "• Appetizers: 5-6 varieties",
        "• Beverages: 2 liters per person",
        "• Desserts: 1 serving per person",
        "• Plates, cups, napkins for all guests",
      ])
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-accent">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="flex items-center gap-3 text-3xl font-bold text-foreground">
              <PartyPopper className="h-8 w-8 text-accent" />
              Feast Beast
            </h1>
            <p className="text-muted-foreground">Plan epic parties with AI assistance</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Party Planning Form */}
          <Card className="border-2 border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent" />
                Party Details
              </CardTitle>
              <CardDescription>Tell us about your event</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="guests">Number of Guests</Label>
                <Input
                  id="guests"
                  type="number"
                  placeholder="e.g., 12"
                  value={guestCount}
                  onChange={(e) => setGuestCount(e.target.value)}
                  className="border-accent/30 focus-visible:ring-accent"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="event-type">Event Type</Label>
                <Input
                  id="event-type"
                  placeholder="e.g., Birthday party, BBQ, Game night"
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="border-accent/30 focus-visible:ring-accent"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="additional">Additional Details (Optional)</Label>
                <Textarea
                  id="additional"
                  placeholder="Any dietary restrictions, theme, or special requests..."
                  className="min-h-[120px] border-accent/30 focus-visible:ring-accent"
                />
              </div>

              <Button
                onClick={handleGeneratePlan}
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                disabled={!guestCount || !eventType}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Party Plan
              </Button>
            </CardContent>
          </Card>

          {/* AI Suggestions */}
          <Card className="border-2 border-accent/20">
            <CardHeader>
              <CardTitle>AI Suggestions</CardTitle>
              <CardDescription>Your personalized party shopping list</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-[500px] flex-col">
                <ScrollArea className="flex-1 pr-4">
                  <div className="space-y-4">
                    {suggestions.length === 0 ? (
                      <div className="flex h-full items-center justify-center text-center">
                        <div className="space-y-3">
                          <PartyPopper className="mx-auto h-12 w-12 text-accent/50" />
                          <p className="text-muted-foreground">
                            Fill in the party details and click "Generate Party Plan" to get AI-powered suggestions!
                          </p>
                        </div>
                      </div>
                    ) : (
                      suggestions.map((suggestion, index) => (
                        <div key={index} className="rounded-lg bg-muted p-4">
                          <p className="text-sm leading-relaxed text-foreground">{suggestion}</p>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>

                <div className="mt-4 flex gap-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask for more suggestions..."
                    className="flex-1 border-accent/30 focus-visible:ring-accent"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && message.trim()) {
                        setMessage("")
                      }
                    }}
                  />
                  <Button size="icon" className="shrink-0 bg-accent text-accent-foreground hover:bg-accent/90">
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
