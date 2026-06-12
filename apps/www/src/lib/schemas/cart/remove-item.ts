import { z } from "zod"

export const removeCartItemSchema = z.object({
  productVariantId: z.string().min(1, "Product is required"),
})

export type CartItemId = z.infer<typeof removeCartItemSchema>
