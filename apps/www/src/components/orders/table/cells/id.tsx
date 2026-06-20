"use client"

import { Order } from "@/types/order"
import { CellContext } from "@tanstack/react-table"
import Link from "next/link"

type IdCellProps = CellContext<Order, unknown>

export function IdCell({ getValue }: IdCellProps) {
  const value = getValue<Order["id"]>()

  return (
    <Link
      href={`/orders/` + value.toString()}
      className="hover:underline hover:underline-offset-4"
    >
      #{value.toString()}
    </Link>
  )
}
