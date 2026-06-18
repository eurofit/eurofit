export type RatingStar = 1 | 2 | 3 | 4 | 5

export type RatingDistribution = {
  stars: RatingStar
  count: number
}

export type ReviewStats = {
  averageRating: number
  totalRatings: number
  distribution: RatingDistribution[]
}

export type Review = {
  id: string
  author: string
  rating: number
  message: string | null
  createdAt: string
}

export type ReviewListPage = {
  reviews: Review[]
  totalReviews: number
  hasNextPage: boolean
  page: number
  totalPages: number
}

export type ReviewEligibility = {
  canReview: boolean
  hasReviewed: boolean
}
