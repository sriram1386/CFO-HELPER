import type React from "react"
import AuthGuard from "@/components/dashboard/auth-guard"
import DashboardTopbar from "@/components/dashboard/topbar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-blue-200 dark:from-slate-950 dark:to-slate-900">
        <DashboardTopbar />
        <main className="flex-1">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </AuthGuard>
  )
}
