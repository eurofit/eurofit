"use client"

import { sendGTMEvent } from "@next/third-parties/google"

type SendSearchEventInput = {
  searchTerm: string
}

/**
 * Fires the GA4 `search` event. `search` is a non-ecommerce event, so it is
 * pushed directly via `sendGTMEvent` rather than `sendGTMEcommerceEvent`.
 * No-ops on an empty term.
 */
export function sendSearchEvent({ searchTerm }: SendSearchEventInput): void {
  const term = searchTerm.trim()
  if (!term) return

  sendGTMEvent({
    event: "search",
    search_term: term,
  })
}
