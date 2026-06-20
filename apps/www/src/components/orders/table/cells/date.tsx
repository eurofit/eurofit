"use client"

import { Order } from "@/types/order"
import { CellContext } from "@tanstack/react-table"
import { format } from "date-fns"

type DateCellProps = CellContext<Order, unknown>

export function DateCell({ getValue }: DateCellProps) {
  const value = getValue<Order["createdAt"]>()

  const formattedDate = format(new Date(value), "MMM dd, yyyy")

  return <time dateTime={value}>{formattedDate}</time>
}
