"use server"

import config from "@payload-config"
import { getPayload } from "payload"

type Args = {
  currentUserId: string
  variantId: string
  isWishlisted: boolean
}

export async function toggleWishlist({
  currentUserId,
  variantId,
  isWishlisted,
}: Args) {
  const payload = await getPayload({
    config,
  })

  if (!currentUserId) {
    throw new Error("User must be logged in to toggle wishlist")
  }

  if (!variantId) {
    throw new Error("Variant ID is required to toggle wishlist")
  }

  if (isWishlisted) {
    await payload.delete({
      collection: "wishlists",
      where: {
        productVariant: {
          equals: variantId,
        },
        user: {
          equals: currentUserId,
        },
      },
    })
    return
  }

  await payload.create({
    collection: "wishlists",
    data: {
      productVariant: variantId,
      user: currentUserId,
    },
    draft: false,
  })
}
