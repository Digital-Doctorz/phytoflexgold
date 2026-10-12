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

export interface OrderEmail {
  to: string
  type: string
  subject: string
  sentAt: Date
  ok: boolean
  error?: string
}

export interface OrderShipping {
  courier?: string
  trackingNumber?: string
  shippedAt?: Date
  deliveredAt?: Date
}

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
    method?: string
    fee?: number
    currency?: string
    amountCapturedPaise?: number | null
    amountExpectedPaise?: number | null
    extraPaymentIds?: string[]
    possibleDoubleCharge?: boolean
  }
  // Set by the payment.captured webhook when the captured amount differs from
  // round(total × 100). Admin review only; the order is never re-priced.
  amountMismatch?: boolean
  // PR-B coupon fields (all optional; old orders stay valid).
  subtotal?: number
  discount?: { code: string; percent: number; amount: number }
  coupon?: { code: string; status: "applied" | "redeemed" | "over_limit" }
  couponFlag?: { reason: "over_limit_after_capture"; at: Date }
  shipping?: OrderShipping
  paidAt?: Date
  cancelledAt?: Date
  emails?: OrderEmail[]
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

export interface Coupon {
  code: string
  percent: number
  active: boolean
  startsAt?: string | Date | null
  expiresAt?: string | Date | null
  perCustomerLimit?: number
  maxUses?: number | null
  usedCount?: number
  eligibleTierIds?: string[]
  eligiblePrices?: number[]
  maxDiscountRupees?: number | null
  stacksWithOtherCodes?: boolean
  channel?: string
  updatedAt?: Date
}

export interface CouponRedemption {
  code: string
  orderId: string
  phoneHash: string | null
  emailHash: string | null
  amount: number | null
  at: Date
}
