import { site } from "@/const/site"
import payloadConfig from "@payload-config"
import { MetadataRoute } from "next"
import { cacheLife, cacheTag } from "next/cache"
import { getPayload } from "payload"

export async function getPagesSitemap(): Promise<MetadataRoute.Sitemap> {
  "use cache"

  cacheTag("pages", "pages-sitemap")
  cacheLife("days")

  const config = await payloadConfig
  const payload = await getPayload({ config })

  const { docs: pages } = await payload.find({
    collection: "pages",
    where: {
      isActive: {
        equals: true,
      },
    },
    select: {
      slug: true,
      updatedAt: true,
    },
    sort: "slug",
    limit: 0,
  })

  return pages.map(({ slug, updatedAt }) => ({
    url: `${site.url}/${slug}`,
    lastModified: updatedAt,
  }))
}
