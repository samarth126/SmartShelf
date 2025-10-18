"use client"

import { cn } from "@/lib/utils"

import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Zap } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const gameModes = [
  {
    id: "stock-box",
    title: "Stock Box",
    description:
      "Upload your grocery bills and track your inventory. Just snap a photo and let AI organize everything for you.",
    href: "/stock-box",
    color: "primary",
    gradient: "from-primary/20 via-primary/10 to-transparent",
    glowColor: "shadow-primary/30",
    badge: "Inventory Master",
  },
  {
    id: "smart-cart",
    title: "Smart Cart",
    description:
      "Build intelligent shopping lists from your inventory. Check items you need and create optimized shopping carts instantly.",
    href: "/smart-cart",
    color: "secondary",
    gradient: "from-secondary/20 via-secondary/10 to-transparent",
    glowColor: "shadow-secondary/30",
    badge: "Shopping Pro",
  },
  {
    id: "feast-beast",
    title: "Feast Beast",
    description:
      "Planning a party? Get AI-powered suggestions for hosting events and stocking up for any number of guests.",
    href: "/feast-beast",
    color: "accent",
    gradient: "from-accent/20 via-accent/10 to-transparent",
    glowColor: "shadow-accent/30",
    badge: "Party Legend",
  },
  {
    id: "guide-ride",
    title: "Guide Ride",
    description:
      "New to SmartShelf? Learn how to navigate all features and make the most of your grocery management experience.",
    href: "/guide-ride",
    color: "muted-foreground",
    gradient: "from-muted-foreground/20 via-muted-foreground/10 to-transparent",
    glowColor: "shadow-muted-foreground/30",
    badge: "Tutorial",
  },
]

