"use client"

import { sendGTMEvent } from "@next/third-parties/google"

type SendShareEventInput = {
  method: string
  itemId: string
}

export function sendShareEvent({ method, itemId }: SendShareEventInput): void {
  sendGTMEvent({
    event: "share",
    method,
    content_type: "product",
    item_id: itemId,
  })
}
