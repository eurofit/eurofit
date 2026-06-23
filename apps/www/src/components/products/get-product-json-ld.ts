import { site } from "@/const/site"
import { ProductDetails } from "@/lib/utils/products/get-product-by-slug"
import { Offer, Product, WithContext } from "schema-dts"

export function getProductJsonLd(product: ProductDetails) {
  const id = `${site.url}/products/${product.slug}#product`

  const activeLines = product.productVariants.filter(
    (line) => !line.isOutOfStock && line.price != null
  )

  const parentProduct: WithContext<Product> = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": id,
    name: product.title,
    description: product.productInformation || undefined,
    image: product.image || undefined,
    brand: {
      "@type": "Brand",
      name: product.brand?.title || undefined,
    },
    manufacturer: {
      "@type": "Organization",
      name: product.brand?.title || undefined,
    },
    category: product.categories.map((category) => category.title).join(", "),
    countryOfOrigin: {
      "@type": "Country",
      name: product.origin || undefined,
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "KES",
      lowPrice: Math.min(...activeLines.map((line) => line.price || 0)),
      highPrice: Math.max(...activeLines.map((line) => line.price || 0)),
      offerCount: activeLines.length,
      availability:
        activeLines.length > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: site.name,
        url: site.url,
      },
    },
  }

  const variants: WithContext<Product>[] = product.productVariants.map(
    (line) => ({
      "@context": "https://schema.org",
      "@type": "Product",
      "@id": `${site.url}/product-variants/${line.slug}#product`,
      productID: line.sku,
      name: line.title,
      sku: line.sku,
      gtin13: line.barcode ?? undefined,
      image: product.image ?? undefined,
      isVariantOf: {
        "@type": "Product",
        "@id": id,
      },

      offers: {
        "@type": "Offer",
        url: `${site.url}/product-variants/${line.slug}`,
        price: line.price?.toString(),
        priceCurrency: "KES",
        availability: !line.isOutOfStock
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
        seller: {
          "@type": "Organization",
          name: site.name,
          url: site.url,
        },
      } as Offer,
    })
  )

  return [parentProduct, ...variants]
}
