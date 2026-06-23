import { site } from "@/const/site"
import { getBrandsSitemap } from "@/lib/utils/brands/get-brands-sitemap"
import { getCategoriesSitemap } from "@/lib/utils/categories/get-categories-sitemap"
import { getPagesSitemap } from "@/lib/utils/pages/get-pages-sitemap"
import { getProductVariantsSitemap } from "@/lib/utils/product-variants/get-product-variants-sitemap"
import { MetadataRoute } from "next"

const staticRoutes: MetadataRoute.Sitemap = [
  "", // home
  "/contact-us",
  "/brands",
  "/categories",
].map((path) => ({
  url: `${site.url}${path}`,
  lastModified: new Date(),
  changeFrequency: "monthly",
  priority: path === "" ? 1 : 0.7,
}))

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [brands, categories, pages, productVariants] = await Promise.all([
    getBrandsSitemap(),
    getCategoriesSitemap(),
    getPagesSitemap(),
    getProductVariantsSitemap(),
  ])

  return [
    ...staticRoutes,
    ...categories,
    ...brands,
    ...pages,
    ...productVariants,
  ]
}
