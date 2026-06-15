import { buildOrderItemSnapshot } from "@/lib/orders/build-order-item-snapshot"
import { resolveAvailableStock } from "@/lib/utils/stock/resolve-available-stock"
import { Order, Product } from "@/payload-types"
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

  const { docs: productVariants } = await req.payload.find({
    collection: "product-variants",
    where: {
      id: { in: productVariantIds },
      isActive: { equals: true },
      retailPrice: { exists: true },
    },
    select: {
      sku: true,
      title: true,
      variant: true,
      expiryDate: true,
      retailPrice: true,
      stock: true,
      supplierStock: true,
      isOutOfStock: true,
      product: true,
    },
    depth: 1,
    pagination: false,
    user: userId,
    req,
  })

  if (productVariants.length !== productVariantIds.length) {
    throw new APIError(
      "One or more products in the order are not found or inactive.",
      400,
      null,
      true
    )
  }

  const correctedItems = data.items!.map((item) => {
    const itemId =
      typeof item.productVariant === "string"
        ? item.productVariant
        : item.productVariant.id

    const productVariant = productVariants.find((pv) => pv.id === itemId)

    if (!productVariant) {
      throw new APIError(
        `Product with ID ${itemId} not found.`,
        400,
        null,
        true
      )
    }

    if (productVariant.isOutOfStock) {
      throw new APIError(
        `Product with ID ${itemId} is out of stock.`,
        400,
        null,
        true
      )
    }

    const availableStock = resolveAvailableStock(
      productVariant.stock,
      productVariant.supplierStock
    )

    if (item.quantity > availableStock) {
      throw new APIError(
        `Insufficient stock for product with ID ${itemId}.`,
        400,
        null,
        true
      )
    }

    // Snapshot is always built server-side from verified DB data — client input is ignored
    const snapshot = buildOrderItemSnapshot({
      sku: productVariant.sku,
      title: productVariant.title,
      variant: productVariant.variant,
      expiryDate: productVariant.expiryDate,
      retailPrice: productVariant.retailPrice,
      product: productVariant.product as Product,
    })

    return { ...item, snapshot }
  })

  return { ...data, items: correctedItems }
}
