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
} from "../src/lib/payment-security.ts"

const KEY = "test_key_secret_placeholder"
const WH = "test_webhook_secret_placeholder"
const sig = (s, d) => createHmac("sha256", s).update(d).digest("hex")

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
