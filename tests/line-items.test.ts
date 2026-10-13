import { test } from "node:test"
import assert from "node:assert/strict"
import { lineAmountRupees, bottlesLabel, itemsSubtotalRupees, formatRupees } from "../src/lib/line-items"

test("CP-7: pack price shown once, not price × bottles", () => {
  assert.equal(lineAmountRupees({ price: 810, quantity: 1 }), 810)
  assert.equal(lineAmountRupees({ price: 2100, quantity: 3 }), 2100) // was 6300
  assert.equal(lineAmountRupees({ price: 5900, quantity: 9 }), 5900) // was 53100
  assert.equal(lineAmountRupees({ price: "2100", quantity: "3" }), 2100)
  assert.equal(lineAmountRupees({ price: undefined }), 0)
})
test("bottles label", () => {
  assert.equal(bottlesLabel({ quantity: 1 }), "× 1 bottle")
  assert.equal(bottlesLabel({ quantity: 3 }), "× 3 bottles")
  assert.equal(bottlesLabel({ quantity: 0 }), "× 1 bottle")
})
test("subtotal equals order.total for catalog orders; rupee formatting", () => {
  assert.equal(itemsSubtotalRupees([{ price: 2100, quantity: 3 }]), 2100)
  assert.equal(formatRupees(5900), "₹5,900")
})
