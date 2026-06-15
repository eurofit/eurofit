"use client"

import { XCircle } from "lucide-react"

export function SearchResultError() {
  return (
    <div className="flex flex-col space-y-2 p-8 text-center">
      <div className="mx-auto flex items-center gap-2">
        <XCircle className="size-4 text-destructive" />
        <p className="text-sm text-muted-foreground">Something went wrong</p>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        An error occurred while searching. Please try again.
      </p>
    </div>
  )
}
