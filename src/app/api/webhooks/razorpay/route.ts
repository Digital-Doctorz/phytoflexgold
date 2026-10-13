import { NextRequest, NextResponse } from "next/server"
import { getAdminDb } from "@/lib/firebase-admin"
import { recordCouponRedemption } from "@/lib/coupons"
import { FieldValue } from "firebase-admin/firestore"
import { captureFields, decideWebhookAction, isWebhookSignatureValid } from "@/lib/payment-security"

// Verifies that the webhook request actually came from Razorpay, using the
// dedicated webhook secret configured in the Razorpay dashboard
// (RAZORPAY_WEBHOOK_SECRET), not the API key secret. See DEPLOY.md.
function isWebhookValid(rawBody: string, signature: string | null) {
  return isWebhookSignatureValid(process.env.RAZORPAY_WEBHOOK_SECRET, rawBody, signature)
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text()
    const signature = request.headers.get("x-razorpay-signature")

    if (!isWebhookValid(rawBody, signature)) {
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 })
    }

    const payload = JSON.parse(rawBody)
    const event = payload.event

    if (event !== "payment.captured" && event !== "payment.failed") {
      return NextResponse.json({ received: true })
    }

    const payment = payload.payload?.payment?.entity
    const razorpayOrderId = payment?.order_id
    const razorpayPaymentId = payment?.id

    if (typeof razorpayOrderId !== "string" || razorpayOrderId.trim() === "") {
      return NextResponse.json({ error: "Missing order_id in webhook payload" }, { status: 400 })
    }

    const db = getAdminDb()
    const ordersSnap = await db
      .collection("orders")
      .where("razorpay.orderId", "==", razorpayOrderId)
      .limit(1)
      .get()

    if (ordersSnap.empty) {
      return NextResponse.json({ error: "No matching order found" }, { status: 404 })
    }

    const orderRef = ordersSnap.docs[0].ref

    // AF-1/AF-2: read the current status inside a transaction and decide, so a
    // late payment.failed can never revert a PAID order and a duplicate
    // payment.captured is a no-op.
    const action = await db.runTransaction(async (tx) => {
      const snap = await tx.get(orderRef)
      const order = snap.data() ?? {}
      const decision = decideWebhookAction({
        event,
        currentStatus: order.status,
        currentPaymentId: order.razorpay?.paymentId,
        incomingPaymentId: razorpayPaymentId,
        currentCapturedPaise: order.razorpay?.amountCapturedPaise,
      })

      if (decision === "apply_captured" || decision === "backfill_capture") {
        // JC-1 amount check: a mismatch is flagged for admin review only; the
        // payment is never re-priced. A backfill (verify-payment marked PAID
        // first) writes the capture details but never touches status (C3-1).
        const fields = captureFields(payment, order, decision === "apply_captured" ? "apply" : "backfill")
        if (fields.amountMismatch) {
          console.warn(
            `[webhook] amount mismatch on ${razorpayOrderId}: captured ${fields["razorpay.amountCapturedPaise"]} expected ${fields["razorpay.amountExpectedPaise"]}`
          )
        }
        tx.update(orderRef, {
          ...(decision === "apply_captured" ? { status: "PAID", "razorpay.paymentId": razorpayPaymentId } : {}),
          ...fields,
        })
      } else if (decision === "record_extra_capture") {
        // A second captured payment on an already PAID order: keep the original
        // paymentId, record the extra one for admin review (possible refund).
        console.warn(`[webhook] extra capture ${razorpayPaymentId} on PAID order ${orderRef.id}`)
        tx.update(orderRef, {
          "razorpay.extraPaymentIds": FieldValue.arrayUnion(razorpayPaymentId),
          "razorpay.possibleDoubleCharge": true,
          updatedAt: new Date(),
        })
      } else if (decision === "apply_failed") {
        tx.update(orderRef, {
          status: "PENDING",
          "razorpay.paymentId": razorpayPaymentId,
          "razorpay.error": payment?.error_description || "Payment failed",
          updatedAt: new Date(),
        })
      }
      // skip_duplicate_capture / skip_failed_on_paid: no writes.
      return decision
    })

    // PR-B: count the coupon once, transactionally, after PAID (JC-3: never
    // re-prices). Skipped on duplicate/extra captures (AF-2: no side effects).
    if (action === "apply_captured" || action === "backfill_capture") {
      await recordCouponRedemption(db, orderRef)
    }

    return NextResponse.json({ received: true, action })
  } catch (error) {
    console.error("Razorpay webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
