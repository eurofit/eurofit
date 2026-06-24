import { getWishlistStatus } from "@/lib/utils/wishlists/get-wishlist-status"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const productVariant =
    request.nextUrl.searchParams.get("productVariant") ?? ""

  const status = await getWishlistStatus(productVariant)

  return Response.json(status)
}
