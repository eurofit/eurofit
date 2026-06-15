export const CATEGORY_FILTER_KEYS = ["brand", "size", "flavour-colour"] as const

export type CategoryFilterKey = (typeof CATEGORY_FILTER_KEYS)[number]

export const SORT_QUERY_KEY = "title"

export const PAGE_QUERY_KEY = "page"

export const CATEGORY_PRODUCTS_PER_PAGE = 15

export const PRODUCT_SORT_OPTIONS = [
  { label: "Product Name: A-Z", value: "asc" },
  { label: "Product Name: Z-A", value: "desc" },
] as const
