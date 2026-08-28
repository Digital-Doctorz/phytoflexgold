import { NextResponse } from "next/server"
import { getAdminDb, serializeFirestoreData } from "@/lib/firebase-admin"
import { requireAdmin } from "@/lib/auth"
import { NextRequest } from "next/server"
import type { OrderItem, PricingTier } from "@/types"

export async function GET(request: NextRequest) {
  const authResult = await requireAdmin(request)
  if ("error" in authResult) return authResult.error

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null)
    const items = body?.items

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "items must be a non-empty array" }, { status: 400 })
    }

    const db = getAdminDb()

    // Price the order entirely from the product catalog so a client cannot
    // tamper with the submitted amount or set its own order status.
    const productIds = [
      ...new Set(items.map((i) => i?.productId).filter((id) => typeof id === "string")),
    ]
    if (productIds.length === 0) {
      return NextResponse.json({ error: "items must include a productId" }, { status: 400 })
    }

    const snaps = await db.getAll(
      ...productIds.map((id) => db.collection("products").doc(id))
    )
    const productById = new Map(snaps.map((s) => [s.id, s]))

    const orderItems: OrderItem[] = []
    let total = 0

    for (const item of items) {
      const productId = item?.productId
      const tier = item?.tier
      const snap = productById.get(productId)
      const product = snap?.exists ? snap.data() : undefined

      if (!product || typeof tier?.label !== "string") {
        return NextResponse.json({ error: "Product not found" }, { status: 400 })
      }

      const catalogTier = Array.isArray(product.tiers)
        ? (product.tiers as PricingTier[]).find(
            (t) => t.label === tier.label || (tier.id && t.id === tier.id)
          )
        : undefined

      if (!catalogTier || typeof catalogTier.price !== "number") {
        return NextResponse.json(
          { error: `Pricing unavailable for ${product.name}` },
          { status: 400 }
        )
      }

      orderItems.push({
        productId,
        productName: product.name,
        quantity: Number.isInteger(tier.quantity) && tier.quantity > 0 ? tier.quantity : 1,
        price: catalogTier.price,
      })
      total += catalogTier.price
    }

    const docRef = await db.collection("orders").add({
      items: orderItems,
      total,
      email: typeof body?.email === "string" ? body.email : null,
      shippingAddress: body?.shippingAddress ?? null,
      status: "PENDING",
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    return NextResponse.json(
      { id: docRef.id, items: orderItems, total, email: body?.email ?? null, shippingAddress: body?.shippingAddress ?? null, status: "PENDING" },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
