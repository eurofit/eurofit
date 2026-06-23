import { DELIVERY_FEE } from "@/const/delivery"
import { site } from "@/const/site"
import { ProductDetail } from "@/lib/utils/product-variants/get-product-variant-by-slug"
import { AggregateRating, Offer, Product, WithContext } from "schema-dts"

const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000

function resolveAvailability(variant: ProductDetail) {
  if (variant.isOutOfStock) return "https://schema.org/OutOfStock"
  if (variant.isPreorder) return "https://schema.org/PreOrder"
  return "https://schema.org/InStock"
}

function buildOffer(variant: ProductDetail, url: string): Offer | undefined {
  if (variant.retailPrice == null) return undefined

  const priceValidUntil = new Date(Date.now() + ONE_YEAR_MS)
    .toISOString()
    .split("T")[0]

  return {
    "@type": "Offer",
    url,
    price: variant.retailPrice.toString(),
    priceCurrency: "KES",
    priceValidUntil,
    itemCondition: "https://schema.org/NewCondition",
    availability: resolveAvailability(variant),
    seller: {
      "@type": "Organization",
      name: site.name,
      url: site.url,
    },
    shippingDetails: {
      "@type": "OfferShippingDetails",
      shippingRate: {
        "@type": "MonetaryAmount",
        value: DELIVERY_FEE,
        currency: "KES",
      },
      shippingDestination: {
        "@type": "DefinedRegion",
        addressCountry: "KE",
      },
    },
    hasMerchantReturnPolicy: {
      "@type": "MerchantReturnPolicy",
      applicableCountry: "KE",
      returnPolicyCategory:
        "https://schema.org/MerchantReturnFiniteReturnWindow",
      merchantReturnDays: 14,
      returnMethod: "https://schema.org/ReturnByMail",
      returnFees: "https://schema.org/ReturnShippingFees",
    },
  }
}

function buildAggregateRating(
  variant: ProductDetail
): AggregateRating | undefined {
  if (variant.totalRatings <= 0) return undefined

  return {
    "@type": "AggregateRating",
    ratingValue: variant.averageRating,
    reviewCount: variant.totalRatings,
    bestRating: 5,
    worstRating: 1,
  }
}

export function getProductVariantJsonLd(
  variant: ProductDetail
): WithContext<Product> {
  const url = `${site.url}/product-variants/${variant.slug}`
  const product = variant.product

  const offers = buildOffer(variant, url)
  const aggregateRating = buildAggregateRating(variant)
  const brandName = product?.brand?.title

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    productID: variant.sku,
    name: variant.detailTitle ?? variant.title,
    sku: variant.sku,
    gtin: variant.barcode ?? undefined,
    image: variant.images,
    brand: brandName ? { "@type": "Brand", name: brandName } : undefined,
    category: variant.category ?? undefined,
    size: variant.size ?? undefined,
    color: variant.flavorColor ?? undefined,
    url,
    isVariantOf: product
      ? { "@id": `${site.url}/products/${product.slug}#product` }
      : undefined,
    ...(offers ? { offers } : {}),
    ...(aggregateRating ? { aggregateRating } : {}),
  }
}
