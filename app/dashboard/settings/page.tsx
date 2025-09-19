"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User, Bell, Shield, CreditCard, Download, Trash2 } from "lucide-react"

export default function SettingsPage() {
  const { user } = useAuth()
  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [currency, setCurrency] = useState("USD")
  const [timezone, setTimezone] = useState("America/New_York")
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [reportNotifications, setReportNotifications] = useState(true)
  const [marketingEmails, setMarketingEmails] = useState(false)

  const saveProfile = () => {
    // In a real app, this would update the user profile
    console.log("Saving profile:", { name, email })
  }

  const savePreferences = () => {
    // In a real app, this would save user preferences
    console.log("Saving preferences:", { currency, timezone, emailNotifications, reportNotifications, marketingEmails })
  }

  const exportData = () => {
    // In a real app, this would export user data
    const userData = {
      profile: { name, email },
      preferences: { currency, timezone },
      notifications: { emailNotifications, reportNotifications, marketingEmails },
      exportDate: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(userData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "cfo-helper-data.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600 mt-1">Manage your account settings and preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Settings
            </CardTitle>
            <CardDescription>Update your personal information and account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-slate-100 text-slate-900 text-lg">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-medium">{user?.name}</h4>
                <p className="text-sm text-slate-500">{user?.email}</p>
                <Badge variant="secondary" className="mt-1">
                  Free Plan
                </Badge>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </div>

              <Button onClick={saveProfile} className="w-full">
                Save Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>Customize your CFO Helper experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Default Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                    <SelectItem value="GBP">GBP - British Pound</SelectItem>
                    <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Timezone</Label>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/New_York">Eastern Time</SelectItem>
                    <SelectItem value="America/Chicago">Central Time</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                    <SelectItem value="Europe/London">London</SelectItem>
                    <SelectItem value="Europe/Paris">Paris</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={savePreferences} className="w-full">
                Save Preferences
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>Manage how you receive updates and alerts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-slate-500">Receive important updates via email</p>
                </div>
                <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Report Notifications</Label>
                  <p className="text-sm text-slate-500">Get notified when reports are ready</p>
                </div>
                <Switch checked={reportNotifications} onCheckedChange={setReportNotifications} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Marketing Emails</Label>
                  <p className="text-sm text-slate-500">Receive tips and product updates</p>
                </div>
                <Switch checked={marketingEmails} onCheckedChange={setMarketingEmails} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account & Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Account & Security
            </CardTitle>
            <CardDescription>Manage your account security and data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <Shield className="h-4 w-4 mr-2" />
              Change Password
            </Button>

            <Button variant="outline" className="w-full justify-start bg-transparent" onClick={exportData}>
              <Download className="h-4 w-4 mr-2" />
              Export My Data
            </Button>

            <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 bg-transparent">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Usage & Billing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Usage & Billing
          </CardTitle>
          <CardDescription>Monitor your usage and manage billing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900">12</div>
              <div className="text-sm text-slate-600">Scenarios Run</div>
              <div className="text-xs text-slate-500 mt-1">This month</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900">5</div>
              <div className="text-sm text-slate-600">Reports Generated</div>
              <div className="text-xs text-slate-500 mt-1">This month</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900">Free</div>
              <div className="text-sm text-slate-600">Current Plan</div>
              <div className="text-xs text-slate-500 mt-1">Unlimited scenarios</div>
            </div>
          </div>
          <div className="mt-6 text-center">
            <Button>Upgrade to Pro</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
