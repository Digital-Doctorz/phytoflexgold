import { NextRequest, NextResponse } from "next/server"
import { getAdminDb } from "@/lib/firebase-admin"
import { createRazorpayOrder, MIN_AMOUNT_PAISE } from "@/lib/razorpay"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null)
    const orderId = body?.orderId
    const amount = body?.amount

    if (typeof orderId !== "string" || orderId.trim() === "") {
      return NextResponse.json({ error: "orderId is required" }, { status: 400 })
    }
    if (typeof amount !== "number" || !Number.isFinite(amount) || amount * 100 < MIN_AMOUNT_PAISE) {
      return NextResponse.json(
        { error: `amount must be a number of at least ${MIN_AMOUNT_PAISE / 100} rupee` },
        { status: 400 }
      )
    }

    const db = getAdminDb()
    const orderRef = db.collection("orders").doc(orderId)
    const orderSnap = await orderRef.get()

    if (!orderSnap.exists) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
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
