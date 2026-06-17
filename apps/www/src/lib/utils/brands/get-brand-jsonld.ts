import { site } from "@/const/site"
import { getFaqJsonLd } from "@/lib/utils/get-faqs-json-ld"
import { ServiceAreaDetail } from "@/types/service-area"
import {
  Brand,
  BreadcrumbList,
  CollectionPage,
  ItemList,
  ListItem,
  OfferShippingDetails,
  Thing,
  WithContext,
} from "schema-dts"

type AreaJsonLd = Pick<
  ServiceAreaDetail,
  "title" | "slug" | "deliveryTime" | "lowestShippingRate"
>

type AreaFaq = {
  question: string
  answer: string
}

type BrandJsonLdProduct = {
  slug: string
  title: string
  image?: string | null
}

type BrandJsonLdOptions = {
  brand: {
    title: string
    slug: string
    image?: string | null
  }
  products: BrandJsonLdProduct[]
  totalProducts: number
  page?: number
  pagingCounter: number
  area?: AreaJsonLd | null
  areaFaqs?: AreaFaq[]
}

export function getBrandJsonLd({
  brand,
  products,
  totalProducts,
  page = 1,
  pagingCounter,
  area = null,
  areaFaqs = [],
}: BrandJsonLdOptions): WithContext<Thing>[] {
  const brandsUrl = `${site.url}/brands`
  const brandUrl = `${brandsUrl}/${brand.slug}`
  // For area pages the canonical entity is the area page itself, so structured
  // data is self-referencing (required for the page to rank locally).
  const baseUrl = area ? `${brandUrl}/${area.slug}` : brandUrl
  const pageUrl = page > 1 ? `${baseUrl}?page=${page}` : baseUrl

  // The Brand schema stays anchored to the canonical brand page so product
  // pages can reference a single, stable brand @id.
  const brandId = `${brandUrl}#brand`
  const breadcrumbId = `${pageUrl}#breadcrumb`
  const productListId = `${pageUrl}#product-list`

  const collectionName = area
    ? `${brand.title} Supplements in ${area.title}`
    : `${brand.title} Supplements in Kenya`
  const locationLabel = area ? area.title : "Kenya"

  // --- Breadcrumbs ---
  const breadcrumb: WithContext<BreadcrumbList> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": breadcrumbId,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: site.url,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Shop by Brand",
        item: brandsUrl,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: brand.title,
        item: brandUrl,
      },
      ...(area
        ? [
            {
              "@type": "ListItem" as const,
              position: 4,
              name: area.title,
              item: baseUrl,
            },
          ]
        : []),
    ],
  }

  // --- Brand (referenceable by product detail pages via @id) ---
  const brandSchema: WithContext<Brand> = {
    "@context": "https://schema.org",
    "@type": "Brand",
    "@id": brandId,
    name: brand.title,
    url: brandUrl,
    logo: brand.image ?? undefined,
  }

  // --- Paginated product ItemList ---
  const productItemList: WithContext<ItemList> = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": productListId,
    name: `${brand.title} Supplements Available at ${site.name}`,
    description: `Paginated list of authentic ${brand.title} supplements available in ${locationLabel} at ${site.name}.`,
    itemListOrder: "https://schema.org/ItemListOrderAlphabetical",
    numberOfItems: totalProducts,
    itemListElement: products.map<ListItem>((product, index) => {
      const productUrl = `${site.url}/products/${product.slug}`

      return {
        "@type": "ListItem",
        position: pagingCounter + index,
        item: {
          "@type": "Product",
          "@id": `${productUrl}#product`,
          name: product.title,
          url: productUrl,
          image: product.image ?? undefined,
          brand: { "@id": brandId },
        },
      }
    }),
  }

  // --- CollectionPage ---
  const webpage: WithContext<CollectionPage> = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: collectionName,
    description: `Browse authentic ${brand.title} supplements available in ${locationLabel} at ${site.name}.`,
    inLanguage: "en",
    isPartOf: { "@id": `${site.url}/#website` },
    about: { "@id": brandId },
    breadcrumb: { "@id": breadcrumbId },
    mainEntity: { "@id": productListId },
  }

  const schemas: WithContext<Thing>[] = [
    breadcrumb,
    brandSchema,
    webpage,
    productItemList,
  ]

  if (!area) return schemas

  // Area-specific delivery data makes each brand × area page genuinely unique:
  // real per-area shipping price and delivery window, machine-readable.
  const shippingDetails: WithContext<OfferShippingDetails> = {
    "@context": "https://schema.org",
    "@type": "OfferShippingDetails",
    "@id": `${pageUrl}#delivery`,
    shippingDestination: {
      "@type": "DefinedRegion",
      addressRegion: area.title,
      addressCountry: "KE",
    },
    deliveryTime: {
      "@type": "ShippingDeliveryTime",
      transitTime: {
        "@type": "QuantitativeValue",
        minValue: area.deliveryTime.minDays,
        maxValue: area.deliveryTime.maxDays,
        unitCode: "DAY",
      },
    },
    ...(area.lowestShippingRate !== null && {
      shippingRate: {
        "@type": "MonetaryAmount",
        currency: "KES",
        value: area.lowestShippingRate,
      },
    }),
  }

  schemas.push(shippingDetails)

  if (areaFaqs.length > 0) {
    schemas.push(getFaqJsonLd(areaFaqs))
  }

  return schemas
}
