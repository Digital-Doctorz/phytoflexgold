import { NextResponse } from "next/server"
import { getAdminDb, serializeFirestoreData } from "@/lib/firebase-admin"
import { requireAdmin } from "@/lib/auth"
import { NextRequest } from "next/server"
import type { OrderItem, PricingTier } from "@/types"
import { applyCoupon } from "@/lib/coupons"
import { rateLimit } from "@/lib/rate-limiter"
import { COUPON_RATE_LIMIT, couponRateLimitKey } from "@/lib/client-ip"
import { COUPON_MESSAGES } from "@/lib/coupon-rules"

export async function GET(request: NextRequest) {
  const authResult = await requireAdmin(request)
  if ("error" in authResult) return authResult.error

  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    const db = getAdminDb()
    // Filter by status in-memory rather than with .where() so we never require a
    // composite Firestore index (status + createdAt). A missing composite index
    // used to return a 500, which crashed the client with "orders.map is not a
    // function". Fetching the full list and filtering here is robust and cheap.
    const query = db.collection("orders").orderBy("createdAt", "desc")
    const snapshot = await query.get()
    let orders: { id: string; status?: string }[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...serializeFirestoreData(doc.data()),
    }))
    if (status) {
      orders = orders.filter((o) => o.status === status)
    }
    return NextResponse.json(orders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null)
    const items = body?.items

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "items must be a non-empty array" }, { status: 400 })
    }

    const db = getAdminDb()

    // Price the order entirely from the product catalog so a client cannot
    // tamper with the submitted amount or set its own order status.
    const productIds = [
      ...new Set(items.map((i) => i?.productId).filter((id) => typeof id === "string")),
    ]
    if (productIds.length === 0) {
      return NextResponse.json({ error: "items must include a productId" }, { status: 400 })
    }

    const snaps = await db.getAll(
      ...productIds.map((id) => db.collection("products").doc(id))
    )
    const productById = new Map(snaps.map((s) => [s.id, s]))

    const orderItems: OrderItem[] = []
    let total = 0
    let couponTierId: string | null = null

    for (const item of items) {
      const productId = item?.productId
      const tier = item?.tier
      const snap = productById.get(productId)
      const product = snap?.exists ? snap.data() : undefined

      if (!product || typeof tier?.label !== "string") {
        return NextResponse.json({ error: "Product not found" }, { status: 400 })
      }

      const catalogTier = Array.isArray(product.tiers)
        ? (product.tiers as PricingTier[]).find(
            (t) => t.label === tier.label || (tier.id && t.id === tier.id)
          )
        : undefined

      if (!catalogTier || typeof catalogTier.price !== "number") {
        return NextResponse.json(
          { error: `Pricing unavailable for ${product.name}` },
          { status: 400 }
        )
      }

      orderItems.push({
        productId,
        productName: product.name,
        quantity: Number.isInteger(tier.quantity) && tier.quantity > 0 ? tier.quantity : 1,
        price: catalogTier.price,
      })
      total += catalogTier.price
      couponTierId = typeof catalogTier.id === "string" ? catalogTier.id : null
    }

    // Optional coupon (CP-3). Recomputed server-side from the catalog price;
    // any client-sent total/discount is ignored. One code per single-pack order.
    const subtotal = total
    let discountFields: Record<string, unknown> = {}
    const couponCode = typeof body?.couponCode === "string" ? body.couponCode.trim() : ""
    if (couponCode !== "") {
      // AF-4: the coupon path is rate-limited here too (same bucket as /api/coupons/validate).
      const rl = rateLimit(couponRateLimitKey(request.headers), COUPON_RATE_LIMIT.limit, COUPON_RATE_LIMIT.windowMs)
      if (!rl.success) {
        return NextResponse.json({ error: "Too many attempts. Please wait a minute." }, { status: 429 })
      }
      if (orderItems.length !== 1) {
        return NextResponse.json(
          { error: COUPON_MESSAGES.not_eligible, reason: "not_eligible" },
          { status: 400 }
        )
      }
      const result = await applyCoupon(db, {
        code: couponCode,
        tierId: couponTierId,
        tierPrice: subtotal,
        phone: body?.shippingAddress?.phone ?? "",
        email: body?.email,
      })
      if (!result.ok) {
        return NextResponse.json(
          { error: COUPON_MESSAGES[result.reason], reason: result.reason },
          { status: 400 }
        )
      }
      total = result.payable
      discountFields = {
        subtotal,
        discount: { code: result.code, percent: result.percent, amount: result.discount },
        coupon: { code: result.code, status: "applied" },
      }
    }

    const docRef = await db.collection("orders").add({
      items: orderItems,
      total,
      ...discountFields,
      email: typeof body?.email === "string" ? body.email : null,
      shippingAddress: body?.shippingAddress ?? null,
      status: "PENDING",
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    return NextResponse.json(
      { id: docRef.id, items: orderItems, total, ...discountFields, email: body?.email ?? null, shippingAddress: body?.shippingAddress ?? null, status: "PENDING" },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
