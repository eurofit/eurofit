import type { SearchBrandsData } from "@/actions/brands/search-brand"

export type FetchBrandsSearchResult = SearchBrandsData

export async function fetchBrandsSearch(
  q: string
): Promise<FetchBrandsSearchResult> {
  const params = new URLSearchParams({ q })

  const res = await fetch(`/api/brands/search?${params.toString()}`)

  if (!res.ok) {
    throw new Error("Failed to search brands.")
  }

  return res.json() as Promise<FetchBrandsSearchResult>
}
