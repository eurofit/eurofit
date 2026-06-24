import type { SearchProductResult } from "@/lib/utils/products/search-product-suggestions"

export type { SearchProductResult }

type Args = {
  query: string
  limit?: number
}

export async function searchProductSuggestions({
  query,
  limit,
}: Args): Promise<SearchProductResult> {
  const params = new URLSearchParams({ q: query })
  if (limit != null) params.set("limit", String(limit))

  const res = await fetch(
    `/api/products/search-suggestions?${params.toString()}`
  )

  if (!res.ok) throw new Error("Failed to search products.")

  return (await res.json()) as SearchProductResult
}
