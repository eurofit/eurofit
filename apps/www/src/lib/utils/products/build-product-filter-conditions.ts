import { isEmpty } from "lodash-es"
import type { Where } from "payload"

type ProductFilterValues = {
  brand?: string[] | null
  category?: string[] | null
  size?: string[] | null
  flavourColour?: string[] | null
}

/**
 * Builds the Payload `Where` conditions for the storefront product filters. Each
 * group is returned as its own condition (callers decide whether to combine them
 * with `and` or `or`); values within a group are combined with `in` (OR).
 *
 * `brand` is optional because the brand page fixes the brand via the route slug
 * and never filters by it — only search passes a brand group. Category matches
 * either the product's own categories or a variant's category field.
 */
export function buildProductFilterConditions({
  brand,
  category,
  size,
  flavourColour,
}: ProductFilterValues): Where[] {
  const conditions: Where[] = []

  if (!isEmpty(brand)) {
    conditions.push({ "brand.slug": { in: brand } })
  }

  if (!isEmpty(category)) {
    conditions.push({
      or: [
        { "categories.slug": { in: category } },
        { "productVariants.category": { in: category } },
      ],
    })
  }

  if (!isEmpty(size)) {
    conditions.push({ "productVariants.size": { in: size } })
  }

  if (!isEmpty(flavourColour)) {
    conditions.push({ "productVariants.flavorColor": { in: flavourColour } })
  }

  return conditions
}
