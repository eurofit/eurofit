import { getInvoice } from "@/actions/get-invoice"
import {
  getOrderConfirmationEmailHTML,
  getOrderConfirmationEmailText,
} from "@/emails/order-confirmation"
import { env } from "@/env.mjs"
import { Order, Transaction, User } from "@/payload-types"
import { orderItem, orderItemSnapShotSchema } from "@/schemas/order"
import { getInvoiceBuffer } from "@/utils/getInvoiceBuffer"
import { CollectionAfterChangeHook } from "payload"
import * as z from "zod"

export const sendOrderConfimationEmail: CollectionAfterChangeHook<
  Transaction
> = async ({ operation, req, doc: transaction, context }) => {
  if (operation !== "create") {
    return
  }
  const isOrderPopulated =
    typeof transaction.order === "object" && transaction.order !== null
  const orderId =
    typeof transaction.order === "number"
      ? transaction.order
      : transaction.order.id

  let order: Order

  if (isOrderPopulated) {
    order = transaction.order as Order
  } else if (context.order) {
    order = context.order as Order
  } else {
    order = await req.payload.findByID({
      id: orderId,
      collection: "orders",
      req,
    })
  }

  let customer: User

  if (typeof order.customer === "object" && order.customer !== null) {
    customer = order.customer as User
  } else {
    customer = await req.payload.findByID({
      collection: "users",
      id: order.customer,
      req,
    })
  }

  const items = order.items.map(({ snapshot, ...item }) => ({
    ...item,
    ...(typeof snapshot === "object" ? snapshot : {}),
    id:
      typeof item.productVariant === "string"
        ? item.productVariant
        : item.productVariant.id,
  }))

  const itemSchema = orderItemSnapShotSchema.extend(
    orderItem.pick({ id: true, quantity: true }).shape
  )

  const formattedItems = z.array(itemSchema).parse(items)

  const invoice = await getInvoice({ orderId: order.id })
  const invoiceBuffer = await getInvoiceBuffer(invoice)

  req.payload.sendEmail({
    from: env.SMTP_USERNAME,
    to: customer.email,
    subject: "Order Confirmation",
    text: getOrderConfirmationEmailText({
      customer: {
        name: customer.firstName,
      },
      order: {
        id: order.id.toString(),
        items: formattedItems.map((item) => ({
          quantity: item.quantity,
          price: item.price,
          variant: item.variant,
          product: {
            title: item.product.title,
            image: item.product.image,
          },
        })),
        total: order.total! + 300,
        subtotal: order.total!,
        deliveryFee: 350,
      },
    }),
    html: await getOrderConfirmationEmailHTML({
      customer: {
        name: customer.firstName,
      },
      order: {
        id: order.id.toString(),
        items: formattedItems.map((item) => ({
          quantity: item.quantity,
          price: item.price,
          variant: item.variant,
          product: {
            title: item.product.title,
            image: item.product.image,
          },
        })),
        total: order.total! + 300,
        subtotal: order.total!,
        deliveryFee: 350,
      },
    }),
    replyTo: env.SMTP_INFO_USERNAME,
    attachments: [
      {
        filename: `invoice-${order.id}.pdf`,
        content: invoiceBuffer,
        contentType: "application/pdf",
      },
    ],
  })

  return transaction
}
