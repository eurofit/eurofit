"use server"

import { buildPrefixTsQuery } from "@/lib/utils/build-prefix-ts-query"
import { brands } from "@/payload-generated-schema"
import config from "@/payload.config"
import { asc, sql } from "@payloadcms/db-postgres/drizzle"
import { getPayload } from "payload"
import { z } from "zod"

export async function searchBrand(q: string) {
  const query = z.string().min(2).parse(q)
  const payload = await getPayload({ config })

  const tsQuery = buildPrefixTsQuery(query)

  if (!tsQuery) {
    return null
  }

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

  return { brands: matchedBrands, totalBrands }
}

export type SearchBrandResult = Awaited<ReturnType<typeof searchBrand>>
