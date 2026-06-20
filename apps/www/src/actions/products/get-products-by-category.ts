import "server-only"

import { getCurrentUser } from "@/actions/auth/get-current-user"
import { CATEGORY_PRODUCTS_PER_PAGE } from "@/const/category-filters"
import { normalizeVariantDiscount } from "@/lib/utils/discounts/normalize-variant-discount"
import { buildProductFilterConditions } from "@/lib/utils/products/build-product-filter-conditions"
import { resolveAvailableStock } from "@/lib/utils/stock/resolve-available-stock"
import { Media } from "@/payload-types"
import config from "@payload-config"
import { cacheLife, cacheTag } from "next/cache"
import { getPayload } from "payload"
import { z } from "zod"

const DEFAULT_PAGE = 1

const optionsSchema = z.object({
  slug: z.string(),
  page: z
    .number()
    .optional()
    .default(DEFAULT_PAGE)
    .pipe(z.transform((val) => Math.max(1, val))),
  limit: z
    .number()
    .optional()
    .default(CATEGORY_PRODUCTS_PER_PAGE)
    .pipe(z.transform((val) => Math.max(1, val))),
  sortDirection: z.string().optional().nullable(),
  brand: z.array(z.string()).optional().nullable(),
  size: z.array(z.string()).optional().nullable(),
  flavourColour: z.array(z.string()).optional().nullable(),
})

type GetProductsByCategoryArgs = z.infer<typeof optionsSchema>

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

export async function getProductsByCategory(opts: GetProductsByCategoryArgs) {
  const { slug, page, limit, sortDirection, brand, size, flavourColour } =
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
      "categories.slug": { equals: slug },
      or: [...buildProductFilterConditions({ brand, size, flavourColour })],
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
        discount: true,
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
          const {
            supplierStock,
            retailPrice,
            stock,
            discount,
            ...variantRest
          } = variant

          return {
            ...variantRest,
            stock: resolveAvailableStock(stock, supplierStock),
            price: retailPrice ?? null,
            discount: normalizeVariantDiscount(discount),
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

export async function getTotalProductsByCategory(
  slug: string
): Promise<number> {
  "use cache"
  cacheTag("products", "product-variants")
  cacheLife("hours")

  const payload = await getPayload({ config })

  const { totalDocs: totalProducts } = await payload.count({
    collection: "product-variants",
    where: {
      "product.categories.slug": { equals: slug },
    },
  })

  return totalProducts
}
