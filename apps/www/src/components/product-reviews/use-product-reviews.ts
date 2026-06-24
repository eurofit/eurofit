"use client"

import { REVIEWS_PER_PAGE, reviewKeys } from "@/const/reviews"
import { ReviewEligibility, ReviewListPage, ReviewStats } from "@/types/review"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) throw new Error("Request failed")
  return response.json() as Promise<T>
}

export function useReviewStats(productVariantId: string) {
  return useQuery({
    queryKey: reviewKeys.stats(productVariantId),
    queryFn: () =>
      fetchJson<ReviewStats>(
        `/api/reviews/stats?productVariant=${productVariantId}`
      ),
  })
}

export function useReviewList(productVariantId: string) {
  return useInfiniteQuery({
    queryKey: reviewKeys.list(productVariantId),
    queryFn: ({ pageParam }) =>
      fetchJson<ReviewListPage>(
        `/api/reviews?productVariant=${productVariantId}&page=${pageParam}&limit=${REVIEWS_PER_PAGE}`
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.page + 1 : undefined,
  })
}

export function useReviewEligibility(productVariantId: string) {
  return useQuery({
    queryKey: reviewKeys.eligibility(productVariantId),
    queryFn: () =>
      fetchJson<ReviewEligibility>(
        `/api/reviews/eligibility?productVariant=${productVariantId}`
      ),
  })
}
