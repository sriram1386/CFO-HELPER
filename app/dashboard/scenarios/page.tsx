"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TrendingUp, DollarSign, Calendar, Save, Play, Copy, Lightbulb, Trash2 } from "lucide-react"
import { FinancialCalculator, type FinancialInputs } from "@/lib/financial-calculations"
import { useUserScenarios, type UserScenario } from "@/lib/storage"

export default function ScenariosPage() {
  const [inputs, setInputs] = useState<FinancialInputs>({
    revenue: 75000,
    teamSize: 8,
    marketingBudget: 15000,
    operationalCosts: 30000,
    averageSalary: 8000,
    initialCash: 100000,
  })

  const [scenarioName, setScenarioName] = useState("")
  const { scenarios, saveScenario, deleteScenario, loading } = useUserScenarios()

  const calculator = new FinancialCalculator(inputs)
  const metrics = calculator.calculateMetrics()
  const breakEven = calculator.calculateBreakEven()
  const insights = calculator.generateInsights()

  const handleSaveScenario = () => {
    if (!scenarioName.trim()) return

    const newScenario: UserScenario = {
      id: Date.now().toString(),
      name: scenarioName,
      inputs: { ...inputs },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    saveScenario(newScenario)
    setScenarioName("")
  }

  const loadScenario = (scenario: UserScenario) => {
    setInputs({ ...scenario.inputs })
  }

  const handleDeleteScenario = (scenarioId: string) => {
    if (confirm("Are you sure you want to delete this scenario?")) {
      deleteScenario(scenarioId)
    }
  }

  const quickScenarios = [
    { name: "Startup Mode", inputs: { revenue: 25000, teamSize: 3, marketingBudget: 5000, operationalCosts: 12000 } },
    {
      name: "Growth Phase",
      inputs: { revenue: 100000, teamSize: 10, marketingBudget: 20000, operationalCosts: 40000 },
    },
    { name: "Scale Up", inputs: { revenue: 200000, teamSize: 20, marketingBudget: 40000, operationalCosts: 80000 } },
  ]

  const applyQuickScenario = (scenario: any) => {
    setInputs({ ...inputs, ...scenario.inputs })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-slate-900"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Scenario Planning</h1>
        <p className="text-slate-600 mt-1">Test different business scenarios and see their financial impact.</p>
      </div>

      {/* Quick Scenarios */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Scenarios</CardTitle>
          <CardDescription>Apply common business scenarios with one click</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickScenarios.map((scenario, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-4 flex flex-col items-start bg-transparent"
                onClick={() => applyQuickScenario(scenario)}
              >
                <div className="font-medium">{scenario.name}</div>
                <div className="text-sm text-slate-500 mt-1">
                  ${scenario.inputs.revenue.toLocaleString()}/mo • {scenario.inputs.teamSize} people
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Scenario Builder
            </CardTitle>
            <CardDescription>Adjust parameters to create your scenario</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-3">
                <Label>Monthly Revenue: ${inputs.revenue.toLocaleString()}</Label>
                <Slider
                  value={[inputs.revenue]}
                  onValueChange={(value) => setInputs({ ...inputs, revenue: value[0] })}
                  max={500000}
                  min={10000}
                  step={5000}
                  className="w-full"
                />
              </div>

              <div className="space-y-3">
                <Label>Team Size: {inputs.teamSize} people</Label>
                <Slider
                  value={[inputs.teamSize]}
                  onValueChange={(value) => setInputs({ ...inputs, teamSize: value[0] })}
                  max={100}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="text-sm text-slate-500">
                  Estimated cost: ${(inputs.teamSize * (inputs.averageSalary || 8000)).toLocaleString()}/mo
                </div>
              </div>

              <div className="space-y-3">
                <Label>Marketing Budget: ${inputs.marketingBudget.toLocaleString()}</Label>
                <Slider
                  value={[inputs.marketingBudget]}
                  onValueChange={(value) => setInputs({ ...inputs, marketingBudget: value[0] })}
                  max={100000}
                  min={1000}
                  step={1000}
                  className="w-full"
                />
              </div>

              <div className="space-y-3">
                <Label>Operational Costs: ${inputs.operationalCosts.toLocaleString()}</Label>
                <Slider
                  value={[inputs.operationalCosts]}
                  onValueChange={(value) => setInputs({ ...inputs, operationalCosts: value[0] })}
                  max={200000}
                  min={5000}
                  step={2500}
                  className="w-full"
                />
              </div>

              <div className="space-y-3">
                <Label>Average Salary: ${(inputs.averageSalary || 8000).toLocaleString()}/mo</Label>
                <Slider
                  value={[inputs.averageSalary || 8000]}
                  onValueChange={(value) => setInputs({ ...inputs, averageSalary: value[0] })}
                  max={15000}
                  min={3000}
                  step={500}
                  className="w-full"
                />
              </div>
            </div>

            <div className="border-t pt-4 space-y-3">
              <Label htmlFor="scenario-name">Save Scenario</Label>
              <div className="flex gap-2">
                <Input
                  id="scenario-name"
                  placeholder="Enter scenario name"
                  value={scenarioName}
                  onChange={(e) => setScenarioName(e.target.value)}
                />
                <Button onClick={handleSaveScenario} disabled={!scenarioName.trim()}>
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle>Scenario Results</CardTitle>
            <CardDescription>Financial impact of your current scenario</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Monthly Profit</span>
                </div>
                <div className={`text-xl font-bold ${metrics.monthlyProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
                  ${metrics.monthlyProfit.toLocaleString()}
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Profit Margin</span>
                </div>
                <div className={`text-xl font-bold ${metrics.profitMargin >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {metrics.profitMargin.toFixed(1)}%
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium">Cash Runway</span>
                </div>
                <div className="text-xl font-bold text-slate-900">
                  {typeof metrics.cashRunway === "string" ? metrics.cashRunway : `${metrics.cashRunway}M`}
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium">Break-even</span>
                </div>
                <div className="text-xl font-bold text-slate-900">${breakEven.breakEvenRevenue.toLocaleString()}</div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Advanced Metrics</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span>Gross Margin:</span>
                  <span className="font-medium">{metrics.grossMargin.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Burn Rate:</span>
                  <span className="font-medium">${metrics.burnRate.toLocaleString()}/mo</span>
                </div>
                <div className="flex justify-between">
                  <span>CAC:</span>
                  <span className="font-medium">${metrics.customerAcquisitionCost.toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>LTV:</span>
                  <span className="font-medium">${metrics.lifetimeValue.toFixed(0)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            AI Insights & Recommendations
          </CardTitle>
          <CardDescription>Smart analysis of your scenario</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <div key={index} className="p-3 bg-slate-50 rounded-lg text-sm">
                {insight}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Saved Scenarios */}
      <Card>
        <CardHeader>
          <CardTitle>Saved Scenarios ({scenarios.length})</CardTitle>
          <CardDescription>Your previously saved financial scenarios</CardDescription>
        </CardHeader>
        <CardContent>
          {scenarios.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <p>No saved scenarios yet. Create and save your first scenario above!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {scenarios.map((scenario) => {
                const scenarioCalculator = new FinancialCalculator(scenario.inputs)
                const scenarioMetrics = scenarioCalculator.calculateMetrics()

                return (
                  <Card key={scenario.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-medium">{scenario.name}</h4>
                        <Badge
                          variant={scenarioMetrics.monthlyProfit >= 0 ? "default" : "destructive"}
                          className="text-xs"
                        >
                          {scenarioMetrics.monthlyProfit >= 0 ? "Profitable" : "Loss"}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm text-slate-600 mb-3">
                        <div>Revenue: ${scenario.inputs.revenue.toLocaleString()}/mo</div>
                        <div>Team: {scenario.inputs.teamSize} people</div>
                        <div>Profit: ${scenarioMetrics.monthlyProfit.toLocaleString()}/mo</div>
                        <div className="text-xs text-slate-400">
                          Created: {new Date(scenario.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => loadScenario(scenario)} className="flex-1">
                          Load
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteScenario(scenario.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
