import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isAdminRoute = pathname.startsWith("/admin")
  const isAuthRoute = pathname.startsWith("/auth")

  if (isAdminRoute && !request.cookies.get("__session")) {
    const loginUrl = new URL("/auth/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  if ((pathname === "/auth/login" || pathname === "/auth/register") && request.cookies.get("__session")) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/auth/:path*"],
}
