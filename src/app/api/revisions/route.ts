import { NextResponse } from "next/server"
import { getAdminDb, serializeFirestoreData } from "@/lib/firebase-admin"
import { requireAdmin } from "@/lib/auth"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const authResult = await requireAdmin(request)
  if ("error" in authResult) return authResult.error

  try {
    const { searchParams } = new URL(request.url)
    const entityType = searchParams.get("entityType")
    const entityId = searchParams.get("entityId")
    const limit = parseInt(searchParams.get("limit") || "20", 10)

    const db = getAdminDb()
    // Use only a single-field orderBy so we never require a composite Firestore
    // index (entityType + entityId + createdAt). A missing composite index used
    // to return 500 and break the Revision History panel on the Products and
    // Settings pages, the same bug class previously fixed for /api/orders.
    const snapshot = await db.collection("revisions").orderBy("createdAt", "desc").get()
    const revisions = snapshot.docs
      .map((doc) => {
        const data = serializeFirestoreData(doc.data())
        return { id: doc.id, ...data }
      })
      .filter(
        (rev) =>
          (!entityType || (rev as { entityType?: string }).entityType === entityType) &&
          (!entityId || (rev as { entityId?: string }).entityId === entityId)
      )
      .slice(0, limit)

    return NextResponse.json(revisions)
  } catch (error) {
    console.error("Error fetching revisions:", error)
    return NextResponse.json({ error: "Failed to fetch revisions" }, { status: 500 })
  }
}
