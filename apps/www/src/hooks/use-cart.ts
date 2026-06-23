"use client"

import { addCartItem } from "@/actions/cart/add-cart-item"
import { createCart } from "@/actions/cart/create-cart"
import { deleteCart } from "@/actions/cart/delete-cart"
import { removeCartItem } from "@/actions/cart/remove-cart-item"
import { updateCartItemQuantity } from "@/actions/cart/update-cart-item-quantity"
import { CART_QUERY_KEY } from "@/const/cart"
import { sendAddToCartEvent } from "@/lib/analytics/ecommerce/add-to-cart"
import { sendRemoveFromCartEvent } from "@/lib/analytics/ecommerce/remove-from-cart"
import { fetchCart } from "@/lib/api/cart/get-cart"
import { computeCartTotals } from "@/lib/utils/cart/cart-totals"
import { formatCartItem } from "@/lib/utils/cart/formatCartItem"
import {
  applyAddToCart,
  applyRemoveItem,
  applySetQuantity,
  CartItemPreview,
} from "@/lib/utils/cart/optimistic-cart"
import { unwrapActionResult } from "@/lib/utils/unwrap-action-result"
import { Cart } from "@/payload-types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

type AddToCart = {
  productVariantId: string
  quantity: number
  optimisticItem?: CartItemPreview
}
type SetQuantity = { productVariantId: string; quantity: number }
type CartRollback = { previousCart: Cart | null }

/**
 * Finds a variant's line in a cart snapshot and formats it for analytics. Matches
 * on the variant id whether the line's `productVariant` is populated or a raw id.
 */
function formatLine(cart: Cart | null, productVariantId: string) {
  const line = cart?.items?.find((item) => {
    const variant = item.productVariant
    return typeof variant === "object"
      ? variant.id === productVariantId
      : variant === productVariantId
  })
  return line ? formatCartItem(line) : null
}

/**
 * Client cart state + mutations. Mutations orchestrate the single-purpose server
 * actions from the current cart snapshot and apply optimistic cache updates with
 * rollback, then reconcile via an `onSettled` refetch (strict cascades like
 * deleting an emptied cart are enforced server-side).
 */
