import type { SearchBrandData } from "@/lib/utils/brands/search-brand"

export type FetchBrandsSearchResult = SearchBrandData

export async function searchBrand(q: string): Promise<FetchBrandsSearchResult> {
  const params = new URLSearchParams({ q })

  const res = await fetch(`/api/brands/search?${params.toString()}`)

  if (!res.ok) {
    const error = (await res.json().catch(() => null)) as {
      message?: string
    } | null

    throw new Error(error?.message ?? "Failed to search brands.")
  }

  return (await res.json()) as FetchBrandsSearchResult
}
