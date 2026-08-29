import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price)
}

export interface FirestoreDateObject {
  _seconds?: number
  _nanoseconds?: number
}

export function toDate(value: Date | string | number | FirestoreDateObject | null | undefined): Date | null {
  if (value == null) return null
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value
  if (typeof value === "number") {
    const d = new Date(value)
    return Number.isNaN(d.getTime()) ? null : d
  }
  if (typeof value === "string") {
    const d = new Date(value)
    return Number.isNaN(d.getTime()) ? null : d
  }
  if (typeof value === "object" && typeof value._seconds === "number") {
    const d = new Date(value._seconds * 1000)
    return Number.isNaN(d.getTime()) ? null : d
  }
  return null
}

export function formatDate(date: Date | string | number | FirestoreDateObject | null | undefined): string {
  const d = toDate(date)
  if (!d) return "—"
  return d.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function formatDateTime(date: Date | string | number | FirestoreDateObject | null | undefined): string {
  const d = toDate(date)
  if (!d) return "—"
  return d.toLocaleString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}
