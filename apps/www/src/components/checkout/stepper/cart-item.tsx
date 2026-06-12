"use client"

import { ImageWithRetry } from "@/components/image-with-retry"
import { useCartQuantity } from "@/hooks/use-cart-quantity"
import { FormattedCartItem } from "@/lib/utils/cart/formatCartItem"
import { formatWithCommas } from "@/lib/utils/format-with-commas"
import { Button } from "@eurofit/ui/components/button"
import {
  ButtonGroup,
  ButtonGroupText,
} from "@eurofit/ui/components/button-group"
import { Spinner } from "@eurofit/ui/components/spinner"
import { ImageOff, Minus, Plus, Trash } from "lucide-react"

type CartItemProps = {
  item: FormattedCartItem
}

export function CartItem({ item }: CartItemProps) {
  const { quantity, increment, decrement, remove, canIncrement, isPending } =
    useCartQuantity({ variant: item })

  const isLastOne = quantity === 1

  return (
    <div className="flex items-start gap-2">
      <div className="relative flex size-16 items-center justify-center rounded-md bg-muted">
        {item.product.image ? (
          <ImageWithRetry
            src={item.product.image}
            alt={item.product.title}
            width={64}
            height={64}
            className="m-auto max-h-11/12 max-w-11/12 rounded-md bg-white object-contain"
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
        <p className="text-sm text-muted-foreground">{item.variant}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {item.stock} in stock
        </p>
      </div>
      <div className="ml-auto space-y-2">
        <div className="flex items-center justify-end gap-1 text-right text-sm font-medium">
          <span className="text-xs text-muted-foreground">Ksh</span>
          <span>{formatWithCommas(item.retailPrice!)}</span>
        </div>

        <ButtonGroup>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={isLastOne ? remove : decrement}
            disabled={isPending}
          >
            {isLastOne ? (
              <>
                <Trash aria-hidden="true" />
                <span className="sr-only">Remove item</span>
              </>
            ) : (
              <>
                <Minus aria-hidden="true" />
                <span className="sr-only">Decrease quantity</span>
              </>
            )}
          </Button>
          <ButtonGroupText className="min-w-6.5">
            {isPending ? <Spinner aria-label="Updating quantity" /> : quantity}
          </ButtonGroupText>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={increment}
            disabled={isPending || !canIncrement}
          >
            <Plus aria-hidden="true" />
            <span className="sr-only">Increase quantity</span>
          </Button>
        </ButtonGroup>
      </div>
    </div>
  )
}
