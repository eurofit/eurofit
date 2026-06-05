import { getCurrentUser } from "@/actions/auth/get-current-user"
import { SignupForm } from "@/components/auth/signup-form"
import { Logo } from "@/components/logo"
import { Metadata } from "next"
import { redirect } from "next/navigation"

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

export default async function Page() {
  const user = await getCurrentUser()

  if (user) {
    redirect("/")
  }

  return (
    <div className="flex min-h-svh bg-muted p-6 md:p-10">
      <div className="m-auto w-full max-w-md space-y-4">
        <div className="flex items-center justify-center">
          <Logo className="text-xl" />
        </div>
        <SignupForm />
      </div>
    </div>
  )
}
