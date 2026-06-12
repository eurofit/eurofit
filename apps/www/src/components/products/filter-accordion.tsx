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
      className="md:gap-1.5"
    >
      {filters.map(({ key, title, items }) => {
        return (
          <AccordionItem key={key} value={key} className="md:border-b-0">
            <AccordionTrigger className="md:rounded-lg md:bg-muted md:px-3 md:hover:bg-muted/80 md:hover:no-underline">
              <span className="flex items-center gap-2">
                <span className="capitalize">{title}</span>
                <span className="text-xs text-muted-foreground">
                  ({items.length})
                </span>
              </span>
            </AccordionTrigger>
            <AccordionContent className="pr-4 [&_a]:no-underline">
              <div className="mb-3 flex justify-end">
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
