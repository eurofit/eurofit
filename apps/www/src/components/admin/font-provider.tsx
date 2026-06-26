import { dmSans } from "@/fonts/dm-sans"
import type { ReactNode } from "react"

export default function AdminFontProvider({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className={dmSans.variable} style={{ display: "contents" }}>
      {children}
    </div>
  )
}
