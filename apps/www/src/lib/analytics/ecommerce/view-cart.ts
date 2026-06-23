"use client"

import {
  GTM_ECOMMERCE_CURRENCY,
  GTM_ECOMMERCE_EVENT,
} from "@/const/gtm-ecommerce-events"
import { sendGTMEcommerceEvent } from "@/lib/analytics/ecommerce/send-gtm-ecommerce-event"
import { toGTMCartItems } from "@/lib/analytics/ecommerce/to-gtm-cart-items"
import type { FormattedCartItem } from "@/lib/utils/cart/formatCartItem"

type SendViewCartEventInput = {
  items: FormattedCartItem[]
  value: number
}

/** Fires the GA4 `view_cart` event for the current cart contents. */
export function sendViewCartEvent({
  items,
  value,
}: SendViewCartEventInput): void {
  sendGTMEcommerceEvent({
    event: GTM_ECOMMERCE_EVENT.VIEW_CART,
    ecommerce: {
      currency: GTM_ECOMMERCE_CURRENCY,
      value,
      items: toGTMCartItems(items),
    },
  })
}
