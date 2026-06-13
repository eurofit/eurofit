import type { Validate } from "payload"

export const validateRetailPrice: Validate<number | null | undefined> = (
  value
) => {
  if (value === null || value === undefined) return true
  if (!Number.isInteger(value) || value < 0) {
    return "Retail price must be a non-negative integer (KES)."
  }
  return true
}
