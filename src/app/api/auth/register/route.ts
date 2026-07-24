import { NextRequest, NextResponse } from "next/server"
import { getAdminDb, getAdminAuth } from "@/lib/firebase-admin"
import { hash } from "bcryptjs"

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Email, password, and name are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    const db = getAdminDb()
    const auth = getAdminAuth()

    const existing = await db
      .collection("users")
      .where("email", "==", email)
      .limit(1)
      .get()

    if (!existing.empty) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 })
    }

    const userRecord = await auth.createUser({
      email,
      displayName: name,
      emailVerified: false,
    })

    const passwordHash = await hash(password, 12)

    await db.collection("users").doc(userRecord.uid).set({
      email,
      name,
      role: "CUSTOMER",
      passwordHash,
      createdAt: new Date(),
    })

    const customToken = await auth.createCustomToken(userRecord.uid, {
      email,
      role: "CUSTOMER",
    })

    return NextResponse.json({ customToken, uid: userRecord.uid })
  } catch (error) {
    console.error("Register error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
