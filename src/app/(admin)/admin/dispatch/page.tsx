"use client"

import { useCallback, useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { authFetch } from "@/lib/auth-client"
import { OrderDetails } from "@/components/admin/OrderDetails"
import { RefreshCw, Truck } from "lucide-react"
import type { Order } from "@/types"

export default function DispatchPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [refreshing, setRefreshing] = useState(false)

  const fetchQueue = useCallback(async (quiet = false) => {
    if (!quiet) setLoading(true)
    setError("")
    try {
      const res = await authFetch("/api/orders?status=PAID")
      const data = await res.json()
      // Guard against a non-array payload (e.g. an { error } response) so the
      // page never crashes calling orders.map on an object.
      setOrders(Array.isArray(data) ? data : [])
      setError(Array.isArray(data) ? "" : "Failed to load the dispatch queue")
    } catch {
      setOrders([])
      setError("Failed to load the dispatch queue")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      try {
        const res = await authFetch("/api/orders?status=PAID")
        const data = await res.json()
        if (!cancelled) setOrders(Array.isArray(data) ? data : [])
        if (!cancelled && !Array.isArray(data)) setError("Failed to load the dispatch queue")
      } catch {
        if (!cancelled) {
          setOrders([])
          setError("Failed to load the dispatch queue")
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void run()
    return () => {
      cancelled = true
    }
  }, [])

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchQueue(true)
    setRefreshing(false)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-display-sm font-extrabold">Dispatch Queue</h1>
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <Card key={i} className="h-28 animate-pulse bg-surface-container" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-display-sm font-extrabold">Dispatch Queue</h1>
          <Badge variant="warning">{orders.length} ready</Badge>
        </div>
        <Button variant="secondary" size="sm" onClick={handleRefresh} disabled={refreshing}>
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} /> Refresh
        </Button>
      </div>

      {error && <p className="text-error text-sm">{error}</p>}

      {orders.length === 0 ? (
        <Card className="flex flex-col items-center justify-center gap-3 py-20 text-center">
          <Truck className="w-10 h-10 text-on-surface-variant" />
          <p className="font-bold text-lg">Nothing ready to dispatch</p>
          <p className="text-sm text-on-surface-variant max-w-sm">
            Orders appear here the moment payment is captured (Razorpay webhook or verification).
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="p-0">
              <OrderDetails order={order} onChanged={() => void fetchQueue(true)} defaultOpen />
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}