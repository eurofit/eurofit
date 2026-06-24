import { FilterSkeleton } from "@/components/products/filter-primitives"
import {
  MobileProductFilters,
  MobileProductFiltersTriggerSkeleton,
} from "@/components/products/mobile-product-filters"
import { ProductCardSkeleton } from "@/components/products/product-card"
import { ProductFiltersSidebar } from "@/components/products/product-filters-sidebar"
import { SearchProducts } from "@/components/products/search-products"
import { SEARCH_FILTER_KEYS } from "@/const/search-filters"
import { site } from "@/const/site"
import { getSearchProductFilters } from "@/lib/utils/products/get-search-product-filters"
import { parseSearchParams } from "@/lib/utils/search/search-params"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import * as React from "react"

type SearchPageProps = {
  searchParams: Promise<{
    [k: string]: string | string[] | undefined
  }>
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { q } = parseSearchParams(await searchParams)

  if (!q) notFound()

  const title = `Search results for "${q}"`

  return {
    title,
    description: `Browse ${site.name} products matching "${q}".`,
    robots: { index: false, follow: true },
  }
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const search = searchParams.then(parseSearchParams)

  const getFilters = async () =>
    getSearchProductFilters(search.then((s) => s.q))

  return (
    <div className="relative flex items-start md:min-h-[calc(100vh-4rem)] md:gap-8 lg:gap-16">
      {/* SIDEBAR */}
      <React.Suspense fallback={<FilterSkeleton />}>
        <ProductFiltersSidebar
          getFilters={getFilters}
          filterKeys={SEARCH_FILTER_KEYS}
        />
      </React.Suspense>

      {/* MAIN CONTENT */}
      <main className="grow space-y-10">
        <React.Suspense fallback={<ProductCardSkeleton />}>
          <SearchProducts
            searchParams={search}
            mobileFiltersSlot={
              <React.Suspense
                fallback={<MobileProductFiltersTriggerSkeleton />}
              >
                <MobileProductFilters
                  getFilters={getFilters}
                  filterKeys={SEARCH_FILTER_KEYS}
                />
              </React.Suspense>
            }
          />
        </React.Suspense>
      </main>
    </div>
  )
}
