import { getReviewStats } from "@/lib/utils/reviews/get-review-stats"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const productVariant =
    request.nextUrl.searchParams.get("productVariant") ?? ""

  const result = await getReviewStats(productVariant)

  if (!result.success) {
    return Response.json({ message: result.message }, { status: result.code })
  }

  return Response.json(result.data)
}
