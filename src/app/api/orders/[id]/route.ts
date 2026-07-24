import { NextResponse } from "next/server"
import { getAdminDb } from "@/lib/firebase-admin"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const db = getAdminDb()
    await db.collection("orders").doc(id).update({
      ...body,
      updatedAt: new Date(),
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating order:", error)
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
  }
}
