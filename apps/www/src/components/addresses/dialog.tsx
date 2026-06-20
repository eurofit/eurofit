"use client"

import { Address as AddressDoc } from "@/payload-types"
import { Button } from "@eurofit/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@eurofit/ui/components/dialog"
import { ScrollArea } from "@eurofit/ui/components/scroll-area"
import { Plus } from "lucide-react"
import { useRouter } from "nextjs-toploader/app"
import * as React from "react"
import { AddressForm } from "./form"

type AddressDialogProps = {
  address?: AddressDoc
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function AddressDialog({
  address,
  trigger,
  open,
  onOpenChange,
}: AddressDialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const router = useRouter()

  const isControlled = open !== undefined
  const isOpen = isControlled ? open : internalOpen
  const setOpen = isControlled ? (onOpenChange ?? (() => {})) : setInternalOpen

  const isEditing = !!address

  function handleSuccess(_saved: AddressDoc) {
    setOpen(false)
    router.refresh()
  }

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      {trigger ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button>
            <Plus />
            Add Address
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-h-[90dvh] max-w-2xl p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>
            {isEditing ? "Edit Address" : "Add New Address"}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90dvh-5rem)] px-6 pb-6">
          <AddressForm
            address={address}
            onSuccess={handleSuccess}
            onCancel={() => setOpen(false)}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
