import { getCurrentUser } from "@/actions/auth/get-current-user"
import { getVariantReviewStats } from "@/lib/utils/reviews/get-variant-review-stats"
import { resolveAvailableStock } from "@/lib/utils/stock/resolve-available-stock"
import config from "@payload-config"
import { getPayload } from "payload"

type Args = {
  slug: string
}

export async function getProductVariantBySlug({ slug }: Args) {
  const [payload, user] = await Promise.all([
    getPayload({ config }),
    getCurrentUser(),
  ])

  const { docs: productVariants } = await payload.find({
    collection: "product-variants",
    where: {
      slug: {
        equals: slug,
      },
    },
    select: {
      slug: true,
      sku: true,
      title: true,
      detailTitle: true,
      images: true,
      variant: true,
      flavorColor: true,
      size: true,
      retailPrice: true,
      barcode: true,
      product: true,
      discounts: true,
      stock: true,
      supplierStock: true,
      isBackorder: true,
      isLowStock: true,
      isOutOfStock: true,
      isWishlisted: true,
      isNotifyRequested: true,
    },
    populate: {
      products: {
        slug: true,
        title: true,
        supplierImageUrl: true,
        origin: true,
        brand: true,
      },
      brands: {
        slug: true,
        title: true,
      },
    },
    limit: 1,
    pagination: false,
    user,
  })

  let pv = productVariants?.[0]

  if (!pv) {
    return null
  }

  const { stock, supplierStock, ...productVariant } = pv

  const { averageRating, totalRatings } = await getVariantReviewStats(
    productVariant.id
  )

  const formattedProductLine = productVariant
    ? {
        ...productVariant,
        averageRating,
        totalRatings,
        stock: resolveAvailableStock(stock, supplierStock),
        images: (
          productVariant.images?.filter((i) => typeof i === "object") ?? []
        )
          .map((i) => i.url)
          .filter((url): url is string => typeof url === "string"),
        product:
          typeof productVariant.product === "object"
            ? {
                ...productVariant.product,
                brand:
                  typeof productVariant.product.brand === "object"
                    ? productVariant.product.brand
                    : null,
              }
            : null,
      }
    : null

  return formattedProductLine
}

export type ProductDetail = NonNullable<
  Awaited<ReturnType<typeof getProductVariantBySlug>>
>
