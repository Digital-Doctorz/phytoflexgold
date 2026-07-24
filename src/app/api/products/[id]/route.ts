import { NextResponse } from "next/server"
import { getAdminDb, serializeFirestoreData } from "@/lib/firebase-admin"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const db = getAdminDb()
    const doc = await db.collection("products").doc(id).get()
    if (!doc.exists) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }
    return NextResponse.json({ id: doc.id, ...serializeFirestoreData(doc.data()!) })
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const db = getAdminDb()
    await db.collection("products").doc(id).update({
      ...body,
      updatedAt: new Date(),
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const db = getAdminDb()
    await db.collection("products").doc(id).delete()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}
