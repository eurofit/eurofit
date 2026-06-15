import "server-only"

import { Category } from "@/types/categories"
import config from "@payload-config"
import { cacheLife, cacheTag } from "next/cache"
import { getPayload } from "payload"

type GetCategoryArgs = {
  slug: string
}

type CategoryDetail = Pick<Category, "title" | "slug" | "description">

export async function getCategory({
  slug,
}: GetCategoryArgs): Promise<CategoryDetail | null> {
  "use cache"
  cacheTag("categories")
  cacheLife("hours")

  const payload = await getPayload({ config })

  const { docs: categories } = await payload.find({
    collection: "categories",
    where: {
      slug: { equals: slug },
      isActive: { equals: true },
    },
    select: {
      title: true,
      slug: true,
      description: true,
    },
    limit: 1,
    pagination: false,
  })

  const category = categories[0]

  if (!category) return null

  cacheTag(`categories:${category.id}`)

  return {
    title: category.title,
    slug: category.slug,
    description: category.description ?? null,
  }
}
