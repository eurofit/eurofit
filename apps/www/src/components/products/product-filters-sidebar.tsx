import { FilterAccordion } from "@/components/products/filter-accordion"
import { FilterBoundary } from "@/components/products/filter-boundary"
import { FilterClearButton } from "@/components/products/filter-clear-button"
import {
  ProductFilter,
  ProductFilterHeader,
  ProductFilterTitle,
} from "@/components/products/filter-primitives"
import { FilterGroup } from "@/types/filter"
import { FunnelIcon } from "lucide-react"

type ProductFiltersSidebarProps = {
  getFilters: () => Promise<FilterGroup[]>
  /** Query keys the "Clear all" button should reset (one per filter group). */
  filterKeys: readonly string[]
}

/** Desktop sidebar that fetches the page's filter groups and renders them. */
export function ProductFiltersSidebar({
  getFilters,
  filterKeys,
}: ProductFiltersSidebarProps) {
  return (
    <FilterBoundary getFilters={getFilters}>
      {(filters) => (
        <ProductFilter className="pr-6">
          <ProductFilterHeader>
            <ProductFilterTitle>
              <FunnelIcon aria-hidden="true" />
              <h2>Filter By</h2>
            </ProductFilterTitle>
            <FilterClearButton keys={[...filterKeys]} />
          </ProductFilterHeader>
          <FilterAccordion filters={filters} />
        </ProductFilter>
      )}
    </FilterBoundary>
  )
}
