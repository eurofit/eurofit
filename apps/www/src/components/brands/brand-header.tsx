import { getBrand } from "@/actions/brands/get-brand"
import { areaH1, areaPageSubtitle } from "@/lib/utils/brands/build-area-copy"
import { ServiceAreaDetail } from "@/types/service-area"
import { Skeleton } from "@eurofit/ui/components/skeleton"

type BrandHeaderProps = {
  slug: Promise<string>
  area?: Promise<ServiceAreaDetail | null>
}

export async function BrandHeader({
  slug: slugPromise,
  area: areaPromise,
}: BrandHeaderProps) {
  const [slug, area] = await Promise.all([slugPromise, areaPromise ?? null])
  const brand = await getBrand({ slug })

  if (!brand) return null

  const title = area ? areaH1(brand.title, area) : brand.title
  const subtitle = area
    ? areaPageSubtitle(brand.title, area)
    : "Explore premium sports nutrition products designed to support your performance and goals."

  return (
    <hgroup className="max-w-md space-y-2">
      <h1 className="text-balanced scroll-m-20 text-4xl font-extrabold tracking-tight">
        {title}
      </h1>
      <p className="text-muted-foreground">{subtitle}</p>
    </hgroup>
  )
}

export function BrandHeaderSkeleton() {
  return (
    <div className="flex items-start gap-4">
      <Skeleton className="h-9 w-64 rounded-md" />
    </div>
  )
}
