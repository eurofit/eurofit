import { site } from "@/const/site"
import { GetBrandsData } from "@/lib/utils/brands/get-brands"
import {
  BreadcrumbList,
  CollectionPage,
  ItemList,
  ListItem,
  Thing,
  WithContext,
} from "schema-dts"

type BrandListJsonLdOptions = GetBrandsData

export function getBrandListJsonLd({
  brands,
  totalBrands,
  page = 1,
  pagingCounter,
}: BrandListJsonLdOptions): WithContext<Thing>[] {
  const brandsUrl = `${site.url}/brands`
  const pageUrl = page > 1 ? `${brandsUrl}?page=${page}` : brandsUrl

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
        name: "Shop by Brand",
        item: brandsUrl,
      },
    ],
  }

  // --- Paginated ItemList ---
  const itemListId = `${pageUrl}#brand-list`

  const brandItemList: WithContext<ItemList> = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": itemListId,
    name: `Sports Nutrition Brands In Kenya Available at ${site.name}`,
    description: `Paginated list of sports nutrition and supplement brands available in Kenya at ${site.name}.`,
    itemListOrder: "https://schema.org/ItemListOrderAlphabetical",
    numberOfItems: totalBrands,
    itemListElement: brands.map<ListItem>((brand, index) => {
      const brandUrl = `${site.url}/brands/${brand.slug}`

      return {
        "@type": "ListItem",
        position: pagingCounter + index,
        item: {
          "@type": "Brand",
          "@id": `${brandUrl}#brand`,
          name: brand.title,
          url: brandUrl,
          logo: brand.image ?? undefined,
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
    name: "Shop by Brands",
    description:
      "Browse our collection of sports nutrition brands available in Kenya.",
    inLanguage: "en",
    isPartOf: { "@id": `${site.url}/#website` },
    about: { "@id": `${site.url}/#organization` },
    breadcrumb: { "@id": breadcrumbId },
    mainEntity: { "@id": itemListId },
  }

  return [breadcrumb, webpage, brandItemList]
}
