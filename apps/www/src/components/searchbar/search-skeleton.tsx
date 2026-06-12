"use client"

import { Skeleton } from "@eurofit/ui/components/skeleton"

export function SearchListItemSkeleton() {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="size-10 rounded-md" />
      <div className="space-y-2">
        <Skeleton className="h-2.5 w-62.5" />
        <Skeleton className="h-2.5 w-50" />
      </div>
    </div>
  )
}
