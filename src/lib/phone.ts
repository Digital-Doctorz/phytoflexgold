// Pure: normalise an Indian mobile number to E.164 "+91XXXXXXXXXX" (JC-2).
// Accepts 98xxxxxxxx, 098xxxxxxxx, +91 98..., 91-98..., 0091..., with spaces,
// dashes, dots or brackets. Returns null for anything else.
export function normalizeIndianPhone(input: unknown): string | null {
  if (typeof input !== "string") return null
  const trimmed = input.trim()
  if (trimmed === "" || !/^[+0-9\s\-().]+$/.test(trimmed)) return null
  const lead = trimmed.replace(/^\(+/, "") // allow "(+91) ..."
  if (lead.indexOf("+") > 0 || (lead.match(/\+/g) ?? []).length > 1) return null
  let digits = trimmed.replace(/\D/g, "")
  if (digits.length === 14 && digits.startsWith("0091")) digits = digits.slice(4)
  else if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2)
  else if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1)
  else if (lead.startsWith("+")) return null // +<other country> or malformed
  if (!/^[6-9]\d{9}$/.test(digits)) return null
  return `+91${digits}`
}
