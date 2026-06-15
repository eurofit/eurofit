import { productSchema } from "@/lib/schemas/products/product"
import * as z from "zod"

export const orderItemSnapShotSchema = z.object({
  sku: z.string().length(6, "Product variant SKU must be exactly 6 characters"),
  variant: z.string().min(1, "Product variant variant is required"),
  price: z.number().min(0, "Price must be a positive number"),
  title: z.string().min(1, "Product variant title is required"),
  bbe: z
    .string()
    .min(1, "Product variant BBE is required")
    .nullable()
    .optional(),
  product: productSchema,
})
