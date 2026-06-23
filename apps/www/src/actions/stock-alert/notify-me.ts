"use server"

import { getCurrentUser } from "@/actions/auth/get-current-user"
import { captureError } from "@/lib/observability/capture-error"
import { resolveAvailableStock } from "@/lib/utils/stock/resolve-available-stock"
import { ActionResult } from "@/types/action-result"
import config from "@payload-config"
import { getPayload } from "payload"
import { z } from "zod"

const createStockAlertSchema = z.object({
  productVariantId: z.string().min(1),
})

type CreateStockAlertInput = z.infer<typeof createStockAlertSchema>

export async function createStockAlert(
  input: CreateStockAlertInput
): Promise<ActionResult<{ isCreated: boolean }>> {
  const parsed = createStockAlertSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, code: 400, message: "Invalid input." }
  }

  const { productVariantId } = parsed.data

  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, code: 401, message: "You must be signed in." }
    }

    const payload = await getPayload({ config })

    const productVariant = await payload.findByID({
      collection: "product-variants",
      id: productVariantId,
      depth: 0,
    })

    const stock = resolveAvailableStock(
      productVariant.stock,
      productVariant.supplierStock
    )

    if (stock > 0) {
      return { success: true, data: { isCreated: false } }
    }

    await payload.create({
      collection: "stock-alerts",
      data: {
        user: user.id,
        productVariant: productVariantId,
      },
    })

    return { success: true, data: { isCreated: true } }
  } catch (error) {
    captureError(error, { scope: "stock-alerts.create" })
    return {
      success: false,
      code: 500,
      message: "Something went wrong. Please try again.",
    }
  }
}
