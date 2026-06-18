import {
  ReviewCard,
  ReviewCardSkeleton,
} from "@/components/product-reviews/review-card"
import { REVIEWS_PER_PAGE } from "@/const/reviews"
import { Review } from "@/types/review"
import { Button } from "@eurofit/ui/components/button"
import { Spinner } from "@eurofit/ui/components/spinner"

type ReviewsListProps = {
  reviews: Review[]
  hasNextPage: boolean
  isFetchingMore: boolean
  onLoadMore: () => void
}

export function ReviewsList({
  reviews,
  hasNextPage,
  isFetchingMore,
  onLoadMore,
}: ReviewsListProps) {
  if (reviews.length === 0) {
    return (
      <p className="p-6 text-center text-sm text-muted-foreground">
        No reviews yet. Be the first to review this product.
      </p>
    )
  }

  return (
    <div>
      <div className="divide-y">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {hasNextPage && (
        <div className="border-t p-6 text-center">
          <Button
            variant="outline"
            className="w-full"
            onClick={onLoadMore}
            disabled={isFetchingMore}
          >
            {isFetchingMore && <Spinner aria-hidden="true" />}
            {isFetchingMore ? "Loading…" : "View more reviews"}
          </Button>
        </div>
      )}
    </div>
  )
}

export function ReviewsListSkeleton({
  count = REVIEWS_PER_PAGE,
}: {
  count?: number
}) {
  return (
    <div className="divide-y">
      {Array.from({ length: count }).map((_, i) => (
        <ReviewCardSkeleton key={`review-skeleton-${i}`} />
      ))}
    </div>
  )
}
