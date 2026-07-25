export interface PricingTier {
  id?: string
  label: string
  quantity: number
  price: number
  isPopular?: boolean
}

export interface Product {
  id: string
  name: string
  subtitle: string
  description: string
  ingredients?: string
  imageUrl?: string
  basePrice: number
  stock: number
  isActive: boolean
  tiers: PricingTier[]
  createdAt?: Date
  updatedAt?: Date
  version?: number
}

export interface Revision {
  id?: string
  entityType: "product" | "settings"
  entityId: string
  action: "create" | "update" | "delete"
  snapshot: Record<string, unknown>
  changedFields?: string[]
  editedBy?: string
  createdAt: Date
}

export type OrderStatus = "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED"

export interface OrderItem {
  id?: string
  productId: string
  productName: string
  quantity: number
  price: number
  imageUrl?: string
}

export interface Order {
  id: string
  email?: string
  userId?: string
  items: OrderItem[]
  total: number
  status: OrderStatus
  shippingAddress?: {
    name: string
    phone: string
    address: string
    city: string
    state: string
    pincode: string
  }
  razorpay?: {
    orderId: string
    paymentId?: string
    signature?: string
  }
  createdAt: Date
  updatedAt?: Date
}

export interface User {
  id: string
  uid: string
  email: string
  name?: string
  phone?: string
  role: "ADMIN" | "CUSTOMER"
  createdAt: Date
}

export interface DashboardStats {
  totalSales: number
  orderCount: number
  customerCount: number
  productCount: number
  recentOrders: Order[]
  salesByDay: { date: string; sales: number }[]
}

export interface StoreSettings {
  storeName: string
  storeEmail: string
  storePhone: string
  shippingFee: string
  freeShippingThreshold: string
  taxRate: string
  updatedAt?: Date
  version?: number
}
