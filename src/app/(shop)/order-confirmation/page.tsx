"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock } from "lucide-react"

function OrderConfirmationContent() {
  const orderId = useSearchParams().get("id")
  const [status, setStatus] = useState<"checking" | "paid" | "pending" | "missing">(
    () => (orderId ? "checking" : "missing")
  )

  useEffect(() => {
    if (!orderId) return
    let cancelled = false
    fetch(`/api/order-status?orderId=${encodeURIComponent(orderId)}`)
      .then((res) => {
        if (!res.ok) throw new Error("not found")
        return res.json()
      })
      .then((data) => {
        if (!cancelled) setStatus(data.status === "PAID" ? "paid" : "pending")
      })
      .catch(() => {
        if (!cancelled) setStatus("missing")
      })
    return () => {
      cancelled = true
    }
  }, [orderId])

  const isSuccess = orderId && status === "paid"
  const title = isSuccess
    ? "Order Confirmed!"
    : status === "pending"
      ? "Payment Pending"
      : "Order Details"

  const body = isSuccess
    ? "Thank you for your purchase. You will receive a confirmation email shortly with your order details and tracking information."
    : status === "pending"
      ? "We received your order, but the payment has not been confirmed yet. If you were redirected here, the payment may still be processing — please check your email for confirmation or contact support with your order ID."
      : status === "missing"
        ? "We could not find this order. If you just paid, please contact support with your payment reference."
        : "Looking up your order..."

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-margin-mobile text-center">
      {status === "checking" ? (
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-container mb-6" />
      ) : isSuccess ? (
        <CheckCircle className="w-16 h-16 text-green-500 mb-6" />
      ) : (
        <Clock className="w-16 h-16 text-amber-500 mb-6" />
      )}
      <h1 className="text-display-sm font-extrabold mb-4">{title}</h1>
      {orderId ? (
        <p className="text-sm text-on-surface-variant mb-8">
          Order ID: <span className="font-mono text-primary">{orderId}</span>
        </p>
      ) : (
        <p className="text-sm text-on-surface-variant mb-8">No order reference provided.</p>
      )}
      <p className="text-body-md text-on-surface-variant max-w-md mb-8">{body}</p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link href="/">
          <Button variant="primary" size="lg">
            Continue Shopping
          </Button>
        </Link>
        <Link href="/contact">
          <Button variant="secondary" size="lg">
            Contact Support
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center text-on-surface-variant">Loading...</div>}>
      <OrderConfirmationContent />
    </Suspense>
  )
}