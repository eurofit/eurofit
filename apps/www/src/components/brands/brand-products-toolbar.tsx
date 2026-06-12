import {
  ProductSort,
  ProductSortFallback,
} from "@/components/products/product-sort"
import { PRODUCT_SORT_OPTIONS } from "@/const/brand-filters"
import type { BrandSortDirection } from "@/lib/utils/brands/brand-search-params"
import * as React from "react"

type BrandProductsToolbarProps = {
  sortDirection: BrandSortDirection
  mobileFiltersSlot?: React.ReactNode
}

/** Row above the product grid: sort control plus the mobile filters trigger. */
export function BrandProductsToolbar({
  sortDirection,
  mobileFiltersSlot,
}: BrandProductsToolbarProps) {
  return (
    <div className="flex items-center gap-3">
      <React.Suspense fallback={<ProductSortFallback />}>
        <ProductSort
          options={[...PRODUCT_SORT_OPTIONS]}
          defaultValue={sortDirection}
        />
      </React.Suspense>
      {mobileFiltersSlot}
    </div>
  )
}
