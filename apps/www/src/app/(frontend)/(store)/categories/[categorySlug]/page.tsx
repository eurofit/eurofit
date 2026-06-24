import {
  CategoryHeader,
  CategoryHeaderSkeleton,
} from "@/components/categories/category-header"
import { CategoryProducts } from "@/components/categories/category-products"
import { FilterSkeleton } from "@/components/products/filter-primitives"
import {
  MobileProductFilters,
  MobileProductFiltersTriggerSkeleton,
} from "@/components/products/mobile-product-filters"
import { ProductCardSkeleton } from "@/components/products/product-card"
import { ProductFiltersSidebar } from "@/components/products/product-filters-sidebar"
import { CATEGORY_FILTER_KEYS } from "@/const/category-filters"
import { site } from "@/const/site"
import { parseCategorySearchParams } from "@/lib/utils/categories/category-search-params"
import { getCategory } from "@/lib/utils/categories/get-category"
import { getCategoryFilters } from "@/lib/utils/categories/get-category-filters"
import { getTotalProductsByCategory } from "@/lib/utils/products/get-products-by-category"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import pluralize from "pluralize-esm"
import * as React from "react"

type CategoryPageProps = {
  params: Promise<{
    categorySlug: string
  }>
  searchParams: Promise<{
    [k: string]: string | string[] | undefined
  }>
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { categorySlug } = await params

  const [category, totalProducts] = await Promise.all([
    getCategory({ slug: categorySlug }),
    getTotalProductsByCategory(categorySlug),
  ])

  if (!category) notFound()

  const title = pluralize(category.title)
  const canonicalUrl = `${site.url}/categories/${categorySlug}`

  return {
    title: {
      absolute: `Buy Original and High Quality ${title} from ${site.name}`,
    },
    description:
      totalProducts > 0
        ? `Shop ${totalProducts}+ authentic ${title} at ${site.name}. Fresh stock, fast delivery and trusted quality. Order today while stock lasts.`
        : `Shop authentic ${title} at ${site.name}. Fresh stock, fast delivery and trusted quality.`,
    alternates: {
      canonical: canonicalUrl,
    },
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { categorySlug } = await params

  const category = await getCategory({ slug: categorySlug })
  if (!category) notFound()

  const categorySlugPromise = Promise.resolve(categorySlug)
  const categorySearchParams = searchParams.then(parseCategorySearchParams)

  const getFilters = async () => getCategoryFilters(categorySlug)

  return (
    <div className="space-y-10">
      <div className="relative flex items-start md:min-h-[calc(100vh-4rem)] md:gap-8 lg:gap-16">
        {/* SIDEBAR */}
        <React.Suspense fallback={<FilterSkeleton />}>
          <ProductFiltersSidebar
            getFilters={getFilters}
            filterKeys={CATEGORY_FILTER_KEYS}
          />
        </React.Suspense>

        {/* MAIN CONTENT */}
        <main className="grow space-y-10">
          <React.Suspense fallback={<CategoryHeaderSkeleton />}>
            <CategoryHeader slug={categorySlugPromise} />
          </React.Suspense>
          <React.Suspense fallback={<ProductCardSkeleton />}>
            <CategoryProducts
              slug={categorySlugPromise}
              searchParams={categorySearchParams}
              mobileFiltersSlot={
                <React.Suspense
                  fallback={<MobileProductFiltersTriggerSkeleton />}
                >
                  <MobileProductFilters
                    getFilters={getFilters}
                    filterKeys={CATEGORY_FILTER_KEYS}
                  />
                </React.Suspense>
              }
            />
          </React.Suspense>
        </main>
      </div>
    </div>
  )
}
