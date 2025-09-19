"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { TrendingUp, TrendingDown, DollarSign, Users, Calendar, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function DemoPage() {
  const [revenue, setRevenue] = useState([50000])
  const [teamSize, setTeamSize] = useState([5])
  const [marketingBudget, setMarketingBudget] = useState([10000])
  const [operationalCosts, setOperationalCosts] = useState([25000])
  const [scenariosRun, setScenariosRun] = useState(0)

  // Calculate financial metrics
  const monthlyRevenue = revenue[0]
  const monthlyCosts = teamSize[0] * 8000 + marketingBudget[0] + operationalCosts[0]
  const monthlyProfit = monthlyRevenue - monthlyCosts
  const cashRunway = monthlyProfit > 0 ? "Profitable" : Math.abs(100000 / monthlyProfit).toFixed(1)
  const profitMargin = ((monthlyProfit / monthlyRevenue) * 100).toFixed(1)

  // Generate forecast data
  const forecastData = Array.from({ length: 12 }, (_, i) => ({
    month: `Month ${i + 1}`,
    revenue: monthlyRevenue * (1 + i * 0.05),
    costs: monthlyCosts * (1 + i * 0.03),
    profit: monthlyRevenue * (1 + i * 0.05) - monthlyCosts * (1 + i * 0.03),
  }))

  const runScenario = () => {
    setScenariosRun((prev) => prev + 1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-slate-900">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
            <Badge variant="secondary">Demo Mode</Badge>
          </div>
        </div>
      </nav>

      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-slate-900">CFO Helper Demo</h1>
            <p className="text-slate-600 text-lg">Try out the financial simulation tools</p>
            <Badge variant="secondary" className="text-sm">
              Scenarios Run: {scenariosRun}
            </Badge>
          </div>

          {/* Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Financial Controls
              </CardTitle>
              <CardDescription>Adjust your business parameters to see the impact on your finances</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-medium">Monthly Revenue: ${revenue[0].toLocaleString()}</label>
                  <Slider
                    value={revenue}
                    onValueChange={setRevenue}
                    max={200000}
                    min={10000}
                    step={5000}
                    className="w-full"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium">Team Size: {teamSize[0]} people</label>
                  <Slider value={teamSize} onValueChange={setTeamSize} max={50} min={1} step={1} className="w-full" />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium">
                    Marketing Budget: ${marketingBudget[0].toLocaleString()}
                  </label>
                  <Slider
                    value={marketingBudget}
                    onValueChange={setMarketingBudget}
                    max={50000}
                    min={1000}
                    step={1000}
                    className="w-full"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium">
                    Operational Costs: ${operationalCosts[0].toLocaleString()}
                  </label>
                  <Slider
                    value={operationalCosts}
                    onValueChange={setOperationalCosts}
                    max={100000}
                    min={5000}
                    step={2500}
                    className="w-full"
                  />
                </div>
              </div>

              <Button onClick={runScenario} className="w-full">
                Run Scenario Analysis
              </Button>
            </CardContent>
          </Card>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Monthly Profit</p>
                    <p className={`text-2xl font-bold ${monthlyProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
                      ${monthlyProfit.toLocaleString()}
                    </p>
                  </div>
                  {monthlyProfit >= 0 ? (
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
                    <p className="text-sm font-medium text-slate-600">Profit Margin</p>
                    <p
                      className={`text-2xl font-bold ${Number.parseFloat(profitMargin) >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {profitMargin}%
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-slate-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Cash Runway</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {typeof cashRunway === "string" ? cashRunway : `${cashRunway}M`}
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-slate-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Team Size</p>
                    <p className="text-2xl font-bold text-slate-900">{teamSize[0]}</p>
                  </div>
                  <Users className="h-8 w-8 text-slate-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>12-Month Revenue vs Costs Forecast</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={forecastData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, ""]} />
                    <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
                    <Bar dataKey="costs" fill="#ef4444" name="Costs" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Profit Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={forecastData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, "Profit"]} />
                    <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={3} dot={{ fill: "#10b981" }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* CTA */}
          <Card className="text-center">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Ready to get started?</h3>
              <p className="text-slate-600 mb-6">
                Sign up now to save your scenarios, generate reports, and access advanced features.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <Button size="lg">Create Free Account</Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline">
                    Sign In
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
