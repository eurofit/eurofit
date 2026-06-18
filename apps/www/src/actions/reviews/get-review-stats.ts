"use server"

import { getVariantReviewStats } from "@/lib/utils/reviews/get-variant-review-stats"
import { ActionResult } from "@/types/action-result"
import { ReviewStats } from "@/types/review"
import { z } from "zod"

export async function getReviewStats(
  productVariantId: string
): Promise<ActionResult<ReviewStats>> {
  try {
    const id = z.uuid().parse(productVariantId)
    const stats = await getVariantReviewStats(id)

    return { success: true, data: stats }
  } catch {
    return {
      success: false,
      code: 500,
      message: "Failed to load review stats.",
    }
  }
}
