import { NextResponse } from "next/server"
import { getAdminDb, serializeFirestoreData } from "@/lib/firebase-admin"
import { requireAdmin } from "@/lib/auth"
import { NextRequest } from "next/server"

export async function GET(
  _request: NextRequest,
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
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAdmin(request)
  if ("error" in authResult) return authResult.error

  try {
    const { id } = await params
    const body = await request.json()
    const { expectedVersion, ...updateData } = body
    const db = getAdminDb()

    const docRef = db.collection("products").doc(id)
    const doc = await docRef.get()

    if (!doc.exists) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    const currentData = doc.data()!
    const currentVersion = currentData.version || 0

    if (expectedVersion !== undefined && expectedVersion !== currentVersion) {
      return NextResponse.json(
        {
          error: "conflict",
          message: "This product was modified by another session. Please refresh to see the latest version.",
          currentVersion,
          serverData: serializeFirestoreData(currentData),
        },
        { status: 409 }
      )
    }

    const previousSnapshot = serializeFirestoreData(currentData)
    const changedFields = Object.keys(updateData).filter(
      (key) => JSON.stringify(updateData[key]) !== JSON.stringify(previousSnapshot[key])
    )

    await docRef.update({
      ...updateData,
      version: currentVersion + 1,
      updatedAt: new Date(),
    })

    await db.collection("revisions").add({
      entityType: "product",
      entityId: id,
      action: "update",
      snapshot: previousSnapshot,
      changedFields,
      editedBy: request.headers.get("x-user-email") || "admin",
      createdAt: new Date(),
    })

    return NextResponse.json({ success: true, version: currentVersion + 1 })
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAdmin(_request)
  if ("error" in authResult) return authResult.error

  try {
    const { id } = await params
    const db = getAdminDb()

    const doc = await db.collection("products").doc(id).get()
    if (doc.exists) {
      await db.collection("revisions").add({
        entityType: "product",
        entityId: id,
        action: "delete",
        snapshot: serializeFirestoreData(doc.data()!),
        editedBy: _request.headers.get("x-user-email") || "admin",
        createdAt: new Date(),
      })
    }

    await db.collection("products").doc(id).delete()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}
