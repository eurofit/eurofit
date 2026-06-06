import { getBrand } from "@/actions/brands/get-brand"
import { site } from "@/constants/site"
import { Brand as BrandSchema, WithContext } from "schema-dts"
import { JsonLd } from "./json-ld"
import { Skeleton } from "./ui/skeleton"

type BrandHeaderProps = {
  slug: Promise<string>
}

export async function BrandHeader({ slug: slugPromise }: BrandHeaderProps) {
  const slug = await slugPromise
  const brand = await getBrand({ slug })

  const brandUrl = `${site.url}/brands/${slug}`

  const brandJsonLd: WithContext<BrandSchema> = {
    "@context": "https://schema.org",
    "@type": "Brand",
    "@id": `${brandUrl}#brand`,
    name: brand.title,
    url: brandUrl,
    logo: brand.image,
  }

  return (
    <>
      <JsonLd jsonLd={brandJsonLd} />
      <div className="flex items-start gap-4">
        <h1 className="text-balanced scroll-m-20 text-4xl font-extrabold tracking-tight">
          {brand.title}
        </h1>
      </div>
    </>
  )
}

export function BrandHeaderSkeleton() {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-20 rounded-md" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-62.5" />
        <Skeleton className="h-4 w-50" />
      </div>
    </div>
  )
}
