import { paystack } from "@/lib/paystack"
import { paystackCustomerSchema } from "@/lib/schemas/auth/paystack-customer-code"
import { User } from "@/payload-types"
import { APIError, CollectionBeforeChangeHook } from "payload"

export const syncToPaystack: CollectionBeforeChangeHook<User> = async ({
  operation,
  data,
}) => {
  if (operation !== "create") return

  const validationRes = paystackCustomerSchema.safeParse(data)

  if (!validationRes.success) {
    throw new APIError(`Invalid Inputt`, 400, null, true)
  }

  const {
    email,
    firstName: first_name,
    lastName: last_name,
    phone,
  } = validationRes.data

  const res = await paystack.customer.create({
    email,
    first_name,
    last_name,
    phone,
  })

  if (res.status !== true || !res.data) {
    throw new APIError(`Paystack Error: ${res.message}`, 500)
  }

  return {
    ...data,
    paystackCustomerCode: res.data.customer_code,
  }
}
