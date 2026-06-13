import { getAllServiceAreas } from "@/actions/service-areas/get-service-areas"
import { site } from "@/const/site"
import payloadConfig from "@/payload.config"
import { MetadataRoute } from "next"
import { cacheLife, cacheTag } from "next/cache"
import { getPayload } from "payload"

export async function getBrandAreasSitemap(): Promise<MetadataRoute.Sitemap> {
  "use cache"

  cacheTag("brands", "service-areas", "brand-areas-sitemap")
  cacheLife("days")

  const config = await payloadConfig
  const payload = await getPayload({ config })

  // Active brands that have at least one product — same rule as the brand
  // sitemap, so we never emit an empty local landing page.
  const [{ docs: brands }, serviceAreas] = await Promise.all([
    payload.find({
      collection: "brands",
      where: {
        isActive: { equals: true },
      },
      select: {
        slug: true,
        updatedAt: true,
        products: true,
      },
      joins: {
        products: { limit: 1 },
      },
      sort: "slug",
      limit: 0,
    }),
    getAllServiceAreas(),
  ])

  const brandsWithProducts = brands.filter(
    (brand) => (brand.products?.docs?.length ?? 0) > 0
  )

  return brandsWithProducts.flatMap((brand) =>
    serviceAreas.map((area) => ({
      url: `${site.url}/brands/${brand.slug}/${area.slug}`,
      // Reflect whichever record changed most recently for this combination.
      lastModified:
        brand.updatedAt > area.updatedAt ? brand.updatedAt : area.updatedAt,
    }))
  )
}
