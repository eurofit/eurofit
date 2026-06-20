import type { ProductVariant as PayloadProductVariant } from "@/payload-types"
import type { VariantDiscount } from "@/types/product-variant"

/**
 * Normalizes the loosely-typed virtual `discount` group returned by Payload into the
 * strict frontend `VariantDiscount` shape, or `null` when no discount is present.
 */
export function normalizeVariantDiscount(
  discount: PayloadProductVariant["discount"]
): VariantDiscount | null {
  if (
    !discount ||
    discount.price === null ||
    discount.price === undefined ||
    !discount.type ||
    discount.amount === null ||
    discount.amount === undefined
  ) {
    return null
  }

  return {
    price: discount.price,
    type: discount.type,
    amount: discount.amount,
    endDate: discount.endDate ?? null,
  }
}
