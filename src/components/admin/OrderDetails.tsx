"use client"

import { useState } from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatDate, formatPrice } from "@/lib/utils"
import { authFetch } from "@/lib/auth-client"
import { AlertCircle, CheckCircle2, ChevronDown, ChevronRight, Mail, Truck, X } from "lucide-react"
import type { Order, OrderStatus } from "@/types"

const statusColors: Record<OrderStatus, "success" | "warning" | "primary" | "error" | "default"> = {
  PENDING: "warning",
  PAID: "success",
  SHIPPED: "primary",
  DELIVERED: "success",
  CANCELLED: "error",
}

const COURIERS = ["Delhivery", "Blue Dart", "DTDC", "Ekart", "India Post", "XpressBees", "Other"]

const EMAIL_PRESETS: Record<OrderStatus, { subject: string; message: string }> = {
  PENDING: {
    subject: "Order received – awaiting payment",
    message:
      "Hi, we received your PhytoFlex Gold order. Please complete payment at checkout so we can begin preparing your dispatch.",
  },
  PAID: {
    subject: "Payment confirmed – thank you!",
    message:
      "Hi, your payment for the PhytoFlex Gold order has been confirmed. We're preparing your dispatch and will share tracking shortly.",
  },
  SHIPPED: {
    subject: "Your PhytoFlex Gold order is on the way",
    message:
      "Hi, your order has been dispatched. Use the tracking details on your order page to follow it until it arrives.",
  },
  DELIVERED: {
    subject: "Your PhytoFlex Gold order was delivered",
    message:
      "Hi, your PhytoFlex Gold order has been delivered. Enjoy your wellness journey — if you have any questions, just reply to this email.",
  },
  CANCELLED: {
    subject: "Your PhytoFlex Gold order was cancelled",
    message: "Hi, your order was cancelled. If this was a mistake or you'd like to re-order, reply and we'll help.",
  },
}

interface Feedback {
  type: "success" | "error" | "warn"
  text: string
}

