import { NextResponse } from "next/server"
import { getAdminDb, serializeFirestoreData } from "@/lib/firebase-admin"

export async function GET() {
  try {
    const db = getAdminDb()
    const snapshot = await db.collection("products").orderBy("createdAt", "desc").get()
    const products = snapshot.docs.map((doc) => ({ id: doc.id, ...serializeFirestoreData(doc.data()) }))
    return NextResponse.json(products)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const db = getAdminDb()
    const body = await request.json()
    const docRef = await db.collection("products").add({
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    return NextResponse.json({ id: docRef.id, ...body }, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
