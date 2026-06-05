import type { ReactNode } from "react"
import { Button } from "react-email"

type EmailButtonProps = {
  href: string
  children: ReactNode
}

export function EmailButton({ href, children }: EmailButtonProps) {
  return (
    <Button
      href={href}
      className="box-border w-full rounded-lg bg-blue-600 px-3 py-3 text-center font-semibold text-white"
    >
      {children}
    </Button>
  )
}
