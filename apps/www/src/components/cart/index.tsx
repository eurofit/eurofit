"use client"

import { useCurrentUserId } from "@/contexts/current-user-context"
import { useCart } from "@/hooks/use-cart"
import { sendViewCartEvent } from "@/lib/analytics/ecommerce/view-cart"
import { formatWithCommas } from "@/lib/utils/format-with-commas"
import { Badge } from "@eurofit/ui/components/badge"
import { Button } from "@eurofit/ui/components/button"
import { Separator } from "@eurofit/ui/components/separator"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@eurofit/ui/components/sheet"
import { cn } from "@eurofit/ui/lib/utils"
import {
  ChevronRight,
  Info,
  ShoppingBag,
  ShoppingBasket,
  ShoppingCart,
} from "lucide-react"
import Link from "next/link"
import pluralize from "pluralize-esm"
import { Fragment } from "react"
import { CartItem } from "./cart-item"

export function Cart() {
  const { items, total, discountTotal, itemCount, isEmpty, isMutating } =
    useCart()
  const userId = useCurrentUserId()
  const hasDiscount = discountTotal > 0
  const payableSubtotal = total - discountTotal

  // GA4 `view_cart` fires each time the cart is opened with at least one item.
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen || isEmpty) return

    sendViewCartEvent({ items, value: payableSubtotal, userId })
  }

  return (
    <Sheet modal onOpenChange={handleOpenChange}>
      <SheetTrigger disabled={isMutating} asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative"
          aria-label="View Cart"
        >
          <ShoppingBag aria-hidden="true" />

          <span className="sr-only">Cart Button</span>
          {itemCount > 0 && (
            <Badge className="font-variant-numeric-tabular-nums absolute -inset-e-2.5 -top-2.5 h-5 min-w-5 rounded-full bg-destructive px-1">
              {itemCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent
        className="flex h-full w-11/12! min-w-1/3 flex-col"
        style={{ overscrollBehavior: "contain" }}
      >
        {/* HEADER  */}
        <SheetHeader className="flex-row items-center gap-2 border-b">
          <SheetTitle>Cart</SheetTitle>
          {itemCount > 0 && (
            <SheetDescription className="text-xs">
              ({itemCount} {pluralize("item", itemCount)})
            </SheetDescription>
          )}
        </SheetHeader>

        {/* EMPTY CART  */}
        {isEmpty && (
          <div className="relative flex grow items-center justify-center">
            <section className="m-auto flex max-w-sm flex-col items-center gap-6 text-center">
              <ShoppingBasket
                className="size-24 text-gray-200"
                aria-hidden="true"
              />
              <hgroup className="space-y-2">
                <h2 className="text-xl font-medium text-balance text-muted-foreground">
                  Empty Cart
                </h2>
                <p className="mx-auto max-w-3/5 text-sm text-balance text-muted-foreground">
                  Your cart is empty. Add items to see them here.
                </p>
              </hgroup>
            </section>
          </div>
        )}

        {/* CART ITEMS */}
        {!isEmpty && (
          <div className="scrollbar flex grow flex-col overflow-y-auto px-6">
            {items.map((item, itemIndex) => (
              <Fragment key={item.id}>
                {itemIndex > 0 && itemIndex < itemCount && (
                  <Separator className="my-6" />
                )}
                <CartItem key={item.id} item={item} index={itemIndex} />
              </Fragment>
            ))}
          </div>
        )}

        {/* FOOTER   */}
        <SheetFooter
          className={cn("mt-auto flex-col space-y-0 bg-background p-6", {
            "border-t": !isEmpty,
          })}
        >
          {!isEmpty && (
            <div className="space-y-4">
              {/* Totals */}
              <dl className="space-y-1.5 px-2.5">
                {hasDiscount && (
                  <>
                    <div className="flex items-center justify-between gap-2 text-sm">
                      <dt className="text-muted-foreground">Original</dt>
                      <dd className="text-muted-foreground tabular-nums line-through">
                        Ksh&nbsp;{formatWithCommas(total)}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-2 text-sm">
                      <dt className="font-medium text-primary">You save</dt>
                      <dd className="font-medium text-primary tabular-nums">
                        −Ksh&nbsp;{formatWithCommas(discountTotal)}
                      </dd>
                    </div>
                  </>
                )}

                <div className="flex items-center justify-between gap-2">
                  <dt className="text-lg font-semibold">Subtotal</dt>
                  <dd className="flex items-center">
                    <span className="text-muted-foreground">Ksh</span>
                    &nbsp;
                    <span className="text-lg font-semibold tabular-nums">
                      {formatWithCommas(payableSubtotal)}
                    </span>
                  </dd>
                </div>
              </dl>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <SheetClose asChild>
                  <Button variant="secondary" className="flex-1">
                    <ShoppingCart aria-hidden="true" />
                    Continue Shopping
                  </Button>
                </SheetClose>

                <SheetClose asChild>
                  <Button className="flex-1" asChild>
                    <Link
                      href="/checkout"
                      className="flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="size-4" aria-hidden="true" />
                      Checkout
                    </Link>
                  </Button>
                </SheetClose>
              </div>

              {/* Note  */}

              <div className="flex items-center justify-center gap-2 px-2.5">
                <Info className="size-3" />
                <p className="text-xs text-balance text-muted-foreground">
                  Shipping & taxes calculated at checkout.
                </p>
              </div>
            </div>
          )}

          {/* EMPTY CART CLOSE BTN  */}
          {isEmpty && (
            <SheetClose asChild>
              <Button variant="outline" className="items-center" asChild>
                <Link href="/brands">
                  Start Shopping
                  <ChevronRight aria-hidden="true" />
                </Link>
              </Button>
            </SheetClose>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export function CartSkeleton() {
  return (
    <Button
      variant="outline"
      size="icon"
      className="relative"
      disabled
      aria-label="Loading Cart"
    >
      <ShoppingBag aria-hidden="true" />

      <span className="sr-only">Loading Cart</span>
    </Button>
  )
}
