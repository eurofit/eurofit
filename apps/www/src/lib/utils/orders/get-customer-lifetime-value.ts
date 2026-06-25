import config from "@payload-config"
import { sql } from "@payloadcms/db-postgres"
import { getPayload } from "payload"

type CustomerLifetimeValue = {
  clv: number
  isCustomerNew: boolean
}

type Row = {
  clv: string
  is_customer_new: boolean
}

export async function getCustomerLifetimeValue({
  email,
  currentOrderId,
}: {
  email: string
  currentOrderId: number
}): Promise<CustomerLifetimeValue> {
  const payload = await getPayload({ config })

  const { rows } = (await payload.db.drizzle.execute(sql`
    SELECT
      COALESCE(SUM(o.total) FILTER (WHERE o.payment_status = 'paid' AND o.id != ${currentOrderId}), 0)
      + COALESCE(MAX(o.total) FILTER (WHERE o.id = ${currentOrderId}), 0) AS clv,

      (COUNT(o.id) FILTER (WHERE o.payment_status = 'paid' AND o.id != ${currentOrderId}) = 0)
        AS is_customer_new

    FROM users u
    LEFT JOIN orders o ON o.user_id = u.id
    WHERE u.email = ${email}
  `)) as { rows: Row[] }

  const row = rows[0]

  return {
    clv: parseFloat(row?.clv ?? "0"),
    isCustomerNew: row?.is_customer_new ?? true,
  }
}
