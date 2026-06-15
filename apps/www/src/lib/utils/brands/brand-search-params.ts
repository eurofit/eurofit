import { PAGE_QUERY_KEY, SORT_QUERY_KEY } from "@/const/brand-filters"
import { castArray } from "lodash-es"

export type BrandSortDirection = "asc" | "desc"

export type BrandSearchParams = {
  page: number
  sortDirection: BrandSortDirection
  category: string[]
  size: string[]
  flavourColour: string[]
}

type RawSearchParams = {
  [key: string]: string | string[] | undefined
}

/**
 * Normalises the raw storefront query string into a typed shape. The sort
 * direction lives under the `title` key in the URL (managed by the product
 * sort dropdown); every other filter can appear multiple times.
 */
export function parseBrandSearchParams(sp: RawSearchParams): BrandSearchParams {
  const rawPage = sp[PAGE_QUERY_KEY]

  return {
    page: typeof rawPage === "string" ? Math.max(1, Number(rawPage)) : 1,
    sortDirection: sp[SORT_QUERY_KEY] === "desc" ? "desc" : "asc",
    category: castArray(sp.category ?? []),
    size: castArray(sp.size ?? []),
    flavourColour: castArray(sp["flavour-colour"] ?? []),
  }
}
