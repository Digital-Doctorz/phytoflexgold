import { NextResponse } from "next/server"
import { NextRequest } from "next/server"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://phytoflexgold.vercel.app"
const INDEXNOW_KEY = process.env.INDEXNOW_KEY || ""

async function submitToIndexNow(urls: string[]): Promise<{ success: boolean; error?: string }> {
  if (!INDEXNOW_KEY) {
    return { success: false, error: "INDEXNOW_KEY not configured" }
  }

  const host = new URL(siteUrl).hostname

  try {
    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host,
        key: INDEXNOW_KEY,
        keyLocation: `${siteUrl}/${INDEXNOW_KEY}.txt`,
        urlList: urls,
      }),
    })

    if (response.ok || response.status === 202) {
      return { success: true }
    }
    return { success: false, error: `IndexNow returned ${response.status}` }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { urls } = body as { urls?: string[] }

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json({ error: "urls array is required" }, { status: 400 })
    }

    const normalizedUrls = urls.map((url: string) => {
      if (url.startsWith("/")) return `${siteUrl}${url}`
      return url
    })

    const result = await submitToIndexNow(normalizedUrls)

    if (result.success) {
      return NextResponse.json({ success: true, submitted: normalizedUrls.length })
    }
    return NextResponse.json({ error: result.error }, { status: 500 })
  } catch (error) {
    console.error("IndexNow error:", error)
    return NextResponse.json({ error: "Failed to submit to IndexNow" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    configured: !!process.env.INDEXNOW_KEY,
    siteUrl,
  })
}
