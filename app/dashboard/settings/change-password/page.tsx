"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"

export default function ChangePasswordPage() {
  const { changePassword, user } = useAuth()
  const router = useRouter()
  const [current, setCurrent] = useState("")
  const [otp, setOtp] = useState("")
  const [next, setNext] = useState("")
  const [status, setStatus] = useState<string | null>(null)

  const requestOtp = () => {
    // Mock OTP send
    localStorage.setItem("cfo-otp", "123456")
    setStatus(`OTP sent to ${user?.email}`)
  }

  const submit = async () => {
    const expected = localStorage.getItem("cfo-otp")
    if (otp !== expected) {
      setStatus("Invalid OTP")
      return
    }
    const ok = await changePassword(current, next)
    setStatus(ok ? "Password changed" : "Failed to change password")
    if (ok) {
      setTimeout(() => router.push("/dashboard/settings"), 800)
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Confirm your identity and set a new password</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Old Password</Label>
            <Input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Email OTP</Label>
            <div className="flex gap-2">
              <Input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter 6-digit OTP" />
              <Button type="button" variant="outline" onClick={requestOtp}>Send OTP</Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>New Password</Label>
            <Input type="password" value={next} onChange={(e) => setNext(e.target.value)} placeholder="Min 6 characters" />
          </div>
          <Button className="w-full" onClick={submit}>Update Password</Button>
          {status && <p className="text-sm text-slate-500 mt-1">{status}</p>}
        </CardContent>
      </Card>
    </div>
  )
}


