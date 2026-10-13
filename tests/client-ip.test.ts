import { test } from "node:test"
import assert from "node:assert/strict"
import { platformClientIp, couponRateLimitKey, COUPON_RATE_LIMIT } from "../src/lib/client-ip"
import { rateLimit } from "../src/lib/rate-limiter"

const h = (o: Record<string, string>) => ({ get: (n: string) => o[n.toLowerCase()] ?? null })

test("AF-4: key uses x-real-ip, ignores client x-forwarded-for", () => {
  assert.equal(platformClientIp(h({ "x-real-ip": "203.0.113.7", "x-forwarded-for": "1.2.3.4, 203.0.113.7" })), "203.0.113.7")
  assert.equal(platformClientIp(h({})), "unknown")
  assert.equal(platformClientIp(h({ "x-forwarded-for": " , " })), "unknown")
  assert.equal(platformClientIp(h({ "x-real-ip": "  " , "x-forwarded-for": "9.9.9.9" })), "9.9.9.9")
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

test("C3-3: fallback order x-real-ip → last XFF hop (trimmed) → unknown", () => {
  assert.equal(platformClientIp(h({ "x-forwarded-for": "1.2.3.4" })), "1.2.3.4")
  assert.equal(platformClientIp(h({ "x-forwarded-for": "1.2.3.4,  203.0.113.9  " })), "203.0.113.9")
  assert.equal(platformClientIp(h({ "x-real-ip": "198.51.100.1", "x-forwarded-for": "1.2.3.4, 203.0.113.9" })), "198.51.100.1")
})
test("C3-3: spoofed first XFF hop does not change the key", () => {
  const a = couponRateLimitKey(h({ "x-forwarded-for": "10.0.0.1, 203.0.113.9" }))
  const b = couponRateLimitKey(h({ "x-forwarded-for": "66.66.66.66, 203.0.113.9" }))
  const c = couponRateLimitKey(h({ "x-forwarded-for": "1.1.1.1, 2.2.2.2, 203.0.113.9" }))
  assert.equal(a, "coupon:203.0.113.9")
  assert.equal(a, b)
  assert.equal(a, c)
})
