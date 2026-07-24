import { NextRequest, NextResponse } from "next/server"
import { getAdminDb, getAdminAuth } from "@/lib/firebase-admin"
import { compare } from "bcryptjs"

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const db = getAdminDb()
    const auth = getAdminAuth()

    const usersSnapshot = await db
      .collection("users")
      .where("email", "==", email)
      .limit(1)
      .get()

    if (usersSnapshot.empty) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const userDoc = usersSnapshot.docs[0]
    const userData = userDoc.data()

    if (!userData.passwordHash) {
      return NextResponse.json({ error: "Account has no password set. Please contact support." }, { status: 401 })
    }

    const passwordMatch = await compare(password, userData.passwordHash)
    if (!passwordMatch) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const uid = userDoc.id
    const customToken = await auth.createCustomToken(uid, {
      email: userData.email,
      role: userData.role,
    })

    return NextResponse.json({ customToken, uid, email: userData.email, role: userData.role })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
