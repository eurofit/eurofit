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

type SendBeginCheckoutEventInput = {
  items: FormattedCartItem[]
  value: number
}

/** Fires the GA4 `begin_checkout` event when the user advances past cart review. */
export function sendBeginCheckoutEvent({
  items,
  value,
}: SendBeginCheckoutEventInput): void {
  sendGTMEcommerceEvent({
    event: GTM_ECOMMERCE_EVENT.BEGIN_CHECKOUT,
    ecommerce: {
      currency: GTM_ECOMMERCE_CURRENCY,
      value,
      items: toGTMItems(items.map(formattedCartItemToGTMInput)),
    },
  })
}
