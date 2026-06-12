import * as z from "zod"
import { orderItem } from "./order-item"
import { orderSnapShotSchema } from "./order-snapshot"

export const orderSchema = z.object({
  items: z
    .array(orderItem)
    .nonempty("Order must have at least one item")
    .min(1),
  snapshot: orderSnapShotSchema,
})
