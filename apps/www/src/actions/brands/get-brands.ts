"use server"

import { ActionResult } from "@/types/action-result"
import { Brand } from "@/types/brand"
import payloadConfig from "@payload-config"
import { cacheLife, cacheTag } from "next/cache"
import { getPayload } from "payload"
import { z } from "zod"

const options = z.object({
  page: z
    .number()
    .optional()
    .default(1)
    .pipe(z.transform((val) => Math.max(1, val))),
  limit: z
    .number()
    .optional()
    .default(35)
    .pipe(z.transform((val) => Math.max(1, val))),
})

export type GetBrandsOptions = z.input<typeof options>

export type GetBrandsData = {
  brands: Brand[]
  totalBrands: number
  pagingCounter: number
  hasNextPage: boolean
  hasPrevPage: boolean
  nextPage: number | null
  prevPage: number | null
  totalPages: number
  limit: number
  page?: number
}

async function findBrands(page: number, limit: number) {
  "use cache"
  cacheTag("brands")
  cacheLife("hours")

  const payload = await getPayload({ config: payloadConfig })
  return payload.find({
    collection: "brands",
    page,
    limit,
    sort: "title",
    select: {
      slug: true,
      title: true,
      supplierImageUrl: true,
      logo: true,
      updatedAt: true,
    },
  })
}

export async function getBrands(
  opts: GetBrandsOptions
): Promise<ActionResult<GetBrandsData>> {
  try {
    const { page, limit } = options.parse(opts)

    const {
      docs,
      totalDocs: totalBrands,
      pagingCounter,
      hasNextPage,
      hasPrevPage,
      nextPage,
      prevPage,
      totalPages,
      limit: responseLimit,
      page: responsePage,
    } = await findBrands(page, limit)

    return {
      success: true,
      data: {
        brands: docs.map((b) => ({
          id: b.id,
          slug: b.slug ?? "",
          title: b.title,
          image:
            (typeof b.logo === "object" && typeof b.logo?.url === "string"
              ? b.logo.url
              : b.supplierImageUrl) ?? null,
          updatedAt: b.updatedAt,
        })),
        totalBrands,
        pagingCounter,
        hasNextPage,
        hasPrevPage,
        nextPage: nextPage ?? null,
        prevPage: prevPage ?? null,
        totalPages,
        limit: responseLimit,
        page: responsePage,
      },
    }
  } catch {
    return { success: false, code: 500, message: "Failed to load brands." }
  }
}

export async function getAllBrands(): Promise<
  ActionResult<{ brands: Brand[] }>
> {
  try {
    const config = await payloadConfig
    const payload = await getPayload({ config })

    const { docs: brands } = await payload.find({
      collection: "brands",
      select: {
        slug: true,
        title: true,
        supplierImageUrl: true,
        logo: true,
        updatedAt: true,
      },
      sort: "title",
      limit: 0,
      pagination: false,
    })

    return {
      success: true,
      data: {
        brands: brands.map((b) => ({
          id: b.id,
          slug: b.slug ?? "",
          title: b.title,
          image:
            (typeof b.logo === "object" && typeof b.logo?.url === "string"
              ? b.logo?.url
              : b.supplierImageUrl) ?? null,
          updatedAt: b.updatedAt,
        })),
      },
    }
  } catch {
    return { success: false, code: 500, message: "Failed to load brands." }
  }
}
