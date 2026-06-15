"use client"

import { useCart } from "@/hooks/use-cart"
import { useCheckout } from "@/hooks/use-checkout"
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
import type { TurnstileInstance } from "@marsidev/react-turnstile"
import { Turnstile } from "@marsidev/react-turnstile"
import { ChevronRight, Lock, ShoppingCart } from "lucide-react"
import React from "react"
import { toast } from "sonner"
import { OrderItem } from "./order-item"
import { OrderSummary } from "./order-summary"
import { ShippingSummary } from "./shipping-summary"
import { Stepper, useStepper } from "./steps"

export function ReviewStep() {
  const stepper = useStepper()
  const address = stepper.data.get("address") as Address | undefined
  const { items, itemCount, total } = useCart()
  const { checkout, isCheckingout } = useCheckout()

  const turnstileRef = React.useRef<TurnstileInstance | null>(null)
  const [turnstileToken, setTurnstileToken] = React.useState<string | null>(
    null
  )

  const handleCheckout = () => {
    if (!address) {
      toast.info("Please provide delivery Address")
      return
    }

    if (!turnstileToken) {
      toast.error("Security check is still loading. Please wait a moment.")
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
        addressId: address.id,
      },
      turnstileToken,
    })

    setTurnstileToken(null)
    turnstileRef.current?.reset()
  }

  return (
    <Stepper.Content step="place-order">
      <Card className="max-md:pb-4!">
        <CardHeader>
          <CardTitle>Review Order</CardTitle>
          <CardDescription>Review your order & place it.</CardDescription>
        </CardHeader>
        <CardContent className="mt-4">
          <div className="space-y-4">
            <ShippingSummary
              address={address}
              onChange={() => stepper.goTo("address")}
            />

            <div className="space-y-6 rounded-md bg-muted/50 p-2">
              <div className="flex items-center gap-2.5">
                <div className="flex size-16 rounded-md bg-muted">
                  <ShoppingCart className="m-auto size-8" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">
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

            <OrderSummary total={total} />
          </div>
        </CardContent>
        <CardFooter className="hidden flex-col gap-2 md:flex">
          <PlaceOrderAction
            isCheckingout={isCheckingout}
            isReady={Boolean(turnstileToken)}
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
        onSuccess={(token) => setTurnstileToken(token)}
        onError={() => setTurnstileToken(null)}
        onExpire={() => setTurnstileToken(null)}
      />

      {/* mobile sticky  */}
      <div className="sticky bottom-3 z-50 mt-6 flex flex-col gap-2 rounded-xl border bg-card p-4 shadow-lg ring-1 ring-foreground/10 md:hidden">
        <PlaceOrderAction
          isCheckingout={isCheckingout}
          isReady={Boolean(turnstileToken)}
          onCheckout={handleCheckout}
        />
      </div>
    </Stepper.Content>
  )
}

type PlaceOrderActionProps = {
  isCheckingout: boolean
  isReady: boolean
  onCheckout: () => void
}

function PlaceOrderAction({
  isCheckingout,
  isReady,
  onCheckout,
}: PlaceOrderActionProps) {
  return (
    <>
      <Button
        size="lg"
        className="h-12 w-full px-6 text-base font-semibold"
        onClick={onCheckout}
        disabled={isCheckingout || !isReady}
      >
        {isCheckingout && (
          <>
            <Spinner /> Placing Order
          </>
        )}

        {!isCheckingout && "Place Order"}
      </Button>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Lock className="size-4" />
        <p>Secure payment redirect.</p>
      </div>
    </>
  )
}
