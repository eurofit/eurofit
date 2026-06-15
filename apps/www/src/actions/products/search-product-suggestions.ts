"use server"

import { buildPrefixTsQuery } from "@/lib/utils/build-prefix-ts-query"
import { buildProductSearchMatchCondition } from "@/lib/utils/products/build-product-search-match-condition"
import { product_variants, products } from "@/payload-generated-schema"
import payloadConfig from "@/payload.config"
import { asc, eq, sql } from "@payloadcms/db-postgres/drizzle"
import { getPayload } from "payload"
import { z } from "zod"

const inputSchema = z.object({
  query: z.string().min(2),
  limit: z.number().min(1).max(100).optional().default(5),
})

type Args = z.input<typeof inputSchema>

export async function searchProductSuggestions(args: Args) {
  const { query, limit = 5 } = inputSchema.parse(args)

  const payload = await getPayload({ config: payloadConfig })

  const tsQuery = buildPrefixTsQuery(query)

  if (!tsQuery) {
    return null
  }

  const matchCondition = buildProductSearchMatchCondition(tsQuery)

  const productsPromise = payload.db.drizzle
    .select({
      slug: products.slug,
      title: products.title,
      image: products.supplierImageUrl,
    })
    .from(products)
    .leftJoin(product_variants, eq(product_variants.product, products.id))
    .where(matchCondition)
    .groupBy(products.id)
    .limit(limit)
    .orderBy(asc(products.title))

  const productsCountPromise = payload.db.drizzle
    .select({
      count: sql<number>`CAST (COUNT(DISTINCT ${products.id}) AS INTEGER)`,
    })
    .from(products)
    .leftJoin(product_variants, eq(product_variants.product, products.id))
    .where(matchCondition)

  const [matchedProducts, totalCountResult] = await Promise.all([
    productsPromise,
    productsCountPromise,
  ])

  const totalProducts = totalCountResult[0]?.count ?? 0

  return { products: matchedProducts, totalProducts, query: query }
}

export type SearchProductResult = Awaited<
  ReturnType<typeof searchProductSuggestions>
>
