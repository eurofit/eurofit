import { getCurrentUser } from "@/actions/auth/get-current-user"
import { normalizeVariantDiscount } from "@/lib/utils/discounts/normalize-variant-discount"
import { resolveAvailableStock } from "@/lib/utils/stock/resolve-available-stock"
import { Media } from "@/payload-types"
import config from "@payload-config"
import { getPayload } from "payload"

type Args = {
  slug: string
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

export async function getProductBySlug(slug: string) {
  const [payload, user] = await Promise.all([
    getPayload({ config }),
    getCurrentUser(),
  ])

  const { docs: products } = await payload.find({
    collection: "products",
    where: {
      slug: { equals: slug },
    },
    select: {
      slug: true,
      title: true,
      origin: true,
      productInformation: true,
      supplierImageUrl: true,
      images: true,
      brand: true,
      categories: true,
      productVariants: true,
    },
    joins: {
      productVariants: { sort: "title", limit: 0 },
    },
    populate: {
      "product-variants": {
        sku: true,
        slug: true,
        title: true,
        variant: true,
        barcode: true,
        expiryDate: true,
        stock: true,
        supplierStock: true,
        retailPrice: true,
        discount: true,
        isBackorder: true,
        isLowStock: true,
        isOutOfStock: true,
        isNotifyRequested: true,
      },
      brands: {
        slug: true,
        title: true,
      },
      categories: {
        slug: true,
        title: true,
      },
    },
    limit: 1,
    pagination: false,
    user: user?.id,
  })

  const product = products?.[0]

  if (!product) {
    return null
  }

  const { supplierImageUrl, images, brand, categories, ...rest } = product

  return {
    ...rest,
    image: resolveProductImage(images, supplierImageUrl),
    brand: typeof brand === "object" ? brand : null,
    categories: (categories ?? []).filter(
      (category) => typeof category === "object"
    ),
    productVariants: (product.productVariants.docs ?? [])
      .filter((variant) => typeof variant === "object")
      .map((variant) => {
        const { supplierStock, retailPrice, stock, discount, ...variantRest } =
          variant

        return {
          ...variantRest,
          stock: resolveAvailableStock(stock, supplierStock),
          price: retailPrice ?? null,
          discount: normalizeVariantDiscount(discount),
        }
      }),
  }
}

export type ProductDetails = NonNullable<
  Awaited<ReturnType<typeof getProductBySlug>>
>
