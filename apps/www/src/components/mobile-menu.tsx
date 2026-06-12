import { getNav } from "@/actions/get-nav"
import { Button } from "@eurofit/ui/components/button"
import { Menu } from "lucide-react"
import { MobileMenuClient } from "./mobile-menu.client"

export async function MobileMenu() {
  const nav = await getNav()

  return <MobileMenuClient items={nav} />
}

export function MobileMenuSkeleton() {
  return (
    <Button
      variant="ghost"
      size="icon-lg"
      className="animate-pulse md:hidden"
      disabled
      aria-label="Loading menu"
    >
      <span className="sr-only">Mobile menu</span>
      <Menu className="size-5.5" aria-hidden="true" />
    </Button>
  )
}
