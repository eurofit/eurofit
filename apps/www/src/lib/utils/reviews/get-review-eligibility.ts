import "server-only"

import { getCurrentUser } from "@/actions/auth/get-current-user"
import { captureError } from "@/lib/observability/capture-error"
import { hasPurchasedVariant } from "@/lib/utils/reviews/has-purchased-variant"
import { ActionResult } from "@/types/action-result"
import { ReviewEligibility } from "@/types/review"
import config from "@payload-config"
import { getPayload } from "payload"
import { z } from "zod"

export async function getReviewEligibility(
  productVariantId: string
): Promise<ActionResult<ReviewEligibility>> {
  try {
    const id = z.uuid().parse(productVariantId)
    const user = await getCurrentUser()

    if (!user) {
      return {
        success: true,
        data: { isAuthenticated: false, canReview: false, hasReviewed: false },
      }
    }

    const payload = await getPayload({ config })

    const [{ totalDocs: reviewCount }, didPurchaseVariant] = await Promise.all([
      payload.count({
        collection: "product-reviews",
        where: {
          user: { equals: user.id },
          productVariant: { equals: id },
        },
      }),
      hasPurchasedVariant({ userId: user.id, productVariantId: id }),
    ])

    const hasReviewed = reviewCount > 0

    return {
      success: true,
      data: {
        isAuthenticated: true,
        canReview: didPurchaseVariant && !hasReviewed,
        hasReviewed,
      },
    }
  } catch (error) {
    captureError(error, { scope: "reviews.eligibility" })
    return {
      success: false,
      code: 500,
      message: "Failed to check review eligibility.",
    }
  }
}
