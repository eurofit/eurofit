import { getCurrentUser } from "@/actions/auth/get-current-user"
import { CheckoutHeader } from "@/components/checkout/header"
import { CartHydrator } from "@/providers/cart"
import { Metadata } from "next"
import { redirect } from "next/navigation"
import * as React from "react"

export const metadata: Metadata = {
  title: {
    absolute: "Secure Checkout",
  },
  description: "Checkout page",
  robots: {
    index: false,
  },
}

type CheckoutLayoutProps = Readonly<{
  children: React.ReactNode
}>

export default async function CheckoutLayout({
  children,
}: CheckoutLayoutProps) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login" + "?next=" + encodeURIComponent("/checkout"))
  }

  return (
    <>
      <React.Suspense fallback={null}>
        <CartHydrator />
      </React.Suspense>
      <div className="container mx-auto bg-muted/50">
        <CheckoutHeader />
        {children}
      </div>
    </>
  )
}
