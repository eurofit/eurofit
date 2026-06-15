import { Logo } from "@/components/logo"
import { Lock } from "lucide-react"
import * as React from "react"
import { UserButton, UserButtonSkeleton } from "../auth/user-button"

export function CheckoutHeader() {
  return (
    <header className="sticky top-0 z-50 container flex h-20 items-center justify-between gap-x-6 border-b bg-background px-4 md:h-16 md:px-6">
      <Logo />

      <div className="flex items-center gap-2">
        <Lock className="size-4" />
        <p>Secure Checkout</p>
      </div>

      <React.Suspense fallback={<UserButtonSkeleton />}>
        <UserButton />
      </React.Suspense>
    </header>
  )
}
