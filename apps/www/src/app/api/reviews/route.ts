import { REVIEWS_PER_PAGE } from "@/const/reviews"
import { getReviews } from "@/lib/utils/reviews/get-reviews"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl

  const productVariant = searchParams.get("productVariant") ?? ""
  const page = Number(searchParams.get("page")) || 1
  const limit = Number(searchParams.get("limit")) || REVIEWS_PER_PAGE

  const result = await getReviews({ productVariant, page, limit })

  if (!result.success) {
    return Response.json({ message: result.message }, { status: result.code })
  }

  return Response.json(result.data)
}
