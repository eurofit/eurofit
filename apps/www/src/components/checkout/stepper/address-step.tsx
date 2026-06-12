"use client"

import { useToggle } from "@/hooks/use-toggle"
import { Address } from "@/payload-types"
import { Button } from "@eurofit/ui/components/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@eurofit/ui/components/card"
import { Plus } from "lucide-react"
import * as React from "react"
import { AddressSelector } from "../address-selector"
import { CreateAddressForm } from "../create-address"
import { UpdateAddressForm } from "../update-address"
import { Stepper } from "./steps"

type AddressStepProps = {
  addresses: Address[]
}

export function AddressStep({ addresses }: AddressStepProps) {
  const isAddressesEmpty = addresses.length === 0

  const {
    value: isCreateAddressOpen,
    setOn: openCreateAddress,
    setOff: closeCreateAddress,
  } = useToggle(isAddressesEmpty)

  const [isCreatingAddress, setIsCreatingAddress] = React.useState(false)
  const [editingAddressId, setEditingAddressId] = React.useState<string | null>(
    null
  )
  const [, setIsUpdatingAddress] = React.useState(false)
  const editingAddress = addresses.find(
    (address) => address.id === editingAddressId
  )

  return (
    <Stepper.Content step="address">
      <Card>
        <CardHeader>
          <CardTitle>Delivery address</CardTitle>
          <CardDescription>
            {isAddressesEmpty
              ? "Add new address for your order."
              : "Select a delivery address for your order."}
          </CardDescription>
          {!isAddressesEmpty && (
            <CardAction>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => openCreateAddress()}
                disabled={isCreatingAddress || isCreateAddressOpen}
              >
                <Plus aria-hidden="true" />
                Add New Address
              </Button>
            </CardAction>
          )}
        </CardHeader>
        <CardContent>
          {(isAddressesEmpty || isCreateAddressOpen) && !editingAddressId && (
            <CreateAddressForm
              onClose={closeCreateAddress}
              isDefault={isAddressesEmpty}
              onPending={setIsCreatingAddress}
            />
          )}

          {!isAddressesEmpty && !isCreateAddressOpen && !editingAddressId && (
            <AddressSelector
              addresses={addresses}
              onEditAddress={setEditingAddressId}
            />
          )}

          {editingAddress && (
            <UpdateAddressForm
              address={editingAddress}
              onClose={() => setEditingAddressId(null)}
              onPending={setIsUpdatingAddress}
            />
          )}
        </CardContent>
      </Card>
    </Stepper.Content>
  )
}