export default function DashboardPage() {
  const [hoveredMode, setHoveredMode] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background/95">
      <Navigation />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-12 flex items-center justify-center gap-12">
          {/* Left Controller - Modern Gaming Controller */}
          <div className="hidden animate-float lg:block">
            <svg width="180" height="140" viewBox="0 0 180 140" fill="none" className="drop-shadow-2xl">
              {/* Controller grip left */}
              <path
                d="M30 50 Q20 50 15 60 L10 90 Q8 100 15 105 L25 110 Q30 112 35 108 L45 95 Q48 90 48 85 L48 60 Q48 50 40 50 Z"
                fill="url(#leftBodyGradient)"
                className="drop-shadow-xl"
              />
              {/* Controller center body */}
              <rect
                x="48"
                y="40"
                width="84"
                height="60"
                rx="12"
                fill="url(#leftCenterGradient)"
                className="drop-shadow-xl"
              />
              {/* Controller grip right */}
              <path
                d="M132 50 Q140 50 145 60 L150 90 Q152 100 145 105 L135 110 Q130 112 125 108 L115 95 Q112 90 112 85 L112 60 Q112 50 120 50 Z"
                fill="url(#leftBodyGradient)"
                className="drop-shadow-xl"
              />

              {/* D-pad with glow */}
              <g filter="url(#glow)">
                <rect x="60" y="58" width="8" height="24" rx="2" fill="#1e293b" />
                <rect x="52" y="66" width="24" height="8" rx="2" fill="#1e293b" />
                <circle cx="64" cy="62" r="2" fill="#3b82f6" />
                <circle cx="64" cy="78" r="2" fill="#3b82f6" />
                <circle cx="56" cy="70" r="2" fill="#3b82f6" />
                <circle cx="72" cy="70" r="2" fill="#3b82f6" />
              </g>

              {/* Action buttons with colors */}
              <g filter="url(#glow)">
                <circle cx="110" cy="58" r="6" fill="#22c55e" stroke="#16a34a" strokeWidth="2" />
                <circle cx="122" cy="58" r="6" fill="#ef4444" stroke="#dc2626" strokeWidth="2" />
                <circle cx="110" cy="70" r="6" fill="#3b82f6" stroke="#2563eb" strokeWidth="2" />
                <circle cx="122" cy="70" r="6" fill="#eab308" stroke="#ca8a04" strokeWidth="2" />
              </g>

              {/* Analog sticks */}
              <g filter="url(#glow)">
                <circle cx="70" cy="90" r="10" fill="#1e293b" stroke="#475569" strokeWidth="2" />
                <circle cx="70" cy="90" r="6" fill="#334155" />
                <circle cx="112" cy="90" r="10" fill="#1e293b" stroke="#475569" strokeWidth="2" />
                <circle cx="112" cy="90" r="6" fill="#334155" />
              </g>

              {/* Shoulder buttons */}
              <rect x="48" y="30" width="30" height="8" rx="4" fill="url(#shoulderGradient)" />
              <rect x="102" y="30" width="30" height="8" rx="4" fill="url(#shoulderGradient)" />

              {/* LED indicators */}
              <circle cx="85" cy="50" r="2" fill="#3b82f6" className="animate-pulse" />
              <circle cx="90" cy="50" r="2" fill="#8b5cf6" className="animate-pulse" opacity="0.5" />
              <circle cx="95" cy="50" r="2" fill="#ec4899" className="animate-pulse" opacity="0.3" />

              <defs>
                <linearGradient id="leftBodyGradient" x1="0" y1="0" x2="180" y2="140">
                  <stop offset="0%" stopColor="#1e40af" />
                  <stop offset="50%" stopColor="#7c3aed" />
                  <stop offset="100%" stopColor="#db2777" />
                </linearGradient>
                <linearGradient id="leftCenterGradient" x1="48" y1="40" x2="132" y2="100">
                  <stop offset="0%" stopColor="#2563eb" />
                  <stop offset="100%" stopColor="#9333ea" />
                </linearGradient>
                <linearGradient id="shoulderGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#475569" />
                  <stop offset="100%" stopColor="#1e293b" />
                </linearGradient>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
            </svg>
          </div>

          {/* Title */}
          <div className="text-center">
            <h1 className="mb-2 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-6xl font-black text-transparent drop-shadow-2xl sm:text-7xl lg:text-8xl">
              SmartShelf
            </h1>
            <p className="text-xl font-semibold text-muted-foreground lg:text-2xl">Your Grocery Manager</p>
          </div>

          {/* Right Controller - Modern Gaming Controller */}
          <div className="hidden animate-float-delayed lg:block">
            <svg width="180" height="140" viewBox="0 0 180 140" fill="none" className="drop-shadow-2xl">
              {/* Controller grip left */}
              <path
                d="M30 50 Q20 50 15 60 L10 90 Q8 100 15 105 L25 110 Q30 112 35 108 L45 95 Q48 90 48 85 L48 60 Q48 50 40 50 Z"
                fill="url(#rightBodyGradient)"
                className="drop-shadow-xl"
              />
              {/* Controller center body */}
              <rect
                x="48"
                y="40"
                width="84"
                height="60"
                rx="12"
                fill="url(#rightCenterGradient)"
                className="drop-shadow-xl"
              />
              {/* Controller grip right */}
              <path
                d="M132 50 Q140 50 145 60 L150 90 Q152 100 145 105 L135 110 Q130 112 125 108 L115 95 Q112 90 112 85 L112 60 Q112 50 120 50 Z"
                fill="url(#rightBodyGradient)"
                className="drop-shadow-xl"
              />

              {/* D-pad with glow */}
              <g filter="url(#glow2)">
                <rect x="60" y="58" width="8" height="24" rx="2" fill="#1e293b" />
                <rect x="52" y="66" width="24" height="8" rx="2" fill="#1e293b" />
                <circle cx="64" cy="62" r="2" fill="#10b981" />
                <circle cx="64" cy="78" r="2" fill="#10b981" />
                <circle cx="56" cy="70" r="2" fill="#10b981" />
                <circle cx="72" cy="70" r="2" fill="#10b981" />
              </g>

              {/* Action buttons with colors */}
              <g filter="url(#glow2)">
                <circle cx="110" cy="58" r="6" fill="#06b6d4" stroke="#0891b2" strokeWidth="2" />
                <circle cx="122" cy="58" r="6" fill="#f59e0b" stroke="#d97706" strokeWidth="2" />
                <circle cx="110" cy="70" r="6" fill="#8b5cf6" stroke="#7c3aed" strokeWidth="2" />
                <circle cx="122" cy="70" r="6" fill="#ec4899" stroke="#db2777" strokeWidth="2" />
              </g>

              {/* Analog sticks */}
              <g filter="url(#glow2)">
                <circle cx="70" cy="90" r="10" fill="#1e293b" stroke="#475569" strokeWidth="2" />
                <circle cx="70" cy="90" r="6" fill="#334155" />
                <circle cx="112" cy="90" r="10" fill="#1e293b" stroke="#475569" strokeWidth="2" />
                <circle cx="112" cy="90" r="6" fill="#334155" />
              </g>

              {/* Shoulder buttons */}
              <rect x="48" y="30" width="30" height="8" rx="4" fill="url(#shoulderGradient2)" />
              <rect x="102" y="30" width="30" height="8" rx="4" fill="url(#shoulderGradient2)" />

              {/* LED indicators */}
              <circle cx="85" cy="50" r="2" fill="#10b981" className="animate-pulse" />
              <circle cx="90" cy="50" r="2" fill="#06b6d4" className="animate-pulse" opacity="0.5" />
              <circle cx="95" cy="50" r="2" fill="#8b5cf6" className="animate-pulse" opacity="0.3" />

              <defs>
                <linearGradient id="rightBodyGradient" x1="0" y1="0" x2="180" y2="140">
                  <stop offset="0%" stopColor="#059669" />
                  <stop offset="50%" stopColor="#0891b2" />
                  <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
                <linearGradient id="rightCenterGradient" x1="48" y1="40" x2="132" y2="100">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
                <linearGradient id="shoulderGradient2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#475569" />
                  <stop offset="100%" stopColor="#1e293b" />
                </linearGradient>
                <filter id="glow2" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
            </svg>
          </div>
        </div>

        {/* Game Mode Selection Grid */}
        <div className="mb-8 text-center">
          <h2 className="mb-2 flex items-center justify-center gap-3 text-3xl font-bold text-foreground">
            <Zap className="h-8 w-8 animate-pulse text-primary" />
            Select Your Mode
          </h2>
          <p className="text-lg text-muted-foreground">Click to enter and start your mission</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {gameModes.map((mode) => {
            const isHovered = hoveredMode === mode.id

            return (
              <Link
                key={mode.id}
                href={mode.href}
                onMouseEnter={() => setHoveredMode(mode.id)}
                onMouseLeave={() => setHoveredMode(null)}
              >
                <Card
                  className={cn(
                    "group relative h-full overflow-hidden border-2 transition-all duration-500",
                    isHovered
                      ? `scale-105 border-${mode.color} shadow-2xl ${mode.glowColor}`
                      : "border-border hover:border-border/50",
                  )}
                >
                  {/* Animated gradient background */}
                  <div
                    className={cn(
                      "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500",
                      mode.gradient,
                      isHovered && "opacity-100",
                    )}
                  />

                  {/* Scan line effect */}
                  {isHovered && (
                    <div className="absolute inset-0 overflow-hidden">
                      <div className="absolute inset-x-0 top-0 h-1 animate-scan-line bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                    </div>
                  )}

                  <CardHeader className="relative pb-4">
                    <div className="mb-4 flex items-center justify-between">
                      <div
                        className={cn(
                          "flex h-20 w-20 items-center justify-center rounded-2xl transition-all duration-500",
                          `bg-${mode.color}/10`,
                          isHovered && `scale-110 bg-${mode.color}/20 shadow-xl ${mode.glowColor}`,
                        )}
                      >
                        {mode.id === "stock-box" && (
                          <svg
                            width="48"
                            height="48"
                            viewBox="0 0 48 48"
                            fill="none"
                            className={cn("transition-all duration-500", isHovered && "animate-bounce")}
                          >
                            {/* Box with items */}
                            <rect
                              x="8"
                              y="16"
                              width="32"
                              height="24"
                              rx="2"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              className={`text-${mode.color}`}
                            />
                            <path
                              d="M8 20 L24 8 L40 20"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinejoin="round"
                              className={`text-${mode.color}`}
                            />
                            <line
                              x1="24"
                              y1="8"
                              x2="24"
                              y2="40"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              className={`text-${mode.color}`}
                            />
                            {/* Items inside */}
                            <circle cx="16" cy="28" r="2" fill="currentColor" className={`text-${mode.color}`} />
                            <circle cx="32" cy="28" r="2" fill="currentColor" className={`text-${mode.color}`} />
                            <rect
                              x="14"
                              y="32"
                              width="6"
                              height="4"
                              rx="1"
                              fill="currentColor"
                              className={`text-${mode.color}`}
                            />
                          </svg>
                        )}

                        {mode.id === "smart-cart" && (
                          <svg
                            width="48"
                            height="48"
                            viewBox="0 0 48 48"
                            fill="none"
                            className={cn("transition-all duration-500", isHovered && "animate-pulse")}
                          >
                            {/* Shopping cart */}
                            <path
                              d="M8 8 L12 8 L16 32 L38 32"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className={`text-${mode.color}`}
                            />
                            <circle
                              cx="18"
                              cy="38"
                              r="2"
                              fill="currentColor"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              className={`text-${mode.color}`}
                            />
                            <circle
                              cx="34"
                              cy="38"
                              r="2"
                              fill="currentColor"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              className={`text-${mode.color}`}
                            />
                            <path
                              d="M16 28 L38 28 L42 12 L14 12"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className={`text-${mode.color}`}
                            />
                            {/* Smart indicator */}
                            <path
                              d="M28 18 L30 20 L34 16"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className={`text-${mode.color}`}
                            />
                          </svg>
                        )}

                        {mode.id === "feast-beast" && (
                          <svg
                            width="48"
                            height="48"
                            viewBox="0 0 48 48"
                            fill="none"
                            className={cn("transition-all duration-500", isHovered && "animate-wiggle")}
                          >
                            {/* Cute monster face */}
                            <circle
                              cx="24"
                              cy="24"
                              r="16"
                              fill="currentColor"
                              className={`text-${mode.color} opacity-20`}
                            />
                            <circle
                              cx="24"
                              cy="24"
                              r="16"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              className={`text-${mode.color}`}
                            />
                            {/* Eyes */}
                            <circle cx="18" cy="20" r="2.5" fill="currentColor" className={`text-${mode.color}`} />
                            <circle cx="30" cy="20" r="2.5" fill="currentColor" className={`text-${mode.color}`} />
                            {/* Mouth */}
                            <path
                              d="M16 28 Q24 34 32 28"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              className={`text-${mode.color}`}
                            />
                            {/* Horns */}
                            <path
                              d="M14 12 L12 8 L16 10"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className={`text-${mode.color}`}
                            />
                            <path
                              d="M34 12 L36 8 L32 10"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className={`text-${mode.color}`}
                            />
                            {/* Party hat */}
                            <path
                              d="M24 8 L20 16 L28 16 Z"
                              fill="currentColor"
                              className={`text-${mode.color} opacity-30`}
                            />
                          </svg>
                        )}

                        {mode.id === "guide-ride" && (
                          <svg
                            width="48"
                            height="48"
                            viewBox="0 0 48 48"
                            fill="none"
                            className={cn("transition-all duration-500", isHovered && "animate-spin-slow")}
                          >
                            {/* Compass */}
                            <circle
                              cx="24"
                              cy="24"
                              r="16"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              className={`text-${mode.color}`}
                            />
                            <circle
                              cx="24"
                              cy="24"
                              r="12"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              className={`text-${mode.color} opacity-30`}
                            />
                            {/* Compass needle */}
                            <path
                              d="M24 12 L28 24 L24 36 L20 24 Z"
                              fill="currentColor"
                              className={`text-${mode.color}`}
                            />
                            <path
                              d="M24 12 L28 24 L24 36 L20 24 Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              className={`text-${mode.color}`}
                            />
                            {/* Cardinal points */}
                            <circle cx="24" cy="8" r="1.5" fill="currentColor" className={`text-${mode.color}`} />
                            <circle cx="40" cy="24" r="1.5" fill="currentColor" className={`text-${mode.color}`} />
                            <circle cx="24" cy="40" r="1.5" fill="currentColor" className={`text-${mode.color}`} />
                            <circle cx="8" cy="24" r="1.5" fill="currentColor" className={`text-${mode.color}`} />
                          </svg>
                        )}
                      </div>

                      <div
                        className={cn(
                          "rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider transition-all duration-300",
                          `border-${mode.color}/30 bg-${mode.color}/5 text-${mode.color}`,
                          isHovered && "scale-110",
                        )}
                      >
                        {mode.badge}
                      </div>
                    </div>

                    <CardTitle className="mb-2 text-3xl font-black">{mode.title}</CardTitle>
                    <CardDescription className="text-base leading-relaxed">{mode.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="relative">
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-between text-base font-bold transition-all duration-300",
                        `text-${mode.color}`,
                        isHovered && "translate-x-2",
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        Enter Mode
                      </span>
                      <span className="text-2xl transition-transform duration-300 group-hover:translate-x-2">→</span>
                    </Button>
                  </CardContent>

                  {/* Corner accent */}
                  <div
                    className={cn(
                      "absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-0 blur-2xl transition-opacity duration-500",
                      `bg-${mode.color}`,
                      isHovered && "opacity-30",
                    )}
                  />
                </Card>
              </Link>
            )
          })}
        </div>
      </main>

      <style jsx>{`
        @keyframes scan-line {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(1000%);
          }
        }
        .animate-scan-line {
          animation: scan-line 2s ease-in-out infinite;
        }
        @keyframes wiggle {
          0%,
          100% {
            transform: rotate(-3deg);
          }
          50% {
            transform: rotate(3deg);
          }
        }
        .animate-wiggle {
          animation: wiggle 0.5s ease-in-out infinite;
        }
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        /* Added floating animations for controllers */
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 3s ease-in-out infinite;
          animation-delay: 1.5s;
        }
      `}</style>
    </div>
  )
}
