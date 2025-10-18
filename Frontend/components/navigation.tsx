"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Box, ShoppingCart, PartyPopper, Info } from "lucide-react"

const navItems = [
  {
    title: "Stock Box",
    href: "/stock-box",
    icon: Box,
    color: "text-primary",
  },
  {
    title: "Smart Cart",
    href: "/smart-cart",
    icon: ShoppingCart,
    color: "text-secondary",
  },
  {
    title: "Feast Beast",
    href: "/feast-beast",
    icon: PartyPopper,
    color: "text-accent",
  },
  {
    title: "Guide Ride",
    href: "/guide-ride",
    icon: Info,
    color: "text-muted-foreground",
  },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="border-b border-border/50 bg-card/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/60 shadow-lg shadow-primary/30 transition-transform duration-300 group-hover:scale-110">
              <span className="text-xl font-bold text-primary-foreground">S</span>
            </div>
            <span className="text-2xl font-bold text-foreground">
              Smart<span className="text-primary">Shelf</span>
            </span>
          </Link>

          <div className="flex gap-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group relative flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-300",
                    isActive
                      ? "bg-gradient-to-r from-primary/20 to-primary/10 text-foreground shadow-lg"
                      : "text-muted-foreground hover:scale-105 hover:text-foreground hover:bg-muted/50",
                  )}
                >
                  <Icon className={cn("h-5 w-5 transition-colors", isActive && item.color)} />
                  <span className="hidden lg:inline">{item.title}</span>
                  {isActive && (
                    <div className="absolute -bottom-0.5 left-1/2 h-0.5 w-3/4 -translate-x-1/2 rounded-full bg-gradient-to-r from-transparent via-primary to-transparent" />
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
