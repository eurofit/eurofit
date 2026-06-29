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

type SendAddToWishlistEventInput = {
  item: GTMItem
  userId?: string | null
}

export function sendAddToWishlistEvent({
  item,
  userId,
}: SendAddToWishlistEventInput): void {
  sendGTMEcommerceEvent(
    {
      event: GTM_ECOMMERCE_EVENT.ADD_TO_WISHLIST,
      ecommerce: {
        currency: GTM_ECOMMERCE_CURRENCY,
        value: toGTMItemsValue([item]),
        items: [item],
      },
    },
    { id: userId ?? undefined }
  )
}
