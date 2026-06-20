"use client"

import { updateAddress as updateAddressAction } from "@/actions/addresses/update-address"
import { CITIES } from "@/const/cities"
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
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@eurofit/ui/components/combobox"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
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
      city: address.city as Address["city"],
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
      <FieldGroup className="gap-8">
        {/* Contact */}
        <FieldSet>
          <FieldLegend className="font-semibold">Contact</FieldLegend>
          <FieldDescription>
            Who should we contact for this delivery?
          </FieldDescription>
          <FieldGroup>
            <div className="grid gap-4 md:grid-cols-2">
              <Controller
                control={form.control}
                name="title"
                render={({
                  field: { onChange, onBlur, ...field },
                  fieldState,
                }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Salutation</FieldLabel>
                    <Select {...field} onValueChange={onChange}>
                      <SelectTrigger
                        id={field.name}
                        onBlur={onBlur}
                        aria-invalid={fieldState.invalid}
                      >
                        <SelectValue placeholder="Select salutation" />
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
                    <FieldLabel htmlFor={field.name}>Phone</FieldLabel>
                    <Input
                      id={field.name}
                      {...field}
                      type="tel"
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

        <FieldSeparator />

        {/* Delivery Address */}
        <FieldSet>
          <FieldLegend className="font-semibold">Delivery Address</FieldLegend>
          <FieldDescription>
            Where should we deliver your order?
          </FieldDescription>
          <FieldGroup>
            <Controller
              control={form.control}
              name="line1"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Street Address</FieldLabel>
                  <Input
                    id={field.name}
                    {...field}
                    aria-invalid={fieldState.invalid}
                    autoComplete="shipping address-line1"
                  />
                  <FieldDescription>
                    Building / estate name and street
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
                    Apartment / Unit{" "}
                    <span className="text-xs font-normal text-muted-foreground">
                      (optional)
                    </span>
                  </FieldLabel>
                  <Input
                    id={field.name}
                    {...field}
                    aria-invalid={fieldState.invalid}
                    autoComplete="shipping address-line2"
                  />
                  <FieldDescription>
                    Floor, flat number, gate number
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
                  <FieldLabel htmlFor={field.name}>
                    Neighbourhood{" "}
                    <span className="text-xs font-normal text-muted-foreground">
                      (optional)
                    </span>
                  </FieldLabel>
                  <Input
                    id={field.name}
                    {...field}
                    placeholder="e.g. Westlands, Kahawa West, Rongai"
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
                  <FieldLabel htmlFor={field.name}>
                    Nearest Landmark{" "}
                    <span className="text-xs font-normal text-muted-foreground">
                      (optional)
                    </span>
                  </FieldLabel>
                  <Input
                    id={field.name}
                    {...field}
                    placeholder="e.g. Opposite Quickmart, Near BBS mall"
                    aria-invalid={fieldState.invalid}
                    autoCapitalize="on"
                    autoComplete="shipping address-level2"
                  />
                  <FieldDescription>
                    Any well-known location your address is close to.
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
                    <FieldLabel htmlFor={field.name}>Postal Code</FieldLabel>
                    <Input
                      id={field.name}
                      {...field}
                      aria-invalid={fieldState.invalid}
                      autoComplete="shipping postal-code"
                    />
                    <FieldDescription>5-digit code</FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="city"
                render={({
                  field: { onChange, onBlur, value },
                  fieldState,
                }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="update-city-combobox">
                      City / Town
                    </FieldLabel>
                    <Combobox value={value} onValueChange={onChange}>
                      <ComboboxInput
                        id="update-city-combobox"
                        aria-invalid={fieldState.invalid}
                        onBlur={onBlur}
                        showTrigger
                        showClear
                        placeholder="Search city or town..."
                      />
                      <ComboboxContent>
                        <ComboboxList>
                          {CITIES.map((city) => (
                            <ComboboxItem key={city} value={city}>
                              {city}
                            </ComboboxItem>
                          ))}
                          <ComboboxEmpty>No city found.</ComboboxEmpty>
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
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
                    <FieldDescription>
                      e.g. Nairobi, Mombasa, Kisumu
                    </FieldDescription>
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

        <FieldSeparator />

        {/* Other Details */}
        <FieldSet>
          <FieldLegend className="font-semibold">Other Details</FieldLegend>
          <FieldDescription>
            Additional details for your delivery.
          </FieldDescription>
          <FieldGroup>
            <Controller
              control={form.control}
              name="label"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Address Label{" "}
                    <span className="text-xs font-normal text-muted-foreground">
                      (optional)
                    </span>
                  </FieldLabel>
                  <Input
                    id={field.name}
                    {...field}
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldDescription>
                    Short name to identify this address. e.g. Home, Work, Shop,
                    Warehouse.
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
                  <FieldLabel htmlFor={field.name}>
                    Delivery Instructions{" "}
                    <span className="text-xs font-normal text-muted-foreground">
                      (optional)
                    </span>
                  </FieldLabel>
                  <Textarea
                    id={field.name}
                    {...field}
                    placeholder="Any special instructions for the delivery rider."
                    aria-invalid={fieldState.invalid}
                    className="resize-none"
                    rows={4}
                  />
                  <FieldDescription>
                    e.g. &quot;Call when you arrive&quot;
                    {firstName && (
                      <span>, &quot;Ask for {firstName}&quot;</span>
                    )}
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
