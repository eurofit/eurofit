"use server"

import { buildPrefixTsQuery } from "@/lib/utils/build-prefix-ts-query"
import { buildProductSearchMatchCondition } from "@/lib/utils/products/build-product-search-match-condition"
import {
  brands,
  categories,
  product_variants,
  products,
  products_rels,
} from "@/payload-generated-schema"
import payloadConfig from "@/payload.config"
import { Brand } from "@/types/brand"
import { Category } from "@/types/categories"
import { FilterGroup, FilterItem } from "@/types/filter"
import { asc, eq, sql } from "@payloadcms/db-postgres/drizzle"
import sortBy from "lodash-es/sortBy"
import uniqBy from "lodash-es/uniqBy"
import { getPayload } from "payload"
import { z } from "zod"

export async function getSearchProductFilters(
  qPromise: Promise<string | undefined>
): Promise<FilterGroup[]> {
  const [payload, q] = await Promise.all([
    getPayload({ config: payloadConfig }),
    qPromise,
  ])

  const query = z.string().optional().parse(q)

  if (!query) return []

  const tsQuery = buildPrefixTsQuery(query)
  if (!tsQuery) {
    return []
  }

  const matchCondition = buildProductSearchMatchCondition(tsQuery)

  const matchedProducts = await payload.db.drizzle
    .select({
      brand: sql<Omit<Brand, "id" | "image">>`
        jsonb_build_object(
          'slug', ${brands.slug},
          'title', ${brands.title}
        )`,
      categories: sql<Omit<Category, "id">[]>`
        COALESCE(
          jsonb_agg(
            jsonb_build_object(
              'slug', ${categories.slug},
              'title', ${categories.title}
            )
          ) FILTER (WHERE ${categories.id} IS NOT NULL), 
          '[]'::jsonb
        )`,
      productLines: sql<{ size: string | null; flavorColor: string | null }[]>`
        COALESCE(
          jsonb_agg(
            jsonb_build_object(
              'size', ${product_variants.size},
              'flavorColor', ${product_variants.flavorColor}
            )
          ) FILTER (WHERE ${product_variants.id} IS NOT NULL), 
          '[]'::jsonb
        )`,
    })
    .from(products)
    .innerJoin(brands, eq(brands.id, products.brand))
    .innerJoin(product_variants, eq(product_variants.product, products.id))
    .leftJoin(products_rels, eq(products_rels.parent, products.id))
    .leftJoin(categories, eq(categories.id, products_rels.categoriesID))
    .where(matchCondition)
    .groupBy(brands.id, products.id)
    .orderBy(asc(products.title))

  // -----------------------
  // BRANDs
  // -----------------------
  const matchedBrands = matchedProducts.map((p) => p.brand)

  const brandItems: FilterItem[] = sortBy(
    Object.entries(Object.groupBy(matchedBrands, (b) => b.slug))
      .filter(([, entries]) => entries !== undefined && entries.length > 0)
      .map(([slug, entries]) => ({
        slug,
        title: entries![0]!.title ?? "",
        count: entries!.length,
      })),
    (it) => it.title
  )

  // -------------------------
  // Categories
  // For each product: extract valid categories, dedupe them by slug (so a product contributes once per category).
  // Then flatten across products, group by slug and count products per slug.
  // -------------------------
  const perProductUniqueCategories = matchedProducts.map((p) =>
    uniqBy(
      (p.categories ?? [])
        .filter((c) => typeof c === "object" && "slug" in c && "title" in c)
        .map(({ slug, title }) => ({ slug, title })),
      "slug"
    )
  )

  const flatCategories = perProductUniqueCategories.flat()

  const groupedCategories = Object.groupBy(flatCategories, (c) => c.slug)

  const categoryItems: FilterItem[] = sortBy(
    Object.entries(groupedCategories)
      .filter(([, entries]) => entries !== undefined && entries.length > 0)
      .map(([slug, entries]) => ({
        slug,
        title: entries![0]!.title,
        count: entries!.length,
      })),
    (it) => it.title
  )

  // -------------------------
  // Sizes and Flavor/Color from product-lines
  // For each product: extract product-lines, map to size/flavor, dedupe per product,
  // then flatten across products, group by slug and count.
  // -------------------------
  const perProductPLs = matchedProducts.map((p) =>
    (p.productLines ?? [])
      .map((pl) => ({
        size: pl.size ? String(pl.size) : "",
        flavor: pl.flavorColor ? String(pl.flavorColor) : "",
      }))
      .filter((pl) => pl.size || pl.flavor)
  )

  // Per product unique sizes (dedupe size within single product)
  const perProductUniqueSizes = perProductPLs.map((pls) =>
    uniqBy(
      pls
        .filter((pl) => pl.size)
        .map((pl) => ({ slug: String(pl.size), title: String(pl.size) })),
      "slug"
    )
  )

  const flatSizes = perProductUniqueSizes.flat()
  const groupedSizes = Object.groupBy(flatSizes, (s) => s.slug)
  const sizeItems: FilterItem[] = sortBy(
    Object.entries(groupedSizes)
      .filter(([, entries]) => entries !== undefined && entries.length > 0)
      .map(([rawSlug, entries]) => ({
        slug: encodeURIComponent(rawSlug),
        title: entries![0]!.title,
        count: entries!.length,
      })),
    (it) => it.title
  )

  // Per product unique flavors (dedupe flavor within single product)
  const perProductUniqueFlavors = perProductPLs.map((pls) =>
    uniqBy(
      pls
        .filter((pl) => pl.flavor)
        .map((pl) => ({ slug: String(pl.flavor), title: String(pl.flavor) })),
      "slug"
    )
  )

  const flatFlavors = perProductUniqueFlavors.flat()
  const groupedFlavors = Object.groupBy(flatFlavors, (f) => f.slug)
  const flavorItems: FilterItem[] = sortBy(
    Object.entries(groupedFlavors)
      .filter(([, entries]) => entries !== undefined && entries.length > 0)
      .map(([rawSlug, entries]) => ({
        slug: encodeURIComponent(rawSlug),
        title: entries![0]!.title,
        count: entries!.length,
      })),
    (it) => it.title
  )

  const filters: FilterGroup[] = [
    { key: "brand", title: "Brands", items: brandItems },
    { key: "category", title: "Categories", items: categoryItems },
    { key: "size", title: "Sizes", items: sizeItems },
    { key: "flavour-colour", title: "Flavour / Colour", items: flavorItems },
  ]

  return filters.filter((group) => group.items.length > 0)
}
