import { cn } from "@eurofit/ui/lib/utils"
import { Star } from "lucide-react"

const SIZE_MAP = {
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
} as const

type RatingStarsProps = {
  /** Rating value (supports halves, e.g. 4.5). */
  rating: number
  size?: keyof typeof SIZE_MAP
  className?: string
}

/**
 * Read-only 5-star display. Half-stars are rounded to the nearest whole star
 * for the filled count. Shared across the summary, cards, and product info.
 */
export function RatingStars({
  rating,
  size = "sm",
  className,
}: RatingStarsProps) {
  const filled = Math.round(rating)

  return (
    <div
      className={cn("flex gap-0.5", className)}
      role="img"
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          aria-hidden="true"
          className={cn(
            SIZE_MAP[size],
            i < filled
              ? "fill-orange-400 text-orange-400"
              : "text-muted-foreground/40"
          )}
        />
      ))}
    </div>
  )
}
