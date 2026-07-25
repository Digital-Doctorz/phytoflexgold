import { NextResponse } from "next/server"
import { getAdminDb, serializeFirestoreData } from "@/lib/firebase-admin"
import { requireAdmin } from "@/lib/auth"
import { NextRequest } from "next/server"

const SETTINGS_DOC = "config/store"

const DEFAULT_SETTINGS = {
  storeName: "PhytoFlex Gold",
  storeEmail: "support@phytoflexgold.com",
  storePhone: "+91-XXXXXXXXXX",
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
      return NextResponse.json(DEFAULT_SETTINGS)
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
    const db = getAdminDb()
    await db.collection("config").doc("store").set(
      { ...body, updatedAt: new Date() },
      { merge: true }
    )
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating settings:", error)
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}
