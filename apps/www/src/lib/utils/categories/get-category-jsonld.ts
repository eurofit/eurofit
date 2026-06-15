import { site } from "@/const/site"
import {
  BreadcrumbList,
  CollectionPage,
  ItemList,
  ListItem,
  Thing,
  WithContext,
} from "schema-dts"

type CategoryJsonLdProduct = {
  slug: string
  title: string
  image?: string | null
}

type CategoryJsonLdOptions = {
  category: {
    title: string
    slug: string
  }
  products: CategoryJsonLdProduct[]
  totalProducts: number
  page?: number
  pagingCounter: number
}

export function getCategoryJsonLd({
  category,
  products,
  totalProducts,
  page = 1,
  pagingCounter,
}: CategoryJsonLdOptions): WithContext<Thing>[] {
  const categoriesUrl = `${site.url}/categories`
  const categoryUrl = `${categoriesUrl}/${category.slug}`
  const pageUrl = page > 1 ? `${categoryUrl}?page=${page}` : categoryUrl

  const breadcrumbId = `${pageUrl}#breadcrumb`
  const productListId = `${pageUrl}#product-list`

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
        name: "Shop by Category",
        item: categoriesUrl,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: category.title,
        item: categoryUrl,
      },
    ],
  }

  const productItemList: WithContext<ItemList> = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": productListId,
    name: `${category.title} Supplements Available at ${site.name}`,
    description: `Paginated list of authentic ${category.title} supplements available in Kenya at ${site.name}.`,
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
        },
      }
    }),
  }

  const webpage: WithContext<CollectionPage> = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: `${category.title} Supplements in Kenya`,
    description: `Browse authentic ${category.title} supplements available in Kenya at ${site.name}.`,
    inLanguage: "en",
    isPartOf: { "@id": `${site.url}/#website` },
    breadcrumb: { "@id": breadcrumbId },
    mainEntity: { "@id": productListId },
  }

  return [breadcrumb, webpage, productItemList]
}
