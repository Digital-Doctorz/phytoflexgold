import { NextResponse } from "next/server"
import { getAdminDb } from "@/lib/firebase-admin"
import { requireAdmin } from "@/lib/auth"
import { NextRequest } from "next/server"
import { sendEmail, statusEmailFor } from "@/lib/email"
import type { Order, OrderStatus } from "@/types"

const ALLOWED_TRANSITIONS: Partial<Record<OrderStatus, OrderStatus[]>> = {
  PENDING: ["PAID", "CANCELLED"],
  PAID: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED", "CANCELLED"],
  DELIVERED: [],
  CANCELLED: [],
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAdmin(request)
  if ("error" in authResult) return authResult.error

  try {
    const { id } = await params
    const body = await request.json().catch(() => null)
    const requestedStatus = body?.status as OrderStatus | undefined

    const db = getAdminDb()
    const orderRef = db.collection("orders").doc(id)
    const orderSnap = await orderRef.get()

    if (!orderSnap.exists) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    const order = orderSnap.data()! as Order
    order.id = orderSnap.id
    const currentStatus = order.status || "PENDING"

    const update: Record<string, unknown> = { updatedAt: new Date() }

    if (requestedStatus) {
      if (!ALLOWED_TRANSITIONS[currentStatus]?.includes(requestedStatus)) {
        return NextResponse.json(
          {
            error: `Cannot move an order from ${currentStatus} to ${requestedStatus}`,
            currentStatus,
          },
          { status: 400 }
        )
      }

      update.status = requestedStatus

      if (requestedStatus === "PAID") {
        update.paidAt = order.paidAt || new Date()
      }

      if (requestedStatus === "SHIPPED") {
        const courier =
          typeof body?.courier === "string" && body.courier.trim() !== ""
            ? body.courier.trim()
            : ""
        const trackingNumber =
          typeof body?.trackingNumber === "string" && body.trackingNumber.trim() !== ""
            ? body.trackingNumber.trim()
            : ""

        // Dispatch requires a courier and tracking number so the client
        // receives a shippable confirmation rather than a vague status flip.
        if (!courier || !trackingNumber) {
          return NextResponse.json(
            { error: "Courier and tracking number are required to dispatch an order" },
            { status: 400 }
          )
        }

        update.shipping = {
          courier,
          trackingNumber,
          shippedAt: order.shipping?.shippedAt || new Date(),
        }
      }

      if (requestedStatus === "DELIVERED") {
        update.shipping = {
          ...(order.shipping ?? {}),
          deliveredAt: order.shipping?.deliveredAt || new Date(),
        }
      }

      if (requestedStatus === "CANCELLED") {
        update.cancelledAt = order.cancelledAt || new Date()
      }
    }

    await orderRef.update(update)

    let email: { ok?: boolean; skipped?: boolean; error?: string; subject?: string; type?: string; to?: string } | null = null

    if (requestedStatus && body?.notifyEmail !== false) {
      const mail = statusEmailFor(order, requestedStatus)
      const subject = mail.subject
      email = { subject, type: requestedStatus.toLowerCase() }
      const result = await sendEmail({
        to: order.email || "",
        subject,
        html: mail.html,
      })
      email = { ...email, ...result, to: order.email || "" }

      const history = Array.isArray(order.emails) ? order.emails : []
      history.push({
        to: order.email || "",
        type: requestedStatus.toLowerCase(),
        subject,
        sentAt: new Date(),
        ok: result.ok,
        ...(result.error ? { error: result.error } : {}),
      })
      await orderRef.update({ emails: history, updatedAt: new Date() })
    }

    return NextResponse.json({ success: true, email })
  } catch (error) {
    console.error("Error updating order:", error)
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
  }
}