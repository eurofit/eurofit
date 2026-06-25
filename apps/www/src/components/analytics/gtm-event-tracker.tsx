"use client"

import type { GTMUserData } from "@/lib/analytics/ecommerce/send-gtm-ecommerce-event"
import { sendGTMEcommerceEvent } from "@/lib/analytics/ecommerce/send-gtm-ecommerce-event"
import { sendGTMEvent } from "@next/third-parties/google"
import * as React from "react"

/** A dataLayer payload; `event` is the GA4 event name. */
type GTMEventPayload = { event: string } & Record<string, unknown>

type GTMEventTrackerProps = {
  /** The dataLayer payload to push; must include the GA4 `event` name. */
  event: GTMEventPayload
  /**
   * Route through the ecommerce sender (which pushes `ecommerce: null` first so
   * the previous event's items don't merge in). Leave `false` for non-ecommerce
   * events (login, sign_up, search, …).
   */
  ecommerce?: boolean
  /** User identity for GA4 Enhanced Conversions. Only used when `ecommerce` is true. */
  userData?: GTMUserData
}

/**
 * Pushes a GTM event to the dataLayer once, on mount, then renders nothing. Use
 * it to fire view-style events (e.g. `view_item`) for a server-rendered page by
 * dropping it into the tree with the prepared payload.
 */
export function GTMEventTracker({
  event,
  ecommerce = false,
  userData,
}: GTMEventTrackerProps) {
  const didFireRef = React.useRef(false)

  React.useEffect(() => {
    // React StrictMode invokes effects twice in development; the ref keeps the
    // event from being pushed to the dataLayer more than once per mount.
    if (didFireRef.current) return
    didFireRef.current = true

    if (ecommerce) {
      sendGTMEcommerceEvent(
        event as Parameters<typeof sendGTMEcommerceEvent>[0],
        userData
      )
    } else {
      sendGTMEvent(event)
    }
    // Fire once per mount with the payload captured at mount time.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
