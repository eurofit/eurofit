import { getCurrentUser } from "@/actions/auth/get-current-user"
import { normalizeVariantDiscount } from "@/lib/utils/discounts/normalize-variant-discount"
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
      category: true,
      product: true,
      discount: true,
      stock: true,
      supplierStock: true,
      isBackorder: true,
      isLowStock: true,
      isOutOfStock: true,
      isWishlisted: true,
      isNotifyRequested: true,
      meta: true,
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

  const pv = productVariants?.[0]

  if (!pv) {
    return null
  }

  const { stock, supplierStock, meta, ...productVariant } = pv

  const { averageRating, totalRatings } = await getVariantReviewStats(
    productVariant.id
  )

  const product =
    typeof productVariant.product === "object" ? productVariant.product : null

  const variantImages = (
    productVariant.images?.filter((i) => typeof i === "object") ?? []
  )
    .map((i) => i.url)
    .filter((url): url is string => typeof url === "string")

  const images =
    variantImages.length > 0
      ? variantImages
      : [product?.supplierImageUrl].filter(
          (url): url is string => typeof url === "string"
        )

  const formattedProductLine = productVariant
    ? {
        ...productVariant,
        averageRating,
        totalRatings,
        stock: resolveAvailableStock(stock, supplierStock),
        discount: normalizeVariantDiscount(productVariant.discount),
        images,
        meta: meta
          ? {
              title: meta.title ?? null,
              description: meta.description ?? null,
              image:
                typeof meta.image === "object"
                  ? (meta.image?.url ?? null)
                  : null,
            }
          : null,
        product: product
          ? {
              ...product,
              brand: typeof product.brand === "object" ? product.brand : null,
            }
          : null,
      }
    : null

  return formattedProductLine
}

export type ProductDetail = NonNullable<
  Awaited<ReturnType<typeof getProductVariantBySlug>>
>
