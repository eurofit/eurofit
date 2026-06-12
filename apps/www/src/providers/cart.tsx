import { CART_QUERY_KEY } from "@/const/cart"
import { getCart } from "@/lib/utils/cart/get-cart"
import { getQueryClient } from "@/providers/get-query-client"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"

/**
 * Prefetches the current owner's cart and streams it into the shared client
 * cache via a childless `HydrationBoundary`. Rendered inside its own `<Suspense>`
 * so the dynamic, cookie-scoped read never blocks the rest of the layout.
 *
 * The global `QueryClientProvider` already wraps every consumer, so this needs
 * no children — `useCart()` reads the hydrated `["cart"]` query from the same
 * cache anywhere on the page.
 *
 * `prefetchQuery` captures any error into the query state rather than throwing,
 * so a failed read never crashes render or surfaces an error message.
 */
export async function CartHydrator() {
  const queryClient = getQueryClient()

  await queryClient.prefetchQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: getCart,
  })

  return <HydrationBoundary state={dehydrate(queryClient)} />
}
