"use client"

import {
  GTM_ECOMMERCE_CURRENCY,
  GTM_ECOMMERCE_EVENT,
} from "@/const/gtm-ecommerce-events"
import { sendGTMEcommerceEvent } from "@/lib/analytics/ecommerce/send-gtm-ecommerce-event"
import {
  formattedCartItemToGTMInput,
  toGTMItems,
} from "@/lib/analytics/ecommerce/to-gtm-item"
import type { FormattedCartItem } from "@/lib/utils/cart/formatCartItem"

type SendViewCartEventInput = {
  items: FormattedCartItem[]
  value: number
  userId?: string | null
}

/** Fires the GA4 `view_cart` event for the current cart contents. */
export function sendViewCartEvent({
  items,
  value,
  userId,
}: SendViewCartEventInput): void {
  sendGTMEcommerceEvent(
    {
      event: GTM_ECOMMERCE_EVENT.VIEW_CART,
      ecommerce: {
        currency: GTM_ECOMMERCE_CURRENCY,
        value,
        items: toGTMItems(items.map(formattedCartItemToGTMInput)),
      },
    },
    { id: userId ?? undefined }
  )
}
