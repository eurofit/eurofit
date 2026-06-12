import { site } from "@/const/site"
import {
  Brand,
  BreadcrumbList,
  CollectionPage,
  ItemList,
  ListItem,
  Thing,
  WithContext,
} from "schema-dts"

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
}

export function getBrandJsonLd({
  brand,
  products,
  totalProducts,
  page = 1,
  pagingCounter,
}: BrandJsonLdOptions): WithContext<Thing>[] {
  const brandsUrl = `${site.url}/brands`
  const brandUrl = `${brandsUrl}/${brand.slug}`
  const pageUrl = page > 1 ? `${brandUrl}?page=${page}` : brandUrl

  const brandId = `${brandUrl}#brand`
  const breadcrumbId = `${pageUrl}#breadcrumb`
  const productListId = `${pageUrl}#product-list`

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
    description: `Paginated list of authentic ${brand.title} supplements available in Kenya at ${site.name}.`,
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
    name: `${brand.title} Supplements in Kenya`,
    description: `Browse authentic ${brand.title} supplements available in Kenya at ${site.name}.`,
    inLanguage: "en",
    isPartOf: { "@id": `${site.url}/#website` },
    about: { "@id": brandId },
    breadcrumb: { "@id": breadcrumbId },
    mainEntity: { "@id": productListId },
  }

  return [breadcrumb, brandSchema, webpage, productItemList]
}
