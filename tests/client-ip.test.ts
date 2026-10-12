import { test } from "node:test"
import assert from "node:assert/strict"
import { platformClientIp, couponRateLimitKey, COUPON_RATE_LIMIT } from "../src/lib/client-ip"
import { rateLimit } from "../src/lib/rate-limiter"

const h = (o: Record<string, string>) => ({ get: (n: string) => o[n.toLowerCase()] ?? null })

test("AF-4: key uses x-real-ip, ignores client x-forwarded-for", () => {
  assert.equal(platformClientIp(h({ "x-real-ip": "203.0.113.7", "x-forwarded-for": "1.2.3.4, 203.0.113.7" })), "203.0.113.7")
  assert.equal(platformClientIp(h({ "x-forwarded-for": "1.2.3.4" })), "unknown")
  assert.equal(couponRateLimitKey(h({ "x-real-ip": " 203.0.113.7 " })), "coupon:203.0.113.7")
})
test("AF-4: spoofed x-forwarded-for does not bypass the shared coupon limit", () => {
  const ip = "198.51.100." + Math.floor(Math.random() * 200)
  const results: boolean[] = []
  for (let i = 0; i < COUPON_RATE_LIMIT.limit + 2; i++) {
    const headers = h({ "x-real-ip": ip, "x-forwarded-for": `10.0.0.${i}` })
    results.push(rateLimit(couponRateLimitKey(headers), COUPON_RATE_LIMIT.limit, COUPON_RATE_LIMIT.windowMs).success)
  }
  assert.equal(results.filter(Boolean).length, COUPON_RATE_LIMIT.limit)
  assert.equal(results[COUPON_RATE_LIMIT.limit], false)
})
