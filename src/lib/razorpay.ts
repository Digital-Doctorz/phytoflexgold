import "server-only"
import Razorpay from "razorpay"
import { createHmac } from "crypto"

const keyId = process.env.RAZORPAY_KEY_ID
const keySecret = process.env.RAZORPAY_KEY_SECRET

function requireKeySecret(): string {
  if (!keySecret) {
    throw new Error("RAZORPAY_KEY_SECRET must be set")
  }
  return keySecret
}

if (!keyId || !keySecret) {
  throw new Error("RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set")
}

export const razorpay = new Razorpay({
  key_id: keyId,
  key_secret: keySecret,
})

// Minimum order amount accepted by Razorpay is 100 paise (Rs. 1).
export const MIN_AMOUNT_PAISE = 100

export async function createRazorpayOrder(amountInRupees: number, receipt: string) {
  if (!Number.isFinite(amountInRupees) || amountInRupees * 100 < MIN_AMOUNT_PAISE) {
    throw new Error("Order amount must be at least 1 rupee")
  }
  return razorpay.orders.create({
    amount: Math.round(amountInRupees * 100),
    currency: "INR",
    receipt: receipt.slice(0, 40),
    payment_capture: true,
  })
}

export function verifyRazorpayPayment(
  orderId: string,
  paymentId: string,
  signature: string
) {
  const expectedSignature = createHmac("sha256", requireKeySecret())
    .update(`${orderId}|${paymentId}`)
    .digest("hex")
  return expectedSignature === signature
}
