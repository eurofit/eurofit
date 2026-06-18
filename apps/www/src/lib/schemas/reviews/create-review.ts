import * as z from "zod"

export const createReviewSchema = z.object({
  productVariant: z.uuid("A product variant is required."),
  rating: z
    .number({ error: "A rating is required." })
    .min(1, "Rating must be at least 1.")
    .max(5, "Rating must be at most 5.")
    .refine((value) => (value * 2) % 1 === 0, {
      message: "Rating must be in increments of 0.5.",
    }),
  message: z.string().trim().max(1000, "Your review is too long.").optional(),
})

export type CreateReview = z.infer<typeof createReviewSchema>
