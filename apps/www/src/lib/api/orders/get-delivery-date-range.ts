import type { DeliveryDateRangeResult } from "@/lib/utils/orders/get-delivery-date-range"

export type { DeliveryDateRangeResult }

export async function getDeliveryDateRange(
  city: string,
  startDate?: string
): Promise<DeliveryDateRangeResult> {
  const params = new URLSearchParams({ city })
  if (startDate) params.set("startDate", startDate)

  const res = await fetch(`/api/delivery/date-range?${params.toString()}`)

  if (!res.ok) throw new Error("Failed to load delivery estimate.")

  return (await res.json()) as DeliveryDateRangeResult
}
