import { RatingStar, ReviewStats } from "@/types/review"
import config from "@payload-config"
import { sql } from "@payloadcms/db-postgres"
import { getPayload } from "payload"

const STARS_DESC: RatingStar[] = [5, 4, 3, 2, 1]

type StatsRow = {
  average_rating: number | null
  total_ratings: number | null
  star: number
  star_count: number
}

function emptyDistribution() {
  return STARS_DESC.map((stars) => ({ stars, count: 0 }))
}

const EMPTY_STATS: ReviewStats = {
  averageRating: 0,
  totalRatings: 0,
  distribution: emptyDistribution(),
}

/**
 * Aggregates the rating stats for a single variant via direct SQL. Returns the
 * true average, the total count, and the 1–5 star distribution (half-stars are
 * bucketed to the nearest whole star). Shared by the stats endpoint and
 * `getProductVariantBySlug`.
 */
export async function getVariantReviewStats(
  productVariantId: string
): Promise<ReviewStats> {
  const payload = await getPayload({ config })

  const { rows } = (await payload.db.drizzle.execute(sql`
    WITH active_reviews AS (
      SELECT rating
      FROM product_reviews
      WHERE product_variant_id = ${productVariantId} AND is_active = true
    )
    SELECT
      (SELECT COALESCE(ROUND(AVG(rating), 2), 0)::float FROM active_reviews) AS average_rating,
      (SELECT COUNT(*)::int FROM active_reviews) AS total_ratings,
      ROUND(rating)::int AS star,
      COUNT(*)::int AS star_count
    FROM active_reviews
    GROUP BY ROUND(rating)
  `)) as { rows: StatsRow[] }

  const summary = rows[0]
  if (!summary) return EMPTY_STATS

  const countByStar = new Map<number, number>()
  for (const row of rows) {
    countByStar.set(row.star, (countByStar.get(row.star) ?? 0) + row.star_count)
  }

  return {
    averageRating: summary.average_rating ?? 0,
    totalRatings: summary.total_ratings ?? 0,
    distribution: STARS_DESC.map((stars) => ({
      stars,
      count: countByStar.get(stars) ?? 0,
    })),
  }
}
