import { getCurrentUser } from "@/actions/auth/get-current-user"
import {
  Item,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@eurofit/ui/components/item"
import { BadgeCheck, Clock } from "lucide-react"
import { Metadata } from "next"
import { redirect } from "next/navigation"
import { AccountForm } from "./form"

export const metadata: Metadata = {
  title: "Account",
  description: "Manage your account settings.",
  robots: {
    index: false,
  },
}

export default async function AccountPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login" + "?next=" + encodeURIComponent("/account"))
  }

  return (
    <div className="space-y-6">
      <hgroup>
        <h3 className="text-lg font-medium">Account</h3>
        <p className="text-sm text-muted-foreground">
          Update your account settings.
        </p>
      </hgroup>
      {user._verified && (
        <Item
          variant="outline"
          size="sm"
          className="bg-green-50 text-green-700"
        >
          <ItemMedia>
            <BadgeCheck className="size-5" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Your verified email is: {user?.email}</ItemTitle>
          </ItemContent>
        </Item>
      )}
      {!user._verified && (
        <Item variant="outline" size="sm" className="bg-blue-50 text-blue-700">
          <ItemMedia>
            <Clock className="size-5" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Your email is not verified</ItemTitle>
          </ItemContent>
        </Item>
      )}

      <AccountForm user={user} />
    </div>
  )
}
