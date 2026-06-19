"use client"

import { PAGE_QUERY_KEY, SORT_QUERY_KEY } from "@/const/brand-filters"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@eurofit/ui/components/select"
import { cn } from "@eurofit/ui/lib/utils"
import { usePathname, useSearchParams } from "next/navigation"
import { useRouter } from "nextjs-toploader/app"

type Option = {
  label: string
  value: string
}

type ProductSortProps = {
  className?: string
  defaultValue?: string
  options: Option[]
}

export function ProductSort({
  className,
  defaultValue,
  options,
}: ProductSortProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value === "asc") {
      params.delete(SORT_QUERY_KEY)
    } else {
      params.set(SORT_QUERY_KEY, value)
    }

    params.delete(PAGE_QUERY_KEY)
    params.sort()

    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <Select defaultValue={defaultValue} onValueChange={handleChange}>
      <SelectTrigger size="sm" className={cn("w-full md:w-45", className)}>
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Sort by</SelectLabel>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export function ProductSortFallback({ className }: { className?: string }) {
  return (
    <div
      className={cn("h-9 animate-pulse rounded-md bg-muted", className)}
      aria-hidden="true"
    />
  )
}
