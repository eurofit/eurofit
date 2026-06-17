import { brands, products, service_areas } from "@/payload-generated-schema"
import payloadConfig from "@payload-config"
import { and, asc, eq, exists, sql } from "@payloadcms/db-postgres/drizzle"
import { cacheLife, cacheTag } from "next/cache"
import { getPayload } from "payload"

export const BRAND_AREAS_PAGE_SIZE = 50

export type BrandArea = {
  brand: { title: string; slug: string }
  area: { title: string; slug: string }
}

export async function getBrandAreas({
  page,
}: {
  page: number
}): Promise<BrandArea[]> {
  "use cache"

  cacheTag("brands", "service-areas")
  cacheLife("days")

  const safePage = Math.max(1, Math.trunc(page))

  const config = await payloadConfig
  const payload = await getPayload({ config })

  // Only brands that have at least one active product earn a landing page, so we
  // never emit a brand × area combination that would render empty.
  const hasActiveProduct = payload.db.drizzle
    .select({ one: sql`1` })
    .from(products)
    .where(and(eq(products.brand, brands.id), eq(products.isActive, true)))

  const rows = await payload.db.drizzle
    .select({
      brandTitle: brands.title,
      brandSlug: brands.slug,
      areaTitle: service_areas.title,
      areaSlug: service_areas.slug,
    })
    .from(brands)
    .crossJoin(service_areas)
    .where(
      and(
        eq(brands.isActive, true),
        eq(service_areas.isActive, true),
        exists(hasActiveProduct)
      )
    )
    // Deterministic order keeps pagination stable across calls.
    .orderBy(asc(brands.slug), asc(service_areas.slug))
    .limit(BRAND_AREAS_PAGE_SIZE)
    .offset((safePage - 1) * BRAND_AREAS_PAGE_SIZE)

  return rows.map((row) => ({
    brand: { title: row.brandTitle, slug: row.brandSlug },
    area: { title: row.areaTitle, slug: row.areaSlug },
  }))
}

export async function getBrandAreasTotal(): Promise<number> {
  "use cache"

  cacheTag("brands", "service-areas")
  cacheLife("days")

  const config = await payloadConfig
  const payload = await getPayload({ config })

  const hasActiveProduct = payload.db.drizzle
    .select({ one: sql`1` })
    .from(products)
    .where(and(eq(products.brand, brands.id), eq(products.isActive, true)))

  const result = await payload.db.drizzle
    .select({ count: sql<number>`CAST(COUNT(*) AS INTEGER)` })
    .from(brands)
    .crossJoin(service_areas)
    .where(
      and(
        eq(brands.isActive, true),
        eq(service_areas.isActive, true),
        exists(hasActiveProduct)
      )
    )

  return result[0]?.count ?? 0
}
