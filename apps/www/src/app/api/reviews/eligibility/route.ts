import { getReviewEligibility } from "@/actions/reviews/get-review-eligibility"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const productVariant =
    request.nextUrl.searchParams.get("productVariant") ?? ""

  const result = await getReviewEligibility(productVariant)

  if (!result.success) {
    return Response.json({ message: result.message }, { status: result.code })
  }

  return Response.json(result.data)
}
