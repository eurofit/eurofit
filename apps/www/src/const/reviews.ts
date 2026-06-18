/** Shared TanStack Query keys for product-variant reviews. */
export const reviewKeys = {
  all: ["reviews"] as const,
  stats: (productVariantId: string) =>
    ["reviews", "stats", productVariantId] as const,
  list: (productVariantId: string) =>
    ["reviews", "list", productVariantId] as const,
  eligibility: (productVariantId: string) =>
    ["reviews", "eligibility", productVariantId] as const,
}

/** Default page size for the review list. */
export const REVIEWS_PER_PAGE = 5
