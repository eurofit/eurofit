import * as z from "zod"

export const productSchema = z.object({
  id: z.uuid("Product ID must be a valid UUID"),
  title: z.string().min(1, "Product title is required"),
  slug: z.string().min(1, "Product slug is required"),
  image: z.string().nullable(),
})
