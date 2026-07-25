import { getAdminAuth, getAdminDb } from "@/lib/firebase-admin"
import { NextRequest, NextResponse } from "next/server"

export interface AuthUser {
  uid: string
  email: string
  role: string
}

export async function verifyAuth(req: NextRequest): Promise<AuthUser | null> {
  try {
    const authHeader = req.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) return null

    const idToken = authHeader.slice(7)
    const auth = getAdminAuth()
    const decoded = await auth.verifyIdToken(idToken)

    const db = getAdminDb()
    const userDoc = await db.collection("users").doc(decoded.uid).get()
    if (!userDoc.exists) return null

    const data = userDoc.data()!
    return {
      uid: decoded.uid,
      email: data.email || decoded.email || "",
      role: data.role || "USER",
    }
  } catch {
    return null
  }
}

export async function requireAdmin(
  req: NextRequest
): Promise<{ user: AuthUser } | { error: NextResponse }> {
  const user = await verifyAuth(req)
  if (!user) {
    return {
      error: NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      ),
    }
  }
  if (user.role !== "ADMIN") {
    return {
      error: NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      ),
    }
  }
  return { user }
}
