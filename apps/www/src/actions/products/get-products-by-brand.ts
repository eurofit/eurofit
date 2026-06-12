import "server-only"

import { getCurrentUser } from "@/actions/auth/get-current-user"
import { BRAND_PRODUCTS_PER_PAGE } from "@/const/brand-filters"
import { resolveAvailableStock } from "@/lib/utils/stock/resolve-available-stock"
import { Media } from "@/payload-types"
import config from "@payload-config"
import { isEmpty } from "lodash-es"
import { cacheLife, cacheTag } from "next/cache"
import { getPayload, type Where } from "payload"
import { z } from "zod"

const DEFAULT_PAGE = 1

const optionsSchema = z.object({
  brand: z.string(),
  page: z
    .number()
    .optional()
    .default(DEFAULT_PAGE)
    .pipe(z.transform((val) => Math.max(1, val))),
  limit: z
    .number()
    .optional()
    .default(BRAND_PRODUCTS_PER_PAGE)
    .pipe(z.transform((val) => Math.max(1, val))),
  sortDirection: z.string().optional().nullable(),
  category: z.array(z.string()).optional().nullable(),
  size: z.array(z.string()).optional().nullable(),
  flavourColour: z.array(z.string()).optional().nullable(),
})

type GetProductsByBrandArgs = z.infer<typeof optionsSchema>

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
 * Each selected filter group is combined with AND (a product must match every
 * group the user picked), while values within a group are combined with `in`
 * (OR). Category matches either the product's own categories or a variant's
 * category field.
 */
function buildBrandProductFilters({
  category,
  size,
  flavourColour,
}: Pick<
  GetProductsByBrandArgs,
  "category" | "size" | "flavourColour"
>): Where[] {
  const conditions: Where[] = []

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

export async function getProductsByBrand(opts: GetProductsByBrandArgs) {
  const { brand, page, limit, sortDirection, category, size, flavourColour } =
    optionsSchema.parse(opts)

  const [user, payload] = await Promise.all([
    getCurrentUser(),
    getPayload({ config }),
  ])

  const sort = resolveSort(sortDirection)

  const {
    docs: products,
    totalDocs: totalProducts,
    totalPages,
    hasNextPage,
    pagingCounter,
  } = await payload.find({
    collection: "products",
    where: {
      "brand.slug": { equals: brand },
      or: [...buildBrandProductFilters({ category, size, flavourColour })],
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

  const formattedProducts = products.map((product) => {
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

export async function getTotalBrandProductVariants(
  slug: string
): Promise<number> {
  "use cache"
  cacheTag("products", "product-variants")
  cacheLife("hours")

  const payload = await getPayload({ config })

  const { totalDocs: totalBrandProductVariants } = await payload.count({
    collection: "product-variants",
    where: {
      "product.brand.slug": { equals: slug },
    },
  })

  return totalBrandProductVariants
}
