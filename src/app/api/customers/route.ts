import { NextResponse } from "next/server"
import { getAdminDb, serializeFirestoreData } from "@/lib/firebase-admin"

export async function GET() {
  try {
    const db = getAdminDb()
    const snapshot = await db.collection("users").orderBy("createdAt", "desc").get()
    const users = snapshot.docs.map((doc) => {
      const data = serializeFirestoreData(doc.data())
      const { passwordHash, ...safeData } = data
      return { id: doc.id, ...safeData }
    })
    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching customers:", error)
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 })
  }
}
