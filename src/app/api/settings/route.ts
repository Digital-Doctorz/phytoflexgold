import { NextResponse } from "next/server"
import { getAdminDb, serializeFirestoreData } from "@/lib/firebase-admin"
import { requireAdmin } from "@/lib/auth"
import { NextRequest } from "next/server"

const SETTINGS_DOC = "config/store"

const DEFAULT_SETTINGS = {
  storeName: "PhytoFlex Gold",
  storeEmail: "support@phytoflexgold.com",
  storePhone: "+91 9555 9555 95",
  shippingFee: "0",
  freeShippingThreshold: "2100",
  taxRate: "0",
}

export async function GET(request: NextRequest) {
  const authResult = await requireAdmin(request)
  if ("error" in authResult) return authResult.error

  try {
    const db = getAdminDb()
    const doc = await db.collection("config").doc("store").get()
    if (!doc.exists) {
      return NextResponse.json({ ...DEFAULT_SETTINGS, version: 0 })
    }
    return NextResponse.json(serializeFirestoreData(doc.data()!))
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  const authResult = await requireAdmin(request)
  if ("error" in authResult) return authResult.error

  try {
    const body = await request.json()
    const { expectedVersion, ...updateData } = body
    const db = getAdminDb()

    const docRef = db.collection("config").doc(SETTINGS_DOC)
    const doc = await docRef.get()

    const currentData = doc.exists ? doc.data()! : {}
    const currentVersion = currentData.version || 0

    if (expectedVersion !== undefined && expectedVersion !== currentVersion) {
      return NextResponse.json(
        {
          error: "conflict",
          message: "Settings were modified by another session. Please refresh to see the latest version.",
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

    await docRef.set(
      { ...updateData, version: currentVersion + 1, updatedAt: new Date() },
      { merge: true }
    )

    await db.collection("revisions").add({
      entityType: "settings",
      entityId: SETTINGS_DOC,
      action: "update",
      snapshot: previousSnapshot,
      changedFields,
      editedBy: request.headers.get("x-user-email") || "admin",
      createdAt: new Date(),
    })

    return NextResponse.json({ success: true, version: currentVersion + 1 })
  } catch (error) {
    console.error("Error updating settings:", error)
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}
