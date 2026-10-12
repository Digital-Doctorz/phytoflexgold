import { NextRequest, NextResponse } from "next/server"
import { getAdminDb } from "@/lib/firebase-admin"
import { FieldValue } from "firebase-admin/firestore"
import { computeAmountMismatch, decideWebhookAction, isWebhookSignatureValid } from "@/lib/payment-security"

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
      })

      if (decision === "apply_captured") {
        // Compare the captured amount with the server-stored total. A mismatch
        // is flagged for admin review only: the payment is never re-priced.
        const amountCheck = computeAmountMismatch(payment?.amount, order.total)
        if (amountCheck.amountMismatch) {
          console.warn(
            `[webhook] amount mismatch on ${razorpayOrderId}: captured ${amountCheck.capturedPaise} expected ${amountCheck.expectedPaise}`
          )
        }
        tx.update(orderRef, {
          status: "PAID",
          amountMismatch: amountCheck.amountMismatch,
          "razorpay.amountCapturedPaise": amountCheck.capturedPaise,
          "razorpay.amountExpectedPaise": amountCheck.expectedPaise,
          "razorpay.paymentId": razorpayPaymentId,
          "razorpay.method": payment?.method || null,
          "razorpay.fee": typeof payment?.fee === "number" ? payment.fee / 100 : null,
          "razorpay.currency": payment?.currency || null,
          paidAt: new Date(),
          updatedAt: new Date(),
        })
      } else if (decision === "record_extra_capture") {
        // A second captured payment on an already PAID order: keep the original
        // paymentId, record the extra one for admin review (possible refund).
        console.warn(`[webhook] extra capture ${razorpayPaymentId} on PAID order ${orderRef.id}`)
        tx.update(orderRef, {
          "razorpay.extraPaymentIds": FieldValue.arrayUnion(razorpayPaymentId),
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

    return NextResponse.json({ received: true, action })
  } catch (error) {
    console.error("Razorpay webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
