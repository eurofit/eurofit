import { Skeleton } from "@eurofit/ui/components/skeleton"
import { cn } from "@eurofit/ui/lib/utils"
import * as React from "react"

function ProductFilter({ className, ...props }: React.ComponentProps<"aside">) {
  return (
    <aside
      {...props}
      className={cn(
        "mb-4 hidden basis-1/5 md:sticky md:top-20 md:flex md:max-h-[calc(100vh-5rem)] md:scrollbar-gutter-stable md:flex-col md:overflow-y-auto md:overscroll-contain",
        className
      )}
    />
  )
}
function ProductFilterHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={cn("flex items-center justify-between pb-4", className)}
    />
  )
}
function ProductFilterTitle({
  className,
  ...props
}: React.ComponentProps<"header">) {
  return (
    <hgroup
      {...props}
      className={cn(
        "flex items-center gap-2 text-base font-medium capitalize [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
    />
  )
}

function FilterGroupSkeleton() {
  return (
    <div className="border-b py-2.5">
      <div className="flex items-center justify-between py-2.5">
        <Skeleton className="h-4 w-1/3 rounded-sm" />
        <Skeleton className="size-4 rounded-sm" />
      </div>
    </div>
  )
}

function FilterSkeleton() {
  return (
    <div className="mb-4 hidden basis-1/5 flex-col md:flex">
      <div className="flex items-center justify-between pb-4">
        <Skeleton className="h-5 w-2/5" />
      </div>
      <div className="space-y-2.5 pt-0.5">
        <Skeleton className="h-4 w-5/6 rounded-sm" />
        <Skeleton className="h-4 w-4/6 rounded-sm" />
        <Skeleton className="h-4 w-3/4 rounded-sm" />
        <Skeleton className="h-4 w-2/3 rounded-sm" />
      </div>
      <FilterGroupSkeleton />
      <FilterGroupSkeleton />
    </div>
  )
}

export {
  FilterSkeleton,
  ProductFilter,
  ProductFilterHeader,
  ProductFilterTitle,
}
