"use client"

import { orderStatusMap } from "@/const/orders"
import { Order } from "@/types/order"
import { CellContext } from "@tanstack/react-table"

type StatusCellProps = CellContext<Order, unknown>

export function StatusCell({ getValue, row }: StatusCellProps) {
  const value = getValue<Order["status"]>()
  const paymentStatus = row.original.paymentStatus

  const status = orderStatusMap.get(value)

  if (!status) return null

  const formattedStatus =
    status.value === "pending" && paymentStatus === "unpaid"
      ? "Unpaid"
      : status.label

  return <p>{formattedStatus}</p>
}
