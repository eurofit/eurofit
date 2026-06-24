"use client"

import { useCart } from "@/hooks/use-cart"
import { sendBeginCheckoutEvent } from "@/lib/analytics/ecommerce/begin-checkout"
import { Button } from "@eurofit/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@eurofit/ui/components/card"
import { ChevronRight, ShoppingBasket } from "lucide-react"
import Link from "next/link"
import pluralize from "pluralize-esm"
import { useRef } from "react"
import { CartItem } from "./cart-item"
import { Stepper, useStepper } from "./steps"

export function CartStep() {
  const stepper = useStepper()
  const { items, itemCount, isEmpty, total } = useCart()
  const didFireBeginCheckout = useRef(false)

  return (
    <Stepper.Content step="cart">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Cart
            {itemCount > 0 && (
              <span className="text-sm font-normal text-muted-foreground">
                ({itemCount} {pluralize("item", itemCount)})
              </span>
            )}
          </CardTitle>
          <CardDescription>
            Review your cart before placing your order.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isEmpty && (
            <section className="flex flex-col items-center gap-6 py-10 text-center">
              <ShoppingBasket
                className="size-20 text-muted-foreground/30"
                aria-hidden="true"
              />
              <hgroup className="space-y-1.5">
                <h3 className="text-lg font-medium text-muted-foreground">
                  Your cart is empty
                </h3>
                <p className="mx-auto max-w-xs text-sm text-balance text-muted-foreground">
                  Add items to your cart to continue with your order.
                </p>
              </hgroup>
              <Button variant="outline" asChild>
                <Link href="/brands">
                  Start Shopping
                  <ChevronRight aria-hidden="true" />
                </Link>
              </Button>
            </section>
          )}

          {!isEmpty && (
            <div className="space-y-4">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            onClick={() => {
              if (!didFireBeginCheckout.current) {
                sendBeginCheckoutEvent({ items, value: total })
                didFireBeginCheckout.current = true
              }
              stepper.next()
            }}
            disabled={isEmpty}
          >
            Next: Address
          </Button>
        </CardFooter>
      </Card>
    </Stepper.Content>
  )
}
