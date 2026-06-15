"use server"

import { resolveAvailableStock } from "@/lib/utils/stock/resolve-available-stock"
import config from "@payload-config"
import { getPayload } from "payload"
import { z } from "zod"

const createStockAlertSchema = z.object({
  userId: z.string().min(1),
  productVariantId: z.string().min(1),
})

type CreateStockAlertInput = z.infer<typeof createStockAlertSchema>

export async function createStockAlert(input: CreateStockAlertInput) {
  const { userId, productVariantId } = createStockAlertSchema.parse(input)

  const payload = await getPayload({ config })

  // get the user & product variant
  const [user, productVariant] = await Promise.all([
    payload.findByID({
      collection: "users",
      id: userId,
    }),
    payload.findByID({
      collection: "product-variants",
      id: productVariantId,
    }),
  ])

  if (!user) {
    throw new Error("User not found")
  }

  if (!productVariant) {
    throw new Error("Product not found")
  }

  const stock = resolveAvailableStock(
    productVariant.stock,
    productVariant.supplierStock
  )

  // product is in stock, no need to create alert
  if (stock > 0) {
    return false
  }

  await payload.create({
    collection: "stock-alerts",
    data: {
      user: userId,
      productVariant: productVariantId,
    },
  })

  return true
}
