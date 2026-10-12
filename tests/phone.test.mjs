import { test } from "node:test"
import assert from "node:assert/strict"
import { normalizeIndianPhone } from "../src/lib/phone.ts"

const E = "+919812345678"
test("JC-2 phone normalisation: accepted formats", () => {
  for (const f of [
    "9812345678", "09812345678", "+91 9812345678", "+919812345678", "91-9812345678",
    "919812345678", "98123 45678", "98-1234-5678", " +91 98123-45678 ", "0091 98123 45678",
    "(+91) 98123.45678", "+91-98123-45678",
  ]) assert.equal(normalizeIndianPhone(f), E, f)
})
test("JC-2 phone normalisation: invalid input", () => {
  for (const f of [
    "", "   ", "12345", "5812345678", "981234567", "98123456789", "+1 9812345678",
    "+44 7912345678", "98123abc78", "9812345678+", "+91+9812345678", "0912345678",
    null, undefined, 9812345678,
  ]) assert.equal(normalizeIndianPhone(f), null, String(f))
})
test("all equivalent formats collapse to one key", () => {
  const set = new Set(["9812345678", "098123 45678", "+91-98123-45678"].map(normalizeIndianPhone))
  assert.equal(set.size, 1)
})
