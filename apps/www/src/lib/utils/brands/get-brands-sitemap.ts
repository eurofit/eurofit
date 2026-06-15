import { site } from "@/const/site"
import payloadConfig from "@payload-config"
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

  // Active brands only; we filter out brands without products below so the
  // sitemap never lists an empty brand page.
  const { docs: brands } = await payload.find({
    collection: "brands",
    where: {
      isActive: {
        equals: true,
      },
    },
    select: {
      slug: true,
      supplierImageUrl: true,
      updatedAt: true,
      products: true,
    },
    joins: {
      // We only need to know whether a brand has at least one product.
      products: { limit: 1 },
    },
    sort: "slug",
    limit: 0,
  })

  return brands
    .filter((brand) => (brand.products?.docs?.length ?? 0) > 0)
    .map(({ slug, supplierImageUrl: image, updatedAt }) => ({
      url: `${site.url}/brands/${slug}`,
      lastModified: updatedAt,
      images: typeof image === "string" ? [image] : [],
    }))
}
