"use client"

import { Button } from "@eurofit/ui/components/button"
import { cn } from "@eurofit/ui/lib/utils"
import truncate from "lodash-es/truncate"
import { Search, X } from "lucide-react"
import * as React from "react"

type RecentSearchProps = React.ComponentProps<"section">

export function RecentSearch({ className, ...props }: RecentSearchProps) {
  return <section className={cn("space-y-3 p-4", className)} {...props} />
}

type RecentSearchHeaderProps = React.ComponentProps<"div">

export function RecentSearchHeader({
  className,
  ...props
}: RecentSearchHeaderProps) {
  return (
    <div
      className={cn("flex items-center justify-between", className)}
      {...props}
    />
  )
}

type RecentSearchTitleProps = React.ComponentProps<"h2">

export function RecentSearchTitle({
  className,
  ...props
}: RecentSearchTitleProps) {
  return (
    <h2
      className={cn(
        "px-3 text-sm leading-tight text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

type RecentSearchListProps = React.ComponentProps<"ul">

export function RecentSearchList({
  className,
  ...props
}: RecentSearchListProps) {
  return <ul className={cn("space-y-1", className)} {...props} />
}

type RecentSearchListItemProps = React.ComponentProps<typeof Button> & {
  term: string
  onClear: () => void
}

export function RecentSearchListItem({
  term,
  onClear,
  ...props
}: RecentSearchListItemProps) {
  return (
    <li className="flex items-center">
      <Button
        variant="ghost"
        className="grow justify-start overflow-hidden font-normal"
        {...props}
      >
        <Search className="text-muted-foreground" />
        {truncate(term)}
      </Button>
      <Button variant="ghost" size="icon" onClick={onClear}>
        <X className="size-4 text-muted-foreground" />
        <span className="sr-only">Clear recent search: {term}</span>
      </Button>
    </li>
  )
}
