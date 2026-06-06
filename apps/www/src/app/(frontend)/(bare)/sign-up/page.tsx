import { RedirectIfAuthenticated } from "@/components/auth/redirect-if-authenticated"
import { SignupForm } from "@/components/auth/signup-form"
import { Logo } from "@/components/logo"
import { Metadata } from "next"
import * as React from "react"

export const metadata: Metadata = {
  title: "Signup",
  description: "Create a new account",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "/sign-up",
  },
}

export default function Page() {
  return (
    <div className="flex min-h-svh bg-muted p-6 md:p-10">
      <div className="m-auto w-full max-w-md space-y-4">
        <div className="flex items-center justify-center">
          <Logo className="text-xl" />
        </div>
        <React.Suspense>
          <RedirectIfAuthenticated />
        </React.Suspense>
        <SignupForm />
      </div>
    </div>
  )
}
