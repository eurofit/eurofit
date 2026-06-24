import { getCategory } from "@/lib/utils/categories/get-category"
import { Skeleton } from "@eurofit/ui/components/skeleton"

type CategoryHeaderProps = {
  slug: Promise<string>
}

export async function CategoryHeader({
  slug: slugPromise,
}: CategoryHeaderProps) {
  const slug = await slugPromise
  const category = await getCategory({ slug })

  if (!category) return null

  return (
    <hgroup className="max-w-md space-y-2">
      <h1 className="text-balanced scroll-m-20 text-4xl font-extrabold tracking-tight">
        {category.title}
      </h1>
      {category.description && (
        <p className="text-muted-foreground">{category.description}</p>
      )}
    </hgroup>
  )
}

export function CategoryHeaderSkeleton() {
  return (
    <div className="flex items-start gap-4">
      <Skeleton className="h-9 w-64 rounded-md" />
    </div>
  )
}
