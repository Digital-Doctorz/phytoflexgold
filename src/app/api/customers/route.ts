import { NextResponse } from "next/server"
import { getAdminDb, serializeFirestoreData } from "@/lib/firebase-admin"
import { requireAdmin } from "@/lib/auth"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const authResult = await requireAdmin(request)
  if ("error" in authResult) return authResult.error

  try {
    const db = getAdminDb()
    const snapshot = await db.collection("users").orderBy("createdAt", "desc").get()
    // Only staff/admin accounts are excluded so the Customers page and the
    // dashboard "Customers" stat count real customers, not admin users.
    const users = snapshot.docs
      .map((doc) => {
        const data = serializeFirestoreData(doc.data()) as Record<string, unknown>
        delete data.passwordHash
        return { id: doc.id, uid: doc.id, ...data }
      })
      .filter((u) => ((u as { role?: string }).role || "CUSTOMER") !== "ADMIN")
    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching customers:", error)
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 })
  }
}
