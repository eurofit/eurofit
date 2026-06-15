import { site } from "@/const/site"
import payloadConfig from "@payload-config"
import { MetadataRoute } from "next"
import { cacheLife, cacheTag } from "next/cache"
import { getPayload } from "payload"

export async function getProductVariantsSitemap(): Promise<MetadataRoute.Sitemap> {
  "use cache"

  cacheTag("product-variants-sitemap", "product-variants:total")
  cacheLife("days")

  const config = await payloadConfig
  const payload = await getPayload({ config })

  // Active product variants only — these are the primary product landing pages.
  const { docs: productVariants } = await payload.find({
    collection: "product-variants",
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

  return productVariants.map(({ slug, updatedAt }) => ({
    url: `${site.url}/product-variants/${slug}`,
    lastModified: updatedAt,
  }))
}
