"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authFetch } from "@/lib/auth-client"

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    storeName: "PhytoFlex Gold",
    storeEmail: "support@phytoflexgold.com",
    storePhone: "+91-XXXXXXXXXX",
    shippingFee: "0",
    freeShippingThreshold: "2100",
    taxRate: "0",
  })
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await authFetch("/api/settings")
        if (res.ok) {
          const data = await res.json()
          setSettings(data)
        }
      } catch (err) {
        console.error("Failed to load settings:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await authFetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      console.error("Failed to save settings:", err)
    }
  }

  if (loading) {
    return <div className="text-center py-20 text-on-surface-variant">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-display-sm font-extrabold">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Store Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Store Name</Label>
                <Input value={settings.storeName} onChange={(e) => setSettings({ ...settings, storeName: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Support Email</Label>
                <Input type="email" value={settings.storeEmail} onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input value={settings.storePhone} onChange={(e) => setSettings({ ...settings, storePhone: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Shipping Fee (₹) — 0 for free</Label>
                <Input value={settings.shippingFee} onChange={(e) => setSettings({ ...settings, shippingFee: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Free Shipping Above (₹)</Label>
                <Input value={settings.freeShippingThreshold} onChange={(e) => setSettings({ ...settings, freeShippingThreshold: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Tax Rate (%)</Label>
                <Input value={settings.taxRate} onChange={(e) => setSettings({ ...settings, taxRate: e.target.value })} />
              </div>
            </div>
            <Button type="submit">
              {saved ? "Saved!" : "Save Settings"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Integration Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-surface-container">
            <div>
              <p className="font-bold">Razorpay</p>
              <p className="text-sm text-on-surface-variant">Payment Gateway</p>
            </div>
            <div className="flex items-center gap-2 text-green-400">
              <span className="w-2 h-2 rounded-full bg-green-400"></span>
              <span className="text-sm">Configured</span>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg bg-surface-container">
            <div>
              <p className="font-bold">Firebase</p>
              <p className="text-sm text-on-surface-variant">Auth, Database & Storage</p>
            </div>
            <div className="flex items-center gap-2 text-green-400">
              <span className="w-2 h-2 rounded-full bg-green-400"></span>
              <span className="text-sm">Configured</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
