import { VerifyEmail } from "@/components/auth/verify-email"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Verify Email",
  description: "Verify your email address.",
  robots: {
    index: false,
  },
}

export default async function VerifyEmailPage() {
  return (
    <main className="flex h-full min-h-[calc(100vh-5rem-3rem)] items-center justify-center md:min-h-[calc(100vh-4rem-3rem)]">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-87.5">
        <VerifyEmail />
      </div>
    </main>
  )
}
