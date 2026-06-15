"use client"

import {
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Pagination as PaginationRoot,
} from "@eurofit/ui/components/pagination"
import usePagination, {
  type UsePaginationProps,
} from "@mui/material/usePagination"
import { usePathname, useSearchParams } from "next/navigation"

type PaginationProps = UsePaginationProps & {
  /** Query-string key that carries the page number. Defaults to "page". */
  pageParam?: string
  /**
   * Keep the current query string (search query, filters, sort) when changing
   * page. Defaults to `false`, where each anchor points to `?page=N` only.
   */
  preserveParams?: boolean
  className?: string
}

/**
 * shadcn-rendered pagination driven by MUI's `usePagination` truncation logic.
 * Props mirror `UsePaginationProps`, so it stays drop-in compatible with MUI's
 * own `Pagination`. Navigation is link-based: each anchor points to `?page=N`,
 * optionally preserving the rest of the query string via `preserveParams`.
 */
export function Pagination({
  pageParam = "page",
  preserveParams = false,
  className,
  ...paginationProps
}: PaginationProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const { items } = usePagination(paginationProps)

  const buildHref = (targetPage: number) => {
    const params = preserveParams
      ? new URLSearchParams(searchParams.toString())
      : new URLSearchParams()
    params.set(pageParam, String(targetPage))

    return `${pathname}?${params.toString()}`
  }

  if ((paginationProps.count ?? 1) <= 1) {
    return null
  }

  return (
    <PaginationRoot className={className}>
      <PaginationContent>
        {items.map((item, index) => {
          const { type, page, selected: isActive, disabled: isDisabled } = item

          if (type === "start-ellipsis" || type === "end-ellipsis") {
            return (
              <PaginationItem key={`${type}-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            )
          }

          const href = page && !isDisabled ? buildHref(page) : undefined
          const disabledProps = isDisabled
            ? {
                "aria-disabled": true,
                tabIndex: -1,
                className: "pointer-events-none opacity-50",
              }
            : {}

          if (type === "previous") {
            return (
              <PaginationItem key="previous">
                <PaginationPrevious href={href} {...disabledProps} />
              </PaginationItem>
            )
          }

          if (type === "next") {
            return (
              <PaginationItem key="next">
                <PaginationNext href={href} {...disabledProps} />
              </PaginationItem>
            )
          }

          // "page", "first" and "last" all render as numbered links.
          return (
            <PaginationItem key={`${type}-${page}`}>
              <PaginationLink
                href={href}
                isActive={isActive}
                {...disabledProps}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        })}
      </PaginationContent>
    </PaginationRoot>
  )
}
