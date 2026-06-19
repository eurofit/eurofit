import { FilterGroupClearButton } from "@/components/products/filter-clear-button"
import { FilterVirtualList } from "@/components/products/filter-virtual-list"
import { FilterGroup } from "@/types/filter"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@eurofit/ui/components/accordion"

type FilterAccordionProps = {
  filters: FilterGroup[]
}

export function FilterAccordion({ filters }: FilterAccordionProps) {
  return (
    <Accordion
      type="multiple"
      defaultValue={filters[0] ? [filters[0].key] : []}
    >
      {filters.map(({ key, title, items }) => {
        return (
          <AccordionItem key={key} value={key}>
            <AccordionTrigger className="hover:no-underline">
              <span className="flex items-center gap-2">
                <span className="capitalize">{title}</span>
                <span className="text-xs text-muted-foreground tabular-nums">
                  ({items.length})
                </span>
              </span>
            </AccordionTrigger>
            <AccordionContent className="[&_a]:no-underline">
              <div className="-mt-1 mb-1.5 flex justify-end empty:hidden">
                <FilterGroupClearButton queryKey={key} />
              </div>
              <FilterVirtualList items={items} queryKey={key} />
            </AccordionContent>
          </AccordionItem>
        )
      })}
    </Accordion>
  )
}
