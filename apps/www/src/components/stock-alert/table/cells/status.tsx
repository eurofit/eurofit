"use client"

import { StockAlert } from "@/types/stock-alert"
import { Badge } from "@eurofit/ui/components/badge"
import { CellContext } from "@tanstack/react-table"
import { Check, X } from "lucide-react"

type StatusCellProps = CellContext<StockAlert, unknown>

export function StatusCell({ getValue, row }: StatusCellProps) {
  const isOutOfStock = getValue<StockAlert["isOutOfStock"]>()

  if (isOutOfStock)
    return (
      <Badge variant="destructive">
        <X />
        Out of Stock
      </Badge>
    )

  return (
    <Badge className="bg-green-50 text-green-700">
      <Check />
      In Stock
    </Badge>
  )
}
