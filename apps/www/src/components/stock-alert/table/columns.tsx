import { StockAlert } from "@/types/stock-alert"
import { ColumnDef } from "@tanstack/react-table"
import { ActionsCell } from "./cells/actions"
import { ImageCell } from "./cells/image"
import { StatusCell } from "./cells/status"
import { TitleCell } from "./cells/title"

export const columns: ColumnDef<StockAlert>[] = [
  {
    accessorKey: "image",
    header: "Image",
    cell: ImageCell,
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: TitleCell,
  },
  {
    accessorKey: "isOutOfStock",
    header: "Stock Status",
    cell: StatusCell,
  },
  {
    id: "actions",
    cell: ActionsCell,
  },
]
