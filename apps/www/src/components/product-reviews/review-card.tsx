import { RatingStars } from "@/components/product-reviews/rating-stars"
import { Review } from "@/types/review"
import { Avatar, AvatarFallback } from "@eurofit/ui/components/avatar"
import { Badge } from "@eurofit/ui/components/badge"
import { Card } from "@eurofit/ui/components/card"
import { Skeleton } from "@eurofit/ui/components/skeleton"

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
})

export function ReviewCard({ review }: { review: Review }) {
  return (
    <Card className="rounded-none border-0 border-b p-4 shadow-none last:border-b-0">
      <div className="mb-2 flex gap-3">
        <Avatar className="size-10 shrink-0">
          <AvatarFallback>
            {review.author.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold">{review.author}</span>
            <Badge className="bg-green-50 text-green-700">Verified</Badge>
          </div>
          <RatingStars rating={review.rating} size="sm" />
        </div>
      </div>

      {review.message && (
        <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
          {review.message}
        </p>
      )}

      <span className="text-xs text-muted-foreground">
        {dateFormatter.format(new Date(review.createdAt))}
      </span>
    </Card>
  )
}

export function ReviewCardSkeleton() {
  return (
    <div className="border-b p-4 last:border-b-0">
      <div className="mb-3 flex gap-3">
        <Skeleton className="size-10 shrink-0 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3.5 w-32" />
          <Skeleton className="h-3.5 w-24" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-11/12" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  )
}
