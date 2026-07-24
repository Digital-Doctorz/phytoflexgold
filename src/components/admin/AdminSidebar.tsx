"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/AuthContext"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react"

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { signOut } = useAuth()

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-surface-container-low border-r border-outline-variant/20 flex flex-col z-40">
      <div className="p-6 border-b border-outline-variant/20">
        <Link href="/" className="text-headline-md font-bold text-primary-container">
          PhytoFlex Gold
        </Link>
        <p className="text-xs text-on-surface-variant mt-1">Admin Dashboard</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-body-md transition-colors",
                isActive
                  ? "bg-primary-container/15 text-primary-container font-bold"
                  : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
              {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-outline-variant/20">
        <button
          onClick={signOut}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-body-md text-on-surface-variant hover:bg-surface-container hover:text-error transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}
