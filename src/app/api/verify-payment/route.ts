import { NextRequest, NextResponse } from "next/server"
import { getAdminDb } from "@/lib/firebase-admin"
import { recordCouponRedemption } from "@/lib/coupons"
import { verifyRazorpayPayment } from "@/lib/razorpay"
import { decideVerifyAction } from "@/lib/payment-security"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null)
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = body ?? {}

    if (
      typeof orderId !== "string" || orderId.trim() === "" ||
      typeof razorpayOrderId !== "string" || razorpayOrderId.trim() === "" ||
      typeof razorpayPaymentId !== "string" || razorpayPaymentId.trim() === "" ||
      typeof razorpaySignature !== "string" || razorpaySignature.trim() === ""
    ) {
      return NextResponse.json(
        { error: "orderId, razorpayOrderId, razorpayPaymentId, and razorpaySignature are required" },
        { status: 400 }
      )
    }

    // C3-4: read-check-write in one transaction. Bind the payment to the
    // Razorpay order id that create-order stored on THIS order (never trust the
    // client-supplied id alone), then check the signature, then mark PAID once.
    const db = getAdminDb()
    const orderRef = db.collection("orders").doc(orderId)
    const decision = await db.runTransaction(async (tx) => {
      const snap = await tx.get(orderRef)
      const order = snap.data()
      const d = decideVerifyAction({
        exists: snap.exists,
        status: order?.status,
        storedRazorpayOrderId: order?.razorpay?.orderId,
        suppliedRazorpayOrderId: razorpayOrderId,
        isSignatureValid: (stored) => verifyRazorpayPayment(stored, razorpayPaymentId, razorpaySignature),
      })
      if (d.kind === "mark_paid") {
        const now = new Date()
        tx.update(orderRef, {
          status: "PAID",
          "razorpay.paymentId": razorpayPaymentId,
          "razorpay.signature": razorpaySignature,
          paidAt: now,
          updatedAt: now,
        })
      }
      return d
    })

    if (decision.kind === "not_found") {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }
    if (decision.kind === "mismatch") {
      console.warn(`[verify-payment] order ${orderId}: ${decision.reason}`)
      return NextResponse.json({ error: "Payment does not match this order" }, { status: 400 })
    }
    if (decision.kind === "bad_signature") {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 })
    }
    // already_paid: idempotent replay (e.g. the webhook got there first).

    // PR-B: count the coupon once, transactionally, after PAID (JC-3: never
    // re-prices). Idempotent; a replay retries a redeem_failed redemption.
    await recordCouponRedemption(db, orderRef)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error verifying Razorpay payment:", error)
    return NextResponse.json({ error: "Payment verification failed" }, { status: 500 })
  }
}
