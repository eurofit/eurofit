import { Order } from "@/types/order"
import { ColumnDef } from "@tanstack/react-table"
import { ActionsCell } from "./cells/actions"
import { DateCell } from "./cells/date"
import { IdCell } from "./cells/id"
import { StatusCell } from "./cells/status"
import { TotalCell } from "./cells/total"

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: "Order ID",
    cell: IdCell,
  },
  {
    accessorKey: "createdAt",
    header: "Order Date",
    cell: DateCell,
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: TotalCell,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: StatusCell,
  },
  {
    id: "actions",
    cell: ActionsCell,
  },
]
