"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatPrice, formatDate } from "@/lib/utils"
import { authFetch } from "@/lib/auth-client"
import { DollarSign, ShoppingCart, Users, Package } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"

interface DashboardData {
  totalSales: number
  orderCount: number
  customerCount: number
  productCount: number
  recentOrders: any[]
  salesByDay: { date: string; sales: number }[]
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [ordersRes, productsRes, customersRes] = await Promise.all([
          authFetch("/api/orders"),
          authFetch("/api/products"),
          authFetch("/api/customers"),
        ])
        const orders = await ordersRes.json()
        const products = await productsRes.json()
        const customers = await customersRes.json()

        const totalSales = orders
          .filter((o: any) => o.status === "PAID" || o.status === "DELIVERED")
          .reduce((sum: number, o: any) => sum + (o.total || 0), 0)

        const salesByDayMap: Record<string, number> = {}
        orders.forEach((o: any) => {
          if (o.status === "PAID" || o.status === "DELIVERED") {
            try {
              const dateStr = typeof o.createdAt === "string" ? o.createdAt : new Date(o.createdAt).toISOString().split("T")[0]
              const date = dateStr.split("T")[0]
              salesByDayMap[date] = (salesByDayMap[date] || 0) + (o.total || 0)
            } catch {
              // skip orders with invalid dates
            }
          }
        })
        const salesByDay = Object.entries(salesByDayMap)
          .map(([date, sales]) => ({ date, sales }))
          .sort((a, b) => a.date.localeCompare(b.date))
          .slice(-30)

        setData({
          totalSales,
          orderCount: orders.length,
          customerCount: customers.length,
          productCount: products.length,
          recentOrders: orders.slice(0, 5),
          salesByDay,
        })
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-display-sm font-extrabold">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}><CardContent className="p-6"><Skeleton className="h-20" /></CardContent></Card>
          ))}
        </div>
      </div>
    )
  }

  const stats = [
    { label: "Total Revenue", value: formatPrice(data?.totalSales || 0), icon: DollarSign, color: "text-green-400" },
    { label: "Total Orders", value: String(data?.orderCount || 0), icon: ShoppingCart, color: "text-blue-400" },
    { label: "Customers", value: String(data?.customerCount || 0), icon: Users, color: "text-purple-400" },
    { label: "Products", value: String(data?.productCount || 0), icon: Package, color: "text-primary-container" },
  ]

  const statusColor = (status: string) => {
    switch (status) {
      case "PAID": return "success"
      case "PENDING": return "warning"
      case "SHIPPED": return "primary"
      case "DELIVERED": return "success"
      case "CANCELLED": return "error"
      default: return "default"
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-display-sm font-extrabold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-on-surface-variant">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-surface-container-highest ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue (30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            {data?.salesByDay && data.salesByDay.length > 0 ? (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.salesByDay}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="date" tick={{ fill: '#a1a1aa', fontSize: 12 }} tickLine={false} />
                    <YAxis tick={{ fill: '#a1a1aa', fontSize: 12 }} tickLine={false} tickFormatter={(v) => `₹${v}`} />
                    <Tooltip
                      contentStyle={{ background: '#1e2020', border: '1px solid #594139', borderRadius: '8px' }}
                      labelStyle={{ color: '#e2e2e2' }}
                      formatter={(value: any) => [`₹${value}`, 'Revenue']}
                    />
                    <Line type="monotone" dataKey="sales" stroke="#ff6b35" strokeWidth={2} dot={{ fill: '#ff6b35' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-72 flex items-center justify-center text-on-surface-variant">
                No sales data yet
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {data?.recentOrders && data.recentOrders.length > 0 ? (
              <div className="space-y-4">
                {data.recentOrders.map((order: any) => (
                  <div key={order.id} className="flex items-center justify-between py-2 border-b border-outline-variant/10 last:border-0">
                    <div>
                      <p className="font-bold text-sm">{order.email || "Guest"}</p>
                      <p className="text-xs text-on-surface-variant">{formatDate(typeof order.createdAt === "string" ? order.createdAt : new Date(order.createdAt).toISOString())}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatPrice(order.total || 0)}</p>
                      <Badge variant={statusColor(order.status)} className="text-[10px]">{order.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-on-surface-variant py-8">
                No orders yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
