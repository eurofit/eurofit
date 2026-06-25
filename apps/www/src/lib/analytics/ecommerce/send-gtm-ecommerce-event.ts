"use client"

import type { GTMEcommerceEventName } from "@/const/gtm-ecommerce-events"
import { sendGTMEvent } from "@next/third-parties/google"

/** dataLayer payload for an ecommerce event — `event` is restricted to the GA4 set. */
type GTMEcommerceEventData = {
  event: GTMEcommerceEventName
} & Record<string, unknown>

/** User identity fields for GA4 Enhanced Conversions. */
export type GTMUserData = {
  email?: string
}

/**
 * Sends a GA4 ecommerce event to GTM. Per the GA4 spec it always pushes
 * `{ ecommerce: null }` first so items from a previous ecommerce event don't
 * merge into this one, then forwards the event. Use this only for ecommerce
 * events; non-ecommerce events (login, sign_up, …) call `sendGTMEvent` directly.
 *
 * @param data - the ecommerce dataLayer payload; `event` must be a GA4 ecommerce name.
 * @param userData - optional user identity data for Enhanced Conversions; defaults to `{}`.
 * @param dataLayerName - optional non-default dataLayer name, forwarded to GTM.
 */
export function sendGTMEcommerceEvent(
  data: GTMEcommerceEventData,
  userData?: GTMUserData,
  dataLayerName?: string
): void {
  sendGTMEvent({ ecommerce: null }, dataLayerName)
  sendGTMEvent({ ...data, user: userData ?? {} }, dataLayerName)
}
