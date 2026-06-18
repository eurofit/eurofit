import { CART_QUERY_KEY } from "@/const/cart"
import { getCart } from "@/lib/utils/cart/get-cart"
import { getQueryClient } from "@/providers/get-query-client"
import {
  dehydrate,
  type DehydratedState,
  HydrationBoundary,
} from "@tanstack/react-query"

/**
 * Prefetches the current owner's cart and returns its dehydrated state.
 *
 * `"use cache: private"` lets the cookie-scoped read (`getCart`) and the
 * `Date.now()` that `prefetchQuery` stamps run inside a cache scope under
 * `cacheComponents`. Unlike plain `"use cache"`, a private cache is stored only
 * in the browser's memory — never on the server — so it stays per-user with no
 * cross-request leak. The guest cookie is guaranteed to exist by the middleware
 * (`proxy.ts`), so `getCart` only reads cookies here and never writes inside the
 * cached scope.
 *
 * `prefetchQuery` captures any error into the query state rather than throwing,
 * so a failed read never crashes render or surfaces an error message.
 */
async function getCartHydration(): Promise<DehydratedState> {
  "use cache: private"

  const queryClient = getQueryClient()

  await queryClient.prefetchQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: getCart,
  })

  return dehydrate(queryClient)
}

/**
 * Streams the prefetched cart into the shared client cache via a childless
 * `HydrationBoundary`. Rendered inside its own `<Suspense>` so the dynamic,
 * cookie-scoped read never blocks the rest of the layout.
 *
 * The global `QueryClientProvider` already wraps every consumer, so this needs
 * no children — `useCart()` reads the hydrated `["cart"]` query from the same
 * cache anywhere on the page.
 */
export async function CartHydrator() {
  return <HydrationBoundary state={await getCartHydration()} />
}
