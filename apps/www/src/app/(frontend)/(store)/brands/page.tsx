import { getBrands } from "@/actions/brands/get-brands"
import { getTotalBrands } from "@/actions/brands/get-total-brands"
import heroImage from "@/assets/images/brands/hero.png"
import { BrandsSkeleton } from "@/components/brands/brand-card"
import { BrandSearchDynamic } from "@/components/brands/brand-search-dynamic"
import { Brands } from "@/components/brands/brands"
import { TotalBrands } from "@/components/brands/total-brands"
import { JsonLd } from "@/components/json-ld"
import { site } from "@/const/site"
import { getBrandListJsonLd } from "@/lib/utils/brands/get-brand-list-jsonld"
import { Metadata } from "next"
import Image from "next/image"
import * as React from "react"

export async function generateMetadata(): Promise<Metadata> {
  const result = await getTotalBrands()
  const total = result.success ? result.data.total : null
  return {
    title: "Browse Supplement & Sports Nutrition Brands in Kenya",
    description: `${total != null ? `${total}+` : "Hundreds of"} supplement and sports nutrition brands sourced from authorized European manufacturers. Vitamins, protein, pre-workout, creatine — delivered anywhere in Kenya.`,
    alternates: {
      canonical: site.url + "/brands",
    },
  }
}

const BRANDS_LIMIT = 35

type BrandsPageProps = {
  searchParams: Promise<{
    page?: string
  }>
}

export default async function BrandsPage({
  searchParams: searchParamsPromise,
}: BrandsPageProps) {
  const searchParams = await searchParamsPromise
  const page = Number(searchParams.page) || 1

  const brandsResult = await getBrands({ page, limit: BRANDS_LIMIT })

  // --- JSON LD'S ---
  const jsonLds = brandsResult.success
    ? getBrandListJsonLd(brandsResult.data)
    : []

  return (
    <main className="space-y-8 md:space-y-14">
      <JsonLd jsonLd={jsonLds} />

      <div className="relative w-full overflow-visible md:aspect-4/1">
        <Image
          src={heroImage}
          alt="Athlete Wearing  Eurofit brands shirt Hero Background Image"
          fill
          loading="eager"
          className="absolute inset-0 select-none max-md:hidden"
          draggable={false}
          fetchPriority="high"
          preload
        />

        <div className="flex md:absolute md:inset-0 md:ml-auto md:max-w-[65%]">
          <div className="relative flex h-full max-w-xl grow flex-col items-center justify-center gap-6 max-md:p-6 md:mx-auto md:before:absolute md:before:inset-0 md:before:backdrop-blur-md md:before:content-[''] md:after:absolute md:after:left-0 md:after:h-full md:after:w-2 md:after:-translate-x-1/2 md:after:backdrop-blur-xs md:after:content-['']">
            <hgroup className="relative space-y-2 text-center">
              <span className="text-sm font-medium tracking-widest text-muted-foreground uppercase">
                Every Brand. 100% Genuine.
              </span>
              <h1
                id="brand-list-heading"
                className="scroll-m-20 text-2xl font-bold tracking-tight text-pretty lg:text-3xl"
              >
                Browse{" "}
                <React.Suspense fallback={<span>...</span>}>
                  <TotalBrands />
                </React.Suspense>
                {"+ Authentic Supplement & Sports Nutrition Brands in Kenya"}
              </h1>
              <p className="text-pretty text-muted-foreground capitalize">
                Sourced from authorized European manufacturers — delivered to
                Nairobi, Mombasa, Kisumu, and everywhere in between.
              </p>
            </hgroup>
            <BrandSearchDynamic />
          </div>
        </div>
      </div>

      <React.Suspense fallback={<BrandsSkeleton />}>
        <Brands page={page} />
      </React.Suspense>
    </main>
  )
}
