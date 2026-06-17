import { site } from "@/const/site"
import { env } from "@/env.mjs"
import { orderItemSnapShotSchema } from "@/lib/schemas/orders/item-snapshort"
import { orderItem } from "@/lib/schemas/orders/order-item"
import { getInvoiceBuffer } from "@/lib/utils/invoice/getInvoiceBuffer"
import { orderToInvoice } from "@/lib/utils/invoice/orderToInvoice"
import { Order, Transaction, User } from "@/payload-types"
import {
  getOrderConfirmationEmailHTML,
  getOrderConfirmationEmailText,
} from "@eurofit/transactional/order-confirmation"
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

  let orderUser: User

  if (typeof order.user === "object" && order.user !== null) {
    orderUser = order.user as User
  } else {
    orderUser = await req.payload.findByID({
      collection: "users",
      id: order.user,
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

  const invoice = orderToInvoice({
    ...order,
    user: orderUser,
  })
  const invoiceBuffer = invoice ? await getInvoiceBuffer(invoice) : null

  const emailProps = {
    orderUrl: site.url + `order/${order.id}`,
    siteUrl: site.url,
    customer: {
      name: orderUser.firstName,
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
      total: order.total!,
      subtotal: order.subtotal!,
      deliveryFee: order.deliveryFee!,
    },
  }

  try {
    await req.payload.sendEmail({
      from: env.SMTP_NO_REPLY_USERNAME,
      to: orderUser.email,
      subject: "Order Placed",
      text: await getOrderConfirmationEmailText(emailProps),
      html: await getOrderConfirmationEmailHTML(emailProps),
      replyTo: env.SMTP_INFO_USERNAME,
      attachments: [
        invoiceBuffer
          ? {
              filename: `invoice-${order.id}.pdf`,
              content: invoiceBuffer,
              contentType: "application/pdf",
            }
          : null,
      ].filter(Boolean),
    })
  } catch (error) {
    // TODO: implement error tracking service (see TODOS.md)
    console.error("[order-confirmation-email] sendEmail failed:", error)
  }

  return transaction
}
