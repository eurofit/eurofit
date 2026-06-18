import { Category } from "@/types/categories"
import { Card, CardContent } from "@eurofit/ui/components/card"
import { Skeleton } from "@eurofit/ui/components/skeleton"
import { cn } from "@eurofit/ui/lib/utils"
import { ChevronRight } from "lucide-react"
import Link from "next/link"

type CategoryCardProps = {
  category: Category
}

export function CategoryCard({ category }: CategoryCardProps) {
  const monogram = category.title.charAt(0).toUpperCase()

  return (
    <Link
      title={`Shop ${category.title} category`}
      aria-label={`View products in ${category.title}`}
      href={`/categories/${category.slug}`}
      className="group block h-full rounded-xl focus-visible:outline-none"
    >
      <Card className="h-full transition-[box-shadow,transform] duration-300 group-hover:-translate-y-0.5 group-hover:shadow-md group-hover:ring-ring group-focus-visible:ring-2 group-focus-visible:ring-ring">
        <CardContent className="flex h-full flex-col gap-3">
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-base font-medium text-muted-foreground"
            >
              {monogram}
            </span>
            <h2 className="line-clamp-1 flex-1 font-medium text-foreground">
              {category.title}
            </h2>
            <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:translate-x-0.5" />
          </div>

          <p className="line-clamp-2 min-h-[2.5rem] text-sm text-muted-foreground">
            {category.description}
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}

export function CategorySkeleton() {
  return (
    <Card className="h-full">
      <CardContent className="flex h-full flex-col gap-3">
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 shrink-0 rounded-lg" />
          <Skeleton className="h-5 flex-1" />
        </div>
        <div className="min-h-[2.5rem] space-y-1.5">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
        </div>
      </CardContent>
    </Card>
  )
}

type CategoriesSkeletonProps = React.ComponentPropsWithRef<"div"> & {
  length?: number
}

export function CategoriesSkeleton({
  length = 8,
  className,
  ...props
}: CategoriesSkeletonProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
        className
      )}
      {...props}
    >
      {Array.from({ length }).map((_, i) => (
        <CategorySkeleton key={`category-skeleton-${i}`} />
      ))}
    </div>
  )
}
