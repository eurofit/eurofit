import { site } from "@/const/site"
import {
  MerchantAvailability,
  MerchantFeedItem,
} from "@/lib/utils/feeds/build-google-merchant-xml"
import { getBackorderAvailabilityDate } from "@/lib/utils/feeds/get-backorder-availability-date"
import payloadConfig from "@payload-config"
import { format } from "date-fns"
import { cacheLife, cacheTag } from "next/cache"
import { getPayload } from "payload"

type FeedVariant = {
  slug: string
  sku: string
  title: string
  detailTitle?: string | null
  retailPrice?: number | null
  barcode?: string | null
  category?: string | null
  images?: ({ url?: string | null } | string)[] | null
  isOutOfStock: boolean
  isBackorder: boolean
  product?:
    | { supplierImageUrl?: string | null; brand?: { title?: string } | string }
    | string
    | null
}

function resolveAvailability(variant: FeedVariant): MerchantAvailability {
  if (variant.isOutOfStock) return "out_of_stock"
  if (variant.isBackorder) return "backorder"
  return "in_stock"
}

function resolveImageLink(variant: FeedVariant): string | undefined {
  const variantImage = (variant.images ?? [])
    .map((image) => (typeof image === "object" ? image.url : null))
    .find((url): url is string => typeof url === "string")

  const product =
    typeof variant.product === "object" && variant.product
      ? variant.product
      : null

  return variantImage ?? product?.supplierImageUrl ?? undefined
}

function resolveBrand(variant: FeedVariant): string | undefined {
  const product =
    typeof variant.product === "object" && variant.product
      ? variant.product
      : null

  return product && typeof product.brand === "object"
    ? product.brand.title
    : undefined
}

/**
 * Returns every active, priced variant shaped as a Google Merchant Center offer.
 * Cached daily (Googlebot fetches on a schedule), keyed on the same tags the
 * variant collection invalidates. Variants without a price are skipped since an
 * offer can't be listed without one.
 */
export async function getProductVariantsFeed(): Promise<MerchantFeedItem[]> {
  "use cache"

  cacheTag("product-variants-feed", "product-variants:total")
  cacheLife("days")

  const config = await payloadConfig
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: "product-variants",
    where: { isActive: { equals: true } },
    select: {
      slug: true,
      sku: true,
      title: true,
      detailTitle: true,
      retailPrice: true,
      barcode: true,
      category: true,
      images: true,
      isOutOfStock: true,
      isBackorder: true,
      product: true,
    },
    populate: {
      products: { supplierImageUrl: true, brand: true },
      brands: { title: true },
      media: { url: true },
    },
    depth: 2,
    sort: "slug",
    limit: 0,
  })

  return (docs as FeedVariant[])
    .filter((variant) => typeof variant.retailPrice === "number")
    .map((variant) => ({
      id: variant.sku,
      title: variant.detailTitle ?? variant.title,
      link: `${site.url}/product-variants/${variant.slug}`,
      price: variant.retailPrice as number,
      availability: resolveAvailability(variant),
      availabilityDate: variant.isBackorder
        ? `${format(getBackorderAvailabilityDate(new Date()), "yyyy-MM-dd")}T00:00+0300`
        : undefined,
      imageLink: resolveImageLink(variant),
      brand: resolveBrand(variant),
      gtin: variant.barcode ?? undefined,
      productType: variant.category ?? undefined,
    }))
}
