import { getBrand } from "@/actions/brands/get-brand"
import { getBrandFilters } from "@/actions/brands/get-brand-filters"
import { getTotalBrandProductVariants } from "@/actions/products/get-products-by-brand"
import { getServiceArea } from "@/actions/service-areas/get-service-area"
import {
  BrandBreadcrumbs,
  BrandBreadcrumbsSkeleton,
} from "@/components/brands/brand-breadcrumbs"
import {
  BrandHeader,
  BrandHeaderSkeleton,
} from "@/components/brands/brand-header"
import { BrandProducts } from "@/components/brands/brand-products"
import { MobileBrandFilters } from "@/components/brands/mobile-brand-filters"
import { MobileFiltersDrawerTriggerSkeleton } from "@/components/brands/mobile-filters-drawer"
import { FilterSkeleton } from "@/components/products/filter-primitives"
import { ProductCardSkeleton } from "@/components/products/product-card"
import { ProductFiltersSidebar } from "@/components/products/product-filters-sidebar"
import { site } from "@/const/site"
import { parseBrandSearchParams } from "@/lib/utils/brands/brand-search-params"
import {
  areaCanonical,
  areaMetaDescription,
  areaPageTitle,
} from "@/lib/utils/brands/build-area-copy"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import * as React from "react"

type BrandAreaPageProps = {
  params: Promise<{
    brandSlug: string
    area: string
  }>
  searchParams: Promise<{
    [k: string]: string | string[] | undefined
  }>
}

export async function generateMetadata({
  params,
}: BrandAreaPageProps): Promise<Metadata> {
  const { brandSlug, area: areaSlug } = await params

  const [brand, area, totalBrandProductVariants] = await Promise.all([
    getBrand({ slug: brandSlug }),
    getServiceArea({ slug: areaSlug }),
    getTotalBrandProductVariants(brandSlug),
  ])

  if (!brand || !area) notFound()

  const canonicalUrl = areaCanonical(brandSlug, areaSlug)
  const title = areaPageTitle(brand.title, area)
  const description = areaMetaDescription(
    brand.title,
    area,
    totalBrandProductVariants
  )

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

export default function BrandAreaPage({
  params,
  searchParams,
}: BrandAreaPageProps) {
  const brandSlug = params.then((p) => p.brandSlug)
  const area = params.then((p) => getServiceArea({ slug: p.area }))
  const brandSearchParams = searchParams.then(parseBrandSearchParams)

  const getFilters = async () => getBrandFilters(await brandSlug)

  return (
    <div className="space-y-10">
      <React.Suspense fallback={<BrandBreadcrumbsSkeleton />}>
        <BrandBreadcrumbs slug={brandSlug} area={area} />
      </React.Suspense>

      <div className="relative flex items-start md:min-h-[calc(100vh-4rem)] md:gap-8 lg:gap-16">
        {/* SIDEBAR  */}
        <React.Suspense fallback={<FilterSkeleton />}>
          <ProductFiltersSidebar getFilters={getFilters} />
        </React.Suspense>

        {/* MAIN CONTENT   */}
        <main className="grow space-y-10">
          <React.Suspense fallback={<BrandHeaderSkeleton />}>
            <BrandHeader slug={brandSlug} area={area} />
          </React.Suspense>
          <React.Suspense fallback={<ProductCardSkeleton />}>
            <BrandProducts
              slug={brandSlug}
              searchParams={brandSearchParams}
              area={area}
              mobileFiltersSlot={
                <React.Suspense
                  fallback={<MobileFiltersDrawerTriggerSkeleton />}
                >
                  <MobileBrandFilters getFilters={getFilters} />
                </React.Suspense>
              }
            />
          </React.Suspense>
        </main>
      </div>
    </div>
  )
}
