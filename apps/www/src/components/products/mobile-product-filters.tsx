import { FilterBoundary } from "@/components/products/filter-boundary"
import { FilterGroup } from "@/types/filter"
import { MobileProductFiltersDrawer } from "./mobile-product-filters-drawer"

type MobileProductFiltersProps = {
  getFilters: () => Promise<FilterGroup[]>
  /** Query keys driving the active-count badge and the "Clear all" button. */
  filterKeys: readonly string[]
}

/** Fetches the page's filter groups and renders the mobile drawer (or nothing). */
export function MobileProductFilters({
  getFilters,
  filterKeys,
}: MobileProductFiltersProps) {
  return (
    <FilterBoundary getFilters={getFilters}>
      {(filters) => (
        <MobileProductFiltersDrawer filters={filters} filterKeys={filterKeys} />
      )}
    </FilterBoundary>
  )
}

export { MobileProductFiltersTriggerSkeleton } from "./mobile-product-filters-drawer"
