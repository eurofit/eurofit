import { getVariantDiscount } from "@/lib/utils/discounts/get-variant-discount"
import { ProductVariant } from "@/payload-types"
import { FieldHook } from "payload"

/**
 * Field-level `afterRead` hook for the virtual `discount` group. Resolves the best
 * active automatic "amount off" discount for this variant and returns the discounted
 * price details, or `null` when none applies. Relies on `retailPrice` being selected
 * (guaranteed by the collection's `forceSelect`).
 */
export const computeDiscount: FieldHook<
  ProductVariant,
  ProductVariant["discount"],
  ProductVariant
> = async ({ data, req }) => {
  if (
    !data?.id ||
    data.retailPrice === null ||
    data.retailPrice === undefined
  ) {
    return undefined
  }

  const discount = await getVariantDiscount({
    variantId: data.id,
    retailPrice: data.retailPrice,
    req,
  })

  return discount ?? undefined
}
