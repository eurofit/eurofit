"use client"

import { ImageWithRetry } from "@/components/image-with-retry"
import { buttonVariants } from "@eurofit/ui/components/button"
import { cn } from "@eurofit/ui/lib/utils"
import { ImageOff } from "lucide-react"
import Link from "next/link"
import * as React from "react"

type SearchResultProps = React.ComponentPropsWithRef<"div">

export function SearchResult({ className, ...props }: SearchResultProps) {
  return <div className={cn("space-y-4 p-2", className)} {...props} />
}

type SearchResultListProps = React.ComponentProps<"ul">

export function SearchResultList({
  className,
  ...props
}: SearchResultListProps) {
  return <ul className={cn("space-y-1", className)} {...props} />
}

type SearchResultListItemProps = {
  title: string
  slug: string
  image?: string | null
  onClose?: () => void
} & React.ComponentProps<"li">

export function SearchResultListItem({
  title,
  slug,
  image,
  onClose: handleClose,
  ...props
}: SearchResultListItemProps) {
  return (
    <li {...props}>
      <Link
        href={`/products/${slug}`}
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "h-auto w-full justify-start p-3"
        )}
        onClick={handleClose}
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
              <ImageOff className="size-3/5 text-muted-foreground/50" />
            )}
          </div>
          <div className="flex-1 text-left whitespace-break-spaces">
            <p className="text-sm font-medium text-pretty">{title}</p>
          </div>
        </div>
      </Link>
    </li>
  )
}