export function useCart() {
  const queryClient = useQueryClient()

  const {
    data: cart = null,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: fetchCart,
  })

  const items = cart?.items.map(formatCartItem) ?? []
  const { subtotal, discountTotal } = computeCartTotals(items)
  const total = subtotal
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const isEmpty = itemCount === 0

  const withOptimisticCart = <TInput>(
    applyOptimistic: (cart: Cart | null, input: TInput) => Cart | null
  ) => ({
    onMutate: async (input: TInput): Promise<CartRollback> => {
      await queryClient.cancelQueries({ queryKey: CART_QUERY_KEY })
      const previousCart =
        queryClient.getQueryData<Cart | null>(CART_QUERY_KEY) ?? null
      queryClient.setQueryData<Cart | null>(
        CART_QUERY_KEY,
        applyOptimistic(previousCart, input)
      )
      return { previousCart }
    },
    onError: (
      _error: unknown,
      _input: TInput,
      rollback: CartRollback | undefined
    ) => {
      queryClient.setQueryData(CART_QUERY_KEY, rollback?.previousCart ?? null)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY })
    },
  })

  // `addCartItem` already increments an existing line server-side, so adding only
  // needs to branch on whether a cart exists yet.
  const addToCartMutation = useMutation({
    mutationFn: async ({ productVariantId, quantity }: AddToCart) =>
      unwrapActionResult(
        cart
          ? await addCartItem({ productVariantId, quantity })
          : await createCart({ productVariantId, quantity })
      ),
    ...withOptimisticCart<AddToCart>(
      (currentCart, { productVariantId, quantity, optimisticItem }) =>
        applyAddToCart({
          cart: currentCart,
          productVariantId,
          quantity,
          optimisticItem,
        })
    ),
    // `add_to_cart` reports the amount added, so override the line's quantity
    // with the input delta rather than the resulting line total.
    onSuccess: (updatedCart, { productVariantId, quantity }) => {
      const line = formatLine(updatedCart, productVariantId)
      if (!line) return
      sendAddToCartEvent({ items: [{ ...line, quantity }] })
    },
  })

  const setQuantityMutation = useMutation({
    mutationFn: async ({ productVariantId, quantity }: SetQuantity) =>
      quantity <= 0
        ? unwrapActionResult(await removeCartItem({ productVariantId }))
        : unwrapActionResult(
            await updateCartItemQuantity({ productVariantId, quantity })
          ),
    ...withOptimisticCart<SetQuantity>(
      (currentCart, { productVariantId, quantity }) =>
        quantity <= 0
          ? applyRemoveItem({ cart: currentCart, productVariantId })
          : applySetQuantity({ cart: currentCart, productVariantId, quantity })
    ),
    // A stepper/typed change is an add or a remove depending on the delta against
    // the previous quantity. Source the line from `previousCart` so it's still
    // present even when the new quantity removed it.
    onSuccess: (_updatedCart, { productVariantId, quantity }, context) => {
      const line = formatLine(context?.previousCart ?? null, productVariantId)
      if (!line) return
      const delta = quantity - line.quantity
      if (delta > 0) {
        sendAddToCartEvent({ items: [{ ...line, quantity: delta }] })
      } else if (delta < 0) {
        sendRemoveFromCartEvent({ items: [{ ...line, quantity: -delta }] })
      }
    },
  })

  const removeItemMutation = useMutation({
    mutationFn: async (productVariantId: string) =>
      unwrapActionResult(await removeCartItem({ productVariantId })),
    ...withOptimisticCart<string>((currentCart, productVariantId) =>
      applyRemoveItem({ cart: currentCart, productVariantId })
    ),
    // The whole line leaves the cart, so `remove_from_cart` reports its full
    // pre-removal quantity from `previousCart`.
    onSuccess: (_updatedCart, productVariantId, context) => {
      const line = formatLine(context?.previousCart ?? null, productVariantId)
      if (!line) return
      sendRemoveFromCartEvent({ items: [line] })
    },
  })

  const clearCartMutation = useMutation({
    mutationFn: async () => unwrapActionResult(await deleteCart()),
    ...withOptimisticCart<void>(() => null),
  })

  return {
    cart,
    items,
    total,
    discountTotal,
    itemCount,
    isEmpty,
    isLoading,
    isError,
    refetch,

    /** Add `quantity` of a variant; creates the cart or increments as needed. */
    addToCart: ({
      productVariantId,
      quantity = 1,
      optimisticItem,
    }: {
      productVariantId: string
      quantity?: number
      optimisticItem?: CartItemPreview
    }) =>
      addToCartMutation.mutateAsync({
        productVariantId,
        quantity,
        optimisticItem,
      }),
    /** Set a variant's quantity exactly; `0` or less removes the line. */
    setQuantity: ({ productVariantId, quantity }: SetQuantity) =>
      setQuantityMutation.mutateAsync({ productVariantId, quantity }),
    /** Remove a variant; the server deletes the cart when it was the last item. */
    removeItem: (productVariantId: string) =>
      removeItemMutation.mutateAsync(productVariantId),
    /** Delete the entire cart. */
    clearCart: () => clearCartMutation.mutateAsync(),

    isAddingToCart: addToCartMutation.isPending,
    isUpdatingQuantity: setQuantityMutation.isPending,
    isRemovingItem: removeItemMutation.isPending,
    isClearingCart: clearCartMutation.isPending,
    isMutating:
      addToCartMutation.isPending ||
      setQuantityMutation.isPending ||
      removeItemMutation.isPending ||
      clearCartMutation.isPending,
  }
}
