import { MobileFiltersDrawer } from "@/components/brands/mobile-filters-drawer"
import { FilterBoundary } from "@/components/products/filter-boundary"
import { FilterGroup } from "@/types/filter"

type MobileBrandFiltersProps = {
  getFilters: () => Promise<FilterGroup[]>
}

export function MobileBrandFilters({ getFilters }: MobileBrandFiltersProps) {
  return (
    <FilterBoundary getFilters={getFilters}>
      {(filters) => <MobileFiltersDrawer filters={filters} />}
    </FilterBoundary>
  )
}
