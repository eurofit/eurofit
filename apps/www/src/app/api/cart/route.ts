import { captureError } from "@/lib/observability/capture-error"
import { getCart } from "@/lib/utils/cart/get-cart"

export async function GET() {
  try {
    const cart = await getCart()

    return Response.json({ cart })
  } catch (error) {
    captureError(error, { scope: "api.cart" })
    return Response.json({ message: "Failed to load cart." }, { status: 500 })
  }
}
