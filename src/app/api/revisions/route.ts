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
    let query: FirebaseFirestore.Query = db.collection("revisions").orderBy("createdAt", "desc")

    if (entityType) {
      query = query.where("entityType", "==", entityType)
    }
    if (entityId) {
      query = query.where("entityId", "==", entityId)
    }

    query = query.limit(limit)
    const snapshot = await query.get()
    const revisions = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...serializeFirestoreData(doc.data()),
    }))

    return NextResponse.json(revisions)
  } catch (error) {
    console.error("Error fetching revisions:", error)
    return NextResponse.json({ error: "Failed to fetch revisions" }, { status: 500 })
  }
}
