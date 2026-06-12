import { getNav } from "@/actions/get-nav"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@eurofit/ui/components/navigation-menu"
import { Skeleton } from "@eurofit/ui/components/skeleton"

export async function Nav() {
  const navItems = await getNav()
  return (
    <NavigationMenu className="hidden md:block">
      {navItems.length > 0 && (
        <NavigationMenuList>
          {navItems.map(({ label, url, id }) => (
            <NavigationMenuItem key={id}>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                href={url}
              >
                {label}
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      )}
    </NavigationMenu>
  )
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
