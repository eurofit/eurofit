"use client"

import { PreventScroll } from "@/components/prevent-scroll"
import { useToggle } from "@/hooks/use-toggle"
import { sendSearchEvent } from "@/lib/analytics/send-search-event"
import {
  SearchProductResult,
  searchProductSuggestions,
} from "@/lib/api/products/search-product-suggestions"
import { Button, buttonVariants } from "@eurofit/ui/components/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@eurofit/ui/components/input-group"
import { cn } from "@eurofit/ui/lib/utils"
import { useMutation } from "@tanstack/react-query"
import { ChevronRight, ImageOff, Search } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import pluralize from "pluralize-esm"
import * as React from "react"
import { useDebouncedCallback } from "use-debounce"
import { ImageWithRetry } from "./image-with-retry"
import { EmptySearchResult } from "./searchbar/empty-search-result"
import { SearchResultError } from "./searchbar/search-error"
import { SearchListItemSkeleton } from "./searchbar/search-skeleton"

const SEARCH_RESULT_LIMIT = 7

export function SearchSheet() {
  const searchParams = useSearchParams()
  const q = searchParams.get("q")?.toString() ?? ""

  const { value: isOpen, setOff, setOn } = useToggle(false)

  const [query, setQuery] = React.useState("")
  const [products, setProducts] = React.useState<
    NonNullable<SearchProductResult>["products"]
  >([])
  const [totalProducts, setTotalProducts] = React.useState<number>(0)
  const [hasSearched, setHasSearched] = React.useState(false)

  const lastSearchTermRef = React.useRef<string | null>(null)

  const {
    mutate: search,
    isPending: isSearching,
    isError,
  } = useMutation({
    mutationFn: searchProductSuggestions,
    onSuccess: (result) => {
      if (!result) {
        setProducts([])
        setTotalProducts(0)
        return
      }
      setTotalProducts(result.totalProducts)
      setProducts(result.products)

      if (result.query !== lastSearchTermRef.current) {
        lastSearchTermRef.current = result.query
        sendSearchEvent({ searchTerm: result.query })
      }
    },
    onError: () => {
      setProducts([])
      setTotalProducts(0)
    },
    onSettled: () => {
      setHasSearched(true)
    },
  })

  // sync search params
  React.useEffect(() => {
    setQuery(q)
  }, [q])

  const debaouncedSearch = useDebouncedCallback(search, 300)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value

    setQuery(term)

    debaouncedSearch.cancel()

    if (term.length <= 2) {
      setProducts([])
      setTotalProducts(0)
      return
    }

    debaouncedSearch({
      query: term,
      limit: SEARCH_RESULT_LIMIT,
    })
  }

  const reset = () => {
    setQuery("")
    setProducts([])
    setTotalProducts(0)
    setHasSearched(false)
  }

  const handleClose = () => {
    setOff()
    reset()
  }

  return (
    <search className="w-full md:hidden">
      <Button
        variant="secondary"
        size="lg"
        onClick={setOn}
        aria-expanded={isOpen}
        aria-label="Search products"
        className="-mx-1 h-10 w-[calc(100%+8px)] justify-start text-muted-foreground"
      >
        <Search aria-hidden="true" className="size-5.5" />
        Search products, brands and categories
      </Button>

      {isOpen && (
        <PreventScroll>
          <div
            className="absolute inset-x-0 top-0 z-50 h-dvh space-y-6 bg-background p-6"
            style={{ overscrollBehavior: "contain" }}
          >
            <div className="flex w-full grow items-center gap-1.5">
              <form action="/search" className="grow">
                <InputGroup>
                  <InputGroupAddon>
                    <Search aria-hidden="true" />
                  </InputGroupAddon>
                  <InputGroupInput
                    type="search"
                    name="q"
                    value={query}
                    onChange={handleSearchChange}
                    placeholder="Search products…"
                    autoComplete="off"
                    autoFocus
                  />
                </InputGroup>
              </form>

              <Button variant="ghost" onClick={handleClose} className="ml-auto">
                Cancel
              </Button>
            </div>

            <div>
              {/* SEARCH SKELETON  */}
              {isSearching && (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <SearchListItemSkeleton key={index} />
                  ))}
                </div>
              )}

              {/* EMPTY SEARCH RESULT */}
              {query.length > 2 &&
                hasSearched &&
                !isSearching &&
                products.length === 0 &&
                !isError && <EmptySearchResult query={query} />}

              {/* SEARCH ERROR */}
              {isError && <SearchResultError />}

              {/* SEARCH RESULTS */}
              {!isSearching &&
                !isError &&
                query.length > 2 &&
                products.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p>Search results</p>
                      {totalProducts > SEARCH_RESULT_LIMIT && (
                        <Button variant="link" size="sm" asChild>
                          <Link
                            href={`/search?q=${encodeURIComponent(query)}`}
                            onClick={setOff}
                          >
                            View All {totalProducts}{" "}
                            {pluralize("results", totalProducts)}
                            <ChevronRight
                              className="size-3.5"
                              aria-hidden="true"
                            />
                          </Link>
                        </Button>
                      )}
                    </div>
                    {products.map(({ slug, image, title }) => (
                      <Link
                        key={slug}
                        href={`/products/${slug}`}
                        className={cn(
                          buttonVariants({ variant: "ghost" }),
                          "h-auto w-full justify-start p-3"
                        )}
                        onClick={setOff}
                      >
                        <div className="flex w-full items-start gap-3">
                          <div className="relative mt-0.5 flex size-10 items-center justify-center rounded-md shadow">
                            {image ? (
                              <ImageWithRetry
                                src={image}
                                alt={title}
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
                            <p className="text-sm font-medium text-pretty">
                              {title}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
            </div>
          </div>
        </PreventScroll>
      )}
    </search>
  )
}

export function SearchSheetSkeleton() {
  return (
    <Button
      variant="secondary"
      size="lg"
      aria-label="Search products"
      className="-mx-1 h-10 w-[calc(100%+8px)] justify-start bg-muted text-muted-foreground md:hidden"
    >
      <Search aria-hidden="true" className="size-5.5" />
      Search products, brands and categories
    </Button>
  )
}
