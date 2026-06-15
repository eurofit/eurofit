"use client"

import { updateAddress as updateAddressAction } from "@/actions/addresses/update-address"
import { titles } from "@/const/titles"
import { env } from "@/env.mjs"
import {
  Address,
  AddressWithId,
  addressSchema,
} from "@/lib/schemas/addresses/address"
import { unwrapActionResult } from "@/lib/utils/unwrap-action-result"
import { Address as AddressDoc } from "@/payload-types"
import { Button } from "@eurofit/ui/components/button"
import { Checkbox } from "@eurofit/ui/components/checkbox"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@eurofit/ui/components/field"
import { Input } from "@eurofit/ui/components/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@eurofit/ui/components/select"
import { Spinner } from "@eurofit/ui/components/spinner"
import { Textarea } from "@eurofit/ui/components/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import type { TurnstileInstance } from "@marsidev/react-turnstile"
import { Turnstile } from "@marsidev/react-turnstile"
import { useMutation } from "@tanstack/react-query"
import * as React from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { stepper } from "./stepper/steps"

const { useStepper } = stepper

type UpdateAddressFormProps = {
  address: AddressDoc
  onClose: () => void
  onPending: (isPending: boolean) => void
}

export function UpdateAddressForm({
  address,
  onClose,
  onPending,
}: UpdateAddressFormProps) {
  const stepper = useStepper()
  const turnstileRef = React.useRef<TurnstileInstance | null>(null)
  const [turnstileToken, setTurnstileToken] = React.useState<string | null>(
    null
  )

  const { mutate: updateAddress, isPending: isUpdatingAddress } = useMutation({
    mutationKey: ["update-address"],
    mutationFn: async (values: AddressWithId) =>
      unwrapActionResult(
        await updateAddressAction(values, turnstileToken ?? "")
      ),
    onMutate: () => {
      onPending(true)
      stepper.data.set("address", { isUpdatingAddress: true })
    },
    onSuccess: (data) => {
      toast.success("Address updated successfully!")
      stepper.data.set("address", data)
      onClose()
    },
    onError: () => {
      setTurnstileToken(null)
      turnstileRef.current?.reset()
      toast.error("Failed to update address. Please try again.")
    },
    onSettled: () => {
      onPending(false)
    },
  })

  const form = useForm<Address>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      title: address.title,
      firstName: address.firstName,
      lastName: address.lastName,
      phone: address.phone,
      line1: address.line1,
      line2: address.line2 ?? "",
      area: address.area ?? "",
      landmark: address.landmark ?? "",
      postalCode: address.postalCode,
      city: address.city,
      county: address.county,
      country: address.country,
      label: address.label ?? "",
      note: address.note ?? "",
      isDefault: address.isDefault,
    },
  })

  const firstName = form.watch("firstName")

  function onSubmit(values: Address) {
    updateAddress({
      ...values,
      id: address.id,
    })
  }
  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex w-full justify-between gap-8"
    >
      <FieldGroup>
        <FieldSet>
          <FieldGroup>
            <FieldSet>
              <FieldGroup>
                <div className="grid gap-2 md:grid-cols-2">
                  <Controller
                    control={form.control}
                    name="title"
                    render={({
                      field: { onChange, onBlur, ...field },
                      fieldState,
                    }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                        <Select {...field} onValueChange={onChange}>
                          <SelectTrigger
                            id={field.name}
                            onBlur={onBlur}
                            aria-invalid={fieldState.invalid}
                          >
                            <SelectValue placeholder="Please select a title" />
                          </SelectTrigger>
                          <SelectContent>
                            {titles.map((title) => (
                              <SelectItem key={title.value} value={title.value}>
                                {title.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    control={form.control}
                    name="firstName"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>First Name</FieldLabel>
                        <Input
                          id={field.name}
                          {...field}
                          aria-invalid={fieldState.invalid}
                          autoComplete="given-name"
                        />

                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    control={form.control}
                    name="lastName"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Last Name</FieldLabel>
                        <Input
                          id={field.name}
                          {...field}
                          aria-invalid={fieldState.invalid}
                          autoComplete="family-name"
                        />

                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    control={form.control}
                    name="phone"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Telephone</FieldLabel>
                        <Input
                          id={field.name}
                          {...field}
                          aria-invalid={fieldState.invalid}
                          autoComplete="tel"
                        />

                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>
              </FieldGroup>
            </FieldSet>

            <FieldSet>
              <FieldGroup>
                <Controller
                  control={form.control}
                  name="line1"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        Address Line 1
                      </FieldLabel>
                      <Input
                        id={field.name}
                        {...field}
                        aria-invalid={fieldState.invalid}
                        autoComplete="shipping address-line1"
                      />
                      <FieldDescription>
                        Primary address details, e.g: Street name, building name
                        / Estate name
                      </FieldDescription>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="line2"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        Address Line 2
                      </FieldLabel>
                      <Input
                        id={field.name}
                        {...field}
                        aria-invalid={fieldState.invalid}
                        autoComplete="shipping address-line2"
                      />
                      <FieldDescription>
                        Additional address details, e.g., unit, floor / Gate,
                        house no etc.
                      </FieldDescription>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="area"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Area</FieldLabel>
                      <Input
                        id={field.name}
                        {...field}
                        placeholder="Eg: Eastleigh, Westlands, Kahawa West, Utawala Nyali, Rongai, etc."
                        aria-invalid={fieldState.invalid}
                        autoCapitalize="on"
                        autoComplete="shipping address-level2"
                      />

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="landmark"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Landmark</FieldLabel>
                      <Input
                        id={field.name}
                        {...field}
                        placeholder="Eg: Opposite Quickmart, Near BBS mall, etc."
                        aria-invalid={fieldState.invalid}
                        autoCapitalize="on"
                        autoComplete="shipping address-level2"
                      />
                      <FieldDescription>
                        Any famous location your address is near to.
                      </FieldDescription>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <Controller
                    control={form.control}
                    name="postalCode"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>
                          Postal Code
                        </FieldLabel>
                        <Input
                          id={field.name}
                          {...field}
                          aria-invalid={fieldState.invalid}
                          autoComplete="shipping postal-code"
                        />

                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    control={form.control}
                    name="city"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>
                          City / Town
                        </FieldLabel>
                        <Input
                          id={field.name}
                          {...field}
                          aria-invalid={fieldState.invalid}
                          autoCapitalize="on"
                          autoComplete="shipping address-level2"
                        />

                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    control={form.control}
                    name="county"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>County</FieldLabel>
                        <Input
                          id={field.name}
                          {...field}
                          aria-invalid={fieldState.invalid}
                          autoCapitalize="on"
                          autoComplete="shipping address-level1"
                        />

                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    control={form.control}
                    name="country"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Country</FieldLabel>
                        <Input
                          id={field.name}
                          {...field}
                          aria-invalid={fieldState.invalid}
                          autoCapitalize="on"
                          autoComplete="shipping country-name"
                          disabled
                        />

                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>
              </FieldGroup>
            </FieldSet>
          </FieldGroup>
        </FieldSet>
        <FieldSet>
          <FieldLegend>Other Details</FieldLegend>
          <FieldDescription>
            Additional details for your delivery.
          </FieldDescription>
          <FieldGroup>
            <Controller
              control={form.control}
              name="label"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Label</FieldLabel>
                  <Input
                    id={field.name}
                    {...field}
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldDescription>
                    Short name to identify this address. Eg: Home, Work, Shop,
                    Warehouse, Cargo.
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="note"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Delivery Note</FieldLabel>
                  <Textarea
                    id={field.name}
                    {...field}
                    placeholder="Any special  instructions for delivery."
                    aria-invalid={fieldState.invalid}
                    className="resize-none"
                    rows={5}
                  />
                  <FieldDescription>
                    Eg: &quot;Call when you arrive&quot;,{" "}
                    {firstName && <span>&quot;Ask for {firstName}&quot;</span>}
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="isDefault"
              render={({
                field: { onChange, value, ...field },
                fieldState,
              }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor={field.name}
                    className="flex items-start gap-3 rounded-lg border p-3 hover:bg-accent/50 has-disabled:cursor-not-allowed has-aria-invalid:border-destructive/70"
                  >
                    <Checkbox
                      id={field.name}
                      {...field}
                      checked={value}
                      onCheckedChange={onChange}
                      aria-invalid={fieldState.invalid}
                    />
                    <div className="grid gap-1.5 font-normal">
                      <p className="text-sm leading-none font-medium">
                        Set as default address
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Use this address as your default for future orders.
                      </p>
                    </div>
                  </FieldLabel>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </FieldSet>
        <Turnstile
          id="update-address-form-turnstile"
          ref={turnstileRef}
          siteKey={env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_INVISIBLE_SITEKEY}
          options={{ size: "invisible" }}
          onSuccess={(token) => setTurnstileToken(token)}
          onError={() => setTurnstileToken(null)}
          onExpire={() => setTurnstileToken(null)}
        />
        <Field orientation="horizontal" className="flex justify-end">
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>

            <Button
              type="submit"
              className="ml-auto"
              disabled={!turnstileToken || isUpdatingAddress}
            >
              {isUpdatingAddress && <Spinner />}
              {isUpdatingAddress ? "Updating Address..." : "Update Address"}
            </Button>
          </div>
        </Field>
      </FieldGroup>
    </form>
  )
}
