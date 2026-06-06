"use server"

import { buildPrefixTsQuery } from "@/lib/utils/build-prefix-ts-query"
import { brands } from "@/payload-generated-schema"
import config from "@/payload.config"
import { ActionResult } from "@/types/action-result"
import { asc, sql } from "@payloadcms/db-postgres/drizzle"
import { getPayload } from "payload"
import { z } from "zod"

export type SearchBrandsData = {
  brands: { id: string; slug: string; title: string; image: string | null }[]
  totalBrands: number
}

const EMPTY: SearchBrandsData = { brands: [], totalBrands: 0 }

export async function searchBrand(
  q: string
): Promise<ActionResult<SearchBrandsData>> {
  const parsed = z.string().min(2).safeParse(q)
  if (!parsed.success) {
    return { success: true, data: EMPTY }
  }

  try {
    const payload = await getPayload({ config })

    // we pass the tsQuery as a bound parameter into to_tsquery('english', $1)
    const tsQuery = buildPrefixTsQuery(parsed.data)
    if (!tsQuery) {
      return { success: true, data: EMPTY }
    }

    const matchCondition = sql`
      (
        setweight(to_tsvector('english', coalesce(${brands.title}, '')), 'A')
      ) @@ to_tsquery('english', ${tsQuery})
    `

    const [matchedBrands, totalCountResult] = await Promise.all([
      payload.db.drizzle
        .select({
          id: brands.id,
          slug: brands.slug,
          title: brands.title,
          image: brands.supplierImageUrl,
        })
        .from(brands)
        .where(matchCondition)
        .limit(5)
        .orderBy(asc(brands.title)),

      payload.db.drizzle
        .select({
          count: sql<number>`CAST (COUNT(DISTINCT ${brands.id}) AS INTEGER)`,
        })
        .from(brands)
        .where(matchCondition),
    ])

    return {
      success: true,
      data: {
        brands: matchedBrands.map((b) => ({
          ...b,
          slug: b.slug ?? "",
          image: b.image ?? null,
        })),
        totalBrands: totalCountResult[0]?.count ?? 0,
      },
    }
  } catch {
    return { success: false, code: 500, message: "Failed to search brands." }
  }
}
