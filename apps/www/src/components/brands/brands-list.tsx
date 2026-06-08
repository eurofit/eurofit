"use client"

import { BrandCard, BrandsSkeleton } from "@/components/brands/brand-card"
import { useInView } from "@/hooks/use-in-view"
import { useIsMobile } from "@/hooks/use-mobile"
import { fetchBrands, FetchBrandsResult } from "@/lib/api/brands/get-brands"
import { useInfiniteQuery } from "@tanstack/react-query"
import { CheckCircle, CircleX } from "lucide-react"
import { useSearchParams } from "next/navigation"
import * as React from "react"

type BrandListProps = {
  initialData: FetchBrandsResult
  totalBrands: number
} & React.ComponentProps<"section">

const BRANDS_LIMIT = 35

export function BrandList({
  initialData,
  totalBrands,
  ...props
}: BrandListProps) {
  const searchParams = useSearchParams()

  const page = Math.max(1, Number(searchParams.get("page")) || 1)

  const {
    data,
    hasNextPage,
    fetchNextPage,
    isError,
    isFetchingNextPage,
    hasPreviousPage,
  } = useInfiniteQuery({
    queryKey: ["brands"],
    queryFn: ({ pageParam = page }) =>
      fetchBrands({ page: pageParam, limit: BRANDS_LIMIT }),
    initialPageParam: page,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    initialData: {
      pages: [initialData],
      pageParams: [page],
    },
  })

  const brands = React.useMemo(
    () => data?.pages.flatMap((page) => page.brands) ?? [],
    [data]
  )

  const { ref, isInView } = useInView()
  const isMobile = useIsMobile()

  React.useEffect(() => {
    if (!isInView || !hasNextPage || isFetchingNextPage) return

    fetchNextPage()
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, isInView])

  return (
    <section {...props}>
      {/* --- LIST ---  */}
      <ul
        className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-10 lg:grid-cols-4 xl:grid-cols-5"
        role="list"
        aria-label="Brands available for purchase"
      >
        {brands.map((brand, index) => (
          <li key={brand.id}>
            <BrandCard {...brand} index={index} />
          </li>
        ))}
      </ul>

      {hasNextPage && (
        <div ref={ref}>
          <BrandsSkeleton length={isMobile ? 1 : 5} className="mt-10" />
        </div>
      )}

      {isError && (
        <div
          role="alert"
          aria-live="assertive"
          className="mt-10 flex items-center justify-center gap-2"
        >
          <CircleX className="text-destructive" />
          <span>Couldn&apos;t load more brands. Try refreshing the page.</span>
        </div>
      )}

      {brands.length == totalBrands && (
        <div
          aria-live="polite"
          className="mx-auto mt-8 flex max-w-md flex-col items-center justify-center gap-2 text-center"
        >
          <CheckCircle className="text-green-600" />
          <div>
            <p> You&apos;ve seen all {brands.length} brands. </p>
            <p className="text-sm">
              Can&apos;t find what you need?{" "}
              <a
                href="https://wa.me/254110990666"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Message us on WhatsApp.
              </a>
            </p>
          </div>
        </div>
      )}

      {/* --- SEO NAV (hidden but crawlable) --- */}
      <nav
        className="h-px overflow-hidden text-[1px] opacity-5"
        aria-label="Pagination navigation for brands"
      >
        {hasPreviousPage && (
          <a href={`?page=${page - 1}`} rel="prev">
            Previous
          </a>
        )}
        {hasNextPage && (
          <a href={`?page=${page + 1}`} rel="next">
            Next
          </a>
        )}
      </nav>
    </section>
  )
}
