import { ResetPassword } from "@/components/auth/reset-password"
import { Metadata } from "next"
import * as React from "react"

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Reset your account password",
  robots: {
    index: false,
  },
}

export default async function ResetPasswordPage() {
  return (
    <main className="flex h-full min-h-[calc(100vh-5rem-3rem)] items-center justify-center md:min-h-[calc(100vh-4rem-3rem)]">
      <React.Suspense>
        <ResetPassword />
      </React.Suspense>
    </main>
  )
}
