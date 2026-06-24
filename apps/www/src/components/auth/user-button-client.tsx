"use client"

import type { CurrentUser } from "@/actions/auth/get-current-user"
import { Button } from "@eurofit/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@eurofit/ui/components/dropdown-menu"
import { User } from "lucide-react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { LogoutButton } from "./logout"

type MenuItem = {
  label: string
  href: string
  disabled?: boolean
}

const menuItems: MenuItem[] = [
  { label: "Account", href: "/account" },
  { label: "Orders", href: "/account/orders" },
  { label: "Stock Alerts", href: "/account/stock-alerts" },
  { label: "Wishlist", href: "/account/wishlist" },
]

type UserButtonClientProps = {
  user: CurrentUser | null
  className?: string
}

export function UserButtonClient({ user, className }: UserButtonClientProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  if (!user) {
    const nextUrl = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`
    return (
      <Button variant="outline" size="icon" asChild>
        <Link
          href={`/login?next=${encodeURIComponent(nextUrl)}`}
          className={className}
        >
          <User />
          <span className="sr-only">User menu</span>
        </Link>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className={className}>
        <Button variant="outline" size="icon">
          <User />
          <span className="sr-only">User menu</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm leading-none font-medium">{user.fullName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {menuItems.map((item) => (
            <DropdownMenuItem key={item.href} asChild disabled={item.disabled}>
              <Link href={item.href}>{item.label}</Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <LogoutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
