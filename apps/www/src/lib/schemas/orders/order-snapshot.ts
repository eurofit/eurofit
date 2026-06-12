import * as z from "zod"
import { addressWithIdSchema } from "../addresses/address"

export const orderSnapShotSchema = z.object({
  user: z.object({
    id: z.uuid("User ID must be a valid UUID"),
    fullName: z.string().min(1, "User name is required"),
    email: z.email("User email must be valid"),
  }),
  deliveryAddress: addressWithIdSchema,
})
