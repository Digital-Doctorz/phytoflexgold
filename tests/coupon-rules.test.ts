import { test } from "node:test"
import assert from "node:assert/strict"
import { createHmac, createHash } from "node:crypto"
import {
  COUPON_MESSAGES, JC4_MESSAGE, computeDiscount, evaluateCoupon, normalizeCouponCode,
  redemptionHash, redemptionDocIds, decideRedemption, normalizeEmail, appliedMessage,
} from "../src/lib/coupon-rules.ts"
import { JODO10_SEED } from "../src/lib/coupon-config.ts"
import { normalizeIndianPhone } from "../src/lib/phone.ts"

const PEPPER = "test-pepper-placeholder-0123456789"
const active = { ...JODO10_SEED, active: true, startsAt: "2026-10-13T00:00:00+05:30" }
const at = (iso) => new Date(iso)
const NOW = at("2026-10-20T12:00:00+05:30")

test("JC-4 exact string", () => {
  assert.equal(JC4_MESSAGE, "This code can't be used for this order.")
  assert.equal(COUPON_MESSAGES.used, "This code can't be used for this order.")
})
test("seed is created INACTIVE with 10% and rejects while inactive", () => {
  assert.equal(JODO10_SEED.active, false)
  assert.equal(JODO10_SEED.percent, 10)
  assert.deepEqual(evaluateCoupon({ coupon: JODO10_SEED, tierPrice: 2100, now: NOW }), { ok: false, reason: "invalid" })
})
test("package prices 729 / 1890 / 5310", () => {
  for (const [p, d, pay] of [[810, 81, 729], [2100, 210, 1890], [5900, 590, 5310]]) {
    assert.deepEqual(computeDiscount(p, 10), { discount: d, payable: pay })
    const r = evaluateCoupon({ coupon: active, tierPrice: p, now: NOW })
    assert.equal(r.ok && r.payable, pay)
  }
  assert.deepEqual(computeDiscount(1, 10), { discount: 0, payable: 1 })
})
test("code normalisation", () => {
  assert.equal(normalizeCouponCode(" jodo10 "), "JODO10")
  assert.equal(normalizeCouponCode("jo do10"), "JODO10")
  assert.equal(normalizeCouponCode("JODO-10"), null)
  assert.equal(normalizeCouponCode("A".repeat(21)), null)
})
test("window: before start, IST expiry boundary", () => {
  assert.equal(evaluateCoupon({ coupon: active, tierPrice: 810, now: at("2026-10-12T23:59:59+05:30") }).reason, "invalid")
  assert.equal(evaluateCoupon({ coupon: active, tierPrice: 810, now: at("2026-11-30T23:59:59+05:30") }).ok, true)
  assert.equal(evaluateCoupon({ coupon: active, tierPrice: 810, now: at("2026-12-01T00:00:00+05:30") }).reason, "expired")
})
test("eligibility, maxUses, phone/email used, cap", () => {
  assert.equal(evaluateCoupon({ coupon: active, tierPrice: 999, now: NOW }).reason, "not_eligible")
  assert.equal(evaluateCoupon({ coupon: { ...active, eligibleTierIds: ["1-month"] }, tierId: "1-month", tierPrice: 999, now: NOW }).ok, true)
  assert.equal(evaluateCoupon({ coupon: { ...active, usedCount: 500 }, tierPrice: 810, now: NOW }).reason, "used")
  assert.equal(evaluateCoupon({ coupon: active, tierPrice: 810, now: NOW, phoneAlreadyRedeemed: true }).reason, "used")
  assert.equal(evaluateCoupon({ coupon: active, tierPrice: 810, now: NOW, emailAlreadyRedeemed: true }).reason, "used")
  const capped = evaluateCoupon({ coupon: { ...active, maxDiscountRupees: 300 }, tierPrice: 5900, now: NOW })
  assert.deepEqual([capped.discount, capped.payable], [300, 5600])
  assert.equal(evaluateCoupon({ coupon: null, tierPrice: 810, now: NOW }).reason, "invalid")
  assert.equal(appliedMessage("JODO10", 10), "Code JODO10 applied: 10% off.")
})
test("JC-2 HMAC keying with pepper (not plain sha256)", () => {
  const phone = normalizeIndianPhone("098123 45678")
  const h = redemptionHash(PEPPER, phone)
  assert.equal(h, createHmac("sha256", PEPPER).update("+919812345678").digest("hex"))
  assert.notEqual(h, createHash("sha256").update("+919812345678").digest("hex"))
  assert.notEqual(h, redemptionHash(PEPPER + "x", phone))
  assert.equal(redemptionHash(PEPPER, normalizeIndianPhone("+91-98123-45678")), h)
  assert.throws(() => redemptionHash("", phone))
  assert.throws(() => redemptionHash("short", phone))
  assert.deepEqual(redemptionDocIds("JODO10", "aa", "bb"), { phone: "JODO10_p_aa", email: "JODO10_e_bb" })
  assert.equal(normalizeEmail("  A@B.co "), "a@b.co")
})
test("JC-3 over-limit after capture → flag, never re-price", () => {
  const c = { maxUses: 500, usedCount: 10 }
  assert.equal(decideRedemption({ orderId: "o1", coupon: c }), "redeem")
  assert.equal(decideRedemption({ orderId: "o1", coupon: { maxUses: 500, usedCount: 500 } }), "over_limit")
  assert.equal(decideRedemption({ orderId: "o2", coupon: c, existingPhoneRedemptionOrderId: "o1" }), "over_limit")
  assert.equal(decideRedemption({ orderId: "o2", coupon: c, existingEmailRedemptionOrderId: "o1" }), "over_limit")
  assert.equal(decideRedemption({ orderId: "o1", coupon: c, existingPhoneRedemptionOrderId: "o1" }), "already_redeemed")
  assert.equal(decideRedemption({ orderId: "o1", couponStatus: "redeemed", coupon: c }), "already_redeemed")
  assert.equal(decideRedemption({ orderId: "o1", couponStatus: "over_limit", coupon: c }), "already_redeemed")
  assert.equal(decideRedemption({ orderId: "o1", coupon: null }), "over_limit")
})
