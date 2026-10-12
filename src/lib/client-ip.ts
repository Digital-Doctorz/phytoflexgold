// AF-4: client IP for rate limiting, taken from the header the platform sets
// (Vercel sets x-real-ip and overwrites any client-supplied value). The first
// x-forwarded-for entry is client-controlled and is deliberately NOT used.
export interface HeaderGetter {
  get(name: string): string | null
}

export function platformClientIp(headers: HeaderGetter): string {
  const real = headers.get("x-real-ip")?.trim()
  return real ? real : "unknown"
}

// One shared bucket for every coupon path (/api/coupons/validate and the
// coupon branch of POST /api/orders), so alternating endpoints doesn't help.
export function couponRateLimitKey(headers: HeaderGetter): string {
  return `coupon:${platformClientIp(headers)}`
}

export const COUPON_RATE_LIMIT = { limit: 10, windowMs: 60_000 }
