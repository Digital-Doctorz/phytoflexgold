"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatPrice, formatDate } from "@/lib/utils"
import { authFetch } from "@/lib/auth-client"
import { DollarSign, ShoppingCart, Users, Package, Truck, ArrowRight, List } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"
import type { OrderStatus } from "@/types"

interface RecentOrder {
  id: string
  email?: string
  createdAt: string | number
  total: number
  status: string
}

interface DashboardData {
  totalSales: number
  orderCount: number
  customerCount: number
  productCount: number
  pendingDispatch: number
  statusCounts: Record<string, number>
  recentOrders: RecentOrder[]
  dispatchQueue: RecentOrder[]
  salesByDay: { date: string; sales: number }[]
}

const statusMeta: { key: OrderStatus; label: string; variant: "success" | "warning" | "primary" | "error" | "default" }[] = [
  { key: "PENDING", label: "Pending", variant: "warning" },
  { key: "PAID", label: "Paid", variant: "success" },
  { key: "SHIPPED", label: "Shipped", variant: "primary" },
  { key: "DELIVERED", label: "Delivered", variant: "success" },
  { key: "CANCELLED", label: "Cancelled", variant: "error" },
]

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
          .filter((o: RecentOrder) => o.status === "PAID" || o.status === "DELIVERED")
          .reduce((sum: number, o: RecentOrder) => sum + (o.total || 0), 0)

        const salesByDayMap: Record<string, number> = {}
        orders.forEach((o: RecentOrder) => {
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

        const statusCounts: Record<string, number> = {}
        orders.forEach((o: RecentOrder) => {
          statusCounts[o.status] = (statusCounts[o.status] || 0) + 1
        })

        setData({
          totalSales,
          orderCount: orders.length,
          customerCount: customers.length,
          productCount: products.length,
          pendingDispatch: orders.filter((o: RecentOrder) => o.status === "PAID").length,
          statusCounts,
          recentOrders: orders.slice(0, 5),
          dispatchQueue: orders.filter((o: RecentOrder) => o.status === "PAID").slice(0, 5),
          salesByDay,
        })
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    void fetchData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-display-sm font-extrabold">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-6">
          {[...Array(5)].map((_, i) => (
            <Card key={i}><CardContent className="p-6"><Skeleton className="h-20" /></CardContent></Card>
          ))}
        </div>
      </div>
    )
  }

  const stats = [
    { label: "Total Revenue", value: formatPrice(data?.totalSales || 0), icon: DollarSign, color: "text-green-400", href: "/admin/orders" },
    { label: "Total Orders", value: String(data?.orderCount || 0), icon: ShoppingCart, color: "text-blue-400", href: "/admin/orders" },
    { label: "To Dispatch", value: String(data?.pendingDispatch || 0), icon: Truck, color: "text-yellow-400", href: "/admin/dispatch" },
    { label: "Customers", value: String(data?.customerCount || 0), icon: Users, color: "text-purple-400", href: "/admin/customers" },
    { label: "Products", value: String(data?.productCount || 0), icon: Package, color: "text-primary-container", href: "/admin/products" },
  ]

  return (
    <div className="space-y-8">
      <h1 className="text-display-sm font-extrabold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-6">
        {stats.map((stat) => {
          const body = (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-on-surface-variant">{stat.label}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg bg-surface-container-highest ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          )
          return stat.href ? (
            <Link key={stat.label} href={stat.href} className="hover:opacity-90 transition-opacity">
              <Card><CardContent className="p-6">{body}</CardContent></Card>
            </Link>
          ) : (
            <Card key={stat.label}><CardContent className="p-6">{body}</CardContent></Card>
          )
        })}
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
                      formatter={(value) => [`₹${value}`, 'Revenue']}
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
            <CardTitle>Order Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {statusMeta.map((s) => {
                const count = data?.statusCounts?.[s.key] || 0
                const pct = data?.orderCount ? Math.round((count / data.orderCount) * 100) : 0
                return (
                  <div key={s.key} className="flex items-center gap-4">
                    <Badge variant={s.variant} className="w-28 justify-center text-[10px]">{s.label}</Badge>
                    <div className="flex-1 h-2 rounded-full bg-surface-container overflow-hidden">
                      <div className="h-full rounded-full bg-primary-container transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-8 text-right text-sm font-bold">{count}</span>
                  </div>
                )
              })}
              <p className="text-xs text-on-surface-variant pt-2">Funnel: Pending → Paid → Shipped → Delivered</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Dispatch Ready</CardTitle>
          </CardHeader>
          <CardContent>
            {data?.dispatchQueue && data.dispatchQueue.length > 0 ? (
              <div className="space-y-4">
                {data.dispatchQueue.map((order: RecentOrder) => (
                  <div key={order.id} className="flex items-center justify-between py-2 border-b border-outline-variant/10 last:border-0">
                    <div>
                      <p className="font-bold text-sm">{order.email || "Guest"}</p>
                      <p className="text-xs text-on-surface-variant font-mono">{order.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatPrice(order.total || 0)}</p>
                      <Badge variant="success" className="text-[10px]">PAID</Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-on-surface-variant py-8 flex flex-col items-center gap-3">
                <Truck className="w-8 h-8" />
                <p>No orders waiting to ship</p>
              </div>
            )}
            <Link href="/admin/dispatch" className="inline-flex items-center gap-1 text-sm text-primary-container font-bold mt-4 hover:underline">
              Open dispatch queue <ArrowRight className="w-4 h-4" />
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {data?.recentOrders && data.recentOrders.length > 0 ? (
              <div className="space-y-4">
                {data.recentOrders.map((order: RecentOrder) => (
                  <div key={order.id} className="flex items-center justify-between py-2 border-b border-outline-variant/10 last:border-0">
                    <div>
                      <p className="font-bold text-sm">{order.email || "Guest"}</p>
                      <p className="text-xs text-on-surface-variant">{formatDate(typeof order.createdAt === "string" ? order.createdAt : new Date(order.createdAt).toISOString())}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatPrice(order.total || 0)}</p>
                      <Badge variant={statusMeta.find((s) => s.key === order.status)?.variant || "default"} className="text-[10px]">{order.status}</Badge>
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

      <div className="flex justify-end">
        <Button variant="secondary" size="sm" asChild>
          <Link href="/admin/orders"><List className="w-4 h-4" /> Manage all orders</Link>
        </Button>
      </div>
    </div>
  )
}