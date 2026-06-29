"use client"

import { useCart } from "@/hooks/use-cart"
import { getItemVariantId } from "@/lib/utils/cart/cart-items"
import { ProductVariant } from "@/types/product-variant"
import { clamp } from "lodash-es"
import { useEffect, useState } from "react"

type UseCartQuantityInput = {
  variant: Pick<ProductVariant, "id" | "stock">
}

/**
 * Binds a single product variant to its cart line. Returns the quantity to show
 * in the input (a local draft) and delegates every write to {@link useCart}'s
 * optimistic mutations. The `+`/`-` steppers commit immediately; typing only
 * updates the draft, surfacing `isDirty` so the caller can offer a "Change"
 * action that commits the typed value.
 */
export function useCartQuantity({ variant }: UseCartQuantityInput) {
  const {
    cart,
    addToCart,
    setQuantity: setCartQuantity,
    removeItem,
    isAddingToCart,
    isUpdatingQuantity,
    isRemovingItem,
  } = useCart()

  const rawLine = cart?.items?.find(
    (item) => getItemVariantId(item) === variant.id
  )
  const cartQuantity = rawLine?.quantity ?? 0
  const isInCart = cartQuantity > 0

  const max = variant.stock
  const min = isInCart ? 0 : 1

  const [draft, setDraft] = useState(1)
  const [rawInput, setRawInput] = useState("1")

  // Keep the field in step with the cart after commits and external changes, and
  // reset to a clean "add 1" once a line leaves the cart. Typing only changes
  // `draft` (not `cartQuantity`/`isInCart`), so it never refires here — that
  // divergence is exactly what `isDirty` reports.
  useEffect(() => {
    const next = isInCart ? cartQuantity : 1
    setDraft(next)
    setRawInput(String(next))
  }, [cartQuantity, isInCart])

  // While a commit is in flight the optimistic `cartQuantity` updates a tick
  // before the sync effect copies it into `draft`; gating on `isPending` keeps
  // that lag from flashing the "Change" affordance.
  const isPending = isAddingToCart || isUpdatingQuantity || isRemovingItem
  const isDirty =
    isInCart && (rawInput === "" || draft !== cartQuantity) && !isPending
  const hasQuantity = draft > 0

  const setQuantity = (next: number) => {
    const clamped = clamp(next, min, max)
    setDraft(clamped)
    setRawInput(String(clamped))
  }

  // Accepts raw text from the input. Allows empty string as an intermediate
  // state so users can clear-then-retype without seeing a "0" flash.
  const handleRawInput = (val: string) => {
    if (val !== "" && !/^\d+$/.test(val)) return
    setRawInput(val)
    if (val === "") return
    const num = parseInt(val, 10)
    if (!isNaN(num)) setDraft(clamp(num, min, max))
  }

  // Clamp rawInput to the valid draft on blur so out-of-range typed values snap
  // back to the real quantity.
  const handleRawInputBlur = () => setRawInput(String(draft))

  const commit = (next: number) =>
    setCartQuantity({ productVariantId: variant.id, quantity: next })

  const increment = () => {
    const next = clamp(draft + 1, min, max)
    if (isInCart) {
      void commit(next)
      return
    }
    setDraft(next)
    setRawInput(String(next))
  }

  const decrement = () => {
    const next = draft - 1
    if (isInCart) {
      commit(next)
      return
    }
    const clamped = clamp(next, min, max)
    setDraft(clamped)
    setRawInput(String(clamped))
  }

  const add = async () => {
    // Empty input is treated as 0 when submitted (removes from cart or no-op for new adds)
    const effectiveQuantity = rawInput === "" ? (isInCart ? 0 : 1) : draft
    if (isInCart) {
      await commit(effectiveQuantity)
      return
    }
    if (effectiveQuantity <= 0) return
    await addToCart({
      productVariantId: variant.id,
      quantity: effectiveQuantity,
      optimisticItem: { productVariant: variant.id },
    })
  }

  const remove = () => removeItem(variant.id)

  return {
    quantity: draft,
    rawInput,
    handleRawInput,
    handleRawInputBlur,
    hasQuantity,
    cartQuantity,
    isInCart,
    isDirty,
    min,
    max,
    canIncrement: draft < max,
    canDecrement: draft > min,
    setQuantity,
    increment,
    decrement,
    add,
    remove,
    isPending,
  }
}
