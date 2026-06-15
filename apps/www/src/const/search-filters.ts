/**
 * Single source of truth for the search storefront's filter query string.
 *
 * Each filter group the search page renders maps 1:1 to a URL query key here.
 * Unlike the brand page (where the brand is fixed by the route slug), search
 * spans every brand, so it adds a `"brand"` group on top of the brand page's
 * category/size/flavour-colour groups.
 *
 * The sort (`SORT_QUERY_KEY`), page (`PAGE_QUERY_KEY`) and sort options are
 * generic across the storefront and reused from `@/const/brand-filters`.
 */
export const SEARCH_FILTER_KEYS = [
  "brand",
  "category",
  "size",
  "flavour-colour",
] as const

export type SearchFilterKey = (typeof SEARCH_FILTER_KEYS)[number]

/** Carries the search text query. */
export const SEARCH_QUERY_KEY = "q"

export const SEARCH_PRODUCTS_PER_PAGE = 15
