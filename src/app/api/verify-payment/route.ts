import { NextRequest, NextResponse } from "next/server"
import { getAdminDb } from "@/lib/firebase-admin"
import { verifyRazorpayPayment } from "@/lib/razorpay"

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

    const signatureValid = verifyRazorpayPayment(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    )

    if (!signatureValid) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 })
    }

    const db = getAdminDb()
    const orderRef = db.collection("orders").doc(orderId)
    const orderSnap = await orderRef.get()

    if (!orderSnap.exists) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    await orderRef.update({
      status: "PAID",
      "razorpay.paymentId": razorpayPaymentId,
      "razorpay.signature": razorpaySignature,
      updatedAt: new Date(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error verifying Razorpay payment:", error)
    return NextResponse.json({ error: "Payment verification failed" }, { status: 500 })
  }
}
