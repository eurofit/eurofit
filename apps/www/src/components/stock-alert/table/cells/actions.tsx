"use client"

import { deleteStockAlert } from "@/actions/stock-alert/delete-stock-alert"
import { unwrapActionResult } from "@/lib/utils/unwrap-action-result"
import { StockAlert } from "@/types/stock-alert"
import { Button } from "@eurofit/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@eurofit/ui/components/dropdown-menu"
import { useMutation } from "@tanstack/react-query"
import { CellContext } from "@tanstack/react-table"
import { MoreVertical, Trash } from "lucide-react"
import { useRouter } from "nextjs-toploader/app"
import { toast } from "sonner"

type ActionsCellProps = CellContext<StockAlert, unknown>

export function ActionsCell({ row }: ActionsCellProps) {
  const stockAlert = row.original
  const router = useRouter()

  const { mutate: remove, isPending } = useMutation({
    mutationKey: ["delete-stock-alert", stockAlert.id],
    mutationFn: async () =>
      unwrapActionResult(await deleteStockAlert({ id: stockAlert.id })),
    onSuccess: () => {
      router.refresh()
    },
  })

  const handleDelete = () => {
    toast.promise(
      new Promise<void>((resolve, reject) => {
        remove(undefined, { onSuccess: () => resolve(), onError: reject })
      }),
      {
        loading: "Removing alert...",
        success: "Stock alert removed.",
        error: "Failed to remove alert. Please try again.",
      }
    )
  }

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <span className="sr-only">Open menu</span>
            <MoreVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            variant="destructive"
            className="cursor-pointer"
            onClick={handleDelete}
            disabled={isPending}
          >
            <Trash />
            Don&apos;t Alert Me
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
