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

  return <AuthContext.Provider value={{ user, login, signup, logout, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
