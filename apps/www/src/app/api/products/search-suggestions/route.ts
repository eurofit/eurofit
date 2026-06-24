import { searchProductSuggestions } from "@/lib/utils/products/search-product-suggestions"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() ?? ""

  if (q.length < 2) return Response.json(null)

  const limitParam = Number(request.nextUrl.searchParams.get("limit"))
  const limit =
    Number.isFinite(limitParam) && limitParam > 0 ? limitParam : undefined

  const result = await searchProductSuggestions({ query: q, limit })

  return Response.json(result)
}
