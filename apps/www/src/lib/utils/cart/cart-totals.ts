import { normalizeVariantDiscount } from "@/lib/utils/discounts/normalize-variant-discount"
import type { FormattedCartItem } from "./formatCartItem"

export type CartTotals = {
  /** Sum of retail price × quantity across all lines (pre-discount). */
  subtotal: number
  /** Total savings from active automatic discounts across all lines. */
  discountTotal: number
  /** Net subtotal after discounts (`subtotal − discountTotal`). */
  total: number
}

/**
 * Derives the cart's display totals from its items. Mirrors the server-side order
 * formula in `set-order-totals.ts` so the figures shown in the cart match what the
 * order will charge: subtotal is the pre-discount sum, `discountTotal` aggregates the
 * per-line savings, and `total` is the net subtotal (delivery is added separately).
 */
export function computeCartTotals(items: FormattedCartItem[]): CartTotals {
  let subtotal = 0
  let discountTotal = 0

  for (const item of items) {
    const retailPrice = item.retailPrice ?? 0
    subtotal += retailPrice * item.quantity

    const discount = normalizeVariantDiscount(item.discount)
    if (discount) {
      discountTotal += (retailPrice - discount.price) * item.quantity
    }
  }

  return { subtotal, discountTotal, total: subtotal - discountTotal }
}
