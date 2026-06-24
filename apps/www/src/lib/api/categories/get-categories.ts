import type { GetCategoriesData } from "@/lib/utils/categories/get-categories"

export type FetchCategoriesResult = GetCategoriesData

type FetchCategoriesParams = {
  page: number
  limit: number
}

export async function fetchCategories({
  page,
  limit,
}: FetchCategoriesParams): Promise<FetchCategoriesResult> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  })

  const res = await fetch(`/api/categories?${params.toString()}`)

  if (!res.ok) {
    throw new Error("Failed to load categories.")
  }

  return res.json() as Promise<FetchCategoriesResult>
}
