"use client"

import Link from "next/link"
import { useState } from "react"
import { BarChart3, Menu, Search, ShoppingCart, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export function SiteNavbar() {
  const [query, setQuery] = useState("")

  return (
    <nav className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-3">
        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                CFO Helper
              </SheetTitle>
            </SheetHeader>
            <div className="mt-4 space-y-2">
              <Link href="/dashboard" className="block py-2">Dashboard</Link>
              <Link href="/dashboard/forecasts" className="block py-2">Forecasts</Link>
              <Link href="/dashboard/scenarios" className="block py-2">Scenarios</Link>
              <Link href="/dashboard/reports" className="block py-2">Reports</Link>
              <Link href="/demo" className="block py-2">View Demo</Link>
              <Link href="/login" className="block py-2">Sign in</Link>
            </div>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link href="/" className="hidden lg:flex items-center gap-2 hover:opacity-80 transition-opacity">
          <BarChart3 className="h-6 w-6" />
          <span className="text-lg font-bold">CFO Helper</span>
        </Link>

        {/* Search */}
        <div className="flex-1 hidden md:flex items-center">
          <div className="relative w-full max-w-2xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              className="pl-9"
            />
          </div>
        </div>

        {/* Desktop nav actions */}
        <div className="hidden lg:flex items-center gap-2 ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                Hello, sign in
                <span className="font-semibold">Account & Lists</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[320px]">
              <DropdownMenuLabel>Quick actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link href="/login">Sign in</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/signup">Create account</Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Your Lists</DropdownMenuLabel>
              <DropdownMenuItem>Create a wish list</DropdownMenuItem>
              <DropdownMenuItem>Discover your style</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Your Account</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href="/dashboard">Your dashboard</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/reports">Your reports</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/forecasts">Your forecasts</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/scenarios">Saved scenarios</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/dashboard/reports">
            <Button variant="ghost">Returns & Orders</Button>
          </Link>

          <Link href="/dashboard">
            <Button variant="ghost" size="icon" aria-label="Cart">
              <ShoppingCart className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}


