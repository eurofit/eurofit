"use client"

import { ImageWithRetry } from "@/components/image-with-retry"
import { StockAlert } from "@/types/stock-alert"
import { CellContext } from "@tanstack/react-table"

type ImageCellProps = CellContext<StockAlert, unknown>

export function ImageCell({ getValue, row }: ImageCellProps) {
  const title = row.original.title
  const value = getValue<string | null>()

  if (!value) return null

  return (
    <ImageWithRetry
      src={value}
      alt={title}
      width={50}
      height={50}
      className="bg-white object-contain"
    />
  )
}
