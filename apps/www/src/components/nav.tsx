import { getNav } from "@/actions/get-nav"
import { Skeleton } from "@eurofit/ui/components/skeleton"
import { NavLinks } from "./nav.client"

export async function Nav() {
  const navItems = await getNav()
  return <NavLinks items={navItems} />
}

export function NavSkeleton() {
  return (
    <div className="hidden flex-1 gap-2 overflow-hidden md:flex md:items-center">
      <Skeleton className="h-6 w-32 rounded-md" />
      <Skeleton className="h-6 w-24 rounded-md" />
      <Skeleton className="h-6 w-20 rounded-md" />
    </div>
  )
}
