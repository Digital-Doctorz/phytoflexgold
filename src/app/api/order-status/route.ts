import { NextRequest, NextResponse } from "next/server"
import { getAdminDb } from "@/lib/firebase-admin"

export async function GET(request: NextRequest) {
  try {
    const orderId = new URL(request.url).searchParams.get("orderId")
    if (typeof orderId !== "string" || orderId.trim() === "") {
      return NextResponse.json({ error: "orderId is required" }, { status: 400 })
    }

    const db = getAdminDb()
    const orderSnap = await db.collection("orders").doc(orderId).get()

    if (!orderSnap.exists) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    const order = orderSnap.data()
    return NextResponse.json({ status: order?.status ?? "UNKNOWN" })
  } catch (error) {
    console.error("Error fetching order status:", error)
    return NextResponse.json({ error: "Failed to fetch order status" }, { status: 500 })
  }
}