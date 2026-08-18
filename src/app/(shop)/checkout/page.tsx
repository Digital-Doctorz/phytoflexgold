"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Script from "next/script"
import { useCart } from "@/context/CartContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatPrice } from "@/lib/utils"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

declare global {
  interface Window {
    Razorpay: any
  }
}

interface RazorpayFailureResponse {
  error?: {
    code?: string
    description?: string
    reason?: string
    source?: string
    step?: string
  }
}

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (items.length === 0) return
    setLoading(true)
    setError(null)

    try {
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          total,
          shippingAddress: form,
          email: form.email,
        }),
      })
      const orderData = await orderRes.json()
      if (!orderRes.ok || !orderData.id) {
        throw new Error(orderData.error || "Failed to create your order")
      }
      const createdOrderId = orderData.id as string

      const createOrderRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: createdOrderId,
          amount: total,
        }),
      })
      const createOrderData = await createOrderRes.json()
      if (!createOrderRes.ok || !createOrderData.orderId) {
        throw new Error(createOrderData.error || "Failed to initialize payment")
      }

      const options: Record<string, unknown> = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: total * 100,
        currency: "INR",
        name: "PhytoFlex Gold",
        description: `Order ${createdOrderId.slice(0, 8)}`,
        order_id: createOrderData.orderId,
        prefill: { name: form.name, email: form.email, contact: form.phone },
        handler: async function (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) {
          try {
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: createdOrderId,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            })
            const verifyData = await verifyRes.json()

            if (!verifyRes.ok || !verifyData.success) {
              setError(verifyData.error || "Payment could not be verified. Please contact support.")
              setLoading(false)
              return
            }

            clearCart()
            router.push(`/order-confirmation?id=${createdOrderId}`)
          } catch (err) {
            console.error("Verification error:", err)
            setError("Could not verify payment. Please contact support with your order ID.")
            setLoading(false)
          }
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      }

      const rzp = new (window as any).Razorpay(options)
      rzp.on("payment.failed", function (response: RazorpayFailureResponse) {
        const description = response?.error?.description || response?.error?.reason || "Please try again."
        setError(`Payment failed: ${description}`)
        setLoading(false)
      })
      rzp.open()
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-margin-mobile">
        <p className="text-headline-md font-headline-md">Your cart is empty</p>
        <Link href="/">
          <Button variant="secondary">Continue Shopping</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-margin-mobile md:px-gutter-md py-12">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <Link href="/" className="flex items-center gap-2 text-on-surface-variant hover:text-primary mb-8">
        <ArrowLeft className="w-4 h-4" /> Back to store
      </Link>
      <h1 className="text-display-sm font-extrabold mb-8">Checkout</h1>
      <form onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-3 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" value={form.name} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" name="phone" value={form.phone} onChange={handleChange} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" name="address" value={form.address} onChange={handleChange} required />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" name="city" value={form.city} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input id="state" name="state" value={form.state} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input id="pincode" name="pincode" value={form.pincode} onChange={handleChange} required />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.tier.label}`} className="flex justify-between text-sm">
                    <span>{item.productName} — {item.tier.label}</span>
                    <span className="font-bold">{formatPrice(item.tier.price)}</span>
                  </div>
                ))}
                <div className="border-t border-outline-variant/20 pt-4">
                  <div className="flex justify-between text-body-lg">
                    <span className="text-on-surface-variant">Total</span>
                    <span className="font-bold text-on-surface">{formatPrice(total)}</span>
                  </div>
                </div>
                {error && (
                  <div role="alert" className="bg-error-container/20 border border-error/30 rounded-lg px-4 py-3 text-body-sm text-on-surface">
                    {error}
                  </div>
                )}
                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? "Processing..." : `Pay ${formatPrice(total)}`}
                </Button>
                <p className="text-xs text-on-surface-variant text-center">
                  Secure payment via Razorpay. UPI, Cards, Netbanking accepted.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
