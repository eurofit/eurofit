"use client"

import { resendVerificationEmailByEmail } from "@/actions/auth/resend-verification-email-by-email"
import { env } from "@/env.mjs"
import {
  ResendVerificationData,
  resendVerificationSchema,
} from "@/lib/schemas/auth/resend-verification"
import { Button, buttonVariants } from "@eurofit/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@eurofit/ui/components/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@eurofit/ui/components/field"
import { Input } from "@eurofit/ui/components/input"
import { Spinner } from "@eurofit/ui/components/spinner"
import { zodResolver } from "@hookform/resolvers/zod"
import type { TurnstileInstance } from "@marsidev/react-turnstile"
import { Turnstile } from "@marsidev/react-turnstile"
import { useMutation } from "@tanstack/react-query"
import { MailCheck } from "lucide-react"
import Link from "next/link"
import * as React from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"

export function ResendVerificationForm() {
  const turnstileRef = React.useRef<TurnstileInstance | null>(null)

  const { mutate, isPending, data } = useMutation({
    mutationFn: async (data: ResendVerificationData) => {
      const result = await resendVerificationEmailByEmail(
        data,
        turnstileRef.current?.getResponse() ?? ""
      )
      if (!result.success) throw new Error(result.message)
      return result.data
    },
    onError: (error) => {
      toast.error(error.message)
    },
    onSettled: () => {
      turnstileRef.current?.reset()
    },
  })

  const form = useForm<ResendVerificationData>({
    resolver: zodResolver(resendVerificationSchema),
    defaultValues: { email: "" },
  })

  if (data?.status === "sent") {
    return (
      <Card>
        <CardHeader>
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <MailCheck className="size-6 text-green-600" aria-hidden />
          </div>
          <CardTitle className="text-center text-xl">
            Check your inbox
          </CardTitle>
          <CardDescription className="text-center">
            If an account exists for that email, a new verification link has
            been sent.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            className={buttonVariants({
              variant: "outline",
              className: "w-full",
            })}
            href="/login"
          >
            Back to Sign In
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-balance">
          Resend Verification Email
        </CardTitle>
        <CardDescription>
          Enter your email to receive a new verification link.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit((data) => mutate(data))}>
          <FieldSet>
            <FieldGroup>
              <Controller
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="grid gap-2"
                  >
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      spellCheck={false}
                      aria-invalid={fieldState.invalid}
                      {...field}
                    />
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Turnstile
                id="resend-verification-form-turnstile"
                ref={turnstileRef}
                siteKey={env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_INVISIBLE_SITEKEY}
                options={{ size: "invisible" }}
              />
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending && <Spinner aria-hidden />}
                {isPending ? "Sending…" : "Send Verification Link"}
              </Button>
            </FieldGroup>
          </FieldSet>
        </form>
      </CardContent>
    </Card>
  )
}
