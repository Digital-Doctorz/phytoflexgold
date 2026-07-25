import { NextRequest, NextResponse } from "next/server"
import { rateLimit } from "@/lib/rate-limiter"

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  )
}

function isPrivateRoute(pathname: string): boolean {
  return (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/order-confirmation")
  )
}

function isApiRoute(pathname: string): boolean {
  return pathname.startsWith("/api")
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const res = NextResponse.next()

  // --- Security headers (all routes) ---
  res.headers.set("X-DNS-Prefetch-Control", "on")
  res.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload")
  res.headers.set("X-XSS-Protection", "1; mode=block")
  res.headers.set("X-Content-Type-Options", "nosniff")
  res.headers.set("X-Frame-Options", "DENY")
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  res.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()"
  )
  res.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https:; connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://*.firebaseapp.com wss://*.firebaseio.com; frame-src https://checkout.razorpay.com; base-uri 'self'; form-action 'self'"
  )

  // --- X-Robots-Tag on private routes ---
  if (isPrivateRoute(pathname)) {
    res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive, nosnippet")
  }

  // --- Rate limiting on API routes ---
  if (isApiRoute(pathname)) {
    const ip = getClientIp(req)
    const isAuthRoute =
      pathname.startsWith("/api/auth/login") ||
      pathname.startsWith("/api/auth/register")

    const limit = isAuthRoute ? 10 : 100
    const windowMs = isAuthRoute ? 15 * 60 * 1000 : 60 * 1000
    const { success, remaining, resetAt } = rateLimit(`${ip}:${pathname}`, limit, windowMs)

    res.headers.set("X-RateLimit-Limit", String(limit))
    res.headers.set("X-RateLimit-Remaining", String(remaining))
    res.headers.set("X-RateLimit-Reset", String(Math.ceil(resetAt / 1000)))

    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil((resetAt - Date.now()) / 1000)),
            "X-RateLimit-Limit": String(limit),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(Math.ceil(resetAt / 1000)),
          },
        }
      )
    }
  }

  return res
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*", "/auth/:path*", "/checkout", "/order-confirmation"],
}
