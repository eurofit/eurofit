import { Metadata } from "next"

import { getCurrentUser } from "@/actions/auth/get-current-user"
import { PageHeading } from "@/components/page-heading"
import { Separator } from "@eurofit/ui/components/separator"
import { redirect } from "next/navigation"
import { SidebarNav } from "./sidebar"

export const metadata: Metadata = {
  title: "Account",
  description: "Manage your account settings.",
  robots: {
    index: false,
  },
}

const sidebarNavItems = [
  {
    title: "Account",
    href: "/account",
  },
  {
    title: "Addresses",
    href: "/account/addresses",
  },
  {
    title: "Orders",
    href: "/account/orders",
  },
  {
    title: "Stock Alerts",
    href: "/account/stock-alerts",
  },
  {
    title: "Wishlist",
    href: "/account/wishlist",
  },
]

interface SettingsLayoutProps {
  children: React.ReactNode
}

export default async function SettingsLayout({
  children,
}: SettingsLayoutProps) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login" + "?next=" + encodeURIComponent("/account"))
  }

  return (
    <div className="space-y-6">
      <PageHeading
        title="Account"
        description="Manage your account and orders."
      />
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
        <aside className="w-full lg:w-1/5">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex-1 lg:max-w-2xl">{children}</div>
      </div>
    </div>
  )
}
