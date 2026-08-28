"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { AdminSidebar } from "./AdminSidebar"
import { Menu } from "lucide-react"

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const { userProfile, loading, isAdmin } = useAuth()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!loading && (!userProfile || !isAdmin)) {
      router.push("/auth/login")
    }
  }, [loading, userProfile, isAdmin, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-container"></div>
      </div>
    )
  }

  if (!userProfile || !isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="md:pl-64">
        <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-outline-variant/20 bg-background/95 backdrop-blur px-4 py-3 md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
            className="text-on-surface hover:text-primary transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-bold text-sm">PhytoFlex Gold Admin</span>
        </div>
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  )
}