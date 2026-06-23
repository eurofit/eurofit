"use client"

import {
  GTM_ECOMMERCE_CURRENCY,
  GTM_ECOMMERCE_EVENT,
} from "@/const/gtm-ecommerce-events"
import { sendGTMEcommerceEvent } from "@/lib/analytics/ecommerce/send-gtm-ecommerce-event"
import {
  toGTMItemsValue,
  type GTMItem,
} from "@/lib/analytics/ecommerce/to-gtm-item"

type SendRemoveFromWishlistEventInput = {
  item: GTMItem
}

export function sendRemoveFromWishlistEvent({
  item,
}: SendRemoveFromWishlistEventInput): void {
  sendGTMEcommerceEvent({
    event: GTM_ECOMMERCE_EVENT.REMOVE_FROM_WISHLIST,
    ecommerce: {
      currency: GTM_ECOMMERCE_CURRENCY,
      value: toGTMItemsValue([item]),
      items: [item],
    },
  })
}
