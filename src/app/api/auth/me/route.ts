import { NextRequest, NextResponse } from "next/server"
import { getAdminDb } from "@/lib/firebase-admin"

export async function GET(req: NextRequest) {
  try {
    const uid = req.nextUrl.searchParams.get("uid")
    if (!uid) {
      return NextResponse.json({ error: "uid is required" }, { status: 400 })
    }

    const db = getAdminDb()
    const docSnap = await db.collection("users").doc(uid).get()

    if (!docSnap.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const data = docSnap.data()!
    return NextResponse.json({
      id: docSnap.id,
      email: data.email,
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      phone: data.phone || "",
      role: data.role || "USER",
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
