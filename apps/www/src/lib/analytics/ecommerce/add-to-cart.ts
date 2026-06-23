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

type SendAddToCartEventInput = {
  /** The lines added, each with `quantity` set to the amount added (the delta). */
  items: FormattedCartItem[]
}

/**
 * Fires the GA4 `add_to_cart` event. Each item's `quantity` must be the amount
 * added (the delta), not the resulting line total, so the reported `value`
 * reflects only what was added.
 */
export function sendAddToCartEvent({ items }: SendAddToCartEventInput): void {
  if (items.length === 0) return

  const gtmItems = toGTMCartItems(items)

  sendGTMEcommerceEvent({
    event: GTM_ECOMMERCE_EVENT.ADD_TO_CART,
    ecommerce: {
      currency: GTM_ECOMMERCE_CURRENCY,
      value: toGTMEventValue(gtmItems),
      items: gtmItems,
    },
  })
}
