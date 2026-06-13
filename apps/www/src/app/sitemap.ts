import { getBrandAreasSitemap } from "@/lib/utils/brands/get-brand-areas-sitemap"
import { getBrandsSitemap } from "@/lib/utils/brands/get-brands-sitemap"
import { getCategoriesSitemap } from "@/lib/utils/categories/get-categories-sitemap"
import { MetadataRoute } from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [brands, categories, brandAreas] = await Promise.all([
    getBrandsSitemap(),
    getCategoriesSitemap(),
    getBrandAreasSitemap(),
  ])

  return [...categories, ...brands, ...brandAreas]
}
