import { NextResponse } from "next/server"
import { getAdminDb, serializeFirestoreData } from "@/lib/firebase-admin"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    const db = getAdminDb()
    let query: FirebaseFirestore.Query = db.collection("orders").orderBy("createdAt", "desc")
    if (status) {
      query = query.where("status", "==", status)
    }
    const snapshot = await query.get()
    const orders = snapshot.docs.map((doc) => ({ id: doc.id, ...serializeFirestoreData(doc.data()) }))
    return NextResponse.json(orders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const db = getAdminDb()
    const docRef = await db.collection("orders").add({
      ...body,
      status: "PENDING",
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    return NextResponse.json({ id: docRef.id, ...body, status: "PENDING" }, { status: 201 })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
