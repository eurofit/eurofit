import { getBrand } from "@/lib/utils/brands/get-brand"
import { ServiceAreaDetail } from "@/types/service-area"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@eurofit/ui/components/breadcrumb"
import { Skeleton } from "@eurofit/ui/components/skeleton"

type BrandBreadcrumbsProps = {
  slug: Promise<string>
  area?: Promise<ServiceAreaDetail | null>
}

export async function BrandBreadcrumbs({
  slug: slugPromise,
  area: areaPromise,
}: BrandBreadcrumbsProps) {
  const [slug, area] = await Promise.all([slugPromise, areaPromise ?? null])
  const brand = await getBrand({ slug })

  if (!brand) return null

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/brands">Brands</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          {area ? (
            <BreadcrumbLink href={`/brands/${slug}`}>
              {brand.title}
            </BreadcrumbLink>
          ) : (
            <BreadcrumbPage>{brand.title}</BreadcrumbPage>
          )}
        </BreadcrumbItem>
        {area && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{area.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export async function BrandBreadcrumbsSkeleton() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/brands">Brands</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <Skeleton className="h-2.5 w-20" />
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
