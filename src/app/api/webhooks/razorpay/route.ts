import { NextResponse } from "next/server"
import { getAdminDb } from "@/lib/firebase-admin"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action } = body
    const db = getAdminDb()

    if (action === "create-order") {
      const { orderId, amount } = body
      const crypto = await import("crypto")
      const Razorpay = (await import("razorpay")).default
      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID!,
        key_secret: process.env.RAZORPAY_KEY_SECRET!,
      })
      const razorpayOrder = await razorpay.orders.create({
        amount: Math.round(amount * 100),
        currency: "INR",
        receipt: orderId.slice(0, 20),
      })

      await db.collection("orders").doc(orderId).update({
        razorpay: {
          orderId: razorpayOrder.id,
        },
      })

      return NextResponse.json({ razorpayOrderId: razorpayOrder.id })
    }

    if (action === "verify") {
      const { createHmac } = await import("crypto")
      const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = body
      const secret = process.env.RAZORPAY_KEY_SECRET!
      const expected = createHmac("sha256", secret)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest("hex")

      if (expected !== razorpaySignature) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
      }

      await db.collection("orders").doc(orderId).update({
        status: "PAID",
        "razorpay.paymentId": razorpayPaymentId,
        "razorpay.signature": razorpaySignature,
      })

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 })
  } catch (error) {
    console.error("Razorpay webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
