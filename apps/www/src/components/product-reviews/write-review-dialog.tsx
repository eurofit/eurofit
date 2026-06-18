"use client"

import { createReview } from "@/actions/reviews/create-review"
import { reviewKeys } from "@/const/reviews"
import { env } from "@/env.mjs"
import {
  CreateReview,
  createReviewSchema,
} from "@/lib/schemas/reviews/create-review"
import { unwrapActionResult } from "@/lib/utils/unwrap-action-result"
import { Button } from "@eurofit/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@eurofit/ui/components/dialog"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@eurofit/ui/components/field"
import { Spinner } from "@eurofit/ui/components/spinner"
import { Textarea } from "@eurofit/ui/components/textarea"
import { cn } from "@eurofit/ui/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import type { TurnstileInstance } from "@marsidev/react-turnstile"
import { Turnstile } from "@marsidev/react-turnstile"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Star } from "lucide-react"
import * as React from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"

type WriteReviewDialogProps = {
  productVariantId: string
}

function StarRatingInput({
  value,
  onChange,
}: {
  value: number
  onChange: (value: number) => void
}) {
  const [hovered, setHovered] = React.useState(0)
  const active = hovered || value

  return (
    <div className="flex gap-1" onMouseLeave={() => setHovered(0)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          aria-label={`${star} ${star === 1 ? "star" : "stars"}`}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          className="rounded-sm transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <Star
            className={cn("size-7", {
              "fill-orange-400 text-orange-400": star < active,
              "text-muted-foreground/40": star > active,
            })}
          />
        </button>
      ))}
    </div>
  )
}

export function WriteReviewDialog({
  productVariantId,
}: WriteReviewDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [turnstileToken, setTurnstileToken] = React.useState<string | null>(
    null
  )
  const turnstileRef = React.useRef<TurnstileInstance | null>(null)
  const queryClient = useQueryClient()

  const form = useForm<CreateReview>({
    resolver: zodResolver(createReviewSchema),
    defaultValues: {
      productVariant: productVariantId,
      rating: 0,
      message: "",
    },
  })

  const { mutate: submitReview, isPending } = useMutation({
    mutationFn: async (values: CreateReview) =>
      unwrapActionResult(await createReview(values, turnstileToken ?? "")),
    onSuccess: () => {
      toast.success("Thanks! Your review has been published.")
      setIsOpen(false)
      form.reset()
      turnstileRef.current?.reset()
      setTurnstileToken(null)
      queryClient.invalidateQueries({
        queryKey: reviewKeys.stats(productVariantId),
      })
      queryClient.invalidateQueries({
        queryKey: reviewKeys.list(productVariantId),
      })
      queryClient.invalidateQueries({
        queryKey: reviewKeys.eligibility(productVariantId),
      })
    },
    onError: (error) => {
      turnstileRef.current?.reset()
      setTurnstileToken(null)
      toast.error(error.message ?? "Failed to submit your review.")
    },
  })

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Write a review</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Write a review</DialogTitle>
          <DialogDescription>
            Share your experience with this product. Only verified buyers can
            review.
          </DialogDescription>
        </DialogHeader>

        <form
          id="write-review-form"
          onSubmit={form.handleSubmit((values) => submitReview(values))}
        >
          <FieldGroup>
            <Controller
              control={form.control}
              name="rating"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Your rating</FieldLabel>
                  <StarRatingInput
                    value={field.value}
                    onChange={field.onChange}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="message"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="review-message">
                    Your review (optional)
                  </FieldLabel>
                  <Textarea
                    id="review-message"
                    rows={4}
                    aria-invalid={fieldState.invalid}
                    placeholder="What did you like or dislike?"
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Turnstile
              id="write-review-form-turnstile"
              ref={turnstileRef}
              siteKey={env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_INVISIBLE_SITEKEY}
              options={{ size: "invisible" }}
              onSuccess={(token) => setTurnstileToken(token)}
              onError={() => setTurnstileToken(null)}
              onExpire={() => setTurnstileToken(null)}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={!turnstileToken || isPending}
            >
              {isPending && <Spinner aria-hidden="true" />}
              {isPending ? "Submitting…" : "Submit review"}
            </Button>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}
