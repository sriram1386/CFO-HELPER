import type React from "react"
import AuthGuard from "@/components/dashboard/auth-guard"
import Sidebar from "@/components/dashboard/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 lg:flex">
        <Sidebar />
        <main className="flex-1 lg:pl-0 pt-16 lg:pt-0">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </AuthGuard>
  )
}
