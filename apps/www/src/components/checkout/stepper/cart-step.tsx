"use client"

import { useCart } from "@/hooks/use-cart"
import { Button } from "@eurofit/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@eurofit/ui/components/card"
import { ShoppingBag } from "lucide-react"
import { CartItem } from "./cart-item"
import { Stepper, useStepper } from "./steps"

export function CartStep() {
  const stepper = useStepper()
  const { items, isEmpty } = useCart()

  return (
    <Stepper.Content step="cart">
      <Card>
        <CardHeader>
          <CardTitle>Cart</CardTitle>
          <CardDescription>
            Review your cart before placing your order.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isEmpty && (
            <div className="flex items-center gap-2">
              <ShoppingBag className="size-4" />
              <p>Your cart is empty</p>
            </div>
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
          <Button onClick={() => stepper.next()} disabled={isEmpty}>
            Next: Address
          </Button>
        </CardFooter>
      </Card>
    </Stepper.Content>
  )
}
