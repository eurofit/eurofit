import { searchBrand } from "@/lib/utils/brands/search-brand"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() ?? ""

  const result = await searchBrand(q)

  if (!result.success) {
    return Response.json({ message: result.message }, { status: result.code })
  }

  return Response.json(result.data)
}
