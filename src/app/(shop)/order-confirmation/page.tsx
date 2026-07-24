"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

function OrderConfirmationContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("id")

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-margin-mobile text-center">
      <CheckCircle className="w-16 h-16 text-green-500 mb-6" />
      <h1 className="text-display-sm font-extrabold mb-4">Order Confirmed!</h1>
      <p className="text-body-lg text-on-surface-variant mb-2">
        Thank you for your purchase.
      </p>
      {orderId && (
        <p className="text-sm text-on-surface-variant mb-8">
          Order ID: <span className="font-mono text-primary">{orderId}</span>
        </p>
      )}
      <p className="text-body-md text-on-surface-variant max-w-md mb-8">
        You will receive a confirmation email shortly with your order details and tracking information.
      </p>
      <Link href="/">
        <Button variant="primary" size="lg">
          Continue Shopping
        </Button>
      </Link>
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
