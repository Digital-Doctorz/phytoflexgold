import { test } from "node:test"
import assert from "node:assert/strict"
import { createHmac } from "node:crypto"
import {
  safeSignatureEqual,
  isPaymentSignatureValid,
  isWebhookSignatureValid,
  checkRazorpayOrderBinding,
  computeAmountMismatch,
  rupeesToPaise,
  decideWebhookAction,
  captureFields,
  decideVerifyAction,
} from "../src/lib/payment-security"

const KEY = "test_key_secret_placeholder"
const WH = "test_webhook_secret_placeholder"
const sig = (s: string, d: string) => createHmac("sha256", s).update(d).digest("hex")

test("payment signature: valid", () => {
  assert.equal(isPaymentSignatureValid(KEY, "order_A", "pay_1", sig(KEY, "order_A|pay_1")), true)
})
test("payment signature: tampered / wrong length / non-string / empty secret", () => {
  const good = sig(KEY, "order_A|pay_1")
  const flipped = (good[0] === "a" ? "b" : "a") + good.slice(1)
  assert.equal(isPaymentSignatureValid(KEY, "order_A", "pay_1", flipped), false)
  assert.equal(isPaymentSignatureValid(KEY, "order_A", "pay_1", good.slice(0, 10)), false)
  assert.equal(isPaymentSignatureValid(KEY, "order_A", "pay_1", good + "00"), false)
  assert.equal(isPaymentSignatureValid(KEY, "order_A", "pay_1", undefined), false)
  assert.equal(isPaymentSignatureValid(KEY, "order_B", "pay_1", good), false)
  assert.equal(isPaymentSignatureValid("", "order_A", "pay_1", good), false)
})
test("safeSignatureEqual never throws on length mismatch", () => {
  assert.doesNotThrow(() => safeSignatureEqual("abc", "abcd"))
  assert.equal(safeSignatureEqual("abc", "abc"), true)
})
test("webhook: separate secret; key secret signature is rejected", () => {
  const body = JSON.stringify({ event: "payment.captured" })
  assert.equal(isWebhookSignatureValid(WH, body, sig(WH, body)), true)
  assert.equal(isWebhookSignatureValid(WH, body, sig(KEY, body)), false)
  assert.equal(isWebhookSignatureValid(undefined, body, sig(WH, body)), false)
  assert.equal(isWebhookSignatureValid(WH, body + " ", sig(WH, body)), false)
  assert.equal(isWebhookSignatureValid(WH, body, null), false)
})
test("order binding", () => {
  assert.deepEqual(checkRazorpayOrderBinding("order_A", "order_A"), { ok: true })
  assert.deepEqual(checkRazorpayOrderBinding("order_A", "order_CHEAP"), { ok: false, reason: "order_id_mismatch" })
  assert.deepEqual(checkRazorpayOrderBinding(undefined, "order_A"), { ok: false, reason: "no_razorpay_order" })
  assert.deepEqual(checkRazorpayOrderBinding("", "order_A"), { ok: false, reason: "no_razorpay_order" })
})
test("amountMismatch", () => {
  assert.equal(rupeesToPaise(1890), 189000)
  assert.equal(computeAmountMismatch(210000, 2100).amountMismatch, false)
  assert.equal(computeAmountMismatch(189000, 1890).amountMismatch, false)
  assert.equal(computeAmountMismatch(81000, 2100).amountMismatch, true)
  assert.equal(computeAmountMismatch(2100, 2100).amountMismatch, true) // rupees sent as paise
  assert.equal(computeAmountMismatch(undefined, 2100).amountMismatch, true)
  assert.equal(computeAmountMismatch(210000, undefined).amountMismatch, true)
  assert.deepEqual(computeAmountMismatch(81000, 810), { amountMismatch: false, expectedPaise: 81000, capturedPaise: 81000 })
})

test("AF-1: late payment.failed never touches a PAID order", () => {
  assert.equal(decideWebhookAction({ event: "payment.failed", currentStatus: "PAID", currentPaymentId: "pay_1", incomingPaymentId: "pay_2" }), "skip_failed_on_paid")
  assert.equal(decideWebhookAction({ event: "payment.failed", currentStatus: "PAID", currentPaymentId: "pay_1", incomingPaymentId: "pay_1" }), "skip_failed_on_paid")
  assert.equal(decideWebhookAction({ event: "payment.failed", currentStatus: "PENDING", currentPaymentId: undefined, incomingPaymentId: "pay_2" }), "apply_failed")
})
test("AF-2: duplicate payment.captured is a no-op; different id never overwrites", () => {
  assert.equal(decideWebhookAction({ event: "payment.captured", currentStatus: "PAID", currentPaymentId: "pay_1", incomingPaymentId: "pay_1", currentCapturedPaise: 210000 }), "skip_duplicate_capture")
  assert.equal(decideWebhookAction({ event: "payment.captured", currentStatus: "PAID", currentPaymentId: "pay_1", incomingPaymentId: "pay_9" }), "record_extra_capture")
  assert.equal(decideWebhookAction({ event: "payment.captured", currentStatus: "PENDING", currentPaymentId: undefined, incomingPaymentId: "pay_1" }), "apply_captured")
  // verify-payment marked PAID without a stored paymentId yet → webhook may fill it in
  assert.equal(decideWebhookAction({ event: "payment.captured", currentStatus: "PAID", currentPaymentId: "", incomingPaymentId: "pay_1" }), "apply_captured")
})

const pay = { amount: 210000, method: "upi", fee: 4956, currency: "INR" }
test("C3-1: verify-payment before webhook → backfill capture, status untouched", () => {
  assert.equal(decideWebhookAction({ event: "payment.captured", currentStatus: "PAID", currentPaymentId: "pay_1", incomingPaymentId: "pay_1" }), "backfill_capture")
  assert.equal(decideWebhookAction({ event: "payment.captured", currentStatus: "PAID", currentPaymentId: "pay_1", incomingPaymentId: "pay_1", currentCapturedPaise: null }), "backfill_capture")
  const paidAt = new Date("2026-10-13T00:00:00+05:30")
  const now = new Date("2026-10-13T00:01:00+05:30")
  const f = captureFields(pay, { total: 2100, paidAt }, "backfill", now)
  assert.equal("status" in f, false)
  assert.equal("razorpay.paymentId" in f, false)
  assert.equal("paidAt" in f, false) // already set by verify-payment
  assert.equal(f["razorpay.amountCapturedPaise"], 210000)
  assert.equal(f["razorpay.amountExpectedPaise"], 210000)
  assert.equal(f["razorpay.method"], "upi")
  assert.equal(f["razorpay.fee"], 49.56)
  assert.equal(f["razorpay.currency"], "INR")
  assert.equal(f.amountMismatch, false)
  const g = captureFields({ ...pay, amount: 81000 }, { total: 2100 }, "backfill", now)
  assert.equal(g.amountMismatch, true)
  assert.equal(g.paidAt, now) // missing → filled
  assert.equal(captureFields(pay, { total: 2100, paidAt }, "apply", now).paidAt, now)
})
test("C3-2: extra capture is recorded as possible double charge, not a duplicate", () => {
  assert.equal(decideWebhookAction({ event: "payment.captured", currentStatus: "PAID", currentPaymentId: "pay_1", incomingPaymentId: "pay_2", currentCapturedPaise: 210000 }), "record_extra_capture")
  assert.equal(decideWebhookAction({ event: "payment.captured", currentStatus: "PAID", currentPaymentId: "pay_1", incomingPaymentId: "pay_2" }), "record_extra_capture")
})
test("C3-4: verify transaction decision", () => {
  const ok = () => true, bad = () => false
  const base = { exists: true, status: "PENDING", storedRazorpayOrderId: "order_A", suppliedRazorpayOrderId: "order_A", isSignatureValid: ok }
  assert.deepEqual(decideVerifyAction(base), { kind: "mark_paid" })
  assert.deepEqual(decideVerifyAction({ ...base, exists: false }), { kind: "not_found" })
  assert.deepEqual(decideVerifyAction({ ...base, suppliedRazorpayOrderId: "order_CHEAP" }), { kind: "mismatch", reason: "order_id_mismatch" })
  assert.deepEqual(decideVerifyAction({ ...base, storedRazorpayOrderId: undefined }), { kind: "mismatch", reason: "no_razorpay_order" })
  assert.deepEqual(decideVerifyAction({ ...base, isSignatureValid: bad }), { kind: "bad_signature" })
  assert.deepEqual(decideVerifyAction({ ...base, status: "PAID" }), { kind: "already_paid" })
  // signature is checked against the STORED id, and binding precedes the signature
  let seen = ""
  decideVerifyAction({ ...base, isSignatureValid: (id) => { seen = id; return true } })
  assert.equal(seen, "order_A")
  let called = false
  decideVerifyAction({ ...base, suppliedRazorpayOrderId: "x", isSignatureValid: () => { called = true; return true } })
  assert.equal(called, false)
})
