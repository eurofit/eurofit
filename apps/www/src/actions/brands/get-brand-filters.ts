import "server-only"

import { FilterGroup, FilterItem } from "@/types/filter"
import config from "@payload-config"
import { groupBy, sortBy, uniqBy } from "lodash-es"
import { cacheLife, cacheTag } from "next/cache"
import { getPayload } from "payload"

type LabeledValue = { slug: string; title: string }

type VariantDoc = { size?: string | null; flavorColor?: string | null }

type ProductDoc = {
  categories?: unknown
  productVariants?: { docs?: unknown[] | null } | null
}

function isPopulatedCategory(value: unknown): value is LabeledValue {
  return (
    typeof value === "object" &&
    value !== null &&
    "slug" in value &&
    "title" in value
  )
}

function isVariantDoc(value: unknown): value is VariantDoc {
  return typeof value === "object" && value !== null
}

/**
 * Counts how many products contain each distinct value. A product contributes
 * at most once per value (deduped within the product), so the count reflects
 * "number of products" rather than "number of occurrences".
 */
function countDistinctPerProduct<T>(
  products: T[],
  extract: (product: T) => LabeledValue[]
): FilterItem[] {
  const distinctPerProduct = products.flatMap((product) =>
    uniqBy(extract(product), "slug")
  )

  const grouped = groupBy(distinctPerProduct, (item) => item.slug)

  const items = Object.entries(grouped).map(([slug, entries]) => ({
    slug,
    title: entries[0]?.title ?? "",
    count: entries.length,
  }))

  return sortBy(items, (item) => item.title)
}

function extractCategories(product: ProductDoc): LabeledValue[] {
  const categories = Array.isArray(product.categories) ? product.categories : []

  return categories
    .filter(isPopulatedCategory)
    .map(({ slug, title }) => ({ slug, title }))
}

function extractVariantValues(
  product: ProductDoc,
  pick: (variant: VariantDoc) => string | null | undefined
): LabeledValue[] {
  const variants = product.productVariants?.docs ?? []

  return variants
    .filter(isVariantDoc)
    .map((variant) => pick(variant))
    .filter((value): value is string => !!value)
    .map((value) => ({ slug: value, title: value }))
}

export async function getBrandFilters(slug: string): Promise<FilterGroup[]> {
  "use cache"
  cacheTag("products", "product-variants")
  cacheLife("hours")

  const payload = await getPayload({ config })

  const { docs: products, totalDocs: totalProducts } = await payload.find({
    collection: "products",
    where: {
      "brand.slug": { equals: slug },
    },
    select: {
      categories: true,
      productVariants: true,
    },
    populate: {
      categories: { slug: true, title: true },
      "product-variants": { size: true, flavorColor: true },
    },
    joins: {
      productVariants: { limit: 0 },
    },
    limit: 0,
  })

  if (totalProducts === 0) return []

  const productDocs = products as ProductDoc[]

  const groups: FilterGroup[] = [
    {
      key: "category",
      title: "Categories",
      items: countDistinctPerProduct(productDocs, extractCategories),
    },
    {
      key: "size",
      title: "Sizes",
      items: countDistinctPerProduct(productDocs, (product) =>
        extractVariantValues(product, (variant) => variant.size)
      ),
    },
    {
      key: "flavour-colour",
      title: "Flavour / Colour",
      items: countDistinctPerProduct(productDocs, (product) =>
        extractVariantValues(product, (variant) => variant.flavorColor)
      ),
    },
  ]

  return groups.filter((group) => group.items.length > 0)
}
