"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select } from "@/components/ui/select"
import { formatPrice, formatDate } from "@/lib/utils"
import { authFetch } from "@/lib/auth-client"
import { Download, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import type { Order, OrderStatus } from "@/types"

const statusColors: Record<OrderStatus, "success" | "warning" | "primary" | "error" | "default"> = {
  PENDING: "warning",
  PAID: "success",
  SHIPPED: "primary",
  DELIVERED: "success",
  CANCELLED: "error",
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")

  const fetchOrders = async () => {
    try {
      const params = new URLSearchParams()
      if (statusFilter) params.set("status", statusFilter)
      const res = await authFetch(`/api/orders?${params}`)
      const data = await res.json()
      setOrders(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchOrders() }, [statusFilter])

  const updateStatus = async (id: string, status: OrderStatus) => {
    await authFetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    fetchOrders()
  }

  const exportCSV = () => {
    const headers = ["ID", "Email", "Total", "Status", "Date"]
    const rows = orders.map((o) => [
      o.id,
      o.email || "",
      o.total,
      o.status,
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
    !search || o.email?.toLowerCase().includes(search.toLowerCase()) || o.id?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <div className="text-center py-20 text-on-surface-variant">Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-display-sm font-extrabold">Orders</h1>
        <Button variant="secondary" onClick={exportCSV}>
          <Download className="w-4 h-4 mr-2" /> Export CSV
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <Input
            placeholder="Search orders..."
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
              <div key={order.id} className="p-6 hover:bg-surface-container/50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-bold">{order.email || "Guest"}</p>
                      <p className="text-xs text-on-surface-variant font-mono">{order.id}</p>
                    </div>
                    <Badge variant={statusColors[order.status]}>{order.status}</Badge>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{formatPrice(order.total)}</p>
                    <p className="text-xs text-on-surface-variant">{formatDate(order.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-on-surface-variant">
                    {order.items?.map((item) => (
                      <span key={item.productId}>
                        {item.productName} x{item.quantity}
                        {order.items && order.items.indexOf(item) < order.items.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    {order.status === "PENDING" && (
                      <Button size="sm" variant="ghost" onClick={() => updateStatus(order.id, "PAID")}>Mark Paid</Button>
                    )}
                    {order.status === "PAID" && (
                      <Button size="sm" variant="ghost" onClick={() => updateStatus(order.id, "SHIPPED")}>Mark Shipped</Button>
                    )}
                    {order.status === "SHIPPED" && (
                      <Button size="sm" variant="ghost" onClick={() => updateStatus(order.id, "DELIVERED")}>Mark Delivered</Button>
                    )}
                    {order.status !== "CANCELLED" && order.status !== "DELIVERED" && (
                      <Button size="sm" variant="ghost" onClick={() => updateStatus(order.id, "CANCELLED")}>Cancel</Button>
                    )}
                  </div>
                </div>
              </div>
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
