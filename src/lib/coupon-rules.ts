// Pure coupon rules (no Firestore, no "server-only") so they can be unit-tested.
import { createHmac } from "node:crypto"

export type CouponReason = "invalid" | "expired" | "not_eligible" | "used"

// Customer-facing strings. Sourced from the WEBARCHITECT package CP-5 messages,
// with "used" replaced by the JC-4 generic text (GATEKEEPER verdict). JC-4: never
// confirm whether a phone or email has already redeemed.
export const COUPON_MESSAGES: Record<CouponReason | "applied", string> = {
  applied: "Code {CODE} applied: {PERCENT}% off.",
  invalid: "This code isn't valid.",
  expired: "This code has expired.",
  not_eligible: "This code can't be used on this pack.",
  used: "This code can't be used for this order.",
}
export const JC4_MESSAGE = COUPON_MESSAGES.used

export interface CouponDoc {
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
}

export function normalizeCouponCode(input: unknown): string | null {
  if (typeof input !== "string") return null
  const code = input.trim().toUpperCase().replace(/\s+/g, "")
  if (!/^[A-Z0-9]{1,20}$/.test(code)) return null
  return code
}

export function computeDiscount(price: number, percent: number): { discount: number; payable: number } {
  const discount = Math.round((price * percent) / 100)
  const payable = Math.max(1, price - discount)
  return { discount: price - payable, payable }
}

function toMs(v: string | Date | null | undefined): number | null {
  if (v === null || v === undefined || v === "") return null
  const ms = v instanceof Date ? v.getTime() : Date.parse(v)
  return Number.isFinite(ms) ? ms : NaN
}

export interface EvaluateInput {
  coupon: CouponDoc | null | undefined
  tierId?: string | null
  tierPrice: number
  now: Date
  phoneAlreadyRedeemed?: boolean
  emailAlreadyRedeemed?: boolean
}

export type EvaluateResult =
  | { ok: true; code: string; percent: number; discount: number; payable: number }
  | { ok: false; reason: CouponReason }

export function evaluateCoupon(input: EvaluateInput): EvaluateResult {
  const c = input.coupon
  if (!c || c.active !== true || typeof c.percent !== "number" || !(c.percent > 0 && c.percent < 100)) {
    return { ok: false, reason: "invalid" }
  }
  const now = input.now.getTime()
  const start = toMs(c.startsAt)
  const end = toMs(c.expiresAt)
  if (Number.isNaN(start) || Number.isNaN(end)) return { ok: false, reason: "invalid" }
  if (start !== null && now < start) return { ok: false, reason: "invalid" }
  if (end !== null && now > end) return { ok: false, reason: "expired" }

  const byId = Array.isArray(c.eligibleTierIds) && c.eligibleTierIds.length > 0
  const byPrice = Array.isArray(c.eligiblePrices) && c.eligiblePrices.length > 0
  const idOk = byId && !!input.tierId && c.eligibleTierIds!.includes(input.tierId)
  const priceOk = byPrice && c.eligiblePrices!.includes(input.tierPrice)
  if ((byId || byPrice) && !idOk && !priceOk) return { ok: false, reason: "not_eligible" }

  if (typeof c.maxUses === "number" && (c.usedCount ?? 0) >= c.maxUses) return { ok: false, reason: "used" }
  if (input.phoneAlreadyRedeemed || input.emailAlreadyRedeemed) return { ok: false, reason: "used" }

  let { discount, payable } = computeDiscount(input.tierPrice, c.percent)
  if (typeof c.maxDiscountRupees === "number" && c.maxDiscountRupees >= 0 && discount > c.maxDiscountRupees) {
    discount = Math.round(c.maxDiscountRupees)
    payable = Math.max(1, input.tierPrice - discount)
    discount = input.tierPrice - payable
  }
  return { ok: true, code: c.code, percent: c.percent, discount, payable }
}

// JC-2: keyed hash with a server-only pepper. Inputs must already be normalised
// (phone → +91 E.164, email → trimmed lower-case).
export function redemptionHash(pepper: string, normalizedValue: string): string {
  if (!pepper || pepper.length < 16) throw new Error("COUPON_HASH_PEPPER must be set (>=16 chars)")
  return createHmac("sha256", pepper).update(normalizedValue).digest("hex")
}

export function normalizeEmail(input: unknown): string | null {
  if (typeof input !== "string") return null
  const e = input.trim().toLowerCase()
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) ? e : null
}

export function redemptionDocIds(code: string, phoneHash: string, emailHash: string | null) {
  return {
    phone: `${code}_p_${phoneHash}`,
    email: emailHash ? `${code}_e_${emailHash}` : null,
  }
}

// Decision taken INSIDE the PAID transaction (JC-3). Never re-prices and never
// un-pays: the caller only records redemption or flags over_limit.
export type RedemptionDecision = "redeem" | "already_redeemed" | "over_limit"

export function decideRedemption(input: {
  orderId: string
  couponStatus?: string | null
  coupon: Pick<CouponDoc, "maxUses" | "usedCount"> | null | undefined
  existingPhoneRedemptionOrderId?: string | null
  existingEmailRedemptionOrderId?: string | null
}): RedemptionDecision {
  if (input.couponStatus === "redeemed" || input.couponStatus === "over_limit") return "already_redeemed"
  const phoneOther = input.existingPhoneRedemptionOrderId && input.existingPhoneRedemptionOrderId !== input.orderId
  const emailOther = input.existingEmailRedemptionOrderId && input.existingEmailRedemptionOrderId !== input.orderId
  if (input.existingPhoneRedemptionOrderId === input.orderId) return "already_redeemed"
  if (!input.coupon) return "over_limit"
  if (phoneOther || emailOther) return "over_limit"
  if (typeof input.coupon.maxUses === "number" && (input.coupon.usedCount ?? 0) >= input.coupon.maxUses) {
    return "over_limit"
  }
  return "redeem"
}

export function appliedMessage(code: string, percent: number): string {
  return COUPON_MESSAGES.applied.replace("{CODE}", code).replace("{PERCENT}", String(percent))
}
