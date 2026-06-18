"use client"

import { BrandCard, BrandsSkeleton } from "@/components/brands/brand-card"
import { useInView } from "@/hooks/use-in-view"
import { useIsMobile } from "@/hooks/use-mobile"
import { fetchBrands } from "@/lib/api/brands/get-brands"
import { useInfiniteQuery } from "@tanstack/react-query"
import { CheckCircle, CircleX } from "lucide-react"
import * as React from "react"

type BrandListProps = {
  totalBrands: number
} & React.ComponentProps<"section">

const BRANDS_LIMIT = 35

export function BrandList({ totalBrands, ...props }: BrandListProps) {
  const { data, hasNextPage, fetchNextPage, isError, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["brands"],
      queryFn: ({ pageParam }) =>
        fetchBrands({ page: pageParam, limit: BRANDS_LIMIT }),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
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
        className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 md:gap-6 lg:grid-cols-5 xl:grid-cols-6"
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
          <BrandsSkeleton length={isMobile ? 2 : 6} className="mt-8" />
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
    </section>
  )
}
