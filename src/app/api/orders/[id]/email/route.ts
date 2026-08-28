import { NextResponse } from "next/server"
import { getAdminDb } from "@/lib/firebase-admin"
import { requireAdmin } from "@/lib/auth"
import { NextRequest } from "next/server"
import { sendEmail, orderLabel } from "@/lib/email"
import type { Order } from "@/types"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAdmin(request)
  if ("error" in authResult) return authResult.error

  try {
    const { id } = await params
    const body = await request.json().catch(() => null)
    const subject = typeof body?.subject === "string" ? body.subject.trim() : ""
    const message = typeof body?.message === "string" ? body.message.trim() : ""

    if (!subject || !message) {
      return NextResponse.json(
        { error: "subject and message are required" },
        { status: 400 }
      )
    }

    const db = getAdminDb()
    const orderRef = db.collection("orders").doc(id)
    const orderSnap = await orderRef.get()

    if (!orderSnap.exists) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    const order = orderSnap.data()! as Order
    const recipient = order.email
    if (!recipient || !recipient.includes("@")) {
      return NextResponse.json(
        { error: "No customer email on this order" },
        { status: 400 }
      )
    }

    const html = `<div style="font-family:ui-sans-serif,system-ui,Arial,sans-serif;max-width:560px;margin:0 auto;">
      <div style="background:#0a0a0a;border-bottom:3px solid #ff6b35;padding:22px 32px;">
        <span style="color:#ffb59d;font-size:20px;font-weight:800;">PHYTOFLEX GOLD</span>
        <span style="color:#e9c349;font-size:12px;font-weight:600;display:block;margin-top:2px;">CLINICAL JOINT &amp; NERVE CARE</span>
      </div>
      <div style="padding:28px 32px;border:1px solid #e6e6e6;border-top:0;border-radius:0 0 12px 12px;">
        <p style="margin:0 0 4px;color:#ff6b35;font-weight:600;font-size:13px;">Order ${orderLabel(order.id)}</p>
        <p style="margin:0 0 18px;color:#0a0a0a;font-size:14px;line-height:1.6;white-space:pre-wrap;">${message}</p>
        <p style="margin:0;color:#999;font-size:12px;">Need help? Reply to this email.<br/>© ${new Date().getFullYear()} PhytoFlex Gold. All rights reserved.</p>
      </div>
    </div>`

    const result = await sendEmail({ to: recipient, subject, html })

    const history = Array.isArray(order.emails) ? order.emails : []
    history.push({
      to: recipient,
      type: body?.type ?? "custom",
      subject,
      sentAt: new Date(),
      ok: result.ok,
      error: result.error,
    })
    await orderRef.update({ emails: history, updatedAt: new Date() })

    return NextResponse.json({ success: true, email: { to: recipient, subject, ...result } })
  } catch (error) {
    console.error("Error sending order email:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}