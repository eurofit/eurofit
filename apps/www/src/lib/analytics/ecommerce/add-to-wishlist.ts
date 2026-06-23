"use client"

import {
  GTM_ECOMMERCE_CURRENCY,
  GTM_ECOMMERCE_EVENT,
} from "@/const/gtm-ecommerce-events"
import { sendGTMEcommerceEvent } from "@/lib/analytics/ecommerce/send-gtm-ecommerce-event"
import {
  toGTMWishlistEventValue,
  type GTMWishlistItem,
} from "@/lib/analytics/ecommerce/to-gtm-wishlist-item"

type SendAddToWishlistEventInput = {
  item: GTMWishlistItem
}

export function sendAddToWishlistEvent({
  item,
}: SendAddToWishlistEventInput): void {
  sendGTMEcommerceEvent({
    event: GTM_ECOMMERCE_EVENT.ADD_TO_WISHLIST,
    ecommerce: {
      currency: GTM_ECOMMERCE_CURRENCY,
      value: toGTMWishlistEventValue(item),
      items: [item],
    },
  })
}
