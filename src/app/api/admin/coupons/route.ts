import { NextRequest, NextResponse } from "next/server"
import { getAdminDb, serializeFirestoreData } from "@/lib/firebase-admin"
import { requireAdmin } from "@/lib/auth"
import { normalizeCouponCode } from "@/lib/coupon-rules"

// Admin kill switch / terms editor for coupons (CP-7). requireAdmin + revisions
// log, same pattern as /api/settings.
const EDITABLE = ["active", "startsAt", "expiresAt", "maxUses", "perCustomerLimit", "eligibleTierIds", "eligiblePrices", "maxDiscountRupees"] as const

export async function GET(request: NextRequest) {
  const authResult = await requireAdmin(request)
  if ("error" in authResult) return authResult.error
  try {
    const snap = await getAdminDb().collection("coupons").get()
    return NextResponse.json(snap.docs.map((d) => ({ id: d.id, ...serializeFirestoreData(d.data()) })))
  } catch (error) {
    console.error("Error fetching coupons:", error)
    return NextResponse.json({ error: "Failed to fetch coupons" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  const authResult = await requireAdmin(request)
  if ("error" in authResult) return authResult.error
  try {
    const body = await request.json().catch(() => null)
    const code = normalizeCouponCode(body?.code)
    if (!code) return NextResponse.json({ error: "code is required" }, { status: 400 })

    const update: Record<string, unknown> = {}
    for (const k of EDITABLE) if (body && k in body) update[k] = body[k]
    if ("active" in update && typeof update.active !== "boolean") {
      return NextResponse.json({ error: "active must be boolean" }, { status: 400 })
    }
    if (Object.keys(update).length === 0) return NextResponse.json({ error: "nothing to update" }, { status: 400 })

    const db = getAdminDb()
    const ref = db.collection("coupons").doc(code)
    const doc = await ref.get()
    if (!doc.exists) return NextResponse.json({ error: "Coupon not found" }, { status: 404 })

    const previous = serializeFirestoreData(doc.data()!)
    await ref.update({ ...update, updatedAt: new Date() })
    await db.collection("revisions").add({
      entityType: "coupon",
      entityId: code,
      action: "update",
      snapshot: previous,
      changedFields: Object.keys(update),
      editedBy: request.headers.get("x-user-email") || "admin",
      createdAt: new Date(),
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating coupon:", error)
    return NextResponse.json({ error: "Failed to update coupon" }, { status: 500 })
  }
}
