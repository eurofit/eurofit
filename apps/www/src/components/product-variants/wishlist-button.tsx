"use client"

import { toggleWishlist } from "@/actions/wishlists"
import { sendAddToWishlistEvent } from "@/lib/analytics/ecommerce/add-to-wishlist"
import { sendRemoveFromWishlistEvent } from "@/lib/analytics/ecommerce/remove-from-wishlist"
import type { GTMWishlistItem } from "@/lib/analytics/ecommerce/to-gtm-wishlist-item"
import { Button } from "@eurofit/ui/components/button"
import { cn } from "@eurofit/ui/lib/utils"
import { Heart } from "lucide-react"
import Link from "next/link"
import * as React from "react"

type WishlistButtonProps = {
  currentUserId: string | undefined
  variantId: string
  isWishlisted: boolean
  gtmItem?: GTMWishlistItem
}

export function WishlistButton({
  currentUserId,
  variantId,
  isWishlisted,
  gtmItem,
}: WishlistButtonProps) {
  const [optimisticIsWishlisted, setOptimisticIsWishlisted] =
    React.useOptimistic(isWishlisted)

  if (!currentUserId) {
    return (
      <Button
        variant="outline"
        size="icon-lg"
        aria-label="Add to wishlist"
        asChild
      >
        <Link href="/login">
          <Heart className="size-6 fill-transparent text-foreground" />
        </Link>
      </Button>
    )
  }

  const handleClick = () => {
    React.startTransition(async () => {
      setOptimisticIsWishlisted((prev) => !prev)
      const result = await toggleWishlist({
        currentUserId,
        isWishlisted,
        variantId,
      })
      if (result.success && gtmItem) {
        if (isWishlisted) {
          sendRemoveFromWishlistEvent({ item: gtmItem })
        } else {
          sendAddToWishlistEvent({ item: gtmItem })
        }
      }
    })
  }

  return (
    <Button
      variant="outline"
      size="icon-lg"
      aria-label="Add to wishlist"
      onClick={handleClick}
    >
      <Heart
        className={cn("size-6 fill-transparent text-foreground", {
          "fill-rose-500 text-rose-500": optimisticIsWishlisted,
        })}
      />
    </Button>
  )
}
