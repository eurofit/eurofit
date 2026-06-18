import config from "@payload-config"
import { getPayload, type PayloadRequest } from "payload"

type Args = {
  userId: string
  productVariantId: string
  req?: PayloadRequest
}

/**
 * Returns whether the user has a paid order containing the given variant.
 * Drives both the review purchase gate and the "can review" eligibility check.
 */
export async function hasPurchasedVariant({
  userId,
  productVariantId,
  req,
}: Args): Promise<boolean> {
  const payload = await getPayload({ config })

  const { totalDocs } = await payload.count({
    collection: "orders",
    where: {
      user: { equals: userId },
      paymentStatus: { equals: "paid" },
      "items.productVariant": { equals: productVariantId },
    },
    overrideAccess: true,
    req,
  })

  return totalDocs > 0
}
