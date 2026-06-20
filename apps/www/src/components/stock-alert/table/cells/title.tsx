"use client"

import { StockAlert } from "@/types/stock-alert"
import { CellContext } from "@tanstack/react-table"
import Link from "next/link"

type TitleCellProps = CellContext<StockAlert, unknown>

export function TitleCell({ getValue, row }: TitleCellProps) {
  const value = getValue<StockAlert["title"]>()
  const slug = row.original.slug

  return (
    <div className="max-w-xs overflow-hidden">
      <Link
        href={`/products/` + slug}
        className="text-wrap hover:underline hover:underline-offset-4"
      >
        {value}
      </Link>
    </div>
  )
}
