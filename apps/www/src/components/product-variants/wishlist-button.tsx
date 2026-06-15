"use client"

import { toggleWishlist } from "@/actions/wishlists"
import { Button } from "@eurofit/ui/components/button"
import { cn } from "@eurofit/ui/lib/utils"
import { Heart } from "lucide-react"
import Link from "next/link"
import * as React from "react"

type WishlistButtonProps = {
  currentUserId: string | undefined
  variantId: string
  isWishlisted: boolean
}

export function WishlistButton({
  currentUserId,
  variantId,
  isWishlisted,
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
      await toggleWishlist({
        currentUserId,
        isWishlisted,
        variantId,
      })
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
