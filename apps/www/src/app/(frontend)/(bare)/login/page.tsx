import { LoginForm } from "@/components/auth/login-form"
import { RedirectIfAuthenticated } from "@/components/auth/redirect-if-authenticated"
import { Logo } from "@/components/logo"
import { Metadata } from "next"
import * as React from "react"

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "/login",
  },
}

type LoginPageProps = {
  searchParams: Promise<{
    next?: string
  }>
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  return (
    <div className="flex min-h-svh bg-muted p-6 md:p-10">
      <div className="relative m-auto w-full max-w-sm space-y-4">
        <div className="flex items-center justify-center">
          <Logo />
        </div>
        <React.Suspense>
          <RedirectIfAuthenticated searchParams={searchParams} />
          <LoginForm />
        </React.Suspense>
      </div>
    </div>
  )
}
