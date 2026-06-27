"use client"

import { submitContactForm } from "@/actions/contact"
import { env } from "@/env.mjs"
import { useTurnstileToken } from "@/hooks/use-turnstile-token"
import { ContactData, contactSchema } from "@/lib/schemas/contact/contact"
import { unwrapActionResult } from "@/lib/utils/unwrap-action-result"
import { Button } from "@eurofit/ui/components/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@eurofit/ui/components/field"
import { Input } from "@eurofit/ui/components/input"
import { Spinner } from "@eurofit/ui/components/spinner"
import { Textarea } from "@eurofit/ui/components/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { Turnstile } from "@marsidev/react-turnstile"
import { useMutation } from "@tanstack/react-query"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"

export function ContactForm() {
  const {
    turnstileRef,
    getToken,
    reset: resetTurnstile,
    turnstileProps,
  } = useTurnstileToken()

  const { mutate: submit, isPending: isSubmitting } = useMutation({
    mutationFn: async (data: ContactData) =>
      unwrapActionResult(await submitContactForm(data, await getToken())),
    onSuccess: () => {
      toast.success("Message sent successfully!", {
        description: "We'll get back to you as soon as possible.",
      })
      form.reset()
      resetTurnstile()
    },
    onError: (error) => {
      resetTurnstile()
      toast.error(error.message ?? "Failed to send message. Please try again.")
    },
  })

  const form = useForm<ContactData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  })

  const onSubmit = (data: ContactData) => submit(data)

  return (
    <form
      id="contact-form"
      className="max-w-md space-y-4 p-6 shadow-md"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <FieldSet>
        <FieldGroup>
          <Controller
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Name</FieldLabel>
                <Input
                  aria-invalid={fieldState.invalid}
                  autoComplete="name"
                  {...field}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Email</FieldLabel>
                <Input
                  type="email"
                  aria-invalid={fieldState.invalid}
                  autoComplete="email"
                  {...field}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="subject"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Subject</FieldLabel>
                <Input aria-invalid={fieldState.invalid} {...field} />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="message"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Message</FieldLabel>
                <Textarea aria-invalid={fieldState.invalid} {...field} />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Turnstile
            id="contact-form-turnstile"
            ref={turnstileRef}
            siteKey={env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITEKEY}
            className="w-full"
            options={{ size: "flexible", theme: "light" }}
            {...turnstileProps}
          />
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Spinner aria-hidden="true" />}
            {isSubmitting ? "Sending…" : "Send Message"}
          </Button>
        </FieldGroup>
      </FieldSet>
    </form>
  )
}
