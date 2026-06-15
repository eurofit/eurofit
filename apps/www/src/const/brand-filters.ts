/**
 * Single source of truth for the brand storefront's filter/sort query string.
 *
 * Every filter group the brand page renders maps 1:1 to a URL query key here.
 * Sharing these constants keeps the parser, the action, and the filter UI in
 * sync — there is no `"brand"` key because the brand page never filters by
 * brand (the brand is already fixed by the route slug).
 */
export const BRAND_FILTER_KEYS = ["category", "size", "flavour-colour"] as const

export type BrandFilterKey = (typeof BRAND_FILTER_KEYS)[number]

/** Carries the sort direction (managed by the product sort dropdown). */
export const SORT_QUERY_KEY = "title"

/** Carries the 1-based page number for pagination. */
export const PAGE_QUERY_KEY = "page"

export const BRAND_PRODUCTS_PER_PAGE = 15

export const PRODUCT_SORT_OPTIONS = [
  { label: "Product Name: A-Z", value: "asc" },
  { label: "Product Name: Z-A", value: "desc" },
] as const
