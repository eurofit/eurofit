"use client"

import { sendGTMEvent } from "@next/third-parties/google"

type SendShareEventInput = {
  method: string
  itemId: string
  userId?: string | null
}

export function sendShareEvent({
  method,
  itemId,
  userId,
}: SendShareEventInput): void {
  sendGTMEvent({
    event: "share",
    method,
    content_type: "product",
    item_id: itemId,
    user: { id: userId ?? undefined },
  })
}
