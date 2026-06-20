"use server"

import { getCurrentUser } from "@/actions/auth/get-current-user"
import { env } from "@/env.mjs"
import { captureError } from "@/lib/observability/capture-error"
import {
  CreateReview,
  createReviewSchema,
} from "@/lib/schemas/reviews/create-review"
import { verifyTurnstile } from "@/lib/utils/verify-turnstile"
import { ProductReview } from "@/payload-types"
import { ActionResult } from "@/types/action-result"
import config from "@payload-config"
import { APIError, getPayload } from "payload"

export async function createReview(
  unsafeReview: CreateReview,
  turnstileToken: string
): Promise<ActionResult<ProductReview>> {
  const isTurnstileValid = await verifyTurnstile(
    turnstileToken,
    env.CLOUDFLARE_TURNSTILE_INVISIBLE_SECRET_KEY
  )
  if (!isTurnstileValid) {
    return {
      success: false,
      code: 400,
      message: "CAPTCHA validation failed. Please try again.",
    }
  }

  const parsed = createReviewSchema.safeParse(unsafeReview)
  if (!parsed.success) {
    return { success: false, code: 400, message: "Invalid input." }
  }

  try {
    const user = await getCurrentUser()
    if (!user) {
      return {
        success: false,
        code: 401,
        message: "You must be signed in to write a review.",
      }
    }

    const payload = await getPayload({ config })

    // overrideAccess:false + user runs collection access and the beforeChange
    // purchase gate; the unique index blocks a second review per variant.
    const review = await payload.create({
      collection: "product-reviews",
      data: {
        user: user.id,
        productVariant: parsed.data.productVariant,
        rating: parsed.data.rating,
        message: parsed.data.message,
        // Field-level access strips this for non-admins; the default (true) applies.
        isActive: true,
      },
      user: user,
      overrideAccess: false,
      draft: false,
    })

    return { success: true, data: review }
  } catch (err) {
    if (err instanceof APIError && err.isPublic) {
      return { success: false, code: err.status, message: err.message }
    }
    // Public APIErrors above are the expected purchase-gate/duplicate failures;
    // anything else is unexpected and must be captured.
    captureError(err, { scope: "reviews.create" })
    return {
      success: false,
      code: 400,
      message: "We couldn't submit your review. Please try again.",
    }
  }
}
