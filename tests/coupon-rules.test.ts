import { test } from "node:test"
import assert from "node:assert/strict"
import { createHmac, createHash } from "node:crypto"
import {
  COUPON_MESSAGES, JC4_MESSAGE, computeDiscount, evaluateCoupon, normalizeCouponCode,
  redemptionHash, redemptionDocIds, decideRedemption, normalizeEmail, appliedMessage,
  withBoundedRetry, isContentionError, backoffMs, redeemFailedUpdate,
  type EvaluateInput,
} from "../src/lib/coupon-rules"
import { JODO10_SEED } from "../src/lib/coupon-config"
import { normalizeIndianPhone } from "../src/lib/phone"

type Loose = { ok: boolean; reason?: string; discount?: number; payable?: number }
const ev = (i: EvaluateInput) => evaluateCoupon(i) as Loose
const PEPPER = "test-pepper-placeholder-0123456789"
const active = { ...JODO10_SEED, active: true, startsAt: "2026-10-13T00:00:00+05:30" }
const at = (iso: string) => new Date(iso)
const NOW = at("2026-10-20T12:00:00+05:30")

test("JC-4 exact string", () => {
  assert.equal(JC4_MESSAGE, "This code can't be used for this order.")
  assert.equal(COUPON_MESSAGES.used, "This code can't be used for this order.")
})
test("seed is created INACTIVE with 10% and rejects while inactive", () => {
  assert.equal(JODO10_SEED.active, false)
  assert.equal(JODO10_SEED.percent, 10)
  assert.deepEqual(ev({ coupon: JODO10_SEED, tierPrice: 2100, now: NOW }), { ok: false, reason: "invalid" })
})
test("package prices 729 / 1890 / 5310", () => {
  for (const [p, d, pay] of [[810, 81, 729], [2100, 210, 1890], [5900, 590, 5310]]) {
    assert.deepEqual(computeDiscount(p, 10), { discount: d, payable: pay })
    const r = ev({ coupon: active, tierPrice: p, now: NOW })
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
  assert.equal(ev({ coupon: active, tierPrice: 810, now: at("2026-10-12T23:59:59+05:30") }).reason, "invalid")
  assert.equal(ev({ coupon: active, tierPrice: 810, now: at("2026-11-30T23:59:59+05:30") }).ok, true)
  assert.equal(ev({ coupon: active, tierPrice: 810, now: at("2026-12-01T00:00:00+05:30") }).reason, "expired")
})
test("eligibility, maxUses, phone/email used, cap", () => {
  assert.equal(ev({ coupon: active, tierPrice: 999, now: NOW }).reason, "not_eligible")
  assert.equal(ev({ coupon: { ...active, eligibleTierIds: ["1-month"] }, tierId: "1-month", tierPrice: 999, now: NOW }).ok, true)
  assert.equal(ev({ coupon: { ...active, usedCount: 500 }, tierPrice: 810, now: NOW }).reason, "used")
  assert.equal(ev({ coupon: active, tierPrice: 810, now: NOW, phoneAlreadyRedeemed: true }).reason, "used")
  assert.equal(ev({ coupon: active, tierPrice: 810, now: NOW, emailAlreadyRedeemed: true }).reason, "used")
  const capped = ev({ coupon: { ...active, maxDiscountRupees: 300 }, tierPrice: 5900, now: NOW })
  assert.deepEqual([capped.discount, capped.payable], [300, 5600])
  assert.equal(ev({ coupon: null, tierPrice: 810, now: NOW }).reason, "invalid")
  assert.equal(appliedMessage("JODO10", 10), "Code JODO10 applied: 10% off.")
})
test("JC-2 HMAC keying with pepper (not plain sha256)", () => {
  const phone = normalizeIndianPhone("098123 45678")!
  const h = redemptionHash(PEPPER, phone)
  assert.equal(h, createHmac("sha256", PEPPER).update("+919812345678").digest("hex"))
  assert.notEqual(h, createHash("sha256").update("+919812345678").digest("hex"))
  assert.notEqual(h, redemptionHash(PEPPER + "x", phone))
  assert.equal(redemptionHash(PEPPER, normalizeIndianPhone("+91-98123-45678")!), h)
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

test("AF-3: redeem_failed decision never touches status/total", () => {
  const u = redeemFailedUpdate({ status: "PAID", discount: { code: "JODO10" }, coupon: { status: "applied" } })
  assert.ok(u)
  assert.equal(u!["coupon.status"], "redeem_failed")
  assert.equal(u!.couponFlag.reason, "redeem_failed")
  assert.deepEqual(Object.keys(u!).sort(), ["coupon.status", "couponFlag"])
  assert.equal(redeemFailedUpdate({ status: "PAID", discount: { code: "JODO10" }, coupon: { status: "redeemed" } }), null)
  assert.equal(redeemFailedUpdate({ status: "PAID", discount: { code: "JODO10" }, coupon: { status: "over_limit" } }), null)
  assert.equal(redeemFailedUpdate({ status: "PENDING", discount: { code: "JODO10" } }), null)
  assert.equal(redeemFailedUpdate({ status: "PAID" }), null)
  // redeem_failed is not final: a later replay retries redemption
  assert.equal(decideRedemption({ orderId: "o1", couponStatus: "redeem_failed", coupon: { maxUses: 500, usedCount: 1 } }), "redeem")
})
test("AF-3: bounded retry with backoff on contention only", async () => {
  const sleeps: number[] = []
  const sleep = async (ms: number) => { sleeps.push(ms) }
  let n = 0
  const ok = await withBoundedRetry(async () => { if (++n < 3) throw { code: 10 }; return "done" }, { attempts: 3, baseMs: 100, sleep })
  assert.deepEqual(ok, { ok: true, value: "done", attempts: 3 })
  assert.deepEqual(sleeps, [100, 200])
  n = 0; sleeps.length = 0
  const fail = await withBoundedRetry(async () => { n++; throw { code: "aborted" } }, { attempts: 3, sleep })
  assert.equal(fail.ok, false); assert.equal(n, 3); assert.equal(sleeps.length, 2)
  n = 0
  const nonRetry = await withBoundedRetry(async () => { n++; throw new Error("permission denied") }, { attempts: 3, sleep })
  assert.equal(nonRetry.ok, false); assert.equal(n, 1)
  assert.equal(isContentionError({ message: "Too much contention on these documents" }), true)
  assert.equal(isContentionError(null), false)
  assert.equal(backoffMs(10), 1000)
})
