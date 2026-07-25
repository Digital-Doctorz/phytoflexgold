import { NextResponse } from "next/server"
import { getAdminDb, serializeFirestoreData } from "@/lib/firebase-admin"
import { requireAdmin } from "@/lib/auth"
import { NextRequest } from "next/server"

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

export async function POST(request: NextRequest) {
  const authResult = await requireAdmin(request)
  if ("error" in authResult) return authResult.error

  try {
    const db = getAdminDb()
    const body = await request.json()
    const now = new Date()
    const docRef = await db.collection("products").add({
      ...body,
      version: 1,
      createdAt: now,
      updatedAt: now,
    })

    await db.collection("revisions").add({
      entityType: "product",
      entityId: docRef.id,
      action: "create",
      snapshot: { ...body, id: docRef.id },
      editedBy: request.headers.get("x-user-email") || "admin",
      createdAt: now,
    })

    return NextResponse.json({ id: docRef.id, ...body, version: 1 }, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
