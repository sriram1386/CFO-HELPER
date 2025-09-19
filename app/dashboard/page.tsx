"use client"

import { useAuth } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, DollarSign, Users, Calendar, BarChart3, ArrowRight } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import Link from "next/link"
import { FinancialCalculator } from "@/lib/financial-calculations"
import { storageManager } from "@/lib/storage"

export default function DashboardOverview() {
  const { user } = useAuth()

  // Get user data and calculate metrics
  const usageStats = storageManager.getUsageStats()
  const calculator = new FinancialCalculator({
    revenue: 75000,
    teamSize: 8,
    marketingBudget: 15000,
    operationalCosts: 30000,
  })

  const metrics = calculator.calculateMetrics()
  const forecast = calculator.generateForecast(6) // 6 months for dashboard

  const recentActivity = [
    { action: "Ran scenario: High Growth", time: "2 hours ago" },
    { action: "Generated Q4 Report", time: "1 day ago" },
    { action: "Updated team size to 8", time: "2 days ago" },
    { action: "Exported financial forecast", time: "3 days ago" },
  ]

  // Chart data for mini charts
  const revenueData = forecast.slice(0, 6).map((month) => ({
    month: month.month.replace("Month ", "M"),
    value: month.revenue,
  }))

  const profitData = forecast.slice(0, 6).map((month) => ({
    month: month.month.replace("Month ", "M"),
    value: month.profit,
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold selection:bg-indigo-500 selection:text-white">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-slate-700 dark:text-indigo-300 mt-1 selection:bg-indigo-500 selection:text-white">
          Here's what's happening with your business finances.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Monthly Revenue</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">${metrics.monthlyRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Monthly Profit</p>
                <p className={`text-2xl font-bold ${metrics.monthlyProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
                  ${metrics.monthlyProfit.toLocaleString()}
                </p>
              </div>
              {metrics.monthlyProfit >= 0 ? (
                <TrendingUp className="h-8 w-8 text-green-600" />
              ) : (
                <TrendingDown className="h-8 w-8 text-red-600" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Cash Runway</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{metrics.cashRunway}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Profit Margin</p>
                <p className={`text-2xl font-bold ${metrics.profitMargin >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {metrics.profitMargin.toFixed(1)}%
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="dark:text-slate-100">Revenue Trend</CardTitle>
            <CardDescription className="dark:text-slate-400">6-month revenue projection</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, "Revenue"]} />
                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="dark:text-slate-100">Profit Forecast</CardTitle>
            <CardDescription className="dark:text-slate-400">6-month profit projection</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={profitData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, "Profit"]} />
                <Bar dataKey="value" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="dark:text-slate-100">Quick Actions</CardTitle>
            <CardDescription className="dark:text-slate-400">Jump into your most used features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/dashboard/scenarios">
              <Button variant="outline" className="w-full justify-between bg-transparent">
                <span className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Run New Scenario
                </span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard/forecasts">
              <Button variant="outline" className="w-full justify-between bg-transparent">
                <span className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  View Forecasts
                </span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard/reports">
              <Button variant="outline" className="w-full justify-between bg-transparent">
                <span className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Generate Report
                </span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="dark:text-slate-100">Recent Activity</CardTitle>
            <CardDescription className="dark:text-slate-400">Your latest financial planning activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex justify-between items-center py-2">
                  <span className="text-sm text-slate-900 dark:text-slate-100">{activity.action}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="dark:text-slate-100">Usage Statistics</CardTitle>
          <CardDescription className="dark:text-slate-400">Track your financial planning activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{usageStats.scenariosThisMonth}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Scenarios Run</div>
              <Badge variant="secondary" className="mt-1">
                This Month
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{usageStats.reportsThisMonth}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Reports Generated</div>
              <Badge variant="secondary" className="mt-1">
                This Month
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{usageStats.totalScenarios}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Total Scenarios</div>
              <Badge variant="secondary" className="mt-1">
                All Time
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{metrics.profitMargin.toFixed(1)}%</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Profit Margin</div>
              <Badge variant="secondary" className="mt-1">
                Current
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
