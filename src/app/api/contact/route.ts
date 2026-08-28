import { NextRequest, NextResponse } from "next/server"
import { getAdminDb } from "@/lib/firebase-admin"
import { createHash } from "crypto"

const MAX_MESSAGE_LENGTH = 5000

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null)
    const name = typeof body?.name === "string" ? body.name.trim() : ""
    const email = typeof body?.email === "string" ? body.email.trim() : ""
    const subject = typeof body?.subject === "string" ? body.subject.trim() : ""
    const message = typeof body?.message === "string" ? body.message.trim() : ""

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 })
    }
    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json({ error: "Message is too long" }, { status: 400 })
    }

    const db = getAdminDb()

    // Basic rate limit: max 5 messages per hour per IP.
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
    const bucket = createHash("sha256").update(`contact:${ip}`).digest("hex")
    const now = Date.now()
    const cutoff = now - 60 * 60 * 1000
    const recentSnap = await db
      .collection("contactMessages")
      .where("rateBucket", "==", bucket)
      .where("createdAt", ">", new Date(cutoff))
      .get()
    if (recentSnap.size >= 5) {
      return NextResponse.json(
        { error: "Too many messages. Please try again later." },
        { status: 429 }
      )
    }

    await db.collection("contactMessages").add({
      name,
      email,
      subject,
      message,
      rateBucket: bucket,
      status: "NEW",
      createdAt: new Date(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving contact message:", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}