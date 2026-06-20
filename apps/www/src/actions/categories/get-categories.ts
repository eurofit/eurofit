"use server"

import { captureError } from "@/lib/observability/capture-error"
import { ActionResult } from "@/types/action-result"
import { Category } from "@/types/categories"
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
    .default(24)
    .pipe(z.transform((val) => Math.max(1, val))),
})

export type GetCategoriesOptions = z.input<typeof options>

export type GetCategoriesData = {
  categories: Category[]
  totalCategories: number
  pagingCounter: number
  hasNextPage: boolean
  hasPrevPage: boolean
  nextPage: number | null
  prevPage: number | null
  totalPages: number
  limit: number
  page?: number
}

async function findCategories(page: number, limit: number) {
  "use cache"
  cacheTag("categories")
  cacheLife("hours")

  const payload = await getPayload({ config: payloadConfig })
  return payload.find({
    collection: "categories",
    page,
    limit,
    sort: "title",
    select: {
      slug: true,
      title: true,
      description: true,
    },
    where: {
      srcUrl: {
        exists: true,
      },
      isActive: {
        equals: true,
      },
    },
  })
}

export async function getCategories(
  opts: GetCategoriesOptions
): Promise<ActionResult<GetCategoriesData>> {
  try {
    const { page, limit } = options.parse(opts)

    const {
      docs,
      totalDocs: totalCategories,
      pagingCounter,
      hasNextPage,
      hasPrevPage,
      nextPage,
      prevPage,
      totalPages,
      limit: responseLimit,
      page: responsePage,
    } = await findCategories(page, limit)

    return {
      success: true,
      data: {
        categories: docs.map((c) => ({
          id: c.id,
          slug: c.slug ?? "",
          title: c.title,
          description: c.description ?? null,
        })),
        totalCategories,
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
  } catch (error) {
    captureError(error, { scope: "categories.get" })
    return { success: false, code: 500, message: "Failed to load categories." }
  }
}
