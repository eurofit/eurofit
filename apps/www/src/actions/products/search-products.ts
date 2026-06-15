import "server-only"

import { getCurrentUser } from "@/actions/auth/get-current-user"
import { SEARCH_PRODUCTS_PER_PAGE } from "@/const/search-filters"
import { buildPrefixTsQuery } from "@/lib/utils/build-prefix-ts-query"
import { buildProductFilterConditions } from "@/lib/utils/products/build-product-filter-conditions"
import { buildProductSearchMatchCondition } from "@/lib/utils/products/build-product-search-match-condition"
import { resolveAvailableStock } from "@/lib/utils/stock/resolve-available-stock"
import { product_variants, products } from "@/payload-generated-schema"
import { Media } from "@/payload-types"
import config from "@payload-config"
import { eq } from "@payloadcms/db-postgres/drizzle"
import { getPayload } from "payload"
import { z } from "zod"

const DEFAULT_PAGE = 1

const optionsSchema = z.object({
  page: z
    .number()
    .optional()
    .default(DEFAULT_PAGE)
    .pipe(z.transform((val) => Math.max(1, val))),
  limit: z
    .number()
    .optional()
    .default(SEARCH_PRODUCTS_PER_PAGE)
    .pipe(z.transform((val) => Math.max(1, val))),
  sortDirection: z.string().optional().nullable(),
  brand: z.array(z.string()).optional().nullable(),
  category: z.array(z.string()).optional().nullable(),
  size: z.array(z.string()).optional().nullable(),
  flavourColour: z.array(z.string()).optional().nullable(),
})

type SearchProductsOptions = z.input<typeof optionsSchema>

const EMPTY_RESULT = {
  products: [],
  totalProducts: 0,
  totalPages: 0,
  hasNextPage: false,
  pagingCounter: 0,
} as const

/** Maps the storefront sort direction onto Payload's `sort` syntax (title). */
function resolveSort(sortDirection?: string | null): "title" | "-title" {
  return sortDirection === "desc" ? "-title" : "title"
}

type ProductImageSource = (string | Media)[] | null | undefined

function resolveProductImage(
  images: ProductImageSource,
  supplierImageUrl?: string | null
): string | null {
  const firstImage = images?.[0]
  const imageUrl =
    typeof firstImage === "string" ? firstImage : (firstImage?.url ?? null)

  return imageUrl ?? supplierImageUrl ?? null
}

/**
 * Searches products by full-text query, applies the active storefront filters
 * and returns a paginated, fully-formed product list.
 *
 * Two phases keep the result shape identical to `getProductsByBrand`: a Drizzle
 * full-text query resolves the matching product IDs, then `payload.find` narrows
 * by the selected filters and formats images, stock and pricing. Each filter
 * group is combined with AND so picks narrow the results.
 */
export async function searchProducts(
  query: string,
  opts: SearchProductsOptions = {}
) {
  const q = z.string().trim().parse(query)

  if (!q) return EMPTY_RESULT

  const { page, limit, sortDirection, brand, category, size, flavourColour } =
    optionsSchema.parse(opts)

  const tsQuery = buildPrefixTsQuery(q)

  if (!tsQuery) return EMPTY_RESULT

  const [user, payload] = await Promise.all([
    getCurrentUser(),
    getPayload({ config }),
  ])

  // Phase 1: resolve the IDs of products matching the full-text query.
  const matchedRows = await payload.db.drizzle
    .select({ id: products.id })
    .from(products)
    .leftJoin(product_variants, eq(product_variants.product, products.id))
    .where(buildProductSearchMatchCondition(tsQuery))
    .groupBy(products.id)

  const matchedIds = matchedRows.map((row) => row.id)

  if (matchedIds.length === 0) return EMPTY_RESULT

  const sort = resolveSort(sortDirection)

  // Phase 2: narrow the matches by the active filters and format like brands.
  const {
    docs: matchedProducts,
    totalDocs: totalProducts,
    totalPages,
    hasNextPage,
    pagingCounter,
  } = await payload.find({
    collection: "products",
    where: {
      and: [
        { id: { in: matchedIds } },
        ...buildProductFilterConditions({
          brand,
          category,
          size,
          flavourColour,
        }),
      ],
    },
    select: {
      slug: true,
      title: true,
      origin: true,
      supplierImageUrl: true,
      images: true,
      productVariants: true,
    },
    joins: {
      productVariants: { sort, limit: 0 },
    },
    populate: {
      "product-variants": {
        sku: true,
        slug: true,
        title: true,
        variant: true,
        expiryDate: true,
        stock: true,
        supplierStock: true,
        retailPrice: true,
        isPreorder: true,
        isLowStock: true,
        isOutOfStock: true,
        isNotifyRequested: true,
      },
    },
    sort,
    user: user?.id,
    page,
    limit,
  })

  const formattedProducts = matchedProducts.map((product) => {
    const { supplierImageUrl, images, ...rest } = product

    return {
      ...rest,
      image: resolveProductImage(images, supplierImageUrl),
      productVariants: (product.productVariants.docs ?? [])
        .filter((variant) => typeof variant === "object")
        .map((variant) => {
          const { supplierStock, retailPrice, stock, ...variantRest } = variant

          return {
            ...variantRest,
            stock: resolveAvailableStock(stock, supplierStock),
            price: retailPrice ?? null,
          }
        }),
    }
  })

  return {
    products: formattedProducts,
    totalProducts,
    totalPages,
    hasNextPage,
    pagingCounter,
  }
}
