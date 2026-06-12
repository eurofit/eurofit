"use client"

import { FilterAccordion } from "@/components/products/filter-accordion"
import { FilterClearButton } from "@/components/products/filter-clear-button"
import { ProductFilterTitle } from "@/components/products/filter-primitives"
import { BRAND_FILTER_KEYS } from "@/const/brand-filters"
import { FilterGroup } from "@/types/filter"
import { Badge } from "@eurofit/ui/components/badge"
import { Button } from "@eurofit/ui/components/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@eurofit/ui/components/drawer"
import { ScrollArea } from "@eurofit/ui/components/scroll-area"
import { SlidersHorizontal } from "lucide-react"
import { useSearchParams } from "next/navigation"
import * as React from "react"

type MobileFiltersDrawerProps = {
  filters: FilterGroup[]
}

export function MobileFiltersDrawer({ filters }: MobileFiltersDrawerProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const searchParams = useSearchParams()

  const activeCount = BRAND_FILTER_KEYS.reduce(
    (total, key) => total + searchParams.getAll(key).length,
    0
  )

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 md:hidden"
          aria-label="Open product filters"
        >
          <SlidersHorizontal aria-hidden="true" />
          Filters
          {activeCount > 0 && (
            <Badge className="h-4 min-w-4 rounded-full px-1 text-xs">
              {activeCount}
            </Badge>
          )}
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader className="text-left">
          <div className="flex items-center justify-between">
            <DrawerTitle asChild>
              <ProductFilterTitle>
                <SlidersHorizontal aria-hidden="true" />
                <span>Filter By</span>
              </ProductFilterTitle>
            </DrawerTitle>
            <FilterClearButton keys={[...BRAND_FILTER_KEYS]} />
          </div>
        </DrawerHeader>

        <ScrollArea className="overflow-y-auto px-4 pb-2">
          <FilterAccordion filters={filters} />
        </ScrollArea>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export function MobileFiltersDrawerTriggerSkeleton() {
  return (
    <Button variant="outline" size="sm" className="gap-1.5 md:hidden" disabled>
      <SlidersHorizontal aria-hidden="true" />
      Filters
    </Button>
  )
}
