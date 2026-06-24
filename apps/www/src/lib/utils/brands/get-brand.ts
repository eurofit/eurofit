import "server-only"

import { Brand } from "@/types/brand"
import config from "@payload-config"
import { cacheLife, cacheTag } from "next/cache"
import { getPayload } from "payload"

type GetBrandArgs = {
  slug: string
}

type BrandDetail = Pick<Brand, "title" | "slug" | "image">

type BrandLogo = string | { url?: string | null } | null | undefined

function resolveBrandImage(
  logo: BrandLogo,
  supplierImageUrl?: string | null
): string | null {
  const hasPopulatedLogo =
    !!logo && typeof logo === "object" && typeof logo.url === "string"

  return (hasPopulatedLogo ? logo.url : supplierImageUrl) ?? null
}

export async function getBrand({
  slug,
}: GetBrandArgs): Promise<BrandDetail | null> {
  "use cache"
  cacheTag("brands")
  cacheLife("hours")

  const payload = await getPayload({ config })

  const { docs: brands } = await payload.find({
    collection: "brands",
    where: {
      slug: { equals: slug },
    },
    select: {
      title: true,
      slug: true,
      supplierImageUrl: true,
      logo: true,
    },
    limit: 1,
    pagination: false,
  })

  const brand = brands[0]

  if (!brand) return null

  cacheTag(`brands:${brand.id}`)

  return {
    title: brand.title,
    slug: brand.slug ?? "",
    image: resolveBrandImage(brand.logo, brand.supplierImageUrl),
  }
}
