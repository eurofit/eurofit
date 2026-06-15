import { PAGE_QUERY_KEY, SORT_QUERY_KEY } from "@/const/brand-filters"
import { SEARCH_QUERY_KEY } from "@/const/search-filters"
import { castArray } from "lodash-es"

export type SearchSortDirection = "asc" | "desc"

export type ProductSearchParams = {
  q: string
  page: number
  sortDirection: SearchSortDirection
  brand: string[]
  category: string[]
  size: string[]
  flavourColour: string[]
}

type RawSearchParams = {
  [key: string]: string | string[] | undefined
}

const decode = (value: string) => decodeURIComponent(value)

/**
 * Normalises the raw search query string into a typed shape. The sort direction
 * lives under the `title` key (managed by the product sort dropdown). `size` and
 * `flavour-colour` values are stored URL-encoded by the filter items, so they
 * are decoded here before reaching the data layer.
 */
export function parseSearchParams(sp: RawSearchParams): ProductSearchParams {
  const rawQuery = sp[SEARCH_QUERY_KEY]
  const rawPage = sp[PAGE_QUERY_KEY]

  const q = (Array.isArray(rawQuery) ? rawQuery[0] : rawQuery)?.trim() ?? ""

  return {
    q,
    page: typeof rawPage === "string" ? Math.max(1, Number(rawPage)) : 1,
    sortDirection: sp[SORT_QUERY_KEY] === "desc" ? "desc" : "asc",
    brand: castArray(sp.brand ?? []),
    category: castArray(sp.category ?? []),
    size: castArray(sp.size ?? []).map(decode),
    flavourColour: castArray(sp["flavour-colour"] ?? []).map(decode),
  }
}
