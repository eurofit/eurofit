import { addBusinessDays } from "date-fns"
import type { Payload } from "payload"

export type DeliveryDateRange = { min: Date; max: Date }

export async function computeDeliveryDateRange(
  city: string,
  startDate: Date,
  payload: Payload
): Promise<DeliveryDateRange | null> {
  const { docs } = await payload.find({
    collection: "service-areas",
    where: { title: { equals: city } },
    depth: 0,
    limit: 1,
    pagination: false,
  })

  const area = docs[0]
  const { minDays, maxDays } = area?.deliveryTime ?? {}

  if (!area || minDays == null || maxDays == null) return null

  return {
    min: addBusinessDays(startDate, minDays),
    max: addBusinessDays(startDate, maxDays),
  }
}
