"use client"

import { toggleWishlist } from "@/actions/wishlists"
import { sendRemoveFromWishlistEvent } from "@/lib/analytics/ecommerce/remove-from-wishlist"
import { toGTMItem } from "@/lib/analytics/ecommerce/to-gtm-item"
import { WishlistItem } from "@/types/wishlist"
import { Badge } from "@eurofit/ui/components/badge"
import { Button } from "@eurofit/ui/components/button"
import { cn } from "@eurofit/ui/lib/utils"
import { Heart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import * as React from "react"

type WishlistCardProps = {
  item: WishlistItem
  currentUserId: string
}

export function WishlistCard({ item, currentUserId }: WishlistCardProps) {
  const [optimisticRemoved, setOptimisticRemoved] = React.useOptimistic(false)

  const handleRemove = () => {
    React.startTransition(async () => {
      setOptimisticRemoved(true)
      const result = await toggleWishlist({
        currentUserId,
        variantId: item.variantId,
        isWishlisted: true,
      })
      if (result.success) {
        sendRemoveFromWishlistEvent({
          item: toGTMItem({
            slug: item.slug,
            productTitle: item.productTitle,
            price: item.price,
            discountedPrice: item.discountedPrice,
            brand: item.brand ?? null,
            variantLabel: item.title,
            categories: item.categories,
          }),
        })
      }
    })
  }

  if (optimisticRemoved) return null

  const hasDiscount =
    item.discountedPrice !== null && item.discountedPrice !== item.price

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-md">
      <Link
        href={`/products/${item.slug}`}
        className="relative aspect-square overflow-hidden bg-muted"
      >
        {item.image ? (
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No image
          </div>
        )}
        {item.isOutOfStock && (
          <Badge variant="secondary" className="absolute top-2 left-2 text-xs">
            Out of Stock
          </Badge>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <Link
          href={`/products/${item.slug}`}
          className="line-clamp-2 text-sm leading-snug font-medium hover:underline"
        >
          {item.title}
        </Link>

        <div className="mt-auto flex items-center justify-between gap-2">
          <div className="flex flex-col">
            {hasDiscount ? (
              <>
                <span className="text-sm font-semibold">
                  KES {item.discountedPrice?.toLocaleString()}
                </span>
                <span className="text-xs text-muted-foreground line-through">
                  KES {item.price?.toLocaleString()}
                </span>
              </>
            ) : item.price ? (
              <span className="text-sm font-semibold">
                KES {item.price.toLocaleString()}
              </span>
            ) : null}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="size-8 shrink-0 text-rose-500 hover:bg-rose-50 hover:text-rose-600"
            onClick={handleRemove}
            aria-label="Remove from wishlist"
          >
            <Heart className={cn("size-4", "fill-rose-500")} />
          </Button>
        </div>
      </div>
    </div>
  )
}
