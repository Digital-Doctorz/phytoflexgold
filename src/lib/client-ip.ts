// AF-4 / C3-3: client IP for rate limiting, from what the platform sets:
//  1. x-real-ip (Vercel sets it and overwrites any client-supplied value);
//  2. else the LAST x-forwarded-for hop (appended by the platform proxy; the
//     earlier hops are client-controlled and are ignored);
//  3. else "unknown".
export interface HeaderGetter {
  get(name: string): string | null
}

export function platformClientIp(headers: HeaderGetter): string {
  const real = headers.get("x-real-ip")?.trim()
  if (real) return real
  const hops = (headers.get("x-forwarded-for") ?? "")
    .split(",")
    .map((h) => h.trim())
    .filter(Boolean)
  return hops.length > 0 ? hops[hops.length - 1] : "unknown"
}

// One shared bucket for every coupon path (/api/coupons/validate and the
// coupon branch of POST /api/orders), so alternating endpoints doesn't help.
export function couponRateLimitKey(headers: HeaderGetter): string {
  return `coupon:${platformClientIp(headers)}`
}

export const COUPON_RATE_LIMIT = { limit: 10, windowMs: 60_000 }
