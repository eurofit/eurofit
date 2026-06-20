"use client"

import { Order } from "@/types/order"
import { CellContext } from "@tanstack/react-table"

type TotalCellProps = CellContext<Order, unknown>

export function TotalCell({ getValue }: TotalCellProps) {
  const value = getValue<number>()

  const total = new Intl.NumberFormat("en-KE", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    style: "currency",
    currency: "KES",
  }).format(value)

  return <p className="font-variant-numeric-tabular-nums">{total}</p>
}
