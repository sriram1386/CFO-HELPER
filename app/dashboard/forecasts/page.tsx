"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, Calendar, DollarSign, Target, Download } from "lucide-react"

export default function ForecastsPage() {
  const [timeframe, setTimeframe] = useState("12")
  const [growthRate, setGrowthRate] = useState("5")
  const [scenario, setScenario] = useState("current")

  // Base financial data
  const baseData = {
    revenue: 75000,
    teamCosts: 64000, // 8 people * $8k
    marketingBudget: 15000,
    operationalCosts: 30000,
  }

  const totalCosts = baseData.teamCosts + baseData.marketingBudget + baseData.operationalCosts

  // Generate forecast data based on selected parameters
  type ForecastMonth = {
    month: string
    monthNum: number
    revenue: number
    costs: number
    profit: number
    cumulativeProfit: number
  }

  const generateForecastData = (): ForecastMonth[] => {
    const months = Number.parseInt(timeframe)
    const growth = Number.parseFloat(growthRate) / 100
    const data: ForecastMonth[] = []

    for (let i = 0; i < months; i++) {
      const revenueGrowth =
        scenario === "aggressive" ? growth * 1.5 : scenario === "conservative" ? growth * 0.5 : growth
      const costGrowth = growth * 0.6 // Costs grow slower than revenue

      const revenue = baseData.revenue * Math.pow(1 + revenueGrowth, i)
      const costs = totalCosts * Math.pow(1 + costGrowth, i)
      const profit = revenue - costs

      data.push({
        month: `Month ${i + 1}`,
        monthNum: i + 1,
        revenue: Math.round(revenue),
        costs: Math.round(costs),
        profit: Math.round(profit),
        cumulativeProfit: i === 0 ? profit : data[i - 1].cumulativeProfit + profit,
      })
    }

    return data
  }

  const forecastData = generateForecastData()
  const finalMonth = forecastData[forecastData.length - 1]

  // Cost breakdown data
  const costBreakdown = [
    { name: "Team Costs", value: baseData.teamCosts, color: "#3b82f6" },
    { name: "Marketing", value: baseData.marketingBudget, color: "#10b981" },
    { name: "Operations", value: baseData.operationalCosts, color: "#f59e0b" },
  ]

  // Key metrics
  const totalRevenue = forecastData.reduce((sum, month) => sum + month.revenue, 0)
  const totalProfit = forecastData.reduce((sum, month) => sum + month.profit, 0)
  const avgMonthlyGrowth = ((finalMonth.revenue / baseData.revenue) ** (1 / forecastData.length) - 1) * 100

  const exportForecast = () => {
    const csvContent = [
      ["Month", "Revenue", "Costs", "Profit", "Cumulative Profit"],
      ...forecastData.map((row) => [row.month, row.revenue, row.costs, row.profit, row.cumulativeProfit]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `financial-forecast-${timeframe}months.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Financial Forecasts</h1>
          <p className="text-slate-600 dark:text-slate-300 mt-1">Visualize your business financial projections and trends.</p>
        </div>
        <Button onClick={exportForecast} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Forecast
        </Button>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="dark:text-slate-100">Forecast Parameters</CardTitle>
          <CardDescription className="dark:text-slate-400">Adjust the parameters to customize your financial forecast</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Time Frame</label>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">6 Months</SelectItem>
                  <SelectItem value="12">12 Months</SelectItem>
                  <SelectItem value="18">18 Months</SelectItem>
                  <SelectItem value="24">24 Months</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Monthly Growth Rate</label>
              <Select value={growthRate} onValueChange={setGrowthRate}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2% (Conservative)</SelectItem>
                  <SelectItem value="5">5% (Moderate)</SelectItem>
                  <SelectItem value="8">8% (Optimistic)</SelectItem>
                  <SelectItem value="12">12% (Aggressive)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Scenario Type</label>
              <Select value={scenario} onValueChange={setScenario}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="conservative">Conservative</SelectItem>
                  <SelectItem value="current">Current Trend</SelectItem>
                  <SelectItem value="aggressive">Aggressive Growth</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Revenue</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">${totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-slate-500">{timeframe} months</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Profit</p>
                <p className={`text-2xl font-bold ${totalProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
                  ${totalProfit.toLocaleString()}
                </p>
                <p className="text-xs text-slate-500">{timeframe} months</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Avg Growth</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{avgMonthlyGrowth.toFixed(1)}%</p>
                <p className="text-xs text-slate-500">per month</p>
              </div>
              <Target className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Final Month</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">${finalMonth.revenue.toLocaleString()}</p>
                <p className="text-xs text-slate-500">revenue</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="dark:text-slate-100">Revenue vs Costs Forecast</CardTitle>
            <CardDescription className="dark:text-slate-400">Monthly revenue and cost projections</CardDescription>
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
            <CardTitle className="dark:text-slate-100">Profit Trend</CardTitle>
            <CardDescription className="dark:text-slate-400">Monthly and cumulative profit over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, ""]} />
                <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2} name="Monthly Profit" />
                <Line
                  type="monotone"
                  dataKey="cumulativeProfit"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  name="Cumulative Profit"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="dark:text-slate-100">Revenue Growth Area</CardTitle>
            <CardDescription className="dark:text-slate-400">Revenue growth visualization over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, "Revenue"]} />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="dark:text-slate-100">Cost Breakdown</CardTitle>
            <CardDescription className="dark:text-slate-400">Current monthly cost distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={costBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {costBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, ""]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {costBreakdown.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium">${item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Forecast Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="dark:text-slate-100">Forecast Summary</CardTitle>
          <CardDescription className="dark:text-slate-400">Key insights from your financial forecast</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Growth Trajectory</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Starting Revenue:</span>
                  <span className="font-medium">${baseData.revenue.toLocaleString()}/mo</span>
                </div>
                <div className="flex justify-between">
                  <span>Ending Revenue:</span>
                  <span className="font-medium">${finalMonth.revenue.toLocaleString()}/mo</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Growth:</span>
                  <span className="font-medium text-green-600">
                    {(((finalMonth.revenue - baseData.revenue) / baseData.revenue) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-3">Profitability Analysis</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Profitable Months:</span>
                  <span className="font-medium">
                    {forecastData.filter((month) => month.profit > 0).length} of {forecastData.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Best Month:</span>
                  <span className="font-medium">
                    ${Math.max(...forecastData.map((m) => m.profit)).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Break-even Month:</span>
                  <span className="font-medium">
                    {forecastData.find((m) => m.cumulativeProfit > 0)?.monthNum || "Not reached"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
