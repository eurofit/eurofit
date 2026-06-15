import { product_variants, products } from "@/payload-generated-schema"
import { sql, type SQL } from "@payloadcms/db-postgres/drizzle"

/**
 * Builds the weighted Postgres full-text match condition shared by every
 * product search query (suggestions, filters and the results list). `tsQuery`
 * is passed as a bound parameter into `to_tsquery('english', $1)`.
 *
 * Weights: product title (A) ranks highest, then product slug / variant title,
 * sku and barcode (B), then supplier code, flavour-colour and size (C).
 */
export function buildProductSearchMatchCondition(tsQuery: string): SQL {
  return sql`
  (
    setweight(to_tsvector('english', coalesce(${products.title}, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(${products.slug}, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(${product_variants.title}, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(${product_variants.sku}, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(${product_variants.barcode}, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(${product_variants.supplierProductCode}, '')), 'C') ||
    setweight(to_tsvector('english', coalesce(${product_variants.flavorColor}, '')), 'C') ||
    setweight(to_tsvector('english', coalesce(${product_variants.size}, '')), 'C')
    ) @@ to_tsquery('english', ${tsQuery})
    `
}
