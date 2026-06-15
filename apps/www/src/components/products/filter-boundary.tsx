import { FilterGroup } from "@/types/filter"
import * as React from "react"

type FilterBoundaryProps = {
  getFilters: () => Promise<FilterGroup[]>
  children: (filters: FilterGroup[]) => React.ReactNode
}

/**
 * Fetches a brand's filter groups and renders nothing when there are none.
 * Centralises the "load → bail on empty" guard that both the desktop sidebar
 * and the mobile drawer otherwise duplicate.
 */
export async function FilterBoundary({
  getFilters,
  children,
}: FilterBoundaryProps) {
  const filters = await getFilters()

  if (filters.length === 0) {
    return null
  }

  return <>{children(filters)}</>
}
