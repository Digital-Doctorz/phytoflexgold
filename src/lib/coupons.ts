import "server-only"
import type { Firestore, DocumentReference } from "firebase-admin/firestore"
import { FieldValue } from "firebase-admin/firestore"
import { normalizeIndianPhone } from "@/lib/phone"
import {
  type CouponDoc,
  type EvaluateResult,
  decideRedemption,
  evaluateCoupon,
  normalizeCouponCode,
  normalizeEmail,
  redemptionDocIds,
  redemptionHash,
} from "@/lib/coupon-rules"

function pepper(): string {
  const p = process.env.COUPON_HASH_PEPPER
  if (!p) throw new Error("COUPON_HASH_PEPPER must be set")
  return p
}

function toPlainCoupon(data: FirebaseFirestore.DocumentData | undefined): CouponDoc | null {
  if (!data) return null
  const ts = (v: unknown) =>
    v && typeof v === "object" && "toDate" in v && typeof (v as { toDate: unknown }).toDate === "function"
      ? (v as { toDate: () => Date }).toDate()
      : (v as string | Date | null | undefined)
  return { ...(data as CouponDoc), startsAt: ts(data.startsAt), expiresAt: ts(data.expiresAt) }
}

export function couponsEnabled(): boolean {
  return process.env.COUPONS_ENABLED === "true"
}

// Authoritative server check used by POST /api/orders (CP-2/CP-3).
// Phone/email are optional for the preview endpoint; when given, an
// unparseable phone fails with the generic JC-4 reason.
export async function applyCoupon(
  db: Firestore,
  opts: { code: unknown; tierId?: string | null; tierPrice: number; phone?: unknown; email?: unknown; now?: Date }
): Promise<EvaluateResult> {
  if (!couponsEnabled()) return { ok: false, reason: "invalid" }
  const code = normalizeCouponCode(opts.code)
  if (!code) return { ok: false, reason: "invalid" }
  const snap = await db.collection("coupons").doc(code).get()
  const coupon = toPlainCoupon(snap.exists ? snap.data() : undefined)

  let phoneAlreadyRedeemed = false
  let emailAlreadyRedeemed = false
  if (opts.phone !== undefined) {
    const phone = normalizeIndianPhone(opts.phone)
    if (!phone) return { ok: false, reason: "used" } // JC-4 generic
    const email = normalizeEmail(opts.email)
    const ids = redemptionDocIds(code, redemptionHash(pepper(), phone), email ? redemptionHash(pepper(), email) : null)
    const refs = [db.collection("coupon_redemptions").doc(ids.phone)]
    if (ids.email) refs.push(db.collection("coupon_redemptions").doc(ids.email))
    const snaps = await db.getAll(...refs)
    phoneAlreadyRedeemed = snaps[0].exists
    emailAlreadyRedeemed = !!snaps[1]?.exists
  }

  return evaluateCoupon({
    coupon,
    tierId: opts.tierId ?? null,
    tierPrice: opts.tierPrice,
    now: opts.now ?? new Date(),
    phoneAlreadyRedeemed,
    emailAlreadyRedeemed,
  })
}

// Called right after an order is marked PAID (verify-payment or the
// payment.captured webhook, whichever is first). Runs in a Firestore
// transaction, is idempotent, and NEVER re-prices or un-pays (JC-3): if the
// limit was exceeded in a race, the order stays PAID and is flagged.
export async function recordCouponRedemption(db: Firestore, orderRef: DocumentReference): Promise<string> {
  return db.runTransaction(async (tx) => {
    const orderSnap = await tx.get(orderRef)
    const order = orderSnap.data()
    if (!order || order.status !== "PAID" || !order.discount?.code) return "no_coupon"

    const code: string = order.discount.code
    const couponRef = db.collection("coupons").doc(code)
    const phone = normalizeIndianPhone(order.shippingAddress?.phone)
    const email = normalizeEmail(order.email ?? order.shippingAddress?.email)
    const phoneHash = phone ? redemptionHash(pepper(), phone) : null
    const emailHash = email ? redemptionHash(pepper(), email) : null
    const ids = phoneHash ? redemptionDocIds(code, phoneHash, emailHash) : null

    const couponSnap = await tx.get(couponRef)
    const phoneSnap = ids ? await tx.get(db.collection("coupon_redemptions").doc(ids.phone)) : null
    const emailSnap = ids?.email ? await tx.get(db.collection("coupon_redemptions").doc(ids.email)) : null

    const decision = !ids
      ? "over_limit"
      : decideRedemption({
          orderId: orderRef.id,
          couponStatus: order.coupon?.status,
          coupon: couponSnap.exists ? (couponSnap.data() as CouponDoc) : null,
          existingPhoneRedemptionOrderId: phoneSnap?.exists ? phoneSnap.get("orderId") : null,
          existingEmailRedemptionOrderId: emailSnap?.exists ? emailSnap.get("orderId") : null,
        })

    if (decision === "already_redeemed") return decision

    if (decision === "over_limit") {
      tx.update(orderRef, {
        "coupon.status": "over_limit",
        couponFlag: { reason: "over_limit_after_capture", at: new Date() },
        updatedAt: new Date(),
      })
      return decision
    }

    const record = {
      code,
      orderId: orderRef.id,
      phoneHash,
      emailHash,
      amount: order.discount.amount ?? null,
      at: new Date(),
    }
    tx.create(db.collection("coupon_redemptions").doc(ids!.phone), record)
    if (ids!.email && !emailSnap?.exists) tx.create(db.collection("coupon_redemptions").doc(ids!.email), record)
    tx.update(couponRef, { usedCount: FieldValue.increment(1), updatedAt: new Date() })
    tx.update(orderRef, { "coupon.status": "redeemed", updatedAt: new Date() })
    return decision
  })
}
