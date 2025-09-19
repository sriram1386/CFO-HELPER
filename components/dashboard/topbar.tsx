"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { BarChart3, Home, Calculator, TrendingUp, FileText, Settings, ChevronDown, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/auth"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const navigation = [
  { name: "Overview", href: "/dashboard", icon: Home },
  { name: "Scenarios", href: "/dashboard/scenarios", icon: Calculator },
  { name: "Forecasts", href: "/dashboard/forecasts", icon: TrendingUp },
  { name: "Reports", href: "/dashboard/reports", icon: FileText },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export default function DashboardTopbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const { user } = useAuth()

  return (
    <div className="sticky top-0 z-40 border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur">
      <Collapsible open={open} onOpenChange={setOpen}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between gap-4">
            <Link href="/dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6" />
              <span className="text-lg font-semibold">CFO Helper</span>
            </Link>

            {/* Right cluster: nav + theme + account */}
            <div className="flex items-center gap-2 ml-auto">
              <div className="hidden md:flex items-center gap-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  const Icon = item.icon
                  return (
                    <Link key={item.name} href={item.href} className={`px-3 py-2 rounded-md text-base flex items-center gap-2 ${
                      isActive
                        ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}>
                      <Icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  )
                })}
              </div>
              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="bg-slate-200 dark:bg-slate-700 text-xs">
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline">Profile</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings"><span className="flex items-center gap-2"><User className="h-4 w-4" /> Settings</span></Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/reports">Your Reports</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/scenarios">Saved Scenarios</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/login"><span className="flex items-center gap-2"><LogOut className="h-4 w-4" /> Sign out</span></Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="md:hidden gap-1">
                  Menu
                  <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>
        </div>
        <CollapsibleContent className="md:hidden border-t">
          <div className="px-4 py-2 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
                    isActive
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}


