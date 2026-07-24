import "server-only"
import Razorpay from "razorpay"

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export function createRazorpayOrder(amount: number, receipt: string) {
  return razorpay.orders.create({
    amount: amount * 100,
    currency: "INR",
    receipt,
    payment_capture: true,
  })
}

export function verifyRazorpayPayment(
  orderId: string,
  paymentId: string,
  signature: string
) {
  const crypto = require("crypto")
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(`${orderId}|${paymentId}`)
    .digest("hex")
  return expectedSignature === signature
}
