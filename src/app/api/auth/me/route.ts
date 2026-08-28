import { NextRequest, NextResponse } from "next/server"
import { getAdminDb } from "@/lib/firebase-admin"
import { verifyAuth } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    const user = await verifyAuth(req)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = getAdminDb()
    const docSnap = await db.collection("users").doc(user.uid).get()

    if (!docSnap.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const data = docSnap.data()!
    return NextResponse.json({
      id: docSnap.id,
      uid: docSnap.id,
      email: data.email,
      name: data.name || data.firstName || "",
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      phone: data.phone || "",
      role: data.role || "USER",
    })
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Internal error" }, { status: 500 })
  }
}
