import { orderItemSnapShotSchema } from "@/lib/schemas/orders/item-snapshort"
import { Order } from "@/payload-types"
import { APIError, CollectionBeforeChangeHook } from "payload"

export const validateOrderItems: CollectionBeforeChangeHook<Order> = async ({
  data,
  req,
}) => {
  const userId = typeof req.user === "string" ? req.user : req.user?.id

  const productVariantIds =
    data.items?.map((item) =>
      typeof item.productVariant === "string"
        ? item.productVariant
        : item.productVariant.id
    ) ?? []

  if (!productVariantIds.length) {
    throw new APIError(
      "Order must have at least one item with a valid product variant.",
      400,
      null,
      true
    )
  }

  // find the corrosponding product line, inorder to verify prices and stocks
  const { docs: productVariants } = await req.payload.find({
    collection: "product-variants",
    where: {
      id: {
        in: productVariantIds,
      },
      active: {
        equals: true,
      },
      retailPrice: {
        exists: true,
      },
    },
    select: {
      retailPrice: true,
      stock: true,
      srcStock: true,
      isOutOfStock: true,
    },
    pagination: false,
    user: userId,
    req,
  })

  // incase some product lines not found or inactive
  if (productVariants.length !== productVariantIds.length) {
    throw new APIError(
      "One or more products in the order are not found or inactive.",
      400,
      null,
      true
    )
  }

  for (const item of data.items!) {
    const itemId =
      typeof item.productVariant === "string"
        ? item.productVariant
        : item.productVariant.id
    const quantity = item.quantity
    const productVariant = productVariants.find((pl) => pl.id === itemId)

    if (!productVariant) {
      throw new Error(`Product line with ID ${itemId} not found.`)
    }

    // check stock
    if (productVariant.isOutOfStock) {
      throw new APIError(
        `Product line with ID ${itemId} is out of stock.`,
        400,
        null,
        true
      )
    }

    // check requested quantity against available stock
    const availableStock = productVariant.stock ?? productVariant.supplierStock

    if (quantity > availableStock) {
      throw new Error(`Insufficient stock for product line with ID ${itemId}.`)
    }

    const itemSnapshot = orderItemSnapShotSchema.parse(item.snapshot)

    // validate price
    if (itemSnapshot.price !== productVariant.retailPrice) {
      throw new APIError(
        `Price mismatch for product line with ID ${itemId}.`,
        400,
        null,
        true
      )
    }
  }

  return data
}
