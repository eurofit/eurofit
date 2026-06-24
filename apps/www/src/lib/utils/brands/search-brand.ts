import "server-only"

import { captureError } from "@/lib/observability/capture-error"
import { buildPrefixTsQuery } from "@/lib/utils/build-prefix-ts-query"
import { brands } from "@/payload-generated-schema"
import { ActionResult } from "@/types/action-result"
import config from "@payload-config"
import { asc, sql } from "@payloadcms/db-postgres/drizzle"
import { getPayload } from "payload"
import { z } from "zod"

export type SearchBrandData = {
  brands: {
    id: string
    slug: string | null
    title: string
    image: string | null
  }[]
  totalBrands: number
}

export async function searchBrand(
  q: string
): Promise<ActionResult<SearchBrandData>> {
  const parsed = z.string().min(2).safeParse(q)

  if (!parsed.success) {
    return { success: false, code: 400, message: "Search query is too short." }
  }

  const tsQuery = buildPrefixTsQuery(parsed.data)

  // A query made up entirely of stopwords yields no searchable terms — this is
  // a valid search with zero results, not an error.
  if (!tsQuery) {
    return { success: true, data: { brands: [], totalBrands: 0 } }
  }

  try {
    const payload = await getPayload({ config })

    // we pass the tsQuery as a bound parameter into to_tsquery('english', $1)
    const matchCondition = sql`
      (
        setweight(to_tsvector('english', coalesce(${brands.title}, '')), 'A')
      ) @@ to_tsquery('english', ${tsQuery})
      `

    const brandsPromise = payload.db.drizzle
      .select({
        id: brands.id,
        slug: brands.slug,
        title: brands.title,
        image: brands.supplierImageUrl,
      })
      .from(brands)
      .where(matchCondition)
      .limit(5)
      .orderBy(asc(brands.title))

    const brandsCountPromise = payload.db.drizzle
      .select({
        count: sql<number>`CAST (COUNT(DISTINCT ${brands.id}) AS INTEGER)`,
      })
      .from(brands)
      .where(matchCondition)

    const [matchedBrands, totalCountResult] = await Promise.all([
      brandsPromise,
      brandsCountPromise,
    ])

    const totalBrands = totalCountResult[0]?.count ?? 0

    return { success: true, data: { brands: matchedBrands, totalBrands } }
  } catch (error) {
    captureError(error, { scope: "brands.search" })
    return { success: false, code: 500, message: "Failed to search brands." }
  }
}

export type SearchBrandResult = Awaited<ReturnType<typeof searchBrand>>
