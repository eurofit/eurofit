import { ResendVerificationForm } from "@/components/auth/resend-verification-form"
import { Logo } from "@/components/logo"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Resend Verification Email",
  robots: { index: false },
}

export default function ResendVerificationPage() {
  return (
    <div className="flex min-h-svh bg-muted p-6 md:p-10">
      <div className="relative m-auto w-full max-w-sm space-y-4">
        <div className="flex items-center justify-center">
          <Logo className="text-xl" />
        </div>
        <ResendVerificationForm />
      </div>
    </div>
  )
}
