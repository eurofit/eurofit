"use client"

import {
  CategoriesSkeleton,
  CategoryCard,
} from "@/components/categories/category-card"
import { useInView } from "@/hooks/use-in-view"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  fetchCategories,
  FetchCategoriesResult,
} from "@/lib/api/categories/get-categories"
import { useInfiniteQuery } from "@tanstack/react-query"
import { CheckCircle, CircleX } from "lucide-react"
import { useSearchParams } from "next/navigation"
import * as React from "react"

type CategoryListProps = {
  initialData: FetchCategoriesResult
  totalCategories: number
} & React.ComponentProps<"section">

const CATEGORIES_LIMIT = 24

export function CategoryList({
  initialData,
  totalCategories,
  ...props
}: CategoryListProps) {
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
    queryKey: ["categories"],
    queryFn: ({ pageParam = page }) =>
      fetchCategories({ page: pageParam, limit: CATEGORIES_LIMIT }),
    initialPageParam: page,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    initialData: {
      pages: [initialData],
      pageParams: [page],
    },
  })

  const categories = React.useMemo(
    () => data?.pages.flatMap((page) => page.categories) ?? [],
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
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        role="list"
        aria-label="Supplement categories available for shopping"
      >
        {categories.map((category) => (
          <li key={category.id}>
            <CategoryCard category={category} />
          </li>
        ))}
      </ul>

      {hasNextPage && (
        <div ref={ref}>
          <CategoriesSkeleton length={isMobile ? 1 : 4} className="mt-8" />
        </div>
      )}

      {isError && (
        <div
          role="alert"
          aria-live="assertive"
          className="mt-8 flex items-center justify-center gap-2"
        >
          <CircleX className="text-destructive" />
          <span>
            Couldn&apos;t load more categories. Try refreshing the page.
          </span>
        </div>
      )}

      {categories.length == totalCategories && (
        <div
          aria-live="polite"
          className="mx-auto mt-8 flex max-w-md flex-col items-center justify-center gap-2 text-center"
        >
          <CheckCircle className="text-green-600" />
          <div>
            <p> You&apos;ve seen all {categories.length} categories. </p>
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
        aria-label="Pagination navigation for categories"
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
