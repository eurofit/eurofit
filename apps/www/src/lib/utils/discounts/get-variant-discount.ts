import { computeDiscountedPrice } from "@/lib/utils/discounts/compute-discounted-price"
import config from "@payload-config"
import { getPayload, type PayloadRequest } from "payload"

export type VariantDiscount = {
  /** Discounted price in KES (non-negative integer). */
  price: number
  /** The kind of "amount off" applied. */
  type: "percentage" | "fixed"
  /** The raw discount value (percent for "percentage", KES for "fixed"). */
  amount: number
  /** When the discount stops, if it has an end date. */
  endDate?: string | null
}

type Args = {
  variantId: string
  retailPrice: number | null | undefined
  req?: PayloadRequest
}

/**
 * Resolves the best active automatic "amount off products" discount for a product
 * variant and returns the resulting discounted price, or `null` when none applies.
 *
 * v1 scope: only `discountMethod = "automatic"`, `eligibility = "all"`, and
 * `productDiscountType = "amount_off"` discounts that are active and within their
 * date window are considered. When several apply, the one yielding the lowest price
 * (best for the customer) wins.
 */
export async function getVariantDiscount({
  variantId,
  retailPrice,
  req,
}: Args): Promise<VariantDiscount | null> {
  if (retailPrice === null || retailPrice === undefined) return null

  const payload = await getPayload({ config })
  const now = new Date().toISOString()

  const { docs: discounts } = await payload.find({
    collection: "discounts",
    overrideAccess: true,
    req,
    depth: 0,
    pagination: false,
    where: {
      and: [
        { isActive: { equals: true } },
        { discountTarget: { equals: "product" } },
        { productDiscountType: { equals: "amount_off" } },
        { discountMethod: { equals: "automatic" } },
        { eligibility: { equals: "all" } },
        { eligibleVariants: { in: [variantId] } },
        { startDate: { less_than_equal: now } },
        {
          or: [
            { endDate: { exists: false } },
            { endDate: { greater_than: now } },
          ],
        },
      ],
    },
  })

  let best: VariantDiscount | null = null

  for (const discount of discounts) {
    if (
      !discount.valueType ||
      discount.discountAmount === null ||
      discount.discountAmount === undefined
    ) {
      continue
    }

    const price = computeDiscountedPrice(
      retailPrice,
      discount.valueType,
      discount.discountAmount
    )

    if (best === null || price < best.price) {
      best = {
        price,
        type: discount.valueType,
        amount: discount.discountAmount,
        endDate: discount.endDate ?? null,
      }
    }
  }

  return best
}
