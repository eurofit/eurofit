import { getCurrentUser } from "@/actions/auth/get-current-user"
import { GTMEventTracker } from "@/components/analytics/gtm-event-tracker"
import { ImageWithRetry } from "@/components/image-with-retry"
import { OrderCard } from "@/components/orders/card"
import {
  GTM_ECOMMERCE_CURRENCY,
  GTM_ECOMMERCE_EVENT,
} from "@/const/gtm-ecommerce-events"
import { STORE } from "@/const/store"
import { APP_TIME_ZONE } from "@/const/time"
import { toGTMItems } from "@/lib/analytics/ecommerce/to-gtm-item"
import { formatWithCommas } from "@/lib/utils/format-with-commas"
import { formatDeliveryDateRange } from "@/lib/utils/orders/format-delivery-date-range"
import { getCustomerLifetimeValue } from "@/lib/utils/orders/get-customer-lifetime-value"
import { getThankYouOrder } from "@/lib/utils/orders/get-thank-you-order"
import { tz } from "@date-fns/tz"
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

type ThankYouPageProps = {
  params: Promise<{
    orderId: string
  }>
}

export default async function ThankYouPage({ params }: ThankYouPageProps) {
  const { orderId } = await params

  const orderIdNumber = Number(orderId)

  if (!Number.isInteger(orderIdNumber) || orderIdNumber <= 0) {
    notFound()
  }

  const user = await getCurrentUser()

  if (!user) {
    redirect("/login" + "?next=/thank-you/" + orderId)
  }

  const [orderData, { clv, isCustomerNew }] = await Promise.all([
    getThankYouOrder({ orderId: orderIdNumber, user }),
    getCustomerLifetimeValue({
      email: user.email,
      currentOrderId: orderIdNumber,
    }).catch(() => ({ clv: 0, isCustomerNew: false })),
  ])

  if (!orderData) notFound()

  const { order, formattedItems, shippingAddress } = orderData
  const isPickup = order.fulfillmentType === "pickup"

  return (
    <>
      <GTMEventTracker
        ecommerce
        userData={{
          email: user.email,
          is_new_customer: isCustomerNew,
          customer_lifetime_value: clv,
        }}
        event={{
          event: GTM_ECOMMERCE_EVENT.PURCHASE,
          ecommerce: {
            currency: GTM_ECOMMERCE_CURRENCY,
            transaction_id: orderId,
            value: order.total!,
            shipping: order.deliveryFee!,
            discount: order.discountTotal ?? 0,
            items: toGTMItems(
              formattedItems.map((item) => ({
                sku: item.sku,
                productTitle: item.product.title,
                price: item.price,
                discountedPrice: item.discount?.price ?? null,
                brand: item.product.brand ?? null,
                categories: item.product.categories,
                variantLabel: item.variant,
                quantity: item.quantity,
              }))
            ),
          },
        }}
      />
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
                      <span>{formatWithCommas(order.subtotal!)}</span>
                    </dd>
                  </div>
                  {!!order.discountTotal && order.discountTotal > 0 && (
                    <div className="flex items-start justify-between gap-2 py-1.5">
                      <dt className="font-medium">Discount</dt>
                      <dd className="text-right text-green-600 slashed-zero tabular-nums">
                        <span>−</span>
                        <span className="text-muted-foreground">Ksh</span>
                        &nbsp;
                        <span>{formatWithCommas(order.discountTotal)}</span>
                      </dd>
                    </div>
                  )}
                  {isPickup ? (
                    <div className="flex items-start justify-between gap-2 py-1.5">
                      <dt className="font-medium">Store pickup</dt>
                      <dd className="text-right font-medium text-green-600">
                        Free
                      </dd>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-2 py-1.5">
                      <dt className="font-medium">Delivery Fee</dt>
                      <dd className="text-right slashed-zero tabular-nums">
                        <span className="text-muted-foreground">Ksh</span>
                        &nbsp;
                        <span>{formatWithCommas(order.deliveryFee!)}</span>
                      </dd>
                    </div>
                  )}
                  <Separator className="my-2" />
                  <div className="flex items-start justify-between gap-2 py-1.5 font-medium">
                    <dt className="uppercase">Total</dt>
                    <dd className="text-right slashed-zero tabular-nums">
                      <span className="text-muted-foreground">Ksh</span>
                      &nbsp;
                      <span>{formatWithCommas(order.total!)}</span>
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
                  {isPickup ? "Pickup Details" : "Delivery Details"}
                  <ChevronDownIcon className="ml-auto group-data-[state=open]:rotate-180" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-6 rounded-b-lg border px-2.5 py-3">
                {isPickup ? (
                  <>
                    <div className="flex items-start gap-2">
                      <MapPinIcon className="size-5" />
                      <div className="space-y-1">
                        <h3 className="text-sm font-medium text-pretty">
                          Pick up at
                        </h3>
                        <div className="text-sm text-muted-foreground">
                          <p className="font-medium">{STORE.name}</p>
                          {STORE.addressLines.map((line) => (
                            <p key={line}>{line}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                    <Alert>
                      <Clock />
                      <div>
                        <AlertTitle>Store hours</AlertTitle>
                        <p>{STORE.hours}</p>
                      </div>
                      <AlertDescription>
                        We will email you when your order is ready for
                        collection. Please bring your order number and a valid
                        ID.
                      </AlertDescription>
                    </Alert>
                  </>
                ) : (
                  <>
                    <div className="flex items-start gap-2">
                      <MapPinIcon className="size-5" />
                      <div className="space-y-1">
                        <h3 className="text-sm font-medium text-pretty">
                          Delivering to
                        </h3>
                        <div className="text-sm text-muted-foreground">
                          <p className="font-medium capitalize">
                            {shippingAddress?.title}{" "}
                            {shippingAddress?.firstName}{" "}
                            {shippingAddress?.lastName}
                          </p>
                          <div>
                            <p>{shippingAddress?.line1},</p>
                            {shippingAddress?.line2 && (
                              <p>{shippingAddress?.line2},</p>
                            )}
                            <p>
                              {shippingAddress?.area},{" "}
                              {shippingAddress?.postalCode}
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
                        <p>
                          {order.estimatedDelivery?.minDate &&
                          order.estimatedDelivery?.maxDate
                            ? formatDeliveryDateRange(
                                new Date(order.estimatedDelivery.minDate),
                                new Date(order.estimatedDelivery.maxDate)
                              )
                            : "To be confirmed"}
                        </p>
                        {order.shipTogether === false && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            In-stock items shipped separately.
                          </p>
                        )}
                      </div>
                      <AlertDescription>
                        We will send you a tracking number once your order has
                        shipped. Delivery times may vary based on your location
                        and the shipping method selected at checkout.
                      </AlertDescription>
                    </Alert>
                  </>
                )}
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
                        {order.createdAt
                          ? formatDate(
                              new Date(order.createdAt),
                              "MMMM dd, yyyy 'at' h:mm aa",
                              { in: tz(APP_TIME_ZONE) }
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
