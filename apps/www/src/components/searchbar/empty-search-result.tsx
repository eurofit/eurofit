"use client"

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@eurofit/ui/components/empty"
import truncate from "lodash-es/truncate"
import { Search } from "lucide-react"

type EmptySearchResultProps = {
  query: string
}

export function EmptySearchResult({ query }: EmptySearchResultProps) {
  return (
    <Empty className="max-w-sm">
      <EmptyHeader>
        <EmptyMedia>
          <Search />
        </EmptyMedia>
        <EmptyTitle>No products found</EmptyTitle>
        <EmptyDescription className="line-clamp-3 wrap-break-word whitespace-normal">
          We couldn&apos;t find any products for{" "}
          <strong>&quot;{truncate(query)}&quot;</strong>.
        </EmptyDescription>
        <EmptyDescription>
          Please try different keywords or check your spelling.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
