// JODO10 seed record. Written to Firestore coupons/JODO10 by
// scripts/create-coupon-jodo10.mjs, INACTIVE. Only percent (10, DD's request
// in the WEBARCHITECT package) is decided; every other term is TODO-DD and the
// values below are the package's suggested defaults, not decisions.
export const JODO10_SEED = {
  code: "JODO10",
  percent: 10, // DD request ("10% code") per WEBARCHITECT package
  active: false, // created inactive; DD says start → admin sets true
  startsAt: null as string | null, // TODO-DD (DD-1): start date, e.g. "2026-10-13T00:00:00+05:30"
  expiresAt: "2026-11-30T23:59:59+05:30" as string | null, // TODO-DD (DD-1): package default 30 Nov 2026 23:59 IST
  perCustomerLimit: 1, // TODO-DD (DD-2): default 1 per phone AND 1 per email
  maxUses: 500 as number | null, // TODO-DD (DD-7): default 500 total
  usedCount: 0,
  eligibleTierIds: [] as string[], // TODO-DD (DD-3): set tier ids on the product doc first (10-days / 1-month / 3-months)
  eligiblePrices: [810, 2100, 5900], // TODO-DD (DD-3): fallback match on server tier price; all 3 packs by default
  maxDiscountRupees: null as number | null, // TODO-DD: cap (not in package; no cap by default)
  stacksWithOtherCodes: false, // DD-5 default
  channel: "instagram_jodo", // DD-6 default: shared code by DM only
}
