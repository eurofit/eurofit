"use client"

import { WishlistItem } from "@/types/wishlist"
import { WishlistCard } from "./card"

type WishlistGridProps = {
  items: WishlistItem[]
  currentUserId: string
}

export function WishlistGrid({ items, currentUserId }: WishlistGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {items.map((item) => (
        <WishlistCard key={item.id} item={item} currentUserId={currentUserId} />
      ))}
    </div>
  )
}
