"use client"

import { forgotPassword as forgotPasswordAction } from "@/actions/auth/forgot-password"
import { env } from "@/env.mjs"
import {
  ForgotPasswordData,
  forgotPasswordSchema,
} from "@/lib/schemas/auth/forgot-password"
import { Button } from "@eurofit/ui/components/button"
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
import { zodResolver } from "@hookform/resolvers/zod"
import type { TurnstileInstance } from "@marsidev/react-turnstile"
import { Turnstile } from "@marsidev/react-turnstile"
import { useMutation } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { useRouter } from "nextjs-toploader/app"
import * as React from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"

export function ForgetPasswordForm() {
  const turnstileRef = React.useRef<TurnstileInstance | null>(null)
  const router = useRouter()

  const { mutate: forgotPassword, isPending } = useMutation({
    mutationFn: async (data: ForgotPasswordData) => {
      const result = await forgotPasswordAction(
        data,
        turnstileRef.current?.getResponse() ?? ""
      )
      if (!result.success) throw new Error(result.message)
      return result.data
    },
    onSuccess: () => {
      toast.success("Email sent", {
        description: "Please check your inbox for the password reset link.",
      })
      router.push(`/reset-password`)
    },
    onError: () => {
      turnstileRef.current?.reset()
      toast.error("Error", {
        description: "Something went wrong. Please try again",
        duration: 8000,
        action: {
          label: "Contact us",
          onClick: () => router.push("/contact-us"),
        },
      })
    },
  })

  const form = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = (data: ForgotPasswordData) => {
    forgotPassword(data)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-balance">Forgot Password</CardTitle>
        <CardDescription>
          Enter your email to receive a password reset link.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
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
                      placeholder="you@example.com"
                      type="email"
                      autoComplete="email"
                      spellCheck={false}
                      {...field}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Turnstile
                id="forgot-password-form-turnstile"
                ref={turnstileRef}
                siteKey={env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_INVISIBLE_SITEKEY}
                options={{ size: "invisible" }}
              />
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending && <Loader2 className="size-4 animate-spin" />}
                {isPending ? "Sending…" : "Send Reset Link"}
              </Button>
            </FieldGroup>
          </FieldSet>
        </form>
      </CardContent>
    </Card>
  )
}
