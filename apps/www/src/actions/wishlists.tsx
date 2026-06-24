"use server"

import { getCurrentUser } from "@/actions/auth/get-current-user"
import { captureError } from "@/lib/observability/capture-error"
import { ActionResult } from "@/types/action-result"
import config from "@payload-config"
import { getPayload } from "payload"
import { z } from "zod"

const toggleWishlistSchema = z.object({
  variantId: z.string().min(1),
  isWishlisted: z.boolean(),
})

type ToggleArgs = z.input<typeof toggleWishlistSchema>

export async function toggleWishlist(args: ToggleArgs): Promise<ActionResult> {
  const parsed = toggleWishlistSchema.safeParse(args)
  if (!parsed.success) {
    return { success: false, code: 400, message: "Invalid input." }
  }

  const user = await getCurrentUser()
  if (!user) {
    return { success: false, code: 401, message: "You must be signed in." }
  }

  const { variantId, isWishlisted } = parsed.data

  try {
    const payload = await getPayload({ config })

    if (isWishlisted) {
      await payload.delete({
        collection: "wishlists",
        where: {
          productVariant: { equals: variantId },
          user: { equals: user.id },
        },
      })
    } else {
      await payload.create({
        collection: "wishlists",
        data: { productVariant: variantId, user: user.id },
        draft: false,
      })
    }

    return { success: true, data: { ok: true } }
  } catch (error) {
    captureError(error, { scope: "wishlists.toggle" })
    return {
      success: false,
      code: 500,
      message: "Something went wrong. Please try again.",
    }
  }
}
