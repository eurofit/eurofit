import { hasPurchasedVariant } from "@/lib/utils/reviews/has-purchased-variant"
import { ProductReview } from "@/payload-types"
import { APIError, CollectionBeforeChangeHook } from "payload"

/**
 * Reviews are only allowed for variants the customer has actually purchased.
 * Forces ownership server-side and rejects unverified reviews. The unique
 * `(user, productVariant)` index handles the "one review per variant" rule.
 */
export const validateCanReview: CollectionBeforeChangeHook<
  ProductReview
> = async ({ data, req, operation }) => {
  if (operation !== "create") return data

  const userId =
    (typeof req.user === "string" ? req.user : req.user?.id) ??
    (typeof data.user === "string" ? data.user : data.user?.id)

  if (!userId) {
    throw new APIError(
      "You must be signed in to write a review.",
      401,
      null,
      true
    )
  }

  const productVariantId =
    typeof data.productVariant === "string"
      ? data.productVariant
      : data.productVariant?.id

  if (!productVariantId) {
    throw new APIError("A product variant is required.", 400, null, true)
  }

  const didPurchaseVariant = await hasPurchasedVariant({
    userId,
    productVariantId,
    req,
  })

  if (!didPurchaseVariant) {
    throw new APIError(
      "You can only review products you have purchased.",
      403,
      null,
      true
    )
  }

  return { ...data, user: userId }
}
