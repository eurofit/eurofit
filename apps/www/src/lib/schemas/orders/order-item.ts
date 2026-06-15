import * as z from "zod"
import { orderItemSnapShotSchema } from "./item-snapshort"

export const orderItem = z.object({
  id: z.uuid("Product variant ID must be a valid UUID"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  snapshot: orderItemSnapShotSchema,
})
