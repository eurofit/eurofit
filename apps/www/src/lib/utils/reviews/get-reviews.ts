import "server-only"

import { REVIEWS_PER_PAGE } from "@/const/reviews"
import { captureError } from "@/lib/observability/capture-error"
import { User } from "@/payload-types"
import { ActionResult } from "@/types/action-result"
import { ReviewListPage } from "@/types/review"
import config from "@payload-config"
import { getPayload } from "payload"
import { z } from "zod"

const options = z.object({
  productVariant: z.uuid(),
  page: z
    .number()
    .optional()
    .default(1)
    .pipe(z.transform((val) => Math.max(1, val))),
  limit: z
    .number()
    .optional()
    .default(REVIEWS_PER_PAGE)
    .pipe(z.transform((val) => Math.max(1, val))),
})

export type GetReviewsOptions = z.input<typeof options>

export type GetReviewsData = ReviewListPage

/** Builds a privacy-friendly display name: first name + last initial. */
function resolveAuthorName(user: string | User): string {
  if (typeof user === "string") return "Verified buyer"
  const lastInitial = user.lastName ? `${user.lastName.charAt(0)}.` : ""
  return (
    [user.firstName, lastInitial].filter(Boolean).join(" ").trim() ||
    "Verified buyer"
  )
}

export async function getReviews(
  opts: GetReviewsOptions
): Promise<ActionResult<GetReviewsData>> {
  try {
    const { productVariant, page, limit } = options.parse(opts)

    const payload = await getPayload({ config })

    const {
      docs,
      totalDocs: totalReviews,
      hasNextPage,
      page: responsePage,
      totalPages,
    } = await payload.find({
      collection: "product-reviews",
      where: {
        productVariant: { equals: productVariant },
        isActive: { equals: true },
      },
      sort: "-createdAt",
      depth: 1,
      page,
      limit,
      select: {
        rating: true,
        message: true,
        createdAt: true,
        user: true,
      },
    })

    return {
      success: true,
      data: {
        reviews: docs.map((doc) => ({
          id: doc.id,
          author: resolveAuthorName(doc.user),
          rating: doc.rating,
          message: doc.message ?? null,
          createdAt: doc.createdAt,
        })),
        totalReviews,
        hasNextPage,
        page: responsePage ?? page,
        totalPages,
      },
    }
  } catch (error) {
    captureError(error, { scope: "reviews.get" })
    return { success: false, code: 500, message: "Failed to load reviews." }
  }
}
