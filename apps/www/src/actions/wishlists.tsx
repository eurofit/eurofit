"use server"

import { captureError } from "@/lib/observability/capture-error"
import { getPayloadImageUrl } from "@/lib/utils/payload-image"
import { resolveAvailableStock } from "@/lib/utils/stock/resolve-available-stock"
import { ActionResult } from "@/types/action-result"
import { WishlistItem } from "@/types/wishlist"
import config from "@payload-config"
import { getPayload } from "payload"
import { z } from "zod"

const toggleWishlistSchema = z.object({
  currentUserId: z.string().min(1),
  variantId: z.string().min(1),
  isWishlisted: z.boolean(),
})

type ToggleArgs = z.input<typeof toggleWishlistSchema>

export async function toggleWishlist(args: ToggleArgs): Promise<ActionResult> {
  const parsed = toggleWishlistSchema.safeParse(args)
  if (!parsed.success) {
    return { success: false, code: 400, message: "Invalid input." }
  }

  const { currentUserId, variantId, isWishlisted } = parsed.data

  try {
    const payload = await getPayload({ config })

    if (isWishlisted) {
      await payload.delete({
        collection: "wishlists",
        where: {
          productVariant: { equals: variantId },
          user: { equals: currentUserId },
        },
      })
    } else {
      await payload.create({
        collection: "wishlists",
        data: { productVariant: variantId, user: currentUserId },
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

const wishlistItemsSchema = z.object({ userId: z.uuid() })

export async function getWishlistItems(
  args: z.input<typeof wishlistItemsSchema>
): Promise<WishlistItem[]> {
  const parsed = wishlistItemsSchema.safeParse(args)
  if (!parsed.success) return []

  try {
    const payload = await getPayload({ config })

    const { docs } = await payload.find({
      collection: "wishlists",
      where: { user: { equals: parsed.data.userId } },
      depth: 3,
      limit: 50,
      sort: "-createdAt",
    })

    return docs.flatMap((doc) => {
      const variant = doc.productVariant
      if (typeof variant !== "object" || !variant) return []

      const product =
        typeof variant.product === "object" ? variant.product : null
      const productSlug = product?.slug ?? null
      const slug = productSlug ? `${productSlug}/${variant.slug}` : variant.slug

      const firstImage = Array.isArray(variant.images)
        ? variant.images[0]
        : undefined
      const image = getPayloadImageUrl(firstImage)

      const stock = resolveAvailableStock(variant.stock, variant.supplierStock)

      const brand =
        typeof product?.brand === "object" && product.brand
          ? (product.brand.title as string | undefined)
          : undefined

      const categories = Array.isArray(product?.categories)
        ? product.categories.flatMap((cat) =>
            typeof cat === "object" && cat && "title" in cat
              ? [cat.title as string]
              : []
          )
        : []

      return [
        {
          id: doc.id,
          variantId: variant.id,
          title: variant.title,
          productTitle: product?.title ?? variant.title,
          slug,
          price: variant.retailPrice ?? null,
          discountedPrice: null,
          image,
          isOutOfStock: stock === 0,
          brand,
          categories,
        } satisfies WishlistItem,
      ]
    })
  } catch (error) {
    captureError(error, { scope: "wishlists.get-items" })
    return []
  }
}
