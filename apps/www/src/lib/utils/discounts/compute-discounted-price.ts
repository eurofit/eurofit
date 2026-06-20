import type { Discount } from "@/payload-types"

type ValueType = NonNullable<Discount["valueType"]>

/**
 * Applies an "amount off" discount to a retail price and returns the discounted
 * price as a non-negative integer (KES). Percentage discounts subtract a share of
 * the price; fixed discounts subtract an absolute KES amount. The result is clamped
 * at zero so a discount can never produce a negative price.
 *
 * @example
 * computeDiscountedPrice(1000, "percentage", 20) // 800
 * computeDiscountedPrice(1000, "fixed", 1500)    // 0
 */
export function computeDiscountedPrice(
  retailPrice: number,
  valueType: ValueType,
  amount: number
): number {
  const discounted =
    valueType === "percentage"
      ? retailPrice * (1 - amount / 100)
      : retailPrice - amount

  return Math.max(0, Math.round(discounted))
}
