import { getBrandsSitemap } from "@/lib/utils/brands/get-brands-sitemap"
import { getCategoriesSitemap } from "@/lib/utils/categories/get-categories-sitemap"
import { getProductVariantsSitemap } from "@/lib/utils/product-variants/get-product-variants-sitemap"
import { MetadataRoute } from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [brands, categories, productVariants] = await Promise.all([
    getBrandsSitemap(),
    getCategoriesSitemap(),
    getProductVariantsSitemap(),
  ])

  return [...categories, ...brands, ...productVariants]
}
