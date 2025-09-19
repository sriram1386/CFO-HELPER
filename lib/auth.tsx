"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

interface User {
  id: string
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
  updateProfile: (updates: Partial<Pick<User, "name" | "email">>) => Promise<void>
  changePassword: (current: string, next: string) => Promise<boolean>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("cfo-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - in real app, this would call your API
    if (email && password.length >= 6) {
      const user = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name: email.split("@")[0],
      }
      setUser(user)
      localStorage.setItem("cfo-user", JSON.stringify(user))
      return true
    }
    return false
  }

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    // Mock signup - in real app, this would call your API
    if (email && password.length >= 6 && name) {
      const user = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name,
      }
      setUser(user)
      localStorage.setItem("cfo-user", JSON.stringify(user))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("cfo-user")
  }

  const updateProfile = async (updates: Partial<Pick<User, "name" | "email">>) => {
    setUser((prev) => {
      if (!prev) return prev
      const nextUser = { ...prev, ...updates }
      localStorage.setItem("cfo-user", JSON.stringify(nextUser))
      return nextUser
    })
  }

  const changePassword = async (current: string, next: string): Promise<boolean> => {
    // Mock success if next is long enough
    return Boolean(current) && next.length >= 6
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateProfile, changePassword, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
