import { getCategories } from "@/lib/utils/categories/get-categories"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl

  const page = Number(searchParams.get("page")) || 1
  const limit = Number(searchParams.get("limit")) || 24

  const result = await getCategories({ page, limit })

  if (!result.success) {
    return Response.json({ message: result.message }, { status: result.code })
  }

  return Response.json(result.data)
}
