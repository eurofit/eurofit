import * as React from "react"

type StoreLayoutProps = Readonly<{
  children: React.ReactNode
}>

export default async function StoreLayout({ children }: StoreLayoutProps) {
  return (
    <div className="container mx-auto">
      <div className="relative min-h-[calc(100vh-5rem)] p-4 md:min-h-[calc(100vh-4rem)] md:p-6">
        {children}
      </div>
    </div>
  )
}
