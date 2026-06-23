"use client"

import {
  GTM_ECOMMERCE_CURRENCY,
  GTM_ECOMMERCE_EVENT,
} from "@/const/gtm-ecommerce-events"
import { sendGTMEcommerceEvent } from "@/lib/analytics/ecommerce/send-gtm-ecommerce-event"
import {
  toGTMCartItems,
  toGTMEventValue,
} from "@/lib/analytics/ecommerce/to-gtm-cart-items"
import type { FormattedCartItem } from "@/lib/utils/cart/formatCartItem"

type SendRemoveFromCartEventInput = {
  /** The lines removed, each with `quantity` set to the amount removed (the delta). */
  items: FormattedCartItem[]
}

/**
 * Fires the GA4 `remove_from_cart` event. Each item's `quantity` must be the
 * amount removed (the delta), so the reported `value` reflects only what was
 * removed.
 */
export function sendRemoveFromCartEvent({
  items,
}: SendRemoveFromCartEventInput): void {
  if (items.length === 0) return

  const gtmItems = toGTMCartItems(items)

  sendGTMEcommerceEvent({
    event: GTM_ECOMMERCE_EVENT.REMOVE_FROM_CART,
    ecommerce: {
      currency: GTM_ECOMMERCE_CURRENCY,
      value: toGTMEventValue(gtmItems),
      items: gtmItems,
    },
  })
}
