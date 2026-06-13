import { CheckoutHeader } from "@/components/checkout/header"
import { CartHydrator } from "@/providers/cart"
import { Metadata } from "next"
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

export default function CheckoutLayout({ children }: CheckoutLayoutProps) {
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
