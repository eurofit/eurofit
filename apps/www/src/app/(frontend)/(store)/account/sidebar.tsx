"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { Button } from "@eurofit/ui/components/button"
import { cn } from "@eurofit/ui/lib/utils"

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string
    title: string
  }[]
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <nav
      className={cn(
        "flex w-full space-x-2 overflow-x-auto max-md:py-2 lg:flex-col lg:space-y-1 lg:space-x-0",
        className
      )}
      {...props}
    >
      {items.map((item) => {
        const isActive = pathname === item.href
        return (
          <Button key={item.href} variant="ghost" asChild>
            <Link
              href={item.href}
              className={cn("justify-start", {
                "bg-muted hover:bg-muted": isActive,
                "hover:bg-transparent hover:underline": !isActive,
              })}
            >
              {item.title}
            </Link>
          </Button>
        )
      })}
    </nav>
  )
}
