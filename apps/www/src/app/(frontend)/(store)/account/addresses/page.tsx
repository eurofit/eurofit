import { getCurrentUser } from "@/actions/auth/get-current-user"
import { AddressesManager } from "@/components/addresses/manager"
import { getAddresses } from "@/lib/utils/addresses/get-addresses"
import { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Addresses",
  robots: { index: false },
}

export default async function AddressesPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login" + "?next=" + encodeURIComponent("/account/addresses"))
  }

  const addresses = await getAddresses()

  return (
    <div className="space-y-6">
      <hgroup>
        <h3 className="text-lg font-medium">Addresses</h3>
        <p className="text-sm text-muted-foreground">
          Manage your delivery addresses.
        </p>
      </hgroup>
      <AddressesManager addresses={addresses} />
    </div>
  )
}
