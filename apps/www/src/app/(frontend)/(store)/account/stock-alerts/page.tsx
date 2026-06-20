import { getCurrentUser } from "@/actions/auth/get-current-user"
import { getUserStockAlerts } from "@/actions/stock-alert/get-user-stock-alerts"
import { StockAlertsTable } from "@/components/stock-alert/table"
import { columns } from "@/components/stock-alert/table/columns"
import { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Stock Alerts",
  robots: { index: false },
}

export default async function StockAlertsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login" + "?next=" + encodeURIComponent("/account/stock-alerts"))
  }

  const stockAlerts = await getUserStockAlerts({ userId: user.id })

  return (
    <div className="space-y-6">
      <hgroup>
        <h3 className="text-lg font-medium">Stock Alerts</h3>
        <p className="text-sm text-muted-foreground">
          Get notified when out-of-stock items are available again.
        </p>
      </hgroup>
      <StockAlertsTable columns={columns} data={stockAlerts} />
    </div>
  )
}
