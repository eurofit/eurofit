"use client"

import { FilterItem } from "@/components/products/filter-item"
import { FilterItem as FilterItemType } from "@/types/filter"
import { useVirtualizer } from "@tanstack/react-virtual"
import * as React from "react"

const VIRTUALIZE_THRESHOLD = 10

type FilterVirtualListProps = {
  items: FilterItemType[]
  queryKey: string
}

export function FilterVirtualList({ items, queryKey }: FilterVirtualListProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 32,
    overscan: 5,
  })

  if (items.length <= VIRTUALIZE_THRESHOLD) {
    return (
      <div className="space-y-2.5 pr-1">
        {items.map((item) => (
          <FilterItem key={item.slug} queryKey={queryKey} item={item} />
        ))}
      </div>
    )
  }

  return (
    <div ref={scrollRef} className="h-72 overflow-auto overscroll-contain pr-1">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          position: "relative",
          width: "100%",
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            data-index={virtualItem.index}
            ref={virtualizer.measureElement}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              transform: `translateY(${virtualItem.start}px)`,
              paddingBottom: "8px",
            }}
          >
            <FilterItem queryKey={queryKey} item={items[virtualItem.index]!} />
          </div>
        ))}
      </div>
    </div>
  )
}
