"use client"

import {
  GTM_ECOMMERCE_CURRENCY,
  GTM_ECOMMERCE_EVENT,
} from "@/const/gtm-ecommerce-events"
import { sendGTMEcommerceEvent } from "@/lib/analytics/ecommerce/send-gtm-ecommerce-event"
import {
  toGTMItem,
  toGTMItemsValue,
  type GTMItemInput,
} from "@/lib/analytics/ecommerce/to-gtm-item"

export function sendInquireItemPriceEvent(input: GTMItemInput): void {
  const item = toGTMItem(input)
  sendGTMEcommerceEvent({
    event: GTM_ECOMMERCE_EVENT.INQUIRE_ITEM_PRICE,
    ecommerce: {
      currency: GTM_ECOMMERCE_CURRENCY,
      value: toGTMItemsValue([item]),
      items: [item],
    },
  })
}
