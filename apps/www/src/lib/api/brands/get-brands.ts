import type { GetBrandsData } from "@/actions/brands/get-brands"

export type FetchBrandsResult = GetBrandsData

type FetchBrandsParams = {
  page: number
  limit: number
}

export async function fetchBrands({
  page,
  limit,
}: FetchBrandsParams): Promise<FetchBrandsResult> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  })

  const res = await fetch(`/api/brands?${params.toString()}`)

  if (!res.ok) {
    throw new Error("Failed to load brands.")
  }

  return res.json() as Promise<FetchBrandsResult>
}
