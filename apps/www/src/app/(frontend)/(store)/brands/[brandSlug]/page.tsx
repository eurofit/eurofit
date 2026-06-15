import { getBrand } from "@/actions/brands/get-brand"
import { getBrandFilters } from "@/actions/brands/get-brand-filters"
import { getTotalBrandProductVariants } from "@/actions/products/get-products-by-brand"
import {
  BrandBreadcrumbs,
  BrandBreadcrumbsSkeleton,
} from "@/components/brands/brand-breadcrumbs"
import {
  BrandHeader,
  BrandHeaderSkeleton,
} from "@/components/brands/brand-header"
import { BrandProducts } from "@/components/brands/brand-products"
import { FilterSkeleton } from "@/components/products/filter-primitives"
import {
  MobileProductFilters,
  MobileProductFiltersTriggerSkeleton,
} from "@/components/products/mobile-product-filters"
import { ProductCardSkeleton } from "@/components/products/product-card"
import { ProductFiltersSidebar } from "@/components/products/product-filters-sidebar"
import { BRAND_FILTER_KEYS } from "@/const/brand-filters"
import { site } from "@/const/site"
import { parseBrandSearchParams } from "@/lib/utils/brands/brand-search-params"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import * as React from "react"

type BrandPageProps = {
  params: Promise<{
    brandSlug: string
  }>
  searchParams: Promise<{
    [k: string]: string | string[] | undefined
  }>
}

export async function generateMetadata({
  params,
}: BrandPageProps): Promise<Metadata> {
  const { brandSlug } = await params

  const [brand, totalBrandProductVariants] = await Promise.all([
    getBrand({ slug: brandSlug }),
    getTotalBrandProductVariants(brandSlug),
  ])

  if (!brand) notFound()

  const canonicalUrl = `${site.url}/brands/${brandSlug}`
  const title = `Buy Original ${brand.title} Supplements in Kenya`
  const description =
    totalBrandProductVariants > 0
      ? `Shop ${totalBrandProductVariants}+ authentic ${brand.title} supplements in Kenya. Verified products, fair prices, fast nationwide delivery, and trusted quality from ${site.name}.`
      : `Shop authentic ${brand.title} supplements in Kenya. Verified products, fair prices, fast nationwide delivery, and trusted quality from ${site.name}.`

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "website",
      url: canonicalUrl,
      siteName: site.name,
      title,
      description,
      images: brand.image ? [{ url: brand.image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: brand.image ? [brand.image] : undefined,
    },
  }
}

export default function BrandPage({ params, searchParams }: BrandPageProps) {
  const brandSlug = params.then((p) => p.brandSlug)
  const brandSearchParams = searchParams.then(parseBrandSearchParams)

  const getFilters = async () => getBrandFilters(await brandSlug)

  return (
    <div className="space-y-10">
      <React.Suspense fallback={<BrandBreadcrumbsSkeleton />}>
        <BrandBreadcrumbs slug={brandSlug} />
      </React.Suspense>

      <div className="relative flex items-start md:min-h-[calc(100vh-4rem)] md:gap-8 lg:gap-16">
        {/* SIDEBAR  */}
        <React.Suspense fallback={<FilterSkeleton />}>
          <ProductFiltersSidebar
            getFilters={getFilters}
            filterKeys={BRAND_FILTER_KEYS}
          />
        </React.Suspense>

        {/* MAIN CONTENT   */}
        <main className="grow space-y-10">
          <React.Suspense fallback={<BrandHeaderSkeleton />}>
            <BrandHeader slug={brandSlug} />
          </React.Suspense>
          <React.Suspense fallback={<ProductCardSkeleton />}>
            <BrandProducts
              slug={brandSlug}
              searchParams={brandSearchParams}
              mobileFiltersSlot={
                <React.Suspense
                  fallback={<MobileProductFiltersTriggerSkeleton />}
                >
                  <MobileProductFilters
                    getFilters={getFilters}
                    filterKeys={BRAND_FILTER_KEYS}
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
