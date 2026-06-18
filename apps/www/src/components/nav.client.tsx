"use client"

import { Nav as NavGlobal } from "@/payload-types"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@eurofit/ui/components/navigation-menu"
import { cn } from "@eurofit/ui/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"

type NavLinksProps = {
  items: NavGlobal["items"]
}

export function NavLinks({ items }: NavLinksProps) {
  const pathname = usePathname()

  if (!items || items.length === 0) return null

  return (
    <NavigationMenu className="hidden md:block">
      <NavigationMenuList>
        {items.map(({ label, url, id }) => {
          const isActive =
            pathname === url || (url !== "/" && pathname.startsWith(url))

          return (
            <NavigationMenuItem key={id}>
              <NavigationMenuLink
                asChild
                active={isActive}
                className={cn(
                  navigationMenuTriggerStyle(),
                  "text-muted-foreground transition-colors data-active:font-semibold data-active:text-foreground"
                )}
              >
                <Link href={url}>{label}</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          )
        })}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
