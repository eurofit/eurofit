import { CategoriesSkeleton } from "@/components/categories/category-card"
import { Skeleton } from "@eurofit/ui/components/skeleton"

export default function Loading() {
  return (
    <main className="space-y-8 md:space-y-14">
      <div className="mx-auto mb-8 flex max-w-xl flex-col items-center space-y-3">
        <Skeleton className="h-4 w-44" />
        <Skeleton className="h-8 w-80 max-w-full" />
        <Skeleton className="h-4 w-full max-w-md" />
        <Skeleton className="h-4 w-3/4 max-w-md" />
      </div>

      <CategoriesSkeleton length={12} />
    </main>
  )
}
