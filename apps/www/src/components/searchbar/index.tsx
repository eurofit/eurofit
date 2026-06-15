"use client"

import { useToggle } from "@/hooks/use-toggle"
import { Button } from "@eurofit/ui/components/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@eurofit/ui/components/input-group"
import { Spinner } from "@eurofit/ui/components/spinner"
import { Search, X } from "lucide-react"
import Link from "next/link"
import * as React from "react"
import { useClickAway } from "react-use"
import { EmptySearchResult } from "./empty-search-result"
import {
  RecentSearch,
  RecentSearchHeader,
  RecentSearchList,
  RecentSearchListItem,
  RecentSearchTitle,
} from "./recent-search"
import { SearchContent } from "./search-content"
import { SearchResultError } from "./search-error"
import {
  SearchResult,
  SearchResultList,
  SearchResultListItem,
} from "./search-result"
import { SearchListItemSkeleton } from "./search-skeleton"
import { useProductSearch } from "./use-product-search"

export function SearchBar() {
  const {
    query,
    trimmedQuery,
    products,
    totalProducts,
    hasSearched,
    isSearching,
    isError,
    recentSearches,
    setRecentSearches,
    handleChange,
    handleClear,
    handleRecentSearchClick,
    recordRecentSearch,
  } = useProductSearch()

  const { value: isOpen, setOn: setOpen, setOff } = useToggle()

  const ref = React.useRef<HTMLDivElement>(null!)
  const inputRef = React.useRef<HTMLInputElement>(null!)

  useClickAway(ref, setOff)

  return (
    <div ref={ref} className="relative hidden max-w-sm grow md:flex">
      <search className="grow">
        <form
          action="/search"
          onSubmit={() => recordRecentSearch(trimmedQuery)}
          className="relative w-full"
          role="search"
          aria-label="Sitewide"
        >
          <InputGroup className="bg-background! opacity-100! has-[[data-slot=input-group-control]:focus-visible]:ring-0! has-[[data-slot][aria-invalid=true]]:ring-0!">
            <InputGroupAddon align="inline-start">
              <Search aria-hidden="true" />
            </InputGroupAddon>
            <InputGroupInput
              ref={inputRef}
              type="search"
              name="q"
              placeholder="Search here…"
              value={query}
              onChange={handleChange}
              onFocus={setOpen}
              autoComplete="off"
              required
              onInvalid={(e) =>
                e.currentTarget.setCustomValidity("Enter a search term")
              }
              onInput={(e) => e.currentTarget.setCustomValidity("")}
            />

            {query && !isSearching && (
              <InputGroupAddon align="inline-end">
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => {
                    handleClear()
                    inputRef.current?.focus()
                  }}
                  disabled={isSearching}
                  aria-label="Clear search"
                >
                  <X aria-hidden="true" />
                  <span className="sr-only">Clear search</span>
                </Button>
              </InputGroupAddon>
            )}

            {isSearching && (
              <InputGroupAddon align="inline-end">
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  disabled={true}
                  aria-label="Searching"
                >
                  <Spinner aria-hidden="true" />
                  <span className="sr-only">Searching for: {query}</span>
                </Button>
              </InputGroupAddon>
            )}
          </InputGroup>
        </form>
      </search>

      {/* SEARCH SKELETON */}
      {!products.length && isSearching && (
        <SearchContent isOpen={isOpen}>
          <div className="space-y-2 p-4">
            {Array(5)
              .fill(0)
              .map((_, index) => (
                <SearchListItemSkeleton
                  key={`search-list-item-skeleton-${index}`}
                />
              ))}
          </div>
        </SearchContent>
      )}

      {/* RECENT SEARCH */}
      {!trimmedQuery && recentSearches && recentSearches.length > 0 && (
        <SearchContent isOpen={isOpen} key={recentSearches.join("-")}>
          <RecentSearch>
            <RecentSearchHeader>
              <RecentSearchTitle>Recent Searches</RecentSearchTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRecentSearches(undefined)}
              >
                Clear all
              </Button>
            </RecentSearchHeader>
            <RecentSearchList>
              {recentSearches.map((term) => (
                <RecentSearchListItem
                  key={"recent-search-" + term}
                  term={term}
                  onClick={() => handleRecentSearchClick(term)}
                  onClear={() =>
                    setRecentSearches((prev = []) =>
                      prev.filter((t) => t !== term)
                    )
                  }
                />
              ))}
            </RecentSearchList>
          </RecentSearch>
        </SearchContent>
      )}

      {/* SEARCH RESULT */}
      {products.length > 0 && (
        <SearchContent isOpen={isOpen}>
          <SearchResult>
            <SearchResultList>
              {products.map((product) => (
                <SearchResultListItem
                  key={"search-result-list-" + product.slug}
                  onClose={() => {
                    recordRecentSearch(trimmedQuery)
                    setOff()
                  }}
                  {...product}
                />
              ))}
            </SearchResultList>
            {totalProducts > products.length && (
              <Link
                href={`/search?q=${encodeURIComponent(trimmedQuery)}`}
                className="text-xs not-hover:text-muted-foreground hover:underline hover:underline-offset-4"
                onClick={() => recordRecentSearch(trimmedQuery)}
                onNavigate={setOff}
              >
                View All {totalProducts} Product{totalProducts > 1 ? "s" : ""} →
              </Link>
            )}
          </SearchResult>
        </SearchContent>
      )}

      {/* EMPTY SEARCH RESULT */}
      {!isSearching &&
        hasSearched &&
        trimmedQuery &&
        products.length === 0 &&
        !isError && (
          <SearchContent isOpen={isOpen}>
            <EmptySearchResult query={trimmedQuery} />
          </SearchContent>
        )}

      {/* SEARCH ERROR */}
      {isError && (
        <SearchContent isOpen={isOpen}>
          <SearchResultError />
        </SearchContent>
      )}
    </div>
  )
}

export function SearchBarSkeleton() {
  return (
    <div className="relative hidden max-w-sm grow md:flex">
      <InputGroup className="bg-background! opacity-100! has-[[data-slot=input-group-control]:focus-visible]:ring-0! has-[[data-slot][aria-invalid=true]]:ring-0!">
        <InputGroupAddon align="inline-start">
          <Search aria-hidden="true" />
        </InputGroupAddon>
        <InputGroupInput
          type="search"
          name="q"
          placeholder="Search here…"
          autoComplete="off"
          disabled
        />
      </InputGroup>
    </div>
  )
}
