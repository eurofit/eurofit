import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { CartHydrator } from "@/providers/cart"
import * as React from "react"

type StoreLayoutProps = Readonly<{
  children: React.ReactNode
}>

export default function StoreLayout({ children }: StoreLayoutProps) {
  return (
    <>
      <React.Suspense fallback={null}>
        <CartHydrator />
      </React.Suspense>
      <div className="container mx-auto">
        <Header />
        <div className="relative min-h-[calc(100vh-7rem)] p-4 md:min-h-[calc(100vh-4rem)] md:p-6">
          {children}
        </div>
        <React.Suspense fallback={<div>Loading footer...</div>}>
          <Footer />
        </React.Suspense>
      </div>
    </>
  )
}
