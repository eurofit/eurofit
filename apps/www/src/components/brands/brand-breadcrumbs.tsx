import { getBrand } from "@/actions/brands/get-brand"
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
}

export async function BrandBreadcrumbs({ slug }: BrandBreadcrumbsProps) {
  const brand = await getBrand({ slug: await slug })

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
          <BreadcrumbPage>{brand.title}</BreadcrumbPage>
        </BreadcrumbItem>
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
