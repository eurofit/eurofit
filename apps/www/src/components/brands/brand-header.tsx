import { getBrand } from "@/actions/brands/get-brand"
import { Skeleton } from "@eurofit/ui/components/skeleton"

type BrandHeaderProps = {
  slug: Promise<string>
}

export async function BrandHeader({ slug: slugPromise }: BrandHeaderProps) {
  const slug = await slugPromise
  const brand = await getBrand({ slug })

  if (!brand) return null

  return (
    <hgroup className="max-w-md space-y-2">
      <h1 className="text-balanced scroll-m-20 text-4xl font-extrabold tracking-tight">
        {brand.title}
      </h1>
      <p className="text-muted-foreground">
        Explore premium sports nutrition products designed to support your
        performance and goals.
      </p>
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
