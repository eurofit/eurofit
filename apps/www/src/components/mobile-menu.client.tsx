"use client"

import { usePreventScroll } from "@/hooks/use-prevent-scroll"
import { useToggle } from "@/hooks/use-toggle"
import { Nav } from "@/payload-types"
import { Button } from "@eurofit/ui/components/button"
import { cn } from "@eurofit/ui/lib/utils"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

type MobileMenuClientProps = {
  items: Nav["items"]
}

export function MobileMenuClient({ items }: MobileMenuClientProps) {
  const { value: isOpen, toggle } = useToggle()
  const pathname = usePathname()

  usePreventScroll({ isDisabled: isOpen === false })

  return (
    <>
      <Button
        variant="ghost"
        size="icon-lg"
        className="md:hidden"
        onClick={toggle}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? (
          <X className="size-5.5" aria-hidden="true" />
        ) : (
          <Menu className="size-5.5" aria-hidden="true" />
        )}
      </Button>

      {isOpen && (
        <div
          className="absolute inset-x-0 top-28 z-50 h-[calc(100vh-7rem)] bg-black/50 supports-backdrop-filter:backdrop-blur-xs motion-safe:animate-in motion-safe:duration-150 motion-safe:fade-in md:hidden"
          onClick={toggle}
        >
          <nav
            className="border-b bg-popover p-2 text-popover-foreground shadow-md motion-safe:animate-in motion-safe:duration-200 motion-safe:ease-out motion-safe:slide-in-from-top-2"
            onClick={(e) => e.stopPropagation()}
          >
            <ul className="flex flex-col gap-0.5">
              {items.map((item) => {
                const isActive =
                  pathname === item.url ||
                  (item.url !== "/" && pathname.startsWith(item.url))

                return (
                  <li key={item.id}>
                    <Link
                      href={item.url}
                      onClick={toggle}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "flex min-h-11 items-center rounded-md px-4 py-2.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                        isActive &&
                          "bg-accent font-medium text-accent-foreground"
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      )}
    </>
  )
}
