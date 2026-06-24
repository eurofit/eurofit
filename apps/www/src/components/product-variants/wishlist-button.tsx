"use client"

import { toggleWishlist } from "@/actions/wishlists"
import {
  useWishlistStatus,
  wishlistKeys,
} from "@/components/product-variants/use-wishlist-status"
import { sendAddToWishlistEvent } from "@/lib/analytics/ecommerce/add-to-wishlist"
import { sendRemoveFromWishlistEvent } from "@/lib/analytics/ecommerce/remove-from-wishlist"
import type { GTMItem } from "@/lib/analytics/ecommerce/to-gtm-item"
import { WishlistStatus } from "@/types/wishlist"
import { Button } from "@eurofit/ui/components/button"
import { cn } from "@eurofit/ui/lib/utils"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Heart } from "lucide-react"
import Link from "next/link"

type WishlistButtonProps = {
  variantId: string
  gtmItem?: GTMItem
}

export function WishlistButton({ variantId, gtmItem }: WishlistButtonProps) {
  const queryClient = useQueryClient()
  const { data, isPending } = useWishlistStatus(variantId)

  const isWishlisted = data?.isWishlisted ?? false

  const { mutate: toggle } = useMutation({
    mutationFn: () => toggleWishlist({ variantId, isWishlisted }),
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: wishlistKeys.status(variantId),
      })
      const previous = queryClient.getQueryData<WishlistStatus>(
        wishlistKeys.status(variantId)
      )
      queryClient.setQueryData<WishlistStatus>(
        wishlistKeys.status(variantId),
        (current) =>
          current
            ? { ...current, isWishlisted: !current.isWishlisted }
            : current
      )
      return { previous, wasWishlisted: isWishlisted }
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          wishlistKeys.status(variantId),
          context.previous
        )
      }
    },
    onSuccess: (result, _variables, context) => {
      if (!result.success || !gtmItem) return
      if (context?.wasWishlisted) {
        sendRemoveFromWishlistEvent({ item: gtmItem })
      } else {
        sendAddToWishlistEvent({ item: gtmItem })
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: wishlistKeys.status(variantId),
      })
    },
  })

  // Until the per-user state resolves, render a neutral, non-committal heart.
  if (isPending) {
    return (
      <Button
        variant="outline"
        size="icon-lg"
        aria-label="Add to wishlist"
        disabled
      >
        <Heart className="size-6 fill-transparent text-foreground" />
      </Button>
    )
  }

  if (!data?.isAuthenticated) {
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

  return (
    <Button
      variant="outline"
      size="icon-lg"
      aria-label="Add to wishlist"
      onClick={() => toggle()}
    >
      <Heart
        className={cn("size-6 fill-transparent text-foreground", {
          "fill-rose-500 text-rose-500": isWishlisted,
        })}
      />
    </Button>
  )
}
