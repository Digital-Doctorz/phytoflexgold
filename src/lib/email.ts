import "server-only"
import nodemailer from "nodemailer"
import { Resend } from "resend"
import type { Order, OrderStatus } from "@/types"

interface EmailResult {
  ok: boolean
  skipped?: boolean
  error?: string
  messageId?: string
}

function isEnabled(): boolean {
  return process.env.EMAIL_ENABLED === "true"
}

function resendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY)
}

function smtpConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)
}

let resendClient: Resend | null = null
function getResend(): Resend {
  if (!resendClient) resendClient = new Resend(process.env.RESEND_API_KEY)
  return resendClient
}

let transporter: ReturnType<typeof nodemailer.createTransport> | null = null

function getTransporter() {
  if (transporter) return transporter
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "localhost",
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT || 587) === 465,
    auth: {
      user: process.env.SMTP_USER || "",
      pass: process.env.SMTP_PASS || "",
    },
  })
  return transporter
}

export function orderLabel(orderId: string): string {
  return `#${orderId.slice(0, 8).toUpperCase()}`
}

function renderOrderEmail(order: Order, opts: { subject: string; headline: string; body: string; action?: { label: string } }): string {
  const summary = order.items
    ?.map((i) => {
      const p = Number(i.price) || 0
      const q = Number(i.quantity) || 1
      return `<tr>
        <td style="padding:8px 0;border-bottom:1px solid #eee;color:#333;font-size:14px;">${i.productName} &times; ${q}</td>
        <td style="padding:8px 0;border-bottom:1px solid #eee;color:#333;font-size:14px;text-align:right;">₹${(p * q).toLocaleString("en-IN")}</td>
      </tr>`
    })
    .join("") || ""

  const address = order.shippingAddress
  const addressLines = address
    ? `${address.name}, ${address.address}, ${address.city}, ${address.state} - ${address.pincode}`
    : ""

  const tracking = order.shipping?.trackingNumber
    ? `<p style="margin:16px 0 4px;color:#333;font-size:14px;">Courier: <strong>${order.shipping.courier || "—"}</strong></p>
       <p style="margin:0 0 4px;color:#333;font-size:14px;">Tracking: <strong>${order.shipping.trackingNumber}</strong></p>`
    : ""

  return `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#f4f5f6;font-family:ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f5f6;padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e6e6e6;">
            <tr>
              <td style="background:#0a0a0a;padding:22px 32px;border-bottom:3px solid #ff6b35;">
                <span style="color:#ffb59d;font-size:20px;font-weight:800;letter-spacing:0.4px;">PHYTOFLEX GOLD</span>
                <span style="color:#e9c349;font-size:12px;font-weight:600;display:block;margin-top:2px;">CLINICAL JOINT &amp; NERVE CARE</span>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 32px;">
                <h1 style="margin:0 0 6px;font-size:20px;color:#0a0a0a;">${opts.headline}</h1>
                <p style="margin:0 0 18px;color:#ff6b35;font-weight:600;font-size:13px;">Order ${orderLabel(order.id)}</p>
                <p style="margin:0 0 16px;color:#444;font-size:14px;line-height:1.6;">${opts.body}</p>

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:18px;">
                  ${summary}
                </table>

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9f9;border:1px solid #eee;border-radius:8px;padding:14px 16px;">
                  <tr>
                    <td style="padding:4px 0;color:#666;font-size:13px;">Order total</td>
                    <td style="padding:4px 0;color:#0a0a0a;font-weight:800;font-size:15px;text-align:right;">₹${(Number(order.total) || 0).toLocaleString("en-IN")}</td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0;color:#666;font-size:13px;">Status</td>
                    <td style="padding:4px 0;color:#0a0a0a;font-weight:700;font-size:14px;text-align:right;text-transform:capitalize;">${order.status.toLowerCase()}</td>
                  </tr>
                  ${addressLines ? `<tr><td style="padding:4px 0;color:#666;font-size:13px;vertical-align:top;">Shipping to</td><td style="padding:4px 0;color:#0a0a0a;font-size:13px;text-align:right;">${addressLines}</td></tr>` : ""}
                </table>

                ${tracking}

                ${opts.action ? `<p style="margin:20px 0 0;"><a href="${opts.action.label}" style="background:#ff6b35;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;padding:11px 22px;border-radius:8px;display:inline-block;">Track this order</a></p>` : ""}

                <p style="margin:24px 0 0;color:#999;font-size:12px;line-height:1.6;">Need help? Reply to this email and our team will get back to you shortly.<br/>© ${new Date().getFullYear()} PhytoFlex Gold. All rights reserved.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

const STATUS_COPY: Record<OrderStatus, { subject: string; headline: string; body: string }> = {
  PENDING: {
    subject: "Order received – ",
    headline: "We've received your order",
    body: "Your order has been placed and is awaiting payment confirmation. Once your payment is captured, we'll begin preparing your dispatch.",
  },
  PAID: {
    subject: "Payment confirmed – ",
    headline: "Payment received — thank you!",
    body: "We've successfully received your payment. Your order is now being prepared and will be dispatched shortly. We'll email you the tracking details the moment it ships.",
  },
  SHIPPED: {
    subject: "Your package is on the way – ",
    headline: "Your order has been dispatched",
    body: "Great news — your order is now on the move. You can track it anytime with the details below.",
  },
  DELIVERED: {
    subject: "Delivered – ",
    headline: "Your order has been delivered",
    body: "Your order has arrived. We hope it supports you on your wellness journey — if you have any questions, just reply to this email.",
  },
  CANCELLED: {
    subject: "Order cancelled – ",
    headline: "Your order has been cancelled",
    body: "We're sorry your order was cancelled. If this was a mistake or you'd like to re-order, reply to this email and we'll make it right.",
  },
}

export function statusEmailFor(order: Order, status: OrderStatus) {
  const copy = STATUS_COPY[status]
  const subject = `PhytoFlex Gold: ${copy.subject}${orderLabel(order.id)}`
  return {
    subject,
    html: renderOrderEmail(order, {
      subject,
      headline: copy.headline,
      body: copy.body,
      action: status === "SHIPPED" ? { label: "https://www.phytoflexgold.com/order-confirmation?id=" + order.id } : undefined,
    }),
  }
}

export async function sendEmail(opts: {
  to: string
  subject: string
  html: string
}): Promise<EmailResult> {
  if (!opts.to || !opts.to.includes("@")) {
    return { ok: false, error: "No valid recipient email on this order" }
  }
  if (!isEnabled()) {
    return { ok: false, skipped: true, error: "Emails are disabled (EMAIL_ENABLED not set to true)" }
  }
  if (!resendConfigured() && !smtpConfigured()) {
    console.warn(`[email] No provider configured; skipping "${opts.subject}" to ${opts.to}`)
    return { ok: false, skipped: true, error: "No email provider configured (RESEND_API_KEY or SMTP_*) " }
  }

  // Prefer SMTP; fall back to Resend.
  try {
    if (smtpConfigured()) {
      const info = await getTransporter().sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER || "PhytoFlex Gold <onboarding@resend.dev>",
        to: opts.to,
        subject: opts.subject,
        html: opts.html,
      })
      return { ok: true, messageId: info.messageId }
    }

    if (resendConfigured()) {
      const sender = process.env.RESEND_FROM || "PhytoFlex Gold <onboarding@resend.dev>"
      const { data, error } = await getResend().emails.send({
        from: sender,
        to: opts.to,
        subject: opts.subject,
        html: opts.html,
      })
      if (error) {
        console.error("[email] Resend send failed:", error.message, error.name)
        return { ok: false, error: error.name + ": " + error.message }
      }
      return { ok: true, messageId: data?.id }
    }

    return { ok: false, skipped: true, error: "No email provider configured (RESEND_API_KEY or SMTP_*)" }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown email provider error"
    console.error("[email] send failed:", message)
    return { ok: false, error: message }
  }
}