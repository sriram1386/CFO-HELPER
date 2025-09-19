"use client"

import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, BarChart3, TrendingUp, Shield } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { ThemeToggle } from "@/components/ui/theme-toggle"

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-slate-900 dark:border-slate-100"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Navigation */}
      <nav className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <BarChart3 className="h-8 w-8 text-slate-900 dark:text-slate-100" />
              <span className="text-xl font-bold text-slate-900 dark:text-slate-100">CFO Helper</span>
            </Link>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-slate-900 dark:text-slate-100 mb-6 text-balance">
            Make Smarter Financial Decisions with AI
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto text-pretty">
            Simulate budget scenarios, forecast cash flow, and get clear financial outcomes. Perfect for startup
            founders, event organizers, and small business owners.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="flex items-center gap-2">
                Start Free Trial
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline">
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Everything You Need for Financial Planning
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Powerful tools to help you understand your business finances and make data-driven decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg dark:bg-slate-700">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle className="dark:text-slate-100">Scenario Planning</CardTitle>
                <CardDescription className="dark:text-slate-300">
                  Test different business scenarios with interactive sliders and see real-time impact on your finances.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg dark:bg-slate-700">
              <CardHeader>
                <BarChart3 className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle className="dark:text-slate-100">Visual Forecasting</CardTitle>
                <CardDescription className="dark:text-slate-300">
                  Beautiful charts and graphs that make complex financial data easy to understand and share.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg dark:bg-slate-700">
              <CardHeader>
                <Shield className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle className="dark:text-slate-100">Export & Share</CardTitle>
                <CardDescription className="dark:text-slate-300">
                  Generate professional reports and share scenarios with investors, partners, or your team.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-slate-900 dark:bg-slate-950">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Take Control of Your Finances?</h2>
          <p className="text-xl text-slate-300 mb-8">
            Start making data-driven financial decisions today with our powerful simulation tools.
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100">
              Start Your Free Trial
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-800 border-t py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <Link
            href="/"
            className="flex items-center justify-center space-x-2 mb-4 hover:opacity-80 transition-opacity"
          >
            <BarChart3 className="h-6 w-6 text-slate-900 dark:text-slate-100" />
            <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">CFO Helper</span>
          </Link>
          <p className="text-slate-600 dark:text-slate-400">© 2024 CFO Helper. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
