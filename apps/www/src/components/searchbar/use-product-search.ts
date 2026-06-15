"use client"

import {
  SearchProductResult,
  searchProductSuggestions,
} from "@/actions/products/search-product-suggestions"
import { recentSearchesAtom } from "@/atoms/search-bar"
import { useMutation } from "@tanstack/react-query"
import { useAtom } from "jotai"
import { useSearchParams } from "next/navigation"
import * as React from "react"
import { useDebouncedCallback } from "use-debounce"

export function useProductSearch() {
  const searchParams = useSearchParams()
  const q = searchParams.get("q")?.toString() ?? ""

  const [query, setQuery] = React.useState(q)
  const trimmedQuery = query.trim()

  const [hasSearched, setHasSearched] = React.useState(false)
  const [products, setProducts] = React.useState<
    NonNullable<SearchProductResult>["products"]
  >([])
  const [totalProducts, setTotalProducts] = React.useState<number>(0)

  const [recentSearches, setRecentSearches] = useAtom(recentSearchesAtom)

  // sync search params
  React.useEffect(() => {
    setQuery(q)
  }, [q])

  const {
    mutate: search,
    isPending: isSearching,
    isError,
  } = useMutation({
    mutationFn: searchProductSuggestions,
    onSuccess: (result) => {
      if (!result) {
        setTotalProducts(0)
        setProducts([])
        return
      }

      if (result.query) {
        setTotalProducts(result.totalProducts)
        setProducts(result.products)
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

  const debouncedSearch = useDebouncedCallback(
    (term: string) => search({ query: term }),
    300
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setQuery(newValue)

    debouncedSearch.cancel()

    if (!newValue.trim()) {
      setProducts([])
      setTotalProducts(0)
      setHasSearched(false)
      return
    }

    if (newValue.trim().length < 2) return
    debouncedSearch(newValue.trim())
  }

  const handleClear = () => {
    setQuery("")
    setProducts([])
    setTotalProducts(0)
    setHasSearched(false)
  }

  const handleRecentSearchClick = (term: string) => {
    setQuery(term)
    debouncedSearch.cancel()
    search({ query: term })
  }

  const recordRecentSearch = (term: string) => {
    const value = term.trim()
    if (!value) return
    setRecentSearches((prev = []) =>
      [value, ...prev.filter((t) => t !== value)].slice(0, 5)
    )
  }

  return {
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
  }
}
