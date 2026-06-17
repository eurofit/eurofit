import { getBrands, GetBrandsData } from "@/actions/brands/get-brands"
import { JsonLd } from "@/components/json-ld"
import { getBrandListJsonLd } from "@/lib/utils/brands/get-brand-list-jsonld"
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
import { BrandList } from "./brands-list"

const BRANDS_LIMIT = 35

/**
 * Prefetches the first page of brands into a server `QueryClient` and streams it
 * to the client via `HydrationBoundary`. `BrandList` reads the hydrated
 * `["brands"]` infinite query from cache, so the grid renders in the static
 * shell with no loading skeleton — pagination is then driven client-side by
 * infinite scroll. Mirrors the cart's `CartHydrator` pattern.
 *
 * The prefetch is awaited (not `void`) so the grid is part of the prerendered
 * output rather than a streamed-in fallback. The DB read is cached
 * (`"use cache"` in `getBrands`), keeping this component static.
 */
export async function Brands() {
  const queryClient = getQueryClient()

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const result = await getBrands({ page: 1, limit: BRANDS_LIMIT })
      if (!result.success) throw new Error(result.message)
      return result.data
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: GetBrandsData) =>
      lastPage.nextPage ?? undefined,
  })

  const firstPage = queryClient.getQueryData<
    InfiniteData<GetBrandsData, number>
  >(["brands"])?.pages[0]

  if (!firstPage || !firstPage.totalBrands) {
    return <EmptyBrands />
  }

  const jsonLds = getBrandListJsonLd(firstPage)

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <JsonLd jsonLd={jsonLds} />
      <BrandList totalBrands={firstPage.totalBrands} />
    </HydrationBoundary>
  )
}

function EmptyBrands() {
  return (
    <Empty className="m-auto flex h-fit w-fit border border-dashed">
      <EmptyHeader>
        <EmptyTitle>No Brands Found</EmptyTitle>
        <EmptyDescription>
          Our brand catalogue isn&apos;t loading right now. Refresh the page or{" "}
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
