"use client"

import { Button } from "@eurofit/ui/components/button"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"

type FilterGroupClearButtonProps = {
  queryKey: string
}

export function FilterGroupClearButton({
  queryKey,
}: FilterGroupClearButtonProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams.toString())

  const isKeyPresent = searchParams.has(queryKey)

  if (isKeyPresent) {
    params.delete(queryKey)
  }

  const newUrl = `${pathname}${params.toString() ? `?${params.toString()}` : ""}`

  if (!isKeyPresent) {
    return null
  }

  return (
    <Button variant="secondary" size="xs" asChild>
      <Link href={newUrl} replace shallow>
        Clear
      </Link>
    </Button>
  )
}

type FilterClearButtonProps = {
  keys: string[]
}

export function FilterClearButton({ keys }: FilterClearButtonProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams.toString())

  const presentKeys = keys.filter((key) => searchParams.has(key))

  if (presentKeys.length === 0) {
    return null
  }

  presentKeys.forEach((key) => {
    params.delete(key)
  })

  const newUrl = `${pathname}${params.toString() ? `?${params.toString()}` : ""}`

  return (
    <Button variant="destructive" size="sm" asChild>
      <Link href={newUrl} replace shallow>
        Clear all
      </Link>
    </Button>
  )
}
