"use client"

import { WishlistStatus } from "@/types/wishlist"
import { useQuery } from "@tanstack/react-query"

export const wishlistKeys = {
  status: (productVariantId: string) =>
    ["wishlist", "status", productVariantId] as const,
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) throw new Error("Request failed")
  return response.json() as Promise<T>
}

export function useWishlistStatus(productVariantId: string) {
  return useQuery({
    queryKey: wishlistKeys.status(productVariantId),
    queryFn: () =>
      fetchJson<WishlistStatus>(
        `/api/wishlist/status?productVariant=${productVariantId}`
      ),
  })
}
