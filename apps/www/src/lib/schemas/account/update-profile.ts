import { z } from "zod"

export const updateProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(30),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters.")
    .max(30, "Last name must not be longer than 30 characters."),
})

export type UpdateProfile = z.infer<typeof updateProfileSchema>
