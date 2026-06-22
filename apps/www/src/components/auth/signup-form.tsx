"use client"

import { signUp as signUpAction } from "@/actions/auth/sign-up"
import { PasswordInput } from "@/components/password-input"
import { env } from "@/env.mjs"
import { SignupData, SignUpSchema } from "@/lib/schemas/auth/signup"
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
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@eurofit/ui/components/field"
import { Input } from "@eurofit/ui/components/input"
import { RadioGroup, RadioGroupItem } from "@eurofit/ui/components/radio-group"
import { Spinner } from "@eurofit/ui/components/spinner"
import { zodResolver } from "@hookform/resolvers/zod"
import type { TurnstileInstance } from "@marsidev/react-turnstile"
import { Turnstile } from "@marsidev/react-turnstile"
import { sendGTMEvent } from "@next/third-parties/google"
import { useMutation } from "@tanstack/react-query"
import Link from "next/link"
import { useRouter } from "nextjs-toploader/app"
import * as React from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const turnstileRef = React.useRef<TurnstileInstance | null>(null)
  const router = useRouter()

  const { mutate: signup, isPending: isSigningUp } = useMutation({
    mutationFn: async (data: SignupData) => {
      const token = turnstileRef.current?.getResponse() ?? ""
      const result = await signUpAction(data, token)
      if (!result.success) throw new Error(result.message)
      return result.data
    },
    onSuccess: () => {
      toast.success("Account created successfully!", {
        description: "Please check your email to verify your account.",
      })
      router.push("/verify-email")

      sendGTMEvent({
        event: "sign_up",
        method: "email",
      })
    },
    onError: (error) => {
      turnstileRef.current?.reset()
      if (error.message === "Email already exists") {
        form.setError("email", {
          message: "An account with this email already exists.",
        })
        toast.error("User already exist")
        return
      }
      toast.error(
        error.message ?? "Failed to create account. Please try again."
      )
    },
  })

  const form = useForm<SignupData>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      gender: "male",
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = (data: SignupData) => {
    signup(data)
  }

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <div className="grid gap-2 md:grid-cols-2">
              <Controller
                control={form.control}
                name="firstName"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="firstName"
                      className='after:-ml-1 after:text-destructive after:content-["*"]'
                    >
                      First Name
                    </FieldLabel>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="John"
                      autoComplete="given-name"
                      aria-invalid={fieldState.invalid}
                      {...field}
                    />
                    {fieldState.error && (
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
                      htmlFor="lastName"
                      className='after:-ml-1 after:text-destructive after:content-["*"]'
                    >
                      Last Name
                    </FieldLabel>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Doe"
                      autoComplete="family-name"
                      aria-invalid={fieldState.invalid}
                      {...field}
                    />
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
            <Controller
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="email"
                    className='after:-ml-1 after:text-destructive after:content-["*"]'
                  >
                    Email
                  </FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    autoComplete="email"
                    aria-invalid={fieldState.invalid}
                    {...field}
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                  <FieldDescription>
                    We&apos;ll use this to contact you. We will not share your
                    email with anyone else.
                  </FieldDescription>
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="gender"
              render={({ field, fieldState }) => (
                <FieldSet>
                  <FieldLegend variant="label">Choose your gender</FieldLegend>

                  <RadioGroup
                    {...field}
                    onValueChange={field.onChange}
                    defaultValue="male"
                    className="max-w-sm md:flex md:gap-2"
                    data-invalid={fieldState.invalid}
                  >
                    <FieldLabel htmlFor="male">
                      <Field orientation="horizontal">
                        <FieldContent>
                          <FieldTitle>Male</FieldTitle>
                          <FieldDescription>(He, Him, His)</FieldDescription>
                        </FieldContent>
                        <RadioGroupItem
                          value="male"
                          id="male"
                          className="data-checked:border-blue-500 data-checked:bg-blue-500"
                        />
                      </Field>
                    </FieldLabel>
                    <FieldLabel htmlFor="female">
                      <Field orientation="horizontal">
                        <FieldContent>
                          <FieldTitle>Female</FieldTitle>
                          <FieldDescription>(She, Her, Hers)</FieldDescription>
                        </FieldContent>
                        <RadioGroupItem
                          value="female"
                          id="female"
                          className="data-checked:border-pink-500 data-checked:bg-pink-500"
                        />
                      </Field>
                    </FieldLabel>
                  </RadioGroup>
                  <FieldDescription>
                    Some supplements are formulated differently for men and
                    women — tell us your gender so we can recommend the right
                    ones for you.
                  </FieldDescription>
                </FieldSet>
              )}
            />

            <Controller
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <PasswordInput
                    id="password"
                    autoComplete="new-password"
                    aria-invalid={fieldState.invalid}
                    {...field}
                  />
                  <FieldDescription>
                    Must be at least 8 characters long.
                  </FieldDescription>
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="confirmPassword"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="confirm-password">
                    Confirm Password
                  </FieldLabel>
                  <PasswordInput
                    id="confirm-password"
                    autoComplete="new-password"
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
              id="signup-form-turnstile"
              ref={turnstileRef}
              siteKey={env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITEKEY}
              className="w-full"
              options={{ size: "flexible", theme: "light" }}
            />
            <Button type="submit" className="w-full" disabled={isSigningUp}>
              {isSigningUp && <Spinner />}
              {isSigningUp ? "Creating Account..." : "Create Account"}
            </Button>

            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="underline underline-offset-4">
                Log in
              </Link>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
