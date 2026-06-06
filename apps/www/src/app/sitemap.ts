import { getBrandsSitemap } from "@/actions/brands/get-brands-sitemap"
import { MetadataRoute } from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [brandsSitemap] = await Promise.all([getBrandsSitemap()])

  return [...brandsSitemap]
}
