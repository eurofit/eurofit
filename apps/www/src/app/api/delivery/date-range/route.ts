import { getDeliveryDateRange } from "@/lib/utils/orders/get-delivery-date-range"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const city = request.nextUrl.searchParams.get("city")?.trim() ?? ""
  const startDate = request.nextUrl.searchParams.get("startDate") ?? undefined

  if (!city) return Response.json(null)

  const result = await getDeliveryDateRange(city, startDate)

  return Response.json(result)
}
