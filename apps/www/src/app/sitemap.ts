import { getBrandsSitemap } from "@/lib/utils/brands/get-brands-sitemap"
import { getCategoriesSitemap } from "@/lib/utils/categories/get-categories-sitemap"
import { MetadataRoute } from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [brands, categories] = await Promise.all([
    getBrandsSitemap(),
    getCategoriesSitemap(),
  ])

  return [...categories, ...brands]
}
