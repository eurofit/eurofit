import { z } from "zod"

export const updateCartQuantitySchema = z.object({
  productVariantId: z.string().min(1, "Product is required"),
  quantity: z
    .number()
    .int("Quantity must be a whole number")
    .positive("Quantity must be greater than zero"),
})

export type CartQuantity = z.infer<typeof updateCartQuantitySchema>
