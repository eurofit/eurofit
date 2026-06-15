import { PAGE_QUERY_KEY } from "@/const/brand-filters"
import type { ReadonlyURLSearchParams } from "next/navigation"

type BuildFilterToggleUrlArgs = {
  searchParams: ReadonlyURLSearchParams
  pathname: string
  key: string
  slug: string
}

/**
 * Returns the URL produced by toggling a single filter value on or off.
 * Adding a value appends it; removing it drops only that value while keeping
 * the rest of the group. Pagination is reset so results start at page 1, and
 * params are sorted for stable, cache-friendly URLs.
 */
export function buildFilterToggleUrl({
  searchParams,
  pathname,
  key,
  slug,
}: BuildFilterToggleUrlArgs): string {
  const params = new URLSearchParams(searchParams.toString())
  const isChecked = searchParams.getAll(key).includes(slug)

  if (isChecked) {
    const remaining = params.getAll(key).filter((value) => value !== slug)
    params.delete(key)
    remaining.forEach((value) => params.append(key, value))
  } else {
    params.append(key, slug)
  }

  params.delete(PAGE_QUERY_KEY)
  params.sort()

  const query = params.toString()

  return `${pathname}${query ? `?${query}` : ""}`
}
