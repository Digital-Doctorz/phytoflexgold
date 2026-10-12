import { NextRequest, NextResponse } from "next/server"
import { getAdminDb } from "@/lib/firebase-admin"
import { rateLimit } from "@/lib/rate-limiter"
import { applyCoupon } from "@/lib/coupons"
import { COUPON_MESSAGES, appliedMessage } from "@/lib/coupon-rules"
import type { PricingTier } from "@/types"

// CP-4: preview only. Never writes; rate-limited (10/min/IP) against guessing.
// The authoritative check is POST /api/orders.
export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
  const rl = rateLimit(`coupon-validate:${ip}`, 10, 60_000)
  if (!rl.success) {
    return NextResponse.json({ valid: false, message: "Too many attempts. Please wait a minute." }, { status: 429 })
  }

  try {
    const body = await request.json().catch(() => null)
    const productId = body?.productId
    const tierLabel = body?.tier?.label
    const tierId = body?.tier?.id
    if (typeof productId !== "string" || (typeof tierLabel !== "string" && typeof tierId !== "string")) {
      return NextResponse.json({ valid: false, reason: "invalid", message: COUPON_MESSAGES.invalid }, { status: 400 })
    }

    const db = getAdminDb()
    const snap = await db.collection("products").doc(productId).get()
    const tiers = (snap.exists ? snap.data()?.tiers : undefined) as PricingTier[] | undefined
    const tier = Array.isArray(tiers)
      ? tiers.find((t) => t.label === tierLabel || (tierId && t.id === tierId))
      : undefined
    if (!tier || typeof tier.price !== "number") {
      return NextResponse.json({ valid: false, reason: "not_eligible", message: COUPON_MESSAGES.not_eligible }, { status: 400 })
    }

    const result = await applyCoupon(db, {
      code: body?.code,
      tierId: typeof tier.id === "string" ? tier.id : null,
      tierPrice: tier.price,
    })
    if (!result.ok) {
      return NextResponse.json({ valid: false, reason: result.reason, message: COUPON_MESSAGES[result.reason] })
    }
    return NextResponse.json({
      valid: true,
      code: result.code,
      percent: result.percent,
      subtotal: tier.price,
      discount: result.discount,
      payable: result.payable,
      message: appliedMessage(result.code, result.percent),
    })
  } catch (error) {
    console.error("Error validating coupon:", error)
    return NextResponse.json({ valid: false, message: "Could not check this code right now." }, { status: 500 })
  }
}
