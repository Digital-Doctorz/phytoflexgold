// Pure, dependency-free payment helpers (no "server-only", no "@/" imports) so
// they can be unit-tested with `node --experimental-strip-types --test`.
import { createHmac, timingSafeEqual } from "node:crypto"

export function hmacSha256Hex(secret: string, data: string): string {
  return createHmac("sha256", secret).update(data).digest("hex")
}

// Constant-time comparison of two hex signatures. The length is checked first
// because timingSafeEqual throws on buffers of different length.
export function safeSignatureEqual(expectedHex: string, receivedHex: unknown): boolean {
  if (typeof receivedHex !== "string" || receivedHex.length === 0) return false
  const a = Buffer.from(expectedHex, "utf8")
  const b = Buffer.from(receivedHex, "utf8")
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

// Checkout handler signature: HMAC_SHA256(key_secret, razorpay_order_id|razorpay_payment_id)
export function isPaymentSignatureValid(
  keySecret: string,
  razorpayOrderId: string,
  razorpayPaymentId: string,
  signature: unknown
): boolean {
  if (!keySecret) return false
  return safeSignatureEqual(hmacSha256Hex(keySecret, `${razorpayOrderId}|${razorpayPaymentId}`), signature)
}

// Webhook signature: HMAC_SHA256(webhook_secret, rawBody). Uses the separate
// RAZORPAY_WEBHOOK_SECRET, never the API key secret.
export function isWebhookSignatureValid(
  webhookSecret: string | undefined,
  rawBody: string,
  signature: unknown
): boolean {
  if (!webhookSecret) return false
  return safeSignatureEqual(hmacSha256Hex(webhookSecret, rawBody), signature)
}

export type OrderBindingResult =
  | { ok: true }
  | { ok: false; reason: "no_razorpay_order" | "order_id_mismatch" }

// The client-supplied razorpayOrderId must equal the Razorpay order id that
// create-order stored on THIS app order. Otherwise a valid signature from a
// different (e.g. cheaper) Razorpay order could mark this order PAID.
export function checkRazorpayOrderBinding(
  storedRazorpayOrderId: unknown,
  suppliedRazorpayOrderId: string
): OrderBindingResult {
  if (typeof storedRazorpayOrderId !== "string" || storedRazorpayOrderId === "") {
    return { ok: false, reason: "no_razorpay_order" }
  }
  if (!safeSignatureEqual(storedRazorpayOrderId, suppliedRazorpayOrderId)) {
    return { ok: false, reason: "order_id_mismatch" }
  }
  return { ok: true }
}

// order.total is stored in rupees; Razorpay amounts are paise.
export function rupeesToPaise(rupees: number): number {
  return Math.round(rupees * 100)
}

export function computeAmountMismatch(
  capturedPaise: unknown,
  orderTotalRupees: unknown
): { amountMismatch: boolean; expectedPaise: number | null; capturedPaise: number | null } {
  const expected =
    typeof orderTotalRupees === "number" && Number.isFinite(orderTotalRupees)
      ? rupeesToPaise(orderTotalRupees)
      : null
  const captured =
    typeof capturedPaise === "number" && Number.isFinite(capturedPaise) ? capturedPaise : null
  return {
    amountMismatch: expected === null || captured === null || expected !== captured,
    expectedPaise: expected,
    capturedPaise: captured,
  }
}

// AF-1 / AF-2 / C3-1 / C3-2: decide what a webhook event may do to an order,
// given its CURRENT state (read inside a Firestore transaction).
//  - payment.failed never touches a PAID order (status and captured paymentId).
//  - payment.captured on a PAID order with the same paymentId:
//      * capture amount not stored yet (verify-payment ran first) → backfill
//        amount/method/fee/currency/paidAt + amountMismatch, status untouched;
//      * already stored → full duplicate, no-op.
//  - payment.captured with a DIFFERENT paymentId on a PAID order never
//    overwrites the original; it is recorded + flagged possibleDoubleCharge.
export type WebhookAction =
  | "apply_captured"
  | "backfill_capture"
  | "skip_duplicate_capture"
  | "record_extra_capture"
  | "apply_failed"
  | "skip_failed_on_paid"

export function decideWebhookAction(input: {
  event: "payment.captured" | "payment.failed"
  currentStatus: unknown
  currentPaymentId: unknown
  incomingPaymentId: unknown
  currentCapturedPaise?: unknown
}): WebhookAction {
  const paid = input.currentStatus === "PAID"
  if (input.event === "payment.failed") return paid ? "skip_failed_on_paid" : "apply_failed"
  if (!paid) return "apply_captured"
  if (typeof input.currentPaymentId !== "string" || input.currentPaymentId === "") return "apply_captured"
  if (input.currentPaymentId !== input.incomingPaymentId) return "record_extra_capture"
  return typeof input.currentCapturedPaise === "number" ? "skip_duplicate_capture" : "backfill_capture"
}

// Fields written from a captured payment entity (apply_captured and
// backfill_capture). Never includes `status` for a backfill. paidAt is only
// set when missing on a backfill.
export function captureFields(
  payment: { amount?: unknown; method?: unknown; fee?: unknown; currency?: unknown } | undefined,
  order: { total?: unknown; paidAt?: unknown },
  mode: "apply" | "backfill",
  now: Date = new Date()
): Record<string, unknown> {
  const amountCheck = computeAmountMismatch(payment?.amount, order.total)
  const fields: Record<string, unknown> = {
    amountMismatch: amountCheck.amountMismatch,
    "razorpay.amountCapturedPaise": amountCheck.capturedPaise,
    "razorpay.amountExpectedPaise": amountCheck.expectedPaise,
    "razorpay.method": typeof payment?.method === "string" ? payment.method : null,
    "razorpay.fee": typeof payment?.fee === "number" ? payment.fee / 100 : null,
    "razorpay.currency": typeof payment?.currency === "string" ? payment.currency : null,
    updatedAt: now,
  }
  if (mode === "apply" || !order.paidAt) fields.paidAt = now
  return fields
}

// C3-4: verify-payment decision, evaluated inside a Firestore transaction on
// the freshly read order. Binding is checked before the signature.
export type VerifyDecision =
  | { kind: "not_found" }
  | { kind: "mismatch"; reason: "no_razorpay_order" | "order_id_mismatch" }
  | { kind: "bad_signature" }
  | { kind: "already_paid" }
  | { kind: "mark_paid" }

export function decideVerifyAction(input: {
  exists: boolean
  status?: unknown
  storedRazorpayOrderId: unknown
  suppliedRazorpayOrderId: string
  isSignatureValid: (storedRazorpayOrderId: string) => boolean
}): VerifyDecision {
  if (!input.exists) return { kind: "not_found" }
  const binding = checkRazorpayOrderBinding(input.storedRazorpayOrderId, input.suppliedRazorpayOrderId)
  if (!binding.ok) return { kind: "mismatch", reason: binding.reason }
  if (!input.isSignatureValid(input.storedRazorpayOrderId as string)) return { kind: "bad_signature" }
  if (input.status === "PAID") return { kind: "already_paid" }
  return { kind: "mark_paid" }
}
