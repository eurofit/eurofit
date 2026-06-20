import { getCurrentUser } from "@/actions/auth/get-current-user"
import { getUserOrders } from "@/actions/orders/get-user-orders"
import { OrdersTable } from "@/components/orders/table"
import { columns } from "@/components/orders/table/columns"
import { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Orders",
  robots: {
    index: false,
  },
}

export default async function OrdersPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login" + "?next=" + encodeURIComponent("/orders"))
  }

  const orders = await getUserOrders({ userId: user.id })
  return (
    <main className="space-y-6">
      <hgroup>
        <h3 className="text-lg font-medium">Orders</h3>
        <p className="text-sm text-muted-foreground">
          Manage your orders and order history.
        </p>
      </hgroup>

      <OrdersTable columns={columns} data={orders} />
    </main>
  )
}
