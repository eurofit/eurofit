"use client"

import { deleteAddress as deleteAddressAction } from "@/actions/addresses/delete-address"
import { setDefaultAddress as setDefaultAddressAction } from "@/actions/addresses/set-default-address"
import { AddressId } from "@/lib/schemas/addresses/address"
import { unwrapActionResult } from "@/lib/utils/unwrap-action-result"
import { Address } from "@/payload-types"
import { Badge } from "@eurofit/ui/components/badge"
import { Button } from "@eurofit/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@eurofit/ui/components/dropdown-menu"
import { useMutation } from "@tanstack/react-query"
import parsePhoneNumber from "libphonenumber-js"
import { Check, Edit, MoreHorizontal, Star, Trash } from "lucide-react"
import { useRouter } from "nextjs-toploader/app"
import { toast } from "sonner"

type AddressCardProps = {
  address: Address
  onEdit: (id: string) => void
}

export function AddressCard({ address, onEdit }: AddressCardProps) {
  const router = useRouter()
  const phoneNumber = parsePhoneNumber(address.phone, "KE")

  const { mutate: deleteAddress, isPending: isDeletingAddress } = useMutation({
    mutationKey: ["delete-address", address.id],
    mutationFn: async (input: AddressId) =>
      unwrapActionResult(await deleteAddressAction(input)),
    onSuccess: () => router.refresh(),
  })

  const { mutate: setDefaultAddress, isPending: isSettingDefaultAddress } =
    useMutation({
      mutationKey: ["set-default-address", address.id],
      mutationFn: async (input: AddressId) =>
        unwrapActionResult(await setDefaultAddressAction(input)),
      onSuccess: () => router.refresh(),
    })

  const handleDelete = () => {
    toast.promise(
      new Promise<void>((resolve, reject) => {
        deleteAddress(
          { id: address.id },
          { onSuccess: () => resolve(), onError: reject }
        )
      }),
      {
        loading: "Deleting address...",
        success: "Address deleted.",
        error: "Failed to delete address.",
      }
    )
  }

  const handleSetDefault = () => {
    toast.promise(
      new Promise<void>((resolve, reject) => {
        setDefaultAddress(
          { id: address.id },
          { onSuccess: () => resolve(), onError: reject }
        )
      }),
      {
        loading: "Updating default address...",
        success: "Default address updated.",
        error: "Failed to set default address.",
      }
    )
  }

  return (
    <div className="relative flex flex-col gap-3 rounded-lg border p-4 transition-colors hover:bg-accent/30">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <p className="leading-none font-medium">
            {address.firstName} {address.lastName}
          </p>
          {address.label && (
            <Badge variant="secondary" className="text-xs">
              {address.label}
            </Badge>
          )}
          {address.isDefault && (
            <Badge className="bg-green-50 text-xs text-green-700">
              <Star className="size-3" />
              Default
            </Badge>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8 shrink-0">
              <MoreHorizontal className="size-4" />
              <span className="sr-only">Address options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onClick={() => onEdit(address.id)}
              className="cursor-pointer"
            >
              <Edit className="size-4" />
              Edit
            </DropdownMenuItem>
            {!address.isDefault && (
              <DropdownMenuItem
                onClick={handleSetDefault}
                disabled={isSettingDefaultAddress}
                className="cursor-pointer"
              >
                <Check className="size-4" />
                Set as Default
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeletingAddress}
              className="cursor-pointer"
            >
              <Trash className="size-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-0.5 text-sm text-muted-foreground">
        <p>{address.line1}</p>
        {address.line2 && <p>{address.line2}</p>}
        {address.area && <p>{address.area}</p>}
        <p>
          {address.city}, {address.county}
        </p>
        <p>{address.country}</p>
        <p className="pt-1 font-medium text-foreground">
          {phoneNumber ? phoneNumber.formatInternational() : address.phone}
        </p>
      </div>

      {address.note && (
        <p className="border-t pt-2 text-xs text-muted-foreground italic">
          {address.note}
        </p>
      )}
    </div>
  )
}
