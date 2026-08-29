"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"
import { formatDate } from "@/lib/utils"
import { authFetch } from "@/lib/auth-client"
import { OrderDetails } from "@/components/admin/OrderDetails"
import { Download, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import type { Order } from "@/types"

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      try {
        const params = new URLSearchParams()
        if (statusFilter) params.set("status", statusFilter)
        const res = await authFetch(`/api/orders?${params}`)
        const data = await res.json()
        if (!cancelled) setOrders(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error(err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void run()
    return () => {
      cancelled = true
    }
  }, [statusFilter])

  const exportCSV = () => {
    const headers = ["ID", "Email", "Total", "Status", "Payment ID", "Courier", "Tracking", "Date"]
    const rows = orders.map((o) => [
      o.id,
      o.email || "",
      o.total,
      o.status,
      o.razorpay?.paymentId || "",
      o.shipping?.courier || "",
      o.shipping?.trackingNumber || "",
      formatDate(o.createdAt),
    ])
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `orders-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
  }

  const filteredOrders = orders.filter((o) =>
    !search ||
    o.email?.toLowerCase().includes(search.toLowerCase()) ||
    o.id?.toLowerCase().includes(search.toLowerCase()) ||
    o.razorpay?.paymentId?.toLowerCase().includes(search.toLowerCase()) ||
    o.shipping?.trackingNumber?.toLowerCase().includes(search.toLowerCase())
  )

  const refetch = async () => {
    try {
      const params = new URLSearchParams()
      if (statusFilter) params.set("status", statusFilter)
      const res = await authFetch(`/api/orders?${params}`)
      const data = await res.json()
      setOrders(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <div className="text-center py-20 text-on-surface-variant">Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-display-sm font-extrabold">Orders</h1>
        <Button variant="secondary" onClick={exportCSV}>
          <Download className="w-4 h-4 mr-2" /> Export CSV
        </Button>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <Input
            placeholder="Search email, order, payment, tracking..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="PAID">Paid</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-outline-variant/10">
            {filteredOrders.map((order) => (
              <OrderDetails
                key={order.id}
                order={order}
                onChanged={() => void refetch()}
              />
            ))}
            {filteredOrders.length === 0 && (
              <div className="text-center py-12 text-on-surface-variant">No orders found</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}