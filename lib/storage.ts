"use client"

import type { FinancialInputs } from "./financial-calculations"

export interface UserScenario {
  id: string
  name: string
  inputs: FinancialInputs
  createdAt: string
  updatedAt: string
}

export interface UserReport {
  id: string
  name: string
  type: string
  data: any
  createdAt: string
  status: "generated" | "generating" | "failed"
  size: string
}

export interface UserPreferences {
  currency: string
  timezone: string
  emailNotifications: boolean
  reportNotifications: boolean
  marketingEmails: boolean
  defaultGrowthRate: number
  defaultTimeframe: number
}

export interface UserData {
  scenarios: UserScenario[]
  reports: UserReport[]
  preferences: UserPreferences
  lastActivity: string
}

class LocalStorageManager {
  private getStorageKey(userId: string, dataType: string): string {
    return `cfo-helper-${userId}-${dataType}`
  }

  private getUserId(): string {
    const user = localStorage.getItem("cfo-user")
    if (user) {
      const userData = JSON.parse(user)
      return userData.id
    }
    return "anonymous"
  }

  // Scenarios
  saveScenario(scenario: UserScenario): void {
    const userId = this.getUserId()
    const scenarios = this.getScenarios()
    const existingIndex = scenarios.findIndex((s) => s.id === scenario.id)

    if (existingIndex >= 0) {
      scenarios[existingIndex] = { ...scenario, updatedAt: new Date().toISOString() }
    } else {
      scenarios.unshift(scenario)
    }

    localStorage.setItem(this.getStorageKey(userId, "scenarios"), JSON.stringify(scenarios))
    this.updateLastActivity()
  }

  getScenarios(): UserScenario[] {
    const userId = this.getUserId()
    const stored = localStorage.getItem(this.getStorageKey(userId, "scenarios"))
    return stored ? JSON.parse(stored) : []
  }

  deleteScenario(scenarioId: string): void {
    const userId = this.getUserId()
    const scenarios = this.getScenarios().filter((s) => s.id !== scenarioId)
    localStorage.setItem(this.getStorageKey(userId, "scenarios"), JSON.stringify(scenarios))
    this.updateLastActivity()
  }

  // Reports
  saveReport(report: UserReport): void {
    const userId = this.getUserId()
    const reports = this.getReports()
    const existingIndex = reports.findIndex((r) => r.id === report.id)

    if (existingIndex >= 0) {
      reports[existingIndex] = report
    } else {
      reports.unshift(report)
    }

    localStorage.setItem(this.getStorageKey(userId, "reports"), JSON.stringify(reports))
    this.updateLastActivity()
  }

  getReports(): UserReport[] {
    const userId = this.getUserId()
    const stored = localStorage.getItem(this.getStorageKey(userId, "reports"))
    return stored ? JSON.parse(stored) : []
  }

  deleteReport(reportId: string): void {
    const userId = this.getUserId()
    const reports = this.getReports().filter((r) => r.id !== reportId)
    localStorage.setItem(this.getStorageKey(userId, "reports"), JSON.stringify(reports))
    this.updateLastActivity()
  }

  // Preferences
  savePreferences(preferences: UserPreferences): void {
    const userId = this.getUserId()
    localStorage.setItem(this.getStorageKey(userId, "preferences"), JSON.stringify(preferences))
    this.updateLastActivity()
  }

  getPreferences(): UserPreferences {
    const userId = this.getUserId()
    const stored = localStorage.getItem(this.getStorageKey(userId, "preferences"))
    return stored
      ? JSON.parse(stored)
      : {
          currency: "USD",
          timezone: "America/New_York",
          emailNotifications: true,
          reportNotifications: true,
          marketingEmails: false,
          defaultGrowthRate: 5,
          defaultTimeframe: 12,
        }
  }

  // Activity tracking
  updateLastActivity(): void {
    const userId = this.getUserId()
    localStorage.setItem(this.getStorageKey(userId, "lastActivity"), new Date().toISOString())
  }

  getLastActivity(): string | null {
    const userId = this.getUserId()
    return localStorage.getItem(this.getStorageKey(userId, "lastActivity"))
  }

  // Export all user data
  exportUserData(): UserData {
    return {
      scenarios: this.getScenarios(),
      reports: this.getReports(),
      preferences: this.getPreferences(),
      lastActivity: this.getLastActivity() || new Date().toISOString(),
    }
  }

  // Import user data
  importUserData(data: UserData): void {
    const userId = this.getUserId()
    localStorage.setItem(this.getStorageKey(userId, "scenarios"), JSON.stringify(data.scenarios))
    localStorage.setItem(this.getStorageKey(userId, "reports"), JSON.stringify(data.reports))
    localStorage.setItem(this.getStorageKey(userId, "preferences"), JSON.stringify(data.preferences))
    localStorage.setItem(this.getStorageKey(userId, "lastActivity"), data.lastActivity)
  }

  // Clear all user data
  clearUserData(): void {
    const userId = this.getUserId()
    localStorage.removeItem(this.getStorageKey(userId, "scenarios"))
    localStorage.removeItem(this.getStorageKey(userId, "reports"))
    localStorage.removeItem(this.getStorageKey(userId, "preferences"))
    localStorage.removeItem(this.getStorageKey(userId, "lastActivity"))
  }

  // Get usage statistics
  getUsageStats(): {
    totalScenarios: number
    totalReports: number
    scenariosThisMonth: number
    reportsThisMonth: number
    lastActivityDate: string | null
  } {
    const scenarios = this.getScenarios()
    const reports = this.getReports()
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()

    const scenariosThisMonth = scenarios.filter((s) => {
      const date = new Date(s.createdAt)
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear
    }).length

    const reportsThisMonth = reports.filter((r) => {
      const date = new Date(r.createdAt)
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear
    }).length

    return {
      totalScenarios: scenarios.length,
      totalReports: reports.length,
      scenariosThisMonth,
      reportsThisMonth,
      lastActivityDate: this.getLastActivity(),
    }
  }
}

// Create singleton instance
export const storageManager = new LocalStorageManager()

// React hook for using storage
import { useState, useEffect } from "react"

export function useUserScenarios() {
  const [scenarios, setScenarios] = useState<UserScenario[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setScenarios(storageManager.getScenarios())
    setLoading(false)
  }, [])

  const saveScenario = (scenario: UserScenario) => {
    storageManager.saveScenario(scenario)
    setScenarios(storageManager.getScenarios())
  }

  const deleteScenario = (scenarioId: string) => {
    storageManager.deleteScenario(scenarioId)
    setScenarios(storageManager.getScenarios())
  }

  return { scenarios, saveScenario, deleteScenario, loading }
}

export function useUserReports() {
  const [reports, setReports] = useState<UserReport[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setReports(storageManager.getReports())
    setLoading(false)
  }, [])

  const saveReport = (report: UserReport) => {
    storageManager.saveReport(report)
    setReports(storageManager.getReports())
  }

  const deleteReport = (reportId: string) => {
    storageManager.deleteReport(reportId)
    setReports(storageManager.getReports())
  }

  return { reports, saveReport, deleteReport, loading }
}

export function useUserPreferences() {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setPreferences(storageManager.getPreferences())
    setLoading(false)
  }, [])

  const savePreferences = (newPreferences: UserPreferences) => {
    storageManager.savePreferences(newPreferences)
    setPreferences(newPreferences)
  }

  return { preferences, savePreferences, loading }
}
