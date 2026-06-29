"use client"

import { AddressRadioItem } from "@/components/addresses/radio-item"
import { stepper } from "@/components/checkout/stepper/steps"
import { useCurrentUserId } from "@/contexts/current-user-context"
import { useCart } from "@/hooks/use-cart"
import { sendAddShippingInfoEvent } from "@/lib/analytics/ecommerce/add-shipping-info"
import { AddressId, addressIdSchema } from "@/lib/schemas/addresses/address"
import { Address } from "@/payload-types"
import { Button } from "@eurofit/ui/components/button"
import { Field, FieldGroup, FieldLabel } from "@eurofit/ui/components/field"
import { RadioGroup } from "@eurofit/ui/components/radio-group"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"

const { useStepper } = stepper

type AddressSelectorProps = {
  addresses: Address[]
  onEditAddress: (id: string) => void
}

export function AddressSelector({
  addresses,
  onEditAddress,
}: AddressSelectorProps) {
  const stepper = useStepper()
  const { items, total } = useCart()
  const userId = useCurrentUserId()

  const addressForm = useForm<AddressId>({
    resolver: zodResolver(addressIdSchema),
    defaultValues: {
      id: addresses[0]?.id ?? "",
    },
  })

  function handleAddressSelect({ id }: AddressId) {
    const address = addresses.find((address) => address?.id === id)
    if (!address) {
      toast.error("Address not found")
      return
    }

    const lastConfirmedAddress = stepper.data.get("address") as
      | Address
      | undefined
    if (lastConfirmedAddress?.id !== address.id) {
      sendAddShippingInfoEvent({ items, value: total, userId })
    }

    stepper.data.set("address", address)
    stepper.next()
  }

  return (
    <form onSubmit={addressForm.handleSubmit(handleAddressSelect)}>
      <FieldGroup>
        <Controller
          control={addressForm.control}
          name="id"
          render={({ field, fieldState }) => (
            <Field>
              <RadioGroup
                {...field}
                onValueChange={field.onChange}
                data-invalid={fieldState.invalid}
                defaultValue={addresses[0]?.id}
                className="grid gap-2 md:grid-cols-2"
              >
                {addresses.map((address) => (
                  <FieldLabel key={address.id}>
                    <AddressRadioItem
                      id={address.id}
                      value={address.id}
                      address={address}
                      onSetAddress={(val) => addressForm.setValue("id", val)}
                      aria-invalid={fieldState.invalid}
                      onEditAddress={onEditAddress}
                    />
                  </FieldLabel>
                ))}
              </RadioGroup>
            </Field>
          )}
        />
        <Field orientation="horizontal">
          <Button type="submit" className="ml-auto">
            Next: Review
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
