import { Order } from "@/payload-types"
import { FieldHook } from "payload"

export const getOrderStatus: FieldHook<Order, Order["status"], Order> = async ({
  data,
  req,
}) => {
  const { docs: orderStatuses } = await req.payload.find({
    collection: "order-statuses",
    where: {
      order: {
        equals: data?.id,
      },
    },
    select: {
      status: true,
    },
    sort: "-createdAt",
    depth: 0, // Never increment depth to avoid infinite loop
    limit: 1,
    pagination: false,
  })

  const orderStatus = orderStatuses[0]
  return orderStatus?.status ?? "pending"
}
