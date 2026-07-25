"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import { authFetch } from "@/lib/auth-client"
import { Input } from "@/components/ui/input"
import { Search, Mail, Phone, Calendar } from "lucide-react"
import type { User } from "@/types"

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const res = await authFetch("/api/customers")
        const data = await res.json()
        setCustomers(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchCustomers()
  }, [])

  const filtered = customers.filter(
    (c) =>
      !search ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.name?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <div className="text-center py-20 text-on-surface-variant">Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-display-sm font-extrabold">Customers</h1>
        <p className="text-on-surface-variant">{customers.length} total</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
        <Input placeholder="Search customers..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-outline-variant/10">
            {filtered.map((customer) => (
              <div key={customer.id} className="p-6 hover:bg-surface-container/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center">
                        <span className="font-bold text-primary-container">
                          {customer.name?.charAt(0) || customer.email?.charAt(0) || "?"}
                        </span>
                      </div>
                      <div>
                        <p className="font-bold">{customer.name || "Unnamed"}</p>
                        <div className="flex items-center gap-3 text-sm text-on-surface-variant">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" /> {customer.email}
                          </span>
                          {customer.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" /> {customer.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={customer.role === "ADMIN" ? "primary" : "default"}>
                      {customer.role}
                    </Badge>
                    <span className="flex items-center gap-1 text-xs text-on-surface-variant">
                      <Calendar className="w-3 h-3" />
                      {customer.createdAt ? formatDate(customer.createdAt) : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-12 text-on-surface-variant">No customers found</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
