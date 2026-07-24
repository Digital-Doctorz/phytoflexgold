"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { AdminSidebar } from "./AdminSidebar"

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const { userProfile, loading, isAdmin } = useAuth()
  const router = useRouter()

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
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />
      <div className="flex-1 ml-64">
        <main className="p-8">{children}</main>
      </div>
    </div>
  )
}
