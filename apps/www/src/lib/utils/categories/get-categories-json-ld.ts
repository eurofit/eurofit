import { site } from "@/const/site"
import { GetCategoriesData } from "@/lib/utils/categories/get-categories"
import {
  BreadcrumbList,
  CollectionPage,
  ItemList,
  ListItem,
  Thing,
  WithContext,
} from "schema-dts"

type CategoriesJsonLdOptions = GetCategoriesData

export function getCategoriesJsonLd({
  categories,
  totalCategories,
  page = 1,
  pagingCounter,
}: CategoriesJsonLdOptions): WithContext<Thing>[] {
  const categoriesUrl = `${site.url}/categories`
  const pageUrl = page > 1 ? `${categoriesUrl}?page=${page}` : categoriesUrl

  // --- Breadcrumbs ---
  const breadcrumbId = `${pageUrl}#breadcrumb`

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
        name: "Shop Supplements by Category",
        item: categoriesUrl,
      },
    ],
  }

  // --- Paginated ItemList ---
  const itemListId = `${pageUrl}#category-list`

  const categoryItemList: WithContext<ItemList> = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": itemListId,
    name: `Supplement Categories at ${site.name}`,
    description: `Paginated list of sports nutrition and supplement categories available in Kenya at ${site.name}.`,
    itemListOrder: "https://schema.org/ItemListOrderAlphabetical",
    numberOfItems: totalCategories,
    itemListElement: categories.map<ListItem>((category, index) => {
      const categoryUrl = `${site.url}/categories/${category.slug}`

      return {
        "@type": "ListItem",
        position: pagingCounter + index,
        item: {
          "@type": "CollectionPage",
          "@id": `${categoryUrl}#webpage`,
          name: category.title,
          url: categoryUrl,
          description: category.description ?? undefined,
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
    name: "Shop Supplements by Category",
    description:
      "Browse our collection of sports nutrition and supplement categories available in Kenya.",
    inLanguage: "en",
    isPartOf: { "@id": `${site.url}/#website` },
    about: { "@id": `${site.url}/#organization` },
    breadcrumb: { "@id": breadcrumbId },
    mainEntity: { "@id": itemListId },
  }

  return [breadcrumb, webpage, categoryItemList]
}
