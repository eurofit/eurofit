import "server-only"

import { getCurrentUser } from "@/actions/auth/get-current-user"
import { captureError } from "@/lib/observability/capture-error"
import { WishlistStatus } from "@/types/wishlist"
import config from "@payload-config"
import { getPayload } from "payload"
import { z } from "zod"

/**
 * Per-user wishlist state for a single variant. Resolves the user from the
 * session so it can back a client-side query without trusting client input.
 * Returns `isAuthenticated: false` for guests rather than erroring. This is a
 * read, so it lives as a util (not a Server Action) and is called from the
 * `/api/wishlist/status` route.
 */
export async function getWishlistStatus(
  productVariantId: string
): Promise<WishlistStatus> {
  const parsed = z.uuid().safeParse(productVariantId)
  if (!parsed.success) return { isAuthenticated: false, isWishlisted: false }

  const user = await getCurrentUser()
  if (!user) return { isAuthenticated: false, isWishlisted: false }

  try {
    const payload = await getPayload({ config })

    const { totalDocs } = await payload.count({
      collection: "wishlists",
      where: {
        user: { equals: user.id },
        productVariant: { equals: parsed.data },
      },
    })

    return { isAuthenticated: true, isWishlisted: totalDocs > 0 }
  } catch (error) {
    captureError(error, { scope: "wishlists.status" })
    return { isAuthenticated: true, isWishlisted: false }
  }
}
