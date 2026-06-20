"use server"

import { captureError } from "@/lib/observability/capture-error"
import { getPayloadImageUrl } from "@/lib/utils/payload-image"
import { resolveAvailableStock } from "@/lib/utils/stock/resolve-available-stock"
import { StockAlert } from "@/types/stock-alert"
import config from "@payload-config"
import { getPayload } from "payload"
import { z } from "zod"

const inputSchema = z.object({ userId: z.uuid() })

export async function getUserStockAlerts(
  args: z.input<typeof inputSchema>
): Promise<StockAlert[]> {
  const parsed = inputSchema.safeParse(args)
  if (!parsed.success) return []

  try {
    const payload = await getPayload({ config })

    const { docs } = await payload.find({
      collection: "stock-alerts",
      where: { user: { equals: parsed.data.userId } },
      depth: 2,
      limit: 50,
      sort: "-createdAt",
    })

    return docs.flatMap((doc) => {
      const variant = doc.productVariant
      if (typeof variant !== "object" || !variant) return []

      const product = variant.product
      const slug =
        typeof product === "object" && product
          ? `${product.slug}/${variant.slug}`
          : variant.slug

      const firstImage = Array.isArray(variant.images)
        ? variant.images[0]
        : undefined
      const image = getPayloadImageUrl(firstImage)

      const stock = resolveAvailableStock(variant.stock, variant.supplierStock)

      return [
        {
          id: doc.id,
          title: variant.title,
          slug,
          image,
          isOutOfStock: stock === 0,
        } satisfies StockAlert,
      ]
    })
  } catch (error) {
    captureError(error, { scope: "stock-alerts.get-user-alerts" })
    return []
  }
}
