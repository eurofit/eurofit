"use client"

import { DELIVERY_FEE } from "@/const/delivery"
import { useCart } from "@/hooks/use-cart"
import { useCheckout } from "@/hooks/use-checkout"
import { useTurnstileToken } from "@/hooks/use-turnstile-token"
import { getBackorderAvailabilityDate } from "@/lib/utils/feeds/get-backorder-availability-date"
import { formatWithCommas } from "@/lib/utils/format-with-commas"
import { Address } from "@/payload-types"
import { Button } from "@eurofit/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@eurofit/ui/components/card"
import { Spinner } from "@eurofit/ui/components/spinner"
import { Turnstile } from "@marsidev/react-turnstile"
import { ChevronRight, Lock } from "lucide-react"
import React from "react"
import { toast } from "sonner"
import { BackorderAvailabilityNotice } from "./backorder-availability-notice"
import { FulfillmentMethod, FulfillmentSelector } from "./fulfillment-selector"
import { OrderItem } from "./order-item"
import { OrderSummary } from "./order-summary"
import { ShippingSummary } from "./shipping-summary"
import { Stepper, useStepper } from "./steps"
import { StorePickupCard } from "./store-pickup-card"

export function ReviewStep() {
  const stepper = useStepper()
  const address = stepper.data.get("address") as Address | undefined
  const { items, itemCount, total, discountTotal } = useCart()
  const { checkout, isCheckingout } = useCheckout()

  const [fulfillmentType, setFulfillmentType] =
    React.useState<FulfillmentMethod>("delivery")
  const isPickup = fulfillmentType === "pickup"
  const deliveryFee = isPickup ? 0 : DELIVERY_FEE
  const grandTotal = total - discountTotal + deliveryFee

  const hasBackorderItems = items.some((i) => i.isBackorder)
  const hasInStockItems = items.some((i) => !i.isBackorder && !i.isOutOfStock)

  const backorderStartDate = React.useMemo(
    () =>
      hasBackorderItems
        ? getBackorderAvailabilityDate(new Date()).toISOString()
        : undefined,
    [hasBackorderItems]
  )

  const [shipTogether, setShipTogether] = React.useState(true)

  const {
    turnstileRef,
    getToken,
    reset: resetTurnstile,
    turnstileProps,
  } = useTurnstileToken()

  const handleCheckout = async () => {
    if (!isPickup && !address) {
      toast.info("Please provide delivery Address")
      return
    }

    checkout({
      data: {
        items: items.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          snapshot: {
            sku: item.sku,
            bbe: item.expiryDate,
            title: item.title,
            variant: item.variant ?? "",
            price: item.retailPrice!,
            product: item.product,
          },
        })),
        fulfillmentType,
        addressId: isPickup ? undefined : address?.id,
        shipTogether,
      },
      turnstileToken: await getToken(),
    })

    resetTurnstile()
  }

  return (
    <Stepper.Content step="place-order">
      <Card className="max-md:pb-4!">
        <CardHeader>
          <CardTitle>Review Order</CardTitle>
          <CardDescription>Review your order & place it.</CardDescription>
        </CardHeader>
        <CardContent className="mt-4">
          <div className="space-y-6">
            <FulfillmentSelector
              value={fulfillmentType}
              onValueChange={setFulfillmentType}
            />

            {isPickup ? (
              <StorePickupCard />
            ) : (
              <ShippingSummary
                address={address}
                onChange={() => stepper.goTo("address")}
              />
            )}

            <div className="space-y-4 rounded-md border bg-muted/50 p-4">
              <div className="flex items-center gap-2.5">
                <div>
                  <h3 className="text-base font-medium text-foreground">
                    Cart&nbsp;
                    <span className="text-xs text-muted-foreground" aria-hidden>
                      ({itemCount})
                    </span>
                  </h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Your items in the cart
                  </p>
                </div>
                <div className="ml-auto">
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => stepper.goTo("cart")}
                  >
                    Edit <ChevronRight aria-hidden="true" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                {items.map((item) => (
                  <OrderItem key={item.id} item={item} />
                ))}
              </div>
            </div>

            {!isPickup && hasBackorderItems && address && (
              <BackorderAvailabilityNotice
                city={address.city}
                startDate={backorderStartDate}
                hasInStockItems={hasInStockItems}
                shipTogether={shipTogether}
                onShipTogetherChange={setShipTogether}
              />
            )}

            <OrderSummary
              subtotal={total}
              discountTotal={discountTotal}
              deliveryFee={deliveryFee}
            />
          </div>
        </CardContent>
        <CardFooter className="hidden flex-col gap-2 md:flex">
          <PlaceOrderAction
            isCheckingout={isCheckingout}
            onCheckout={handleCheckout}
          />
        </CardFooter>
      </Card>

      <Turnstile
        ref={turnstileRef}
        id="checkout-review-form-turnstile"
        siteKey={
          process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_INVISIBLE_SITEKEY!
        }
        {...turnstileProps}
      />

      {/* mobile sticky  */}
      <div className="sticky bottom-3 z-50 mt-6 flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-lg ring-1 ring-foreground/10 md:hidden">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Order Total</span>
          <span className="font-semibold slashed-zero tabular-nums">
            Ksh {formatWithCommas(grandTotal)}
          </span>
        </div>
        <PlaceOrderAction
          isCheckingout={isCheckingout}
          onCheckout={handleCheckout}
        />
      </div>
    </Stepper.Content>
  )
}

type PlaceOrderActionProps = {
  isCheckingout: boolean
  onCheckout: () => void
}

function PlaceOrderAction({
  isCheckingout,
  onCheckout,
}: PlaceOrderActionProps) {
  return (
    <>
      <Button
        size="lg"
        className="h-12 w-full px-6 text-base font-semibold"
        onClick={onCheckout}
        disabled={isCheckingout}
      >
        {isCheckingout && (
          <>
            <Spinner /> Placing Order
          </>
        )}

        {!isCheckingout && "Place Order"}
      </Button>

      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground not-only:text-center">
        <Lock className="size-4" />
        <p>Secure payment redirect.</p>
      </div>
    </>
  )
}
