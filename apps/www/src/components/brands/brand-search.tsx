"use client"

import { ImageWithRetry } from "@/components/image-with-retry"
import { useClickAway } from "@/hooks/use-click-away"
import { useToggle } from "@/hooks/use-toggle"
import { searchBrand } from "@/lib/api/brands/search-brands"
import { buttonVariants } from "@eurofit/ui/components/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@eurofit/ui/components/input-group"
import { Spinner } from "@eurofit/ui/components/spinner"
import { cn } from "@eurofit/ui/lib/utils"
import { useQuery } from "@tanstack/react-query"
import { ImageOff, Search } from "lucide-react"
import Link from "next/link"
import * as React from "react"
import { toast } from "sonner"
import { useDebouncedCallback } from "use-debounce"

export function BrandSearch() {
  const [query, setQuery] = React.useState("")

  const { value: open, setOn, setOff } = useToggle()

  const isEnabled = query.length >= 2

  const {
    data,
    isFetching: isSearching,
    isError,
    error,
  } = useQuery({
    queryKey: ["brands-search", query],
    queryFn: () => searchBrand(query),
    enabled: isEnabled,
  })

  const brands = isEnabled ? (data?.brands ?? []) : []
  const totalBrands = isEnabled ? (data?.totalBrands ?? 0) : 0

  React.useEffect(() => {
    if (isError) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to search brands. Please try again."
      )
    }
  }, [isError, error])

  const debouncedSetQuery = useDebouncedCallback(setQuery, 300)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const trimmedQuery = e.target.value.trim()

    debouncedSetQuery.cancel()

    if (trimmedQuery.length < 2) {
      setQuery("")
      return
    }

    debouncedSetQuery(trimmedQuery)
  }

  const ref = useClickAway<HTMLDivElement>(setOff)

  return (
    <search ref={ref} className="relative w-full max-w-md">
      <InputGroup className="bg-background">
        <InputGroupAddon>
          {isSearching ? (
            <Spinner aria-hidden="true" />
          ) : (
            <Search aria-hidden="true" />
          )}
        </InputGroupAddon>
        <InputGroupInput
          type="search"
          placeholder="Search brands…"
          autoComplete="off"
          onFocus={setOn}
          onChange={handleChange}
        />
        {totalBrands > 0 && (
          <InputGroupAddon align="inline-end">
            <span className="font-variant-numeric-tabular-nums">
              {totalBrands} {totalBrands === 1 ? "result" : "results"}
            </span>
          </InputGroupAddon>
        )}
      </InputGroup>
      {open && brands.length > 0 && (
        <div
          data-open={open}
          className="absolute top-full right-0 left-0 z-99999999 mt-2 overflow-hidden overscroll-contain rounded-md border bg-popover p-4 text-popover-foreground shadow-lg data-[open=false]:animate-out data-[open=false]:zoom-out-95 data-[state=false]:fade-out-0 data-open:animate-in"
        >
          {brands.map(({ id, title, slug, image }) => (
            <Link
              key={id}
              href={`/brands/${slug}`}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "h-auto w-full items-center justify-start p-3"
              )}
            >
              <div className="flex w-full items-center gap-3">
                <div className="relative mt-0.5 flex size-9 items-center justify-center rounded-md shadow">
                  {image ? (
                    <ImageWithRetry
                      src={image}
                      alt={title ?? "Brand image"}
                      height={64}
                      width={64}
                      className="m-auto max-h-11/12 object-contain"
                      priority
                      loading="eager"
                    />
                  ) : (
                    <ImageOff
                      className="size-3/5 text-muted-foreground/50"
                      aria-hidden="true"
                    />
                  )}
                </div>
                <div className="flex-1 text-left whitespace-break-spaces">
                  <p className="text-sm font-medium text-pretty">{title}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </search>
  )
}
