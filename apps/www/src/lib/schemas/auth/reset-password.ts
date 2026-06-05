import z from "zod"

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .max(128, { message: "Password must be at most 128 characters long" }),
    confirmPassword: z.string(),

    token: z.string().min(1, "Token is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    error: "Passwords do not match",
  })

export type ResetPasswordData = z.infer<typeof resetPasswordSchema>
