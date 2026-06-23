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

type SendRemoveFromWishlistEventInput = {
  item: GTMWishlistItem
}

export function sendRemoveFromWishlistEvent({
  item,
}: SendRemoveFromWishlistEventInput): void {
  sendGTMEcommerceEvent({
    event: GTM_ECOMMERCE_EVENT.REMOVE_FROM_WISHLIST,
    ecommerce: {
      currency: GTM_ECOMMERCE_CURRENCY,
      value: toGTMWishlistEventValue(item),
      items: [item],
    },
  })
}
