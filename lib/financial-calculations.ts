export interface FinancialInputs {
  revenue: number
  teamSize: number
  marketingBudget: number
  operationalCosts: number
  averageSalary?: number
  taxRate?: number
  initialCash?: number
}

export interface FinancialMetrics {
  monthlyRevenue: number
  monthlyCosts: number
  monthlyProfit: number
  profitMargin: number
  breakEvenRevenue: number
  cashRunway: string | number
  grossMargin: number
  burnRate: number
  revenueGrowthRate: number
  customerAcquisitionCost: number
  lifetimeValue: number
}

export interface ForecastData {
  month: string
  monthNum: number
  revenue: number
  costs: number
  profit: number
  cumulativeProfit: number
  cashBalance: number
  teamSize: number
  customers: number
}

export class FinancialCalculator {
  private inputs: FinancialInputs
  private averageSalary: number
  private taxRate: number
  private initialCash: number

  constructor(inputs: FinancialInputs) {
    this.inputs = inputs
    this.averageSalary = inputs.averageSalary || 8000
    this.taxRate = inputs.taxRate || 0.25
    this.initialCash = inputs.initialCash || 100000
  }

  // Core financial metrics
  calculateMetrics(): FinancialMetrics {
    const monthlyRevenue = this.inputs.revenue
    const teamCosts = this.inputs.teamSize * this.averageSalary
    const monthlyCosts = teamCosts + this.inputs.marketingBudget + this.inputs.operationalCosts
    const monthlyProfit = monthlyRevenue - monthlyCosts
    const profitMargin = monthlyRevenue > 0 ? (monthlyProfit / monthlyRevenue) * 100 : 0
    const breakEvenRevenue = monthlyCosts
    const grossMargin =
      monthlyRevenue > 0 ? ((monthlyRevenue - this.inputs.operationalCosts) / monthlyRevenue) * 100 : 0
    const burnRate = monthlyProfit < 0 ? Math.abs(monthlyProfit) : 0

    // Calculate cash runway
    let cashRunway: string | number = "Profitable"
    if (monthlyProfit < 0) {
      const runwayMonths = this.initialCash / Math.abs(monthlyProfit)
      cashRunway = runwayMonths > 12 ? `${(runwayMonths / 12).toFixed(1)} years` : `${runwayMonths.toFixed(1)} months`
    }

    // Estimate customer metrics (simplified)
    const estimatedCustomers = Math.floor(monthlyRevenue / 100) // Assume $100 average revenue per customer
    const customerAcquisitionCost = estimatedCustomers > 0 ? this.inputs.marketingBudget / estimatedCustomers : 0
    const lifetimeValue = customerAcquisitionCost > 0 ? customerAcquisitionCost * 3 : 300 // Simple 3x CAC rule

    return {
      monthlyRevenue,
      monthlyCosts,
      monthlyProfit,
      profitMargin,
      breakEvenRevenue,
      cashRunway,
      grossMargin,
      burnRate,
      revenueGrowthRate: 5, // Default 5% monthly growth
      customerAcquisitionCost,
      lifetimeValue,
    }
  }

  // Generate forecast data
  generateForecast(
    months = 12,
    revenueGrowthRate = 0.05,
    costGrowthRate = 0.03,
    scenario: "conservative" | "current" | "aggressive" = "current",
  ): ForecastData[] {
    const data: ForecastData[] = []
    let currentCash = this.initialCash
    let currentCustomers = Math.floor(this.inputs.revenue / 100)

    // Adjust growth rates based on scenario
    const scenarioMultipliers = {
      conservative: 0.5,
      current: 1.0,
      aggressive: 1.5,
    }

    const adjustedRevenueGrowth = revenueGrowthRate * scenarioMultipliers[scenario]
    const adjustedCostGrowth = costGrowthRate * scenarioMultipliers[scenario] * 0.8 // Costs grow slower

    for (let i = 0; i < months; i++) {
      // Calculate growth with some randomness for realism
      const revenueVariation = 1 + (Math.random() - 0.5) * 0.1 // ±5% variation
      const revenue = this.inputs.revenue * Math.pow(1 + adjustedRevenueGrowth, i) * revenueVariation

      // Team size grows with revenue (simplified)
      const teamSize = Math.max(this.inputs.teamSize, Math.floor(revenue / 15000))
      const teamCosts = teamSize * this.averageSalary

      // Marketing budget scales with revenue
      const marketingBudget = Math.max(this.inputs.marketingBudget, revenue * 0.15)

      // Operational costs grow more slowly
      const operationalCosts = this.inputs.operationalCosts * Math.pow(1 + adjustedCostGrowth, i)

      const totalCosts = teamCosts + marketingBudget + operationalCosts
      const profit = revenue - totalCosts

      currentCash += profit
      currentCustomers = Math.floor(revenue / 100)

      const cumulativeProfit = i === 0 ? profit : data[i - 1].cumulativeProfit + profit

      data.push({
        month: `Month ${i + 1}`,
        monthNum: i + 1,
        revenue: Math.round(revenue),
        costs: Math.round(totalCosts),
        profit: Math.round(profit),
        cumulativeProfit: Math.round(cumulativeProfit),
        cashBalance: Math.round(currentCash),
        teamSize,
        customers: currentCustomers,
      })
    }

    return data
  }

