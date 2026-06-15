"use client"

import { ImageWithRetry } from "@/components/image-with-retry"
import { ImageOff } from "lucide-react"
import Link from "next/link"
import { DefaultCellComponentProps } from "payload"

export function ImageCell({ cellData, rowData }: DefaultCellComponentProps) {
  if (!cellData) return null

  return (
    <Link
      href={`/admin/collections/brands/${rowData.id}`}
      className="relative size-12 shrink-0 overflow-hidden rounded-md border bg-white"
    >
      {cellData ? (
        <ImageWithRetry
          src={cellData}
          alt={`Product image`}
          fill
          className="object-contain p-1"
          sizes="48px"
        />
      ) : (
        <ImageOff
          className="m-auto size-2/3 text-muted-foreground"
          aria-label="Image not available"
        />
      )}
    </Link>
  )
}
