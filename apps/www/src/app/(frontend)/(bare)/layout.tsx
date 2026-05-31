import React from "react"

type LayoutProps = Readonly<{
  children: React.ReactNode
}>
export default function Layout({ children }: LayoutProps) {
  return <>{children}</>
}