  // Calculate scenario comparison
  compareScenarios(scenarios: FinancialInputs[]): Array<{
    name: string
    metrics: FinancialMetrics
    forecast: ForecastData[]
  }> {
    return scenarios.map((scenario, index) => {
      const calculator = new FinancialCalculator(scenario)
      return {
        name: `Scenario ${index + 1}`,
        metrics: calculator.calculateMetrics(),
        forecast: calculator.generateForecast(12),
      }
    })
  }

  // Calculate key ratios
  calculateRatios(): {
    currentRatio: number
    quickRatio: number
    debtToEquity: number
    returnOnInvestment: number
    paybackPeriod: number
  } {
    const metrics = this.calculateMetrics()

    // Simplified ratio calculations (in a real app, you'd need balance sheet data)
    const currentRatio = 2.5 // Assume healthy current ratio
    const quickRatio = 1.8 // Assume healthy quick ratio
    const debtToEquity = 0.3 // Assume low debt
    const returnOnInvestment = metrics.profitMargin > 0 ? metrics.profitMargin / 100 : 0
    const paybackPeriod =
      metrics.customerAcquisitionCost > 0 ? metrics.lifetimeValue / metrics.customerAcquisitionCost : 0

    return {
      currentRatio,
      quickRatio,
      debtToEquity,
      returnOnInvestment,
      paybackPeriod,
    }
  }

  // Calculate break-even analysis
  calculateBreakEven(): {
    breakEvenUnits: number
    breakEvenRevenue: number
    marginOfSafety: number
    contributionMargin: number
  } {
    const fixedCosts = this.inputs.operationalCosts + this.inputs.teamSize * this.averageSalary
    const variableCostPerUnit = this.inputs.marketingBudget / Math.max(1, Math.floor(this.inputs.revenue / 100))
    const pricePerUnit = 100 // Assume $100 per unit

    const contributionMargin = pricePerUnit - variableCostPerUnit
    const breakEvenUnits = contributionMargin > 0 ? fixedCosts / contributionMargin : 0
    const breakEvenRevenue = breakEvenUnits * pricePerUnit
    const currentUnits = Math.floor(this.inputs.revenue / pricePerUnit)
    const marginOfSafety = currentUnits > breakEvenUnits ? ((currentUnits - breakEvenUnits) / currentUnits) * 100 : 0

    return {
      breakEvenUnits: Math.round(breakEvenUnits),
      breakEvenRevenue: Math.round(breakEvenRevenue),
      marginOfSafety: Math.round(marginOfSafety * 100) / 100,
      contributionMargin: Math.round(contributionMargin * 100) / 100,
    }
  }

  // Generate insights and recommendations
  generateInsights(): string[] {
    const metrics = this.calculateMetrics()
    const insights: string[] = []

    // Profitability insights
    if (metrics.monthlyProfit > 0) {
      insights.push(`✅ Your business is profitable with $${metrics.monthlyProfit.toLocaleString()} monthly profit`)
      if (metrics.profitMargin > 20) {
        insights.push(`🎯 Excellent profit margin of ${metrics.profitMargin.toFixed(1)}% - well above industry average`)
      }
    } else {
      insights.push(
        `⚠️ Monthly loss of $${Math.abs(metrics.monthlyProfit).toLocaleString()} - focus on increasing revenue or reducing costs`,
      )
    }

    // Cash runway insights
    if (typeof metrics.cashRunway === "string" && metrics.cashRunway === "Profitable") {
      insights.push(`💰 Strong cash position - business is self-sustaining`)
    } else if (typeof metrics.cashRunway === "string") {
      const runway = Number.parseFloat(metrics.cashRunway.split(" ")[0])
      if (runway < 6) {
        insights.push(`🚨 Critical: Only ${metrics.cashRunway} of cash runway remaining`)
      } else if (runway < 12) {
        insights.push(`⚠️ Moderate risk: ${metrics.cashRunway} of cash runway - consider fundraising`)
      }
    }

    // Growth insights
    if (metrics.customerAcquisitionCost > 0 && metrics.lifetimeValue > 0) {
      const ltvcac = metrics.lifetimeValue / metrics.customerAcquisitionCost
      if (ltvcac > 3) {
        insights.push(`📈 Healthy LTV:CAC ratio of ${ltvcac.toFixed(1)}:1 - good unit economics`)
      } else if (ltvcac < 3) {
        insights.push(
          `📉 LTV:CAC ratio of ${ltvcac.toFixed(1)}:1 is below optimal - improve retention or reduce acquisition costs`,
        )
      }
    }

    // Team insights
    const revenuePerEmployee = metrics.monthlyRevenue / this.inputs.teamSize
    if (revenuePerEmployee > 10000) {
      insights.push(`👥 High productivity: $${revenuePerEmployee.toLocaleString()} revenue per employee`)
    } else if (revenuePerEmployee < 5000) {
      insights.push(
        `👥 Consider optimizing team efficiency - currently $${revenuePerEmployee.toLocaleString()} revenue per employee`,
      )
    }

    return insights
  }
}

// Utility functions
export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`
}

export function calculateGrowthRate(current: number, previous: number): number {
  if (previous === 0) return 0
  return ((current - previous) / previous) * 100
}

export function calculateCompoundGrowth(initialValue: number, growthRate: number, periods: number): number {
  return initialValue * Math.pow(1 + growthRate, periods)
}
