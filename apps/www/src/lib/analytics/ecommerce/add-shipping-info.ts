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

const SHIPPING_TIER = "Standard Delivery"

type SendAddShippingInfoEventInput = {
  items: FormattedCartItem[]
  value: number
  userId?: string | null
}

export function sendAddShippingInfoEvent({
  items,
  value,
  userId,
}: SendAddShippingInfoEventInput): void {
  sendGTMEcommerceEvent(
    {
      event: GTM_ECOMMERCE_EVENT.ADD_SHIPPING_INFO,
      ecommerce: {
        currency: GTM_ECOMMERCE_CURRENCY,
        value,
        shipping_tier: SHIPPING_TIER,
        items: toGTMItems(items.map(formattedCartItemToGTMInput)),
      },
    },
    { id: userId ?? undefined }
  )
}
