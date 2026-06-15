"use client"

import { resetPassword } from "@/actions/auth/reset-password"
import { PasswordInput } from "@/components/password-input"
import { env } from "@/env.mjs"
import {
  ResetPasswordData,
  resetPasswordSchema,
} from "@/lib/schemas/auth/reset-password"
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
  FieldLabel,
  FieldSet,
} from "@eurofit/ui/components/field"
import { Input } from "@eurofit/ui/components/input"
import { Spinner } from "@eurofit/ui/components/spinner"
import { zodResolver } from "@hookform/resolvers/zod"
import type { TurnstileInstance } from "@marsidev/react-turnstile"
import { Turnstile } from "@marsidev/react-turnstile"
import { CheckCircle } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useRouter } from "nextjs-toploader/app"
import * as React from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"

export function ResetPassword() {
  const [showPassword, setShowPassword] = React.useState(false)
  const turnstileRef = React.useRef<TurnstileInstance | null>(null)
  const [turnstileToken, setTurnstileToken] = React.useState<string | null>(
    null
  )
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token")

  const form = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "", token: token ?? "" },
  })

  const onSubmit = async (data: ResetPasswordData) => {
    const result = await resetPassword(data, turnstileToken ?? "")

    if (!result.success) {
      // Clear the consumed token; the invisible widget re-solves and fires
      // onSuccess again, which re-enables the submit button.
      setTurnstileToken(null)
      turnstileRef.current?.reset()
      toast.error(result.message)
      return
    }

    toast.success("Password changed successfully!", {
      description: "You can now log in with your new password.",
    })
    form.reset()
    router.push("/login")
  }

  if (!token) {
    return (
      <Card className="w-full max-w-sm">
        <CardHeader>
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <CheckCircle className="size-6 text-green-600" aria-hidden />
          </div>
          <CardTitle className="text-center text-xl">
            Check your email
          </CardTitle>
          <CardDescription className="text-center">
            We&apos;ve sent instructions to reset your password. Check your
            inbox.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl text-balance">Reset Password</CardTitle>
        <CardDescription>Enter your new password.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit(onSubmit)}
          method="post"
        >
          <FieldSet>
            {(["password", "confirmPassword"] as const).map((name, idx) => (
              <Controller
                key={name}
                control={form.control}
                name={name}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="grid gap-2"
                  >
                    <FieldLabel htmlFor={field.name}>
                      {idx === 0 ? "New Password" : "Confirm Password"}
                    </FieldLabel>
                    <PasswordInput
                      id={field.name}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      showPassword={showPassword}
                      onShowPasswordChange={setShowPassword}
                      aria-invalid={fieldState.invalid}
                      {...field}
                    />
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            ))}
            <Controller
              control={form.control}
              name="token"
              render={({ field }) => <Input type="hidden" {...field} />}
            />
          </FieldSet>

          <Turnstile
            id="reset-password-form-turnstile"
            ref={turnstileRef}
            siteKey={env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_INVISIBLE_SITEKEY}
            options={{ size: "invisible" }}
            onSuccess={(token) => setTurnstileToken(token)}
            onError={() => setTurnstileToken(null)}
            onExpire={() => setTurnstileToken(null)}
          />
          <Button
            type="submit"
            className="w-full"
            disabled={!turnstileToken || form.formState.isSubmitting}
          >
            {form.formState.isSubmitting && <Spinner aria-hidden="true" />}
            {form.formState.isSubmitting ? "Resetting…" : "Reset Password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
