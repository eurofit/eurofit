/** Shared TanStack Query key for the current owner's cart. */
export const CART_QUERY_KEY = ["cart"] as const

/**
 * Shared mutation key for every cart write. Used both to serialize cart
 * mutations and to count in-flight writes so the settle refetch only fires once
 * the queue has drained.
 */
export const CART_MUTATION_KEY = ["cart", "mutate"] as const

/** Scope id that makes TanStack run cart mutations strictly one at a time. */
export const CART_MUTATION_SCOPE = "cart"
