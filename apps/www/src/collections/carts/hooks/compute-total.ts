import { Cart } from "@/payload-types"
import { FieldHook } from "payload"

/**
 * Field-level `afterRead` hook for the virtual `total` field. Returns the sum of
 * each item's snapshot price × quantity so reads always carry an accurate total.
 */
export const computeTotal: FieldHook<Cart, number> = ({ siblingData }) => {
  const items = (siblingData as Partial<Cart>)?.items ?? []

  return items.reduce((sum, item) => {
    const retailPrice = item.snapshot?.retailPrice ?? 0

    return sum + retailPrice * item.quantity
  }, 0)
}
