"use client"

import { ImageWithRetry } from "@/components/image-with-retry"
import { useCartQuantity } from "@/hooks/use-cart-quantity"
import { FormattedCartItem } from "@/lib/utils/cart/formatCartItem"
import { formatWithCommas } from "@/lib/utils/format-with-commas"
import { Button } from "@eurofit/ui/components/button"
import { ButtonGroup } from "@eurofit/ui/components/button-group"
import { Input } from "@eurofit/ui/components/input"
import { ImageOff, Minus, Plus, Trash2 } from "lucide-react"

type CartItemProps = {
  item: FormattedCartItem
}

export function CartItem({ item }: CartItemProps) {
  const {
    quantity,
    isDirty,
    min,
    canIncrement,
    canDecrement,
    setQuantity,
    increment,
    decrement,
    add,
    remove,
    isPending,
  } = useCartQuantity({ variant: item })

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

        <div className="flex items-center justify-end gap-2">
          <ButtonGroup>
            <Button
              variant="outline"
              size="icon-sm"
              aria-label="Decrease quantity"
              onClick={decrement}
              disabled={!canDecrement || isPending}
            >
              <Minus aria-hidden="true" />
            </Button>
            <Input
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              max={item.stock}
              min={min}
              value={quantity}
              onChange={(event) =>
                setQuantity(
                  Number.isNaN(event.target.valueAsNumber)
                    ? min
                    : event.target.valueAsNumber
                )
              }
              onBlur={() => {
                if (isDirty) void add()
              }}
              aria-label="Quantity input"
              placeholder="0"
              className="h-8 w-14 text-center"
            />
            <Button
              variant="outline"
              size="icon-sm"
              aria-label="Increase quantity"
              onClick={increment}
              disabled={!canIncrement || isPending}
            >
              <Plus aria-hidden="true" />
            </Button>
          </ButtonGroup>
          <Button
            variant="ghost"
            className="size-8 rounded-sm p-0 text-destructive hover:bg-destructive/10 *:[svg]:text-destructive!"
            onClick={remove}
            disabled={isPending}
          >
            <Trash2 className="size-3.5" />
            <span className="sr-only">Remove item</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
