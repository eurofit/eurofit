import { getCurrentUser } from "@/actions/auth/get-current-user"
import { ImageWithRetry } from "@/components/image-with-retry"
import { OrderCard } from "@/components/orders/card"
import { addressSchema } from "@/lib/schemas/addresses/address"
import { orderItemSnapShotSchema } from "@/lib/schemas/orders/item-snapshort"
import { orderItem } from "@/lib/schemas/orders/order-item"
import { formatWithCommas } from "@/lib/utils/format-with-commas"
import config from "@/payload.config"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@eurofit/ui/components/alert"
import { Button } from "@eurofit/ui/components/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@eurofit/ui/components/collapsible"
import { Separator } from "@eurofit/ui/components/separator"
import { format as formatDate } from "date-fns"
import {
  Box,
  CheckIcon,
  ChevronDownIcon,
  Clock,
  ImageOff,
  Mail,
  MapPinIcon,
} from "lucide-react"
import { notFound, redirect } from "next/navigation"
import { getPayload } from "payload"
import * as z from "zod"

type ThankYouPageProps = {
  params: Promise<{
    orderId: string
  }>
}

export default async function ThankYouPage({ params }: ThankYouPageProps) {
  const { orderId } = await params

  //TODO: validate orderId number to be positive integer

  const orderIdNumber = Number(orderId)

  const user = await getCurrentUser()

  if (!user) {
    redirect("/login" + "?next=/thank-you/" + orderId)
  }

  const payload = await getPayload({
    config,
  })

  const { docs: orders } = await payload.find({
    collection: "orders",
    where: {
      and: [
        {
          id: {
            equals: orderIdNumber,
          },
        },
        {
          customer: {
            equals: user.id,
          },
        },
      ],
    },
    select: {
      items: {
        productVariant: true,
        quantity: true,
        snapshot: true,
      },
      snapshot: true,
      transactions: true,
      total: true,
    },
    populate: {
      transactions: {
        paidAt: true,
      },
    },
    overrideAccess: false,
    user: user.id,
    depth: 2,
    limit: 1,
    pagination: false,
    showHiddenFields: false,
  })

  const order = orders[0]

  if (!order) notFound()

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

  const shippingAddress = addressSchema.parse((order.snapshot as any)?.address)

  const transaction = order.transactions?.docs?.filter(
    (t) => typeof t !== "string"
  )?.[0]

  return (
    <>
      {/* <pre>{JSON.stringify(order, null, 2)}</pre> */}
      <main className="mx-auto flex max-w-lg flex-col items-center justify-center">
        <div className="relative flex w-full flex-col items-center justify-center gap-4">
          <div className="flex size-12 rounded-full bg-green-50 text-green-700">
            <CheckIcon className="m-auto size-8" />
          </div>
          <hgroup className="space-y-2">
            <h1 className="text-3xl font-bold">Thank You for Your Order!</h1>
            <p className="text-sm text-muted-foreground">
              Your order has been received and is being processed.
            </p>
          </hgroup>
          <OrderCard orderId={orderIdNumber} />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="size-4.5" />
            <p>
              Order confirmation sent to{" "}
              <strong className="inline">{user.email}</strong>
            </p>
          </div>

          <div className="mt-10 w-full space-y-8">
            <Collapsible defaultOpen>
              <CollapsibleTrigger asChild>
                <Button
                  variant="outline"
                  size="lg"
                  className="group w-full data-[state=open]:rounded-b-none"
                >
                  Order Summary
                  <ChevronDownIcon className="ml-auto group-data-[state=open]:rotate-180" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="rounded-b-lg border px-2.5 py-3">
                <div className="space-y-2">
                  {formattedItems.map((item) => (
                    <div
                      key={item.variant}
                      className="flex items-start gap-2.5"
                    >
                      <div className="relative flex size-16 min-h-16 min-w-16 items-center justify-center rounded-md bg-muted">
                        {item.product.image ? (
                          <ImageWithRetry
                            src={item.product.image}
                            alt={item.product.title}
                            width={64}
                            height={64}
                            className="m-auto max-h-11/12 max-w-11/12 rounded-md object-contain"
                          />
                        ) : (
                          <ImageOff
                            className="size-3/5 text-muted-foreground/50"
                            aria-label="Image not available"
                          />
                        )}
                      </div>
                      <div>
                        <h3 className="max-w-xs text-sm font-medium text-pretty">
                          {item.product.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {item.variant}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="ml-auto space-y-2">
                        <div className="flex items-center justify-end text-right text-sm font-medium">
                          <span className="text-xs text-muted-foreground">
                            Ksh
                          </span>
                          &nbsp;
                          <span>
                            {formatWithCommas(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Separator className="my-4" />
                <dl className="text-sm">
                  <div className="flex items-start justify-between gap-2 py-1.5">
                    <dt className="font-medium">Subtotal</dt>
                    <dd className="text-right slashed-zero tabular-nums">
                      <span className="text-muted-foreground">Ksh</span>
                      &nbsp;
                      <span>{formatWithCommas(order.total!)}</span>
                    </dd>
                  </div>
                  <div className="flex items-start justify-between gap-2 py-1.5">
                    <dt className="font-medium">Delivery Fee</dt>
                    <dd className="text-right slashed-zero tabular-nums">
                      <span className="text-muted-foreground">Ksh</span>
                      &nbsp;
                      <span>{formatWithCommas(2000)}</span>
                    </dd>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex items-start justify-between gap-2 py-1.5 font-medium">
                    <dt className="uppercase">Total</dt>
                    <dd className="text-right slashed-zero tabular-nums">
                      <span className="text-muted-foreground">Ksh</span>
                      &nbsp;
                      <span>{formatWithCommas(order.total! + 2000)}</span>
                    </dd>
                  </div>
                </dl>
              </CollapsibleContent>
            </Collapsible>

            <Collapsible defaultOpen>
              <CollapsibleTrigger asChild>
                <Button
                  variant="outline"
                  size="lg"
                  className="group w-full data-[state=open]:rounded-b-none"
                >
                  Delivery Details
                  <ChevronDownIcon className="ml-auto group-data-[state=open]:rotate-180" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-6 rounded-b-lg border px-2.5 py-3">
                <div className="flex items-start gap-2">
                  <MapPinIcon className="size-5" />
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-pretty">
                      Delivering to
                    </h3>
                    <div className="text-sm text-muted-foreground">
                      <p className="font-medium capitalize">
                        {shippingAddress?.title} {shippingAddress?.firstName}{" "}
                        {shippingAddress?.lastName}
                      </p>
                      <div>
                        <p>{shippingAddress?.line1},</p>
                        {shippingAddress?.line2 && (
                          <p>{shippingAddress?.line2},</p>
                        )}
                        <p>
                          {shippingAddress?.area}, {shippingAddress?.postalCode}
                        </p>

                        <div className="flex gap-1.5">
                          {shippingAddress?.city && (
                            <p>{shippingAddress?.city},</p>
                          )}
                          {shippingAddress?.county && (
                            <p>{shippingAddress?.county}</p>
                          )}
                        </div>

                        {shippingAddress?.country && (
                          <p>{shippingAddress?.country}</p>
                        )}
                        {shippingAddress?.phone && (
                          <p>{shippingAddress?.phone}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <Alert>
                  <Box />
                  <div>
                    <AlertTitle>Estimated Delivery</AlertTitle>
                    <p>Wednesday, March 18 - Saturday, March 19</p>
                  </div>
                  <AlertDescription>
                    We will send you a tracking number once your order has
                    shipped. Delivery times may vary based on your location and
                    the shipping method selected at checkout.
                  </AlertDescription>
                </Alert>
              </CollapsibleContent>
            </Collapsible>

            <Collapsible defaultOpen>
              <CollapsibleTrigger asChild>
                <Button
                  variant="outline"
                  size="lg"
                  className="group w-full data-[state=open]:rounded-b-none"
                >
                  Whats Next?
                  <ChevronDownIcon className="ml-auto group-data-[state=open]:rotate-180" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-6 rounded-b-lg border px-2.5 py-3">
                <ol className="space-y-4">
                  <li className="relative flex gap-4">
                    {/* left */}
                    <div className="relative flex w-6 flex-col items-center">
                      <div className="flex size-6 items-center justify-center rounded-full bg-green-700 text-white">
                        <CheckIcon className="size-4" />
                      </div>
                      {/* connector */}
                      <div className="absolute top-6 bottom-0 left-3 w-1 bg-muted" />
                    </div>
                    {/* right */}
                    <div className="text-sm">
                      <p>Order Placed</p>
                      <p className="text-muted-foreground">
                        {transaction?.paidAt
                          ? formatDate(
                              new Date(transaction.paidAt),
                              "MMMM dd, yyyy 'at' h:mm aa"
                            )
                          : "N/A"}
                      </p>
                    </div>
                  </li>
                  <li className="relative flex gap-4">
                    {/* left */}
                    <div className="relative flex w-6 flex-col items-center">
                      <div className="flex size-6 items-center justify-center rounded-full bg-black text-white">
                        <Clock className="size-4" />
                      </div>
                      {/* connector */}
                      <div className="absolute top-6 bottom-0 left-3 w-1 bg-muted" />
                    </div>
                    {/* right */}
                    <div className="text-sm">
                      <p>Pending Confimation</p>
                    </div>
                  </li>
                </ol>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </main>
    </>
  )
}
