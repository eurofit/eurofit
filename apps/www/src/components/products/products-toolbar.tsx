import {
  ProductSort,
  ProductSortFallback,
} from "@/components/products/product-sort"
import { PRODUCT_SORT_OPTIONS } from "@/const/brand-filters"
import type { BrandSortDirection } from "@/lib/utils/brands/brand-search-params"
import pluralize from "pluralize-esm"
import * as React from "react"

type ProductsToolbarProps = {
  sortDirection: BrandSortDirection
  mobileFiltersSlot?: React.ReactNode
  count?: number
  noun?: string
}

/**
 * Bar above the product grid: the result count, the sort control, and the
 * mobile filters trigger. Desktop renders one row (count left, sort right);
 * mobile stacks the count on top with Filters + Sort splitting the row below.
 */
export function ProductsToolbar({
  sortDirection,
  mobileFiltersSlot,
  count,
  noun = "Product",
}: ProductsToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      {typeof count === "number" && (
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground tabular-nums">
            {count}
          </span>{" "}
          {pluralize(noun, count)} found
        </p>
      )}

      <div className="flex w-full items-center gap-2 md:ml-auto md:w-auto">
        {mobileFiltersSlot}
        <React.Suspense
          fallback={
            <ProductSortFallback className="flex-1 md:w-45 md:flex-none" />
          }
        >
          <ProductSort
            options={[...PRODUCT_SORT_OPTIONS]}
            defaultValue={sortDirection}
            className="flex-1 md:w-45 md:flex-none"
          />
        </React.Suspense>
      </div>
    </div>
  )
}
