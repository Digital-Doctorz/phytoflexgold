// Pure helpers for displaying order lines (admin + email). CP-7 / JC-1:
// OrderItem.price is the PACK price in rupees and OrderItem.quantity is the
// number of bottles in that pack, so the line amount is the pack price shown
// once, with "× N bottles" as descriptive text (never price × bottles).
export interface DisplayLineInput {
  productName?: string
  price?: number | string
  quantity?: number | string
}

export function lineAmountRupees(item: DisplayLineInput): number {
  const p = Number(item.price)
  return Number.isFinite(p) && p > 0 ? p : 0
}

export function bottlesLabel(item: DisplayLineInput): string {
  const q = Number(item.quantity)
  const n = Number.isInteger(q) && q > 0 ? q : 1
  return `× ${n} ${n === 1 ? "bottle" : "bottles"}`
}

export function itemsSubtotalRupees(items: DisplayLineInput[] | undefined): number {
  return (items ?? []).reduce((sum, i) => sum + lineAmountRupees(i), 0)
}

export function formatRupees(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`
}
