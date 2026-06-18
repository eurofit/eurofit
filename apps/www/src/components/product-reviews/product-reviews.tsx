"use client"

import { AskQuestionButton } from "@/components/product-reviews/ask-question-button"
import {
  ReviewsList,
  ReviewsListSkeleton,
} from "@/components/product-reviews/reviews-list"
import {
  ReviewsSummary,
  ReviewsSummarySkeleton,
} from "@/components/product-reviews/reviews-summary"
import {
  useReviewEligibility,
  useReviewList,
  useReviewStats,
} from "@/components/product-reviews/use-product-reviews"
import { WriteReviewDialog } from "@/components/product-reviews/write-review-dialog"
import { ReviewStats } from "@/types/review"
import { Button } from "@eurofit/ui/components/button"
import Link from "next/link"
import { usePathname } from "next/navigation"

const EMPTY_STATS: ReviewStats = {
  averageRating: 0,
  totalRatings: 0,
  distribution: [5, 4, 3, 2, 1].map((stars) => ({
    stars: stars as 1 | 2 | 3 | 4 | 5,
    count: 0,
  })),
}

type ProductReviewsProps = {
  productVariantId: string
  variant: {
    title: string
    variant?: string | null
    sku: string
  }
  currentUserId?: string
}

export function ProductReviews({
  productVariantId,
  variant,
  currentUserId,
}: ProductReviewsProps) {
  const pathname = usePathname()
  const statsQuery = useReviewStats(productVariantId)
  const listQuery = useReviewList(productVariantId)
  const eligibilityQuery = useReviewEligibility(productVariantId, currentUserId)

  const reviews = listQuery.data?.pages.flatMap((page) => page.reviews) ?? []

  const writeAction = currentUserId ? (
    eligibilityQuery.data?.canReview ? (
      <WriteReviewDialog productVariantId={productVariantId} />
    ) : null
  ) : (
    <Button asChild>
      <Link href={`/login?next=${encodeURIComponent(pathname)}`}>
        Write a review
      </Link>
    </Button>
  )

  const actions = (
    <>
      {writeAction}
      <AskQuestionButton variant={variant} />
    </>
  )

  return (
    <div className="my-6 w-full bg-muted py-6 md:p-8">
      <div className="mx-auto mt-4 mb-6 text-center">
        <h2 className="text-2xl font-bold">Customer Reviews</h2>
      </div>

      <div className="mx-auto max-w-4xl overflow-hidden rounded-lg bg-background">
        {statsQuery.isPending ? (
          <ReviewsSummarySkeleton />
        ) : (
          <ReviewsSummary
            stats={statsQuery.data ?? EMPTY_STATS}
            actions={actions}
          />
        )}

        <div className="border-t">
          {listQuery.isPending ? (
            <ReviewsListSkeleton />
          ) : (
            <ReviewsList
              reviews={reviews}
              hasNextPage={Boolean(listQuery.hasNextPage)}
              isFetchingMore={listQuery.isFetchingNextPage}
              onLoadMore={() => listQuery.fetchNextPage()}
            />
          )}
        </div>
      </div>
    </div>
  )
}
