import { resolveAvailableStock } from "@/lib/utils/stock/resolve-available-stock"
import { ProductVariant, StockAlert } from "@/payload-types"
import { APIError, CollectionBeforeChangeHook } from "payload"

export const validateOutOfStock: CollectionBeforeChangeHook<
  StockAlert
> = async ({ req, operation, data }) => {
  if (operation !== "create") return data

  const pv = data.productVariant

  if (!pv) {
    throw new Error("Product Not Specified")
  }

  let productVariant: ProductVariant | null = null

  if (typeof pv === "string") {
    productVariant = await req.payload.findByID({
      collection: "product-variants",
      id: pv,
    })
  }

  if (!productVariant) {
    throw new Error("Product Not Found")
  }

  const stock = resolveAvailableStock(
    productVariant.stock,
    productVariant.supplierStock
  )

  if (stock) {
    throw new APIError(
      `Product has already stock.`,
      400,
      [
        {
          field: "productVariant",
          message: "This product has stock",
        },
      ],
      true // isPublic: true makes the error message visible in the admin UI
    )
  }

  return data
}
