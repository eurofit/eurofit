import { getCurrentUser } from "@/actions/auth/get-current-user"
import { LoginForm } from "@/components/auth/login-form"
import { Logo } from "@/components/logo"
import { Metadata } from "next"
import { redirect } from "next/navigation"
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

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { next } = await searchParams

  const user = await getCurrentUser()

  if (user) {
    redirect(next ?? "/")
  }

  return (
    <div className="flex min-h-svh bg-muted p-6 md:p-10">
      <div className="relative m-auto w-full max-w-sm space-y-4">
        <div className="flex items-center justify-center">
          <Logo />
        </div>
        <React.Suspense>
          <LoginForm />
        </React.Suspense>
      </div>
    </div>
  )
}