function DialogShell({
  open,
  onOpenChange,
  title,
  description,
  children,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl border border-outline-variant/20 bg-surface-container-low p-6 shadow-2xl">
          <div className="flex items-start justify-between mb-1">
            <Dialog.Title className="font-headline-md text-headline-md">{title}</Dialog.Title>
            <Dialog.Close asChild>
              <button aria-label="Close" className="text-on-surface-variant hover:text-on-surface">
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>
          <Dialog.Description className="text-body-md text-on-surface-variant mb-4">{description}</Dialog.Description>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export function OrderDetails({
  order,
  onChanged,
  defaultOpen = false,
}: {
  order: Order
  onChanged: () => void
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  const [busy, setBusy] = useState<OrderStatus | "EMAIL" | null>(null)
  const [feedback, setFeedback] = useState<Feedback | null>(null)

  const [shipOpen, setShipOpen] = useState(false)
  const [courier, setCourier] = useState("Delhivery")
  const [tracking, setTracking] = useState("")
  const [notify, setNotify] = useState(true)

  const [mailOpen, setMailOpen] = useState(false)
  const [mailSubject, setMailSubject] = useState("")
  const [mailMessage, setMailMessage] = useState("")

  const openMail = () => {
    const preset = EMAIL_PRESETS[order.status] || EMAIL_PRESETS.PENDING
    setMailSubject(preset.subject)
    setMailMessage(preset.message)
    setMailOpen(true)
  }

  const runAction = async (status: OrderStatus, extras?: Record<string, unknown>) => {
    setBusy(status)
    setFeedback(null)
    try {
      const res = await authFetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, notifyEmail: true, ...extras }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setFeedback({ type: "error", text: data.error || "Action failed" })
      } else if (data.email && !data.email.ok && data.email.skipped) {
        setFeedback({
          type: "warn",
          text: `Order marked ${status}. Email was queued but SMTP isn't configured yet — add SMTP vars in Vercel to enable sending.`,
        })
        onChanged()
      } else if (data.email && !data.email.ok) {
        setFeedback({ type: "warn", text: `Order marked ${status}, but the email could not be sent: ${data.email.error || "unknown error"}` })
        onChanged()
      } else {
        setFeedback({ type: "success", text: `Order marked ${status}${data.email?.ok ? " and confirmation emailed to the client" : ""}.` })
        onChanged()
      }
    } catch {
      setFeedback({ type: "error", text: "Request failed. Check your connection and try again." })
    } finally {
      setBusy(null)
    }
  }

  const handleCancel = () => {
    if (!window.confirm("Cancel this order? This cannot be undone.")) return
    void runAction("CANCELLED")
  }

  const handleShip = async () => {
    if (!courier || !tracking.trim()) {
      setFeedback({ type: "error", text: "Courier and tracking number are required." })
      return
    }
    setBusy("SHIPPED")
    setFeedback(null)
    try {
      const res = await authFetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "SHIPPED", courier, trackingNumber: tracking.trim(), notifyEmail: notify }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setFeedback({ type: "error", text: data.error || "Failed to dispatch order" })
      } else if (data.email && !data.email.ok && data.email.skipped) {
        setFeedback({ type: "warn", text: "Order dispatched. Tracking email queued but SMTP isn't configured yet." })
        setShipOpen(false)
        onChanged()
      } else if (data.email && !data.email.ok) {
        setFeedback({ type: "warn", text: `Dispatched, but email failed: ${data.email.error}` })
        setShipOpen(false)
        onChanged()
      } else {
        setFeedback({ type: "success", text: "Order dispatched and tracking email sent to the client." })
        setShipOpen(false)
        onChanged()
      }
    } catch {
      setFeedback({ type: "error", text: "Request failed. Check your connection and try again." })
    } finally {
      setBusy(null)
    }
  }

  const handleEmail = async () => {
    if (!mailSubject.trim() || !mailMessage.trim()) {
      setFeedback({ type: "error", text: "Subject and message are required." })
      return
    }
    setBusy("EMAIL")
    setFeedback(null)
    try {
      const res = await authFetch(`/api/orders/${order.id}/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: mailSubject.trim(), message: mailMessage.trim(), type: "custom" }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setFeedback({ type: "error", text: data.error || "Failed to send email" })
      } else if (data.email && !data.email.ok && data.email.skipped) {
        setFeedback({ type: "warn", text: "Email recorded but not sent — SMTP isn't configured yet." })
        setMailOpen(false)
        onChanged()
      } else if (data.email && !data.email.ok) {
        setFeedback({ type: "warn", text: `Email could not be sent: ${data.email.error}` })
        setMailOpen(false)
        onChanged()
      } else {
        setFeedback({ type: "success", text: `Email sent to ${order.email || "client"}.` })
        setMailOpen(false)
        onChanged()
      }
    } catch {
      setFeedback({ type: "error", text: "Request failed. Check your connection and try again." })
    } finally {
      setBusy(null)
    }
  }

  const address = order.shippingAddress
  const payment = order.razorpay
  const shipping = order.shipping
  const emails = order.emails || []

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 text-left hover:text-primary transition-colors"
          aria-expanded={open}
        >
          {open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          <div>
            <p className="font-bold">{order.email || "Guest"}</p>
            <p className="text-xs text-on-surface-variant font-mono">{order.id}</p>
          </div>
        </button>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="font-bold text-lg">{formatPrice(order.total)}</p>
            <p className="text-xs text-on-surface-variant">{formatDate(order.createdAt)}</p>
          </div>
          <Badge variant={statusColors[order.status]}>{order.status}</Badge>
        </div>
      </div>

      {open && (
        <div className="space-y-4 mt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <section className="rounded-lg border border-outline-variant/20 p-4 text-sm">
              <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Customer</h4>
              <p className="font-bold">{address?.name || "—"}</p>
              <p className="text-on-surface-variant">{address?.phone || ""}</p>
              {address && (
                <p className="text-on-surface-variant mt-1">
                  {address.address}, {address.city}, {address.state} - {address.pincode}
                </p>
              )}
            </section>

            <section className="rounded-lg border border-outline-variant/20 p-4 text-sm">
              <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Items</h4>
              <div className="space-y-1">
                {order.items?.map((item) => (
                  <p key={item.productId} className="flex justify-between gap-2">
                    <span>
                      {item.productName} <span className="text-on-surface-variant">× {item.quantity}</span>
                    </span>
                    <span className="font-bold">{formatPrice((item.price || 0) * (item.quantity || 1))}</span>
                  </p>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-outline-variant/20 p-4 text-sm">
              <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Payment</h4>
              {payment?.orderId ? (
                <div className="space-y-1 text-on-surface-variant">
                  <p>
                    Razorpay: <span className="font-mono text-on-surface text-xs">{payment.orderId}</span>
                  </p>
                  {payment.paymentId && (
                    <p>
                      Payment: <span className="font-mono text-on-surface text-xs">{payment.paymentId}</span>
                    </p>
                  )}
                  {payment.method && <p>Method: <span className="text-on-surface capitalize">{payment.method}</span></p>}
                  {typeof payment.fee === "number" && <p>Gateway fee: {formatPrice(payment.fee)}</p>}
                  {order.paidAt && <p>Paid: {formatDate(order.paidAt)}</p>}
                </div>
              ) : (
                <p className="text-on-surface-variant">No Razorpay order created yet</p>
              )}
            </section>

            <section className="rounded-lg border border-outline-variant/20 p-4 text-sm">
              <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Shipping</h4>
              {shipping?.trackingNumber ? (
                <div className="space-y-1 text-on-surface-variant">
                  <p>
                    Courier: <span className="text-on-surface">{shipping.courier || "—"}</span>
                  </p>
                  <p>
                    Tracking: <span className="font-mono text-on-surface text-xs">{shipping.trackingNumber}</span>
                  </p>
                  {shipping.shippedAt && <p>Shipped: {formatDate(shipping.shippedAt)}</p>}
                  {shipping.deliveredAt && <p>Delivered: {formatDate(shipping.deliveredAt)}</p>}
                </div>
              ) : (
                <p className="text-on-surface-variant">{order.status === "PENDING" ? "Awaiting payment" : order.status === "PAID" ? "Ready to dispatch" : "Not shipped"}</p>
              )}
            </section>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {order.status === "PENDING" && (
              <>
                <Button size="sm" disabled={busy !== null} onClick={() => void runAction("PAID")}>
                  <CheckCircle2 className="w-4 h-4" /> {busy === "PAID" ? "Marking paid..." : "Mark Paid"}
                </Button>
                <Button size="sm" variant="ghost" disabled={busy !== null} onClick={handleCancel}>Cancel</Button>
              </>
            )}
            {order.status === "PAID" && (
              <>
                <Button size="sm" onClick={() => setShipOpen(true)}>
                  <Truck className="w-4 h-4" /> Dispatch Order
                </Button>
                <Button size="sm" variant="ghost" disabled={busy !== null} onClick={handleCancel}>Cancel</Button>
              </>
            )}
            {order.status === "SHIPPED" && (
              <>
                <Button size="sm" disabled={busy !== null} onClick={() => void runAction("DELIVERED")}>
                  <CheckCircle2 className="w-4 h-4" /> {busy === "DELIVERED" ? "Marking delivered..." : "Mark Delivered"}
                </Button>
                <Button size="sm" variant="ghost" disabled={busy !== null} onClick={handleCancel}>Cancel</Button>
              </>
            )}
            {order.email && (
              <Button size="sm" variant="secondary" disabled={busy !== null} onClick={openMail}>
                <Mail className="w-4 h-4" /> Email Client
              </Button>
            )}
          </div>

          {feedback && (
            <div
              className={`flex items-center gap-2 text-sm rounded-lg px-4 py-3 ${
                feedback.type === "error"
                  ? "bg-error-container/20 text-on-error-container"
                  : feedback.type === "warn"
                  ? "bg-secondary/10 text-secondary"
                  : "bg-green-500/10 text-green-400"
              }`}
            >
              {feedback.type === "error" ? (
                <AlertCircle className="w-4 h-4 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              )}
              <span>{feedback.text}</span>
            </div>
          )}

          {emails.length > 0 && (
            <section className="rounded-lg border border-outline-variant/20 p-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3">
                Email history ({emails.length})
              </h4>
              <div className="space-y-2">
                {[...emails].reverse().map((mailItem, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-3 text-sm">
                    <div className="min-w-0">
                      <p className="font-bold truncate">{mailItem.subject}</p>
                      <p className="text-xs text-on-surface-variant">
                        to {mailItem.to} · {formatDate(mailItem.sentAt)} · {(mailItem.type || "custom").toLowerCase()}
                      </p>
                    </div>
                    <Badge variant={mailItem.ok ? "success" : "error"} className="text-[10px]">
                      {mailItem.ok ? "sent" : mailItem.error || "failed"}
                    </Badge>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      <DialogShell
        open={shipOpen}
        onOpenChange={setShipOpen}
        title="Dispatch Order"
        description={`Enter courier details for ${order.id.slice(0, 8).toUpperCase()}. A tracking email is sent to the client automatically.`}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="courier">Courier</Label>
            <select
              id="courier"
              value={courier}
              onChange={(e) => setCourier(e.target.value)}
              className="flex h-12 w-full rounded-lg border border-outline-variant/30 bg-transparent px-4 py-2 text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container/30 transition-colors"
            >
              {COURIERS.map((c) => (
                <option key={c} value={c} className="bg-surface-container-low">
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tracking">Tracking number</Label>
            <Input
              id="tracking"
              value={tracking}
              onChange={(e) => setTracking(e.target.value)}
              placeholder="e.g. DL123456789IN"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-on-surface-variant">
            <input
              type="checkbox"
              checked={notify}
              onChange={(e) => setNotify(e.target.checked)}
              className="accent-primary-container"
            />
            Send tracking email to the client
          </label>
          <Button className="w-full" disabled={busy !== null} onClick={() => void handleShip()}>
            {busy === "SHIPPED" ? "Dispatching..." : "Confirm Dispatch"}
          </Button>
        </div>
      </DialogShell>

      <DialogShell
        open={mailOpen}
        onOpenChange={setMailOpen}
        title="Email Client"
        description={`Send a message to ${order.email || "the customer"}. The message is sent as-is.`}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mailSubject">Subject</Label>
            <Input id="mailSubject" value={mailSubject} onChange={(e) => setMailSubject(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mailMessage">Message</Label>
            <textarea
              id="mailMessage"
              value={mailMessage}
              onChange={(e) => setMailMessage(e.target.value)}
              rows={5}
              className="w-full rounded-lg border border-outline-variant/30 bg-transparent px-4 py-2 text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container/30 transition-colors resize-none"
            />
          </div>
          <Button className="w-full" disabled={busy !== null} onClick={() => void handleEmail()}>
            {busy === "EMAIL" ? "Sending..." : "Send Email"}
          </Button>
        </div>
      </DialogShell>
    </div>
  )
}