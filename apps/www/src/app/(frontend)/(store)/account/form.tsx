"use client"

import { updateProfile } from "@/actions/account/update-profile"
import type { CurrentUser } from "@/actions/auth/get-current-user"
import { env } from "@/env.mjs"
import {
  updateProfileSchema,
  type UpdateProfile,
} from "@/lib/schemas/account/update-profile"
import { unwrapActionResult } from "@/lib/utils/unwrap-action-result"
import { Button } from "@eurofit/ui/components/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@eurofit/ui/components/field"
import { Input } from "@eurofit/ui/components/input"
import { Spinner } from "@eurofit/ui/components/spinner"
import { zodResolver } from "@hookform/resolvers/zod"
import type { TurnstileInstance } from "@marsidev/react-turnstile"
import { Turnstile } from "@marsidev/react-turnstile"
import { useMutation } from "@tanstack/react-query"
import * as React from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"

type AccountFormProps = {
  user: NonNullable<CurrentUser>
}

export function AccountForm({ user }: AccountFormProps) {
  const turnstileRef = React.useRef<TurnstileInstance | null>(null)

  const form = useForm<UpdateProfile>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
    },
  })

  const { mutate: saveProfile, isPending } = useMutation({
    mutationKey: ["update-profile"],
    mutationFn: async (values: UpdateProfile) =>
      unwrapActionResult(
        await updateProfile(values, turnstileRef.current?.getResponse() ?? "")
      ),
    onError: () => {
      turnstileRef.current?.reset()
    },
  })

  function onSubmit(data: UpdateProfile) {
    toast.promise(
      new Promise<void>((resolve, reject) => {
        saveProfile(data, { onSuccess: () => resolve(), onError: reject })
      }),
      {
        loading: "Saving...",
        success: "Profile updated successfully.",
        error: "Failed to update profile. Please try again.",
      }
    )
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            value={user.email}
            autoComplete="email"
            disabled
            readOnly
            className="text-muted-foreground"
          />
        </Field>

        <div className="grid gap-4 md:grid-cols-2">
          <Controller
            control={form.control}
            name="firstName"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor={field.name}
                  className='after:-ml-0.5 after:text-destructive after:content-["*"]'
                >
                  First Name
                </FieldLabel>
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
                <FieldLabel
                  htmlFor={field.name}
                  className='after:-ml-0.5 after:text-destructive after:content-["*"]'
                >
                  Last Name
                </FieldLabel>
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
        </div>

        <Turnstile
          id="account-profile-form-turnstile"
          ref={turnstileRef}
          siteKey={env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_INVISIBLE_SITEKEY}
          options={{ size: "invisible" }}
        />

        <Field orientation="horizontal" className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending && <Spinner />}
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
