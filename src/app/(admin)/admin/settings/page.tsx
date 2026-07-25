"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authFetch } from "@/lib/auth-client"
import { AlertTriangle, RotateCcw, Clock, ChevronDown, ChevronUp } from "lucide-react"
import type { Revision } from "@/types"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useDebounce<T extends (...args: any[]) => any>(fn: T, delay: number) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const fnRef = useRef(fn)

  useEffect(() => {
    fnRef.current = fn
  }, [fn])

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => fnRef.current(...args), delay)
    },
    [delay]
  )
}

function RevisionHistory() {
  const [revisions, setRevisions] = useState<Revision[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const fetchedRef = useRef(false)

  useEffect(() => {
    if (!open || fetchedRef.current) return
    fetchedRef.current = true
    authFetch("/api/revisions?entityType=settings&entityId=config/store&limit=10")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setRevisions(data) })
      .catch(() => { /* empty */ })
      .finally(() => setLoading(false))
  }, [open])

  return (
    <div className="border border-outline-variant/20 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-on-surface hover:bg-surface-container/50 transition-colors"
      >
        <span className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Revision History ({revisions.length})
        </span>
        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {open && (
        <div className="border-t border-outline-variant/10 max-h-64 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-sm text-on-surface-variant">Loading...</div>
          ) : revisions.length === 0 ? (
            <div className="p-4 text-center text-sm text-on-surface-variant">No revisions yet</div>
          ) : (
            revisions.map((rev) => (
              <div key={rev.id} className="px-4 py-3 border-b border-outline-variant/5 last:border-0">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-on-surface">
                    {rev.action === "create" ? "Created" : rev.action === "delete" ? "Deleted" : "Updated"}
                  </span>
                  <span className="text-on-surface-variant">
                    {new Date(rev.createdAt).toLocaleString()}
                  </span>
                </div>
                {rev.changedFields && rev.changedFields.length > 0 && (
                  <p className="text-xs text-on-surface-variant mt-1">
                    Changed: {rev.changedFields.join(", ")}
                  </p>
                )}
                {rev.editedBy && (
                  <p className="text-xs text-on-surface-variant mt-0.5">By: {rev.editedBy}</p>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    storeName: "PhytoFlex Gold",
    storeEmail: "support@phytoflexgold.com",
    storePhone: "+91-XXXXXXXXXX",
    shippingFee: "0",
    freeShippingThreshold: "2100",
    taxRate: "0",
    version: 0,
  })
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")
  const [loading, setLoading] = useState(true)
  const [conflict, setConflict] = useState<{
    serverData: typeof settings
    message: string
  } | null>(null)

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

  const persistSettings = useCallback(async (data: typeof settings) => {
    setSaveStatus("saving")
    try {
      const res = await authFetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, expectedVersion: data.version ?? undefined }),
      })
      if (res.status === 409) {
        const err = await res.json()
        setConflict({ serverData: err.serverData, message: err.message })
        setSaveStatus("error")
        return
      }
      if (!res.ok) throw new Error("Save failed")
      const result = await res.json()
      setSettings((prev) => ({ ...prev, version: result.version }))
      setSaveStatus("saved")
      setTimeout(() => setSaveStatus("idle"), 2000)
    } catch {
      setSaveStatus("error")
      setTimeout(() => setSaveStatus("idle"), 3000)
    }
  }, [])

  const debouncedSave = useDebounce(persistSettings, 800)

  const handleFieldChange = (field: string, value: string) => {
    const updated = { ...settings, [field]: value }
    setSettings(updated)
    debouncedSave(updated)
  }

  const handleManualSave = async (e: React.FormEvent) => {
    e.preventDefault()
    await persistSettings(settings)
  }

  const resolveConflict = (useServer: boolean) => {
    if (!conflict) return
    if (useServer) {
      setSettings(conflict.serverData)
    }
    setConflict(null)
  }

  if (loading) {
    return <div className="text-center py-20 text-on-surface-variant">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-display-sm font-extrabold">Settings</h1>
        <span className="text-xs text-on-surface-variant flex items-center gap-1">
          {saveStatus === "saving" && <><span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" /> Saving...</>}
          {saveStatus === "saved" && <><span className="w-2 h-2 rounded-full bg-green-400" /> Saved</>}
          {saveStatus === "error" && <><span className="w-2 h-2 rounded-full bg-red-400" /> Error</>}
          {saveStatus === "idle" && settings.version !== undefined && (
            <>v{settings.version}</>
          )}
        </span>
      </div>

      {conflict && (
        <Card className="border-error/30 bg-error-container/10">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-error mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-bold text-on-surface">{conflict.message}</p>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" onClick={() => resolveConflict(true)}>
                    <RotateCcw className="w-3 h-3 mr-1" /> Load Latest Version
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setConflict(null)}>
                    Keep My Changes
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Store Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleManualSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Store Name</Label>
                <Input value={settings.storeName} onChange={(e) => handleFieldChange("storeName", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Support Email</Label>
                <Input type="email" value={settings.storeEmail} onChange={(e) => handleFieldChange("storeEmail", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input value={settings.storePhone} onChange={(e) => handleFieldChange("storePhone", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Shipping Fee (₹) — 0 for free</Label>
                <Input value={settings.shippingFee} onChange={(e) => handleFieldChange("shippingFee", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Free Shipping Above (₹)</Label>
                <Input value={settings.freeShippingThreshold} onChange={(e) => handleFieldChange("freeShippingThreshold", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Tax Rate (%)</Label>
                <Input value={settings.taxRate} onChange={(e) => handleFieldChange("taxRate", e.target.value)} />
              </div>
            </div>
            <Button type="submit">
              Save Changes
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

      <Card>
        <CardHeader>
          <CardTitle>Change History</CardTitle>
        </CardHeader>
        <CardContent>
          <RevisionHistory />
        </CardContent>
      </Card>
    </div>
  )
}
