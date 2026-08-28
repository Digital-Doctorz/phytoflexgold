import { NextRequest, NextResponse } from "next/server"
import { getAdminDb } from "@/lib/firebase-admin"
import { createRazorpayOrder, MIN_AMOUNT_PAISE } from "@/lib/razorpay"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null)
    const orderId = body?.orderId

    if (typeof orderId !== "string" || orderId.trim() === "") {
      return NextResponse.json({ error: "orderId is required" }, { status: 400 })
    }

    const db = getAdminDb()
    const orderRef = db.collection("orders").doc(orderId)
    const orderSnap = await orderRef.get()

    if (!orderSnap.exists) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    const order = orderSnap.data()!
    const amount = order.total

    // The client-supplied amount is ignored. The order total stored on the
    // server is the only acceptable value for the Razorpay order.
    if (typeof amount !== "number" || !Number.isFinite(amount) || amount * 100 < MIN_AMOUNT_PAISE) {
      return NextResponse.json({ error: "Order total is invalid" }, { status: 400 })
    }

    // If a Razorpay order was already created for this order, return it instead
    // of charging the customer twice on a retry.
    if (typeof order.razorpay?.orderId === "string" && order.razorpay.orderId !== "") {
      return NextResponse.json({
        orderId: order.razorpay.orderId,
        amount: Math.round(amount * 100),
        currency: "INR",
      })
    }

    const razorpayOrder = await createRazorpayOrder(amount, orderId)

    await orderRef.update({
      "razorpay.orderId": razorpayOrder.id,
      updatedAt: new Date(),
    })

    return NextResponse.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    })
  } catch (error) {
    console.error("Error creating Razorpay order:", error)
    return NextResponse.json({ error: "Failed to create payment order" }, { status: 500 })
  }
}
