"use client"

import { login as loginAction } from "@/actions/auth/login"
import { PasswordInput } from "@/components/password-input"
import { env } from "@/env.mjs"
import { useTurnstileToken } from "@/hooks/use-turnstile-token"
import { LoginData, loginSchema } from "@/lib/schemas/auth/login"
import { isSafeRedirect } from "@/lib/utils/is-safe-redirect"
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
import { Spinner } from "@eurofit/ui/components/spinner"
import { cn } from "@eurofit/ui/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { Turnstile } from "@marsidev/react-turnstile"
import { sendGTMEvent } from "@next/third-parties/google"
import { useMutation } from "@tanstack/react-query"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useRouter } from "nextjs-toploader/app"
import * as React from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const {
    turnstileRef,
    getToken,
    reset: resetTurnstile,
    turnstileProps,
  } = useTurnstileToken()
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get("next")

  const { mutate: login, isPending: isLoggingIn } = useMutation({
    mutationFn: async (data: LoginData) => {
      const result = await loginAction(data, await getToken())
      if (!result.success) throw new Error(result.message)
      return result.data
    },
    onSuccess: ({ user }) => {
      router.push(isSafeRedirect(next) ? next : "/")

      sendGTMEvent({
        event: "login",
        method: "email",
        user_id: user.id,
      })
    },
    onError: (error: unknown) => {
      resetTurnstile()
      toast.error(
        error instanceof Error ? error.message : "An unexpected error occurred."
      )
    },
  })

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = (data: LoginData) => login(data)

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="gap-6">
        <CardHeader>
          <CardTitle className="text-2xl text-balance">Sign In</CardTitle>
          <CardDescription>
            Enter your email to sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form
            className="flex flex-col gap-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FieldSet>
              <FieldGroup>
                <Controller
                  control={form.control}
                  name="email"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="email">Email</FieldLabel>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Email"
                        autoComplete="email"
                        spellCheck={false}
                        {...field}
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="password"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <div className="flex items-center">
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                        <Link
                          href="/forgot-password"
                          className="ml-auto text-sm text-foreground! underline underline-offset-2"
                        >
                          Forgot password?
                        </Link>
                      </div>

                      <PasswordInput
                        id="password"
                        autoComplete="current-password"
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
                  id="login-form-turnstile"
                  ref={turnstileRef}
                  siteKey={
                    env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_INVISIBLE_SITEKEY
                  }
                  options={{ size: "invisible" }}
                  {...turnstileProps}
                />
                <Button type="submit" className="w-full" disabled={isLoggingIn}>
                  {isLoggingIn && <Spinner aria-hidden="true" />}
                  {isLoggingIn ? "Logging in…" : "Login"}
                </Button>
              </FieldGroup>
            </FieldSet>
          </form>

          <div className="flex items-center gap-2 text-center text-sm">
            Don&apos;t have an account?
            <Link href="/sign-up" className="underline underline-offset-4">
              Sign up →
            </Link>
          </div>
        </CardContent>
      </Card>
      <div className="text-center text-xs text-balance text-muted-foreground *:[a]:underline *:[a]:underline-offset-4 *:[a]:hover:text-primary">
        By clicking continue, you agree to our{" "}
        <Link href="#">Terms of Service</Link> and{" "}
        <Link href="#">Privacy Policy</Link>.
      </div>
    </div>
  )
}
