import { resolveAvailableStock } from "@/lib/utils/stock/resolve-available-stock"
import { Cart } from "@/payload-types"
import { APIError, CollectionBeforeChangeHook } from "payload"

export const validateCartItems: CollectionBeforeChangeHook<Cart> = async ({
  data,
  req,
}) => {
  const productVariantIds =
    data.items?.map((item) =>
      typeof item.productVariant === "string"
        ? item.productVariant
        : item.productVariant.id
    ) ?? []

  if (!productVariantIds.length) {
    throw new APIError(
      "Cart must have at least one item with a valid product.",
      400
    )
  }

  // find the corrosponding product line, inorder to verify prices and stocks
  const { docs: productVariants } = await req.payload.find({
    collection: "product-variants",
    where: {
      id: {
        in: productVariantIds,
      },
      isActive: {
        equals: true,
      },
      retailPrice: {
        exists: true,
      },
    },
    select: {
      retailPrice: true,
      stock: true,
      supplierStock: true,
      isOutOfStock: true,
    },
    pagination: false,
  })

  // incase some product lines not found or inactive
  if (productVariants.length !== productVariantIds.length) {
    throw new APIError(
      "One or more products in the cart are not found or inactive.",
      404,
      null,
      true
    )
  }

  data.items?.forEach((item) => {
    const itemId =
      typeof item.productVariant === "string"
        ? item.productVariant
        : item.productVariant.id
    const quantity = item.quantity
    const productVariant = productVariants.find((pl) => pl.id === itemId)

    if (!productVariant) {
      throw new APIError("Product Not Found", 404, null, true)
    }

    // check stock
    if (productVariant.isOutOfStock) {
      throw new APIError("Product is Out of Stock", 403, null, true)
    }

    // check requested quantity against available stock
    const availableStock = resolveAvailableStock(
      productVariant.stock,
      productVariant.supplierStock
    )

    if (quantity > availableStock) {
      throw new APIError("Product has low stock", 400, null, true)
    }
  })

  return data
}
