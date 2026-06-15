import { titles } from "@/const/titles"
import * as z from "zod"

const titleValues = titles.map((t) => t.value)

export const addressSchema = z.object({
  title: z.enum(titleValues, {
    error: "Title is required",
  }),
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(100, "Contact name is too long"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(100, "Contact name is too long"),
  phone: z.string().regex(/^\+?[0-9]\d{1,14}$/, "Invalid phone number"),
  // Address Details
  line1: z
    .string()
    .min(1, "Primary address is required")
    .max(200, "Address is too long"),
  line2: z.string().max(200, "Address detail is too long").optional(),
  area: z.string().max(150, "Area is too long").optional(),
  landmark: z.string().max(150, "Landmark is too long").optional(),
  postalCode: z.string().length(5, "Postal code must be 5 characters long"),
  city: z.string().min(1, "City is required").max(100, "City is too long"),
  county: z
    .string()
    .min(1, "County is required")
    .max(100, "County is too long"),
  country: z
    .string()
    .min(1, "Country is required")
    .max(100, "Country is too long"),
  label: z.string().max(50, "Label is too long").optional(),
  note: z.string().max(500, "Delivery notes are too long").optional(),
  isDefault: z.boolean(),
})

export const addressWithIdSchema = addressSchema.extend({
  id: z.uuid(),
})

export const addressIdSchema = addressWithIdSchema.pick({ id: true })

export type Address = z.infer<typeof addressSchema>
export type AddressWithId = z.infer<typeof addressWithIdSchema>
export type AddressId = z.infer<typeof addressIdSchema>
