import { PAGE_QUERY_KEY, SORT_QUERY_KEY } from "@/const/category-filters"
import { castArray } from "lodash-es"

export type CategorySortDirection = "asc" | "desc"

export type CategorySearchParams = {
  page: number
  sortDirection: CategorySortDirection
  brand: string[]
  size: string[]
  flavourColour: string[]
}

type RawSearchParams = {
  [key: string]: string | string[] | undefined
}

export function parseCategorySearchParams(
  sp: RawSearchParams
): CategorySearchParams {
  const rawPage = sp[PAGE_QUERY_KEY]

  return {
    page: typeof rawPage === "string" ? Math.max(1, Number(rawPage)) : 1,
    sortDirection: sp[SORT_QUERY_KEY] === "desc" ? "desc" : "asc",
    brand: castArray(sp.brand ?? []),
    size: castArray(sp.size ?? []),
    flavourColour: castArray(sp["flavour-colour"] ?? []),
  }
}
