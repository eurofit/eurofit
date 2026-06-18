import { RatingStars } from "@/components/product-reviews/rating-stars"
import { ReviewStats } from "@/types/review"
import { Progress } from "@eurofit/ui/components/progress"
import { Skeleton } from "@eurofit/ui/components/skeleton"
import { Star } from "lucide-react"
import pluralize from "pluralize-esm"

type ReviewsSummaryProps = {
  stats: ReviewStats
  actions?: React.ReactNode
}

function RatingDistribution({ stats }: { stats: ReviewStats }) {
  return (
    <div className="space-y-2">
      {stats.distribution.map((item) => (
        <div key={item.stars} className="flex items-center gap-3">
          <div className="flex w-8 items-center gap-1">
            <span className="text-sm font-medium">{item.stars}</span>
            <Star
              aria-hidden="true"
              className="size-3 fill-orange-400 text-orange-400"
            />
          </div>
          <Progress
            value={
              stats.totalRatings > 0
                ? (item.count / stats.totalRatings) * 100
                : 0
            }
            className="h-2 flex-1"
          />
          <span className="w-6 text-right text-xs text-muted-foreground">
            {item.count}
          </span>
        </div>
      ))}
    </div>
  )
}

export function ReviewsSummary({ stats, actions }: ReviewsSummaryProps) {
  const { averageRating, totalRatings } = stats

  return (
    <div className="flex flex-col gap-8 p-6 md:flex-row">
      {/* Score */}
      <div className="flex flex-col items-center gap-2 md:items-start">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold">{averageRating.toFixed(1)}</span>
          <span className="text-2xl text-muted-foreground">/5</span>
        </div>
        <RatingStars rating={averageRating} size="md" />
        <p className="mt-2 text-xs text-muted-foreground">
          {totalRatings > 0
            ? `Based on ${totalRatings} verified ${pluralize("review", totalRatings)}`
            : "No reviews yet"}
        </p>
      </div>

      {/* Distribution */}
      <div className="flex-1">
        <RatingDistribution stats={stats} />
      </div>

      {/* Actions */}
      {actions && (
        <div className="flex flex-col gap-3 md:ml-auto md:w-44">{actions}</div>
      )}
    </div>
  )
}

export function ReviewsSummarySkeleton() {
  return (
    <div className="flex flex-col gap-8 p-6 md:flex-row">
      <div className="flex flex-col items-center gap-2 md:items-start">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-5 w-28" />
        <Skeleton className="mt-2 h-3 w-32" />
      </div>
      <div className="flex-1 space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={`dist-skeleton-${i}`} className="flex items-center gap-3">
            <Skeleton className="h-3 w-8" />
            <Skeleton className="h-2 flex-1" />
            <Skeleton className="h-3 w-6" />
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-3 md:ml-auto md:w-44">
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
      </div>
    </div>
  )
}
