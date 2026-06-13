import { env } from "@/env.mjs"
import config from "@/payload.config"
import { NextResponse } from "next/server"
import crypto from "node:crypto"
import { getPayload } from "payload"

const paystackSecretKey = env.PAYSTACK_SECRET_KEY

export async function POST(req: Request) {
  const body = await req.json()

  const hash = crypto
    .createHmac("sha512", paystackSecretKey)
    .update(JSON.stringify(body))
    .digest("hex")

  const paystackSignature = req.headers.get("x-paystack-signature")

  if (hash != paystackSignature) {
    return Response.json(
      {
        success: false,
      },
      {
        status: 401,
      }
    )
  }

  const payload = await getPayload({
    config,
  })

  if (body.event == "charge.success") {
    const eventData = body.data
    // check if order exists and is not already paid
    const { docs: orders } = await payload.find({
      collection: "orders",
      where: {
        and: [
          {
            id: {
              equals: eventData.reference,
            },
          },
          {
            paymentStatus: {
              equals: "unpaid",
            },
          },
        ],
      },
      limit: 1,
      pagination: false,
    })

    if (!orders || orders.length === 0) {
      return Response.json(
        {
          success: false,
          message: "Order not found",
        },
        {
          status: 404,
        }
      )
    }

    const order = orders[0]

    // check if the amount matches, done is transaction collection beforechange hook
    // send order confirmation email to user, done in transaction collection afterchange hook

    await payload.create({
      collection: "transactions",
      data: {
        order: order.id,
        ref: body.data.reference,
        amount: body.data.amount / 100,
        provider: "paystack",
        isTest: body.data.domain !== "live",
        paidAt: body.data.paid_at,
        snapshot: body.data,
      },
      draft: false,
    })
  }

  return NextResponse.json(
    {
      success: true,
    },
    {
      status: 200,
    }
  )
}
