import { z } from "zod"

export const resendVerificationSchema = z.object({
  email: z.email("Invalid email address"),
})

export type ResendVerificationData = z.infer<typeof resendVerificationSchema>
