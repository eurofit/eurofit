import { site } from "@/const/site"
import payloadConfig from "@/payload.config"
import { MetadataRoute } from "next"
import { cacheLife, cacheTag } from "next/cache"
import { getPayload } from "payload"

export async function getBrandsSitemap(): Promise<MetadataRoute.Sitemap> {
  "use cache"

  cacheTag("brands", "brands-sitemap")
  cacheLife("days")

  const config = await payloadConfig
  const payload = await getPayload({
    config,
  })

  // select active brands with atleast one product.
  const { docs: brandsWithProducts } = await payload.find({
    collection: "brands",
    where: {
      and: [
        {
          isActive: {
            equals: true,
          },
        },
      ],
    },
    select: {
      slug: true,
      supplierImage: true,
      updatedAt: true,
    },
    sort: "slug",
    limit: 0,
  })

  return brandsWithProducts.map(
    ({ slug, supplierImageUrl: image, updatedAt }) => ({
      url: `${site.url}/brands/${slug}`,
      lastModified: updatedAt,
      images: typeof image === "string" ? [image] : [],
    })
  )
}
