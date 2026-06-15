import { Category } from "@/types/categories"
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@eurofit/ui/components/card"
import { Skeleton } from "@eurofit/ui/components/skeleton"
import { cn } from "@eurofit/ui/lib/utils"
import { ChevronRight } from "lucide-react"
import Link from "next/link"

type CategoryCardProps = {
  category: Category
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/categories/${category.slug}`} className="group block h-full">
      <Card>
        <CardHeader>
          <CardTitle className="font-medium">{category.title}</CardTitle>
          <CardAction>
            <ChevronRight className="size-4 text-muted-foreground" />
          </CardAction>
          {category.description && (
            <CardDescription>{category.description}</CardDescription>
          )}
        </CardHeader>
      </Card>
    </Link>
  )
}

export function CategorySkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="mt-2 h-3 w-full" />
        <Skeleton className="mt-1 h-3 w-4/5" />
      </CardHeader>
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
