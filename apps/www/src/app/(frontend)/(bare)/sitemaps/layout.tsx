import { Metadata } from "next"
import React from "react"

export const metadata: Metadata = {
  title: {
    default: "Sitemaps",
    template: `%s | Sitemaps`,
  },
}

type LayoutProps = Readonly<{ children: React.ReactNode }>

export default function SitemapsLayout({ children }: LayoutProps) {
  return <>{children}</>
}
