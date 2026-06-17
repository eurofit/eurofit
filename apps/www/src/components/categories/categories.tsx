import {
  getCategories,
  GetCategoriesData,
} from "@/actions/categories/get-categories"
import { JsonLd } from "@/components/json-ld"
import { getCategoriesJsonLd } from "@/lib/utils/categories/get-categories-json-ld"
import { getQueryClient } from "@/providers/get-query-client"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@eurofit/ui/components/empty"
import {
  dehydrate,
  HydrationBoundary,
  type InfiniteData,
} from "@tanstack/react-query"
import { CategoryList } from "./categories-list"

const CATEGORIES_LIMIT = 24

/**
 * Prefetches the first page of categories into a server `QueryClient` and
 * streams it to the client via `HydrationBoundary`. `CategoryList` reads the
 * hydrated `["categories"]` infinite query from cache, so the grid renders in
 * the static shell with no loading skeleton — pagination is then driven
 * client-side by infinite scroll. Mirrors the cart's `CartHydrator` pattern.
 *
 * The prefetch is awaited (not `void`) so the grid is part of the prerendered
 * output rather than a streamed-in fallback. The DB read is cached
 * (`"use cache"` in `getCategories`), keeping this component static.
 */
export async function Categories() {
  const queryClient = getQueryClient()

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const result = await getCategories({ page: 1, limit: CATEGORIES_LIMIT })
      if (!result.success) throw new Error(result.message)
      return result.data
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: GetCategoriesData) =>
      lastPage.nextPage ?? undefined,
  })

  const firstPage = queryClient.getQueryData<
    InfiniteData<GetCategoriesData, number>
  >(["categories"])?.pages[0]

  if (!firstPage || !firstPage.totalCategories) {
    return <EmptyCategories />
  }

  const jsonLds = getCategoriesJsonLd(firstPage)

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <JsonLd jsonLd={jsonLds} />
      <CategoryList totalCategories={firstPage.totalCategories} />
    </HydrationBoundary>
  )
}

function EmptyCategories() {
  return (
    <Empty className="m-auto flex h-fit w-fit border border-dashed">
      <EmptyHeader>
        <EmptyTitle>No Categories Found</EmptyTitle>
        <EmptyDescription>
          Our category catalogue isn&apos;t loading right now. Refresh the page
          or{" "}
          <a
            href="https://wa.me/254110990666"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            contact us on WhatsApp
          </a>{" "}
          if this continues.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
