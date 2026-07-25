import { NextResponse } from "next/server"
import { getAdminDb } from "@/lib/firebase-admin"
import { requireAdmin } from "@/lib/auth"
import { NextRequest } from "next/server"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAdmin(request)
  if ("error" in authResult) return authResult.error

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
