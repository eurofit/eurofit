import "server-only"

import { computeDeliveryDateRange } from "@/lib/utils/orders/compute-delivery-date-range"
import config from "@payload-config"
import { getPayload } from "payload"

export type DeliveryDateRangeResult = { min: string; max: string } | null

export async function getDeliveryDateRange(
  city: string,
  startDate?: string
): Promise<DeliveryDateRangeResult> {
  const payload = await getPayload({ config })
  const start = startDate ? new Date(startDate) : new Date()
  const range = await computeDeliveryDateRange(city, start, payload)

  if (!range) return null

  return { min: range.min.toISOString(), max: range.max.toISOString() }
}
