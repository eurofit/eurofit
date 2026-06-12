"use client"

import { ImageWithRetry } from "@/components/image-with-retry"
import { useCartQuantity } from "@/hooks/use-cart-quantity"
import { FormattedCartItem } from "@/lib/utils/cart/formatCartItem"
import { formatWithCommas } from "@/lib/utils/format-with-commas"
import { Button } from "@eurofit/ui/components/button"
import { ButtonGroup } from "@eurofit/ui/components/button-group"
import { Input } from "@eurofit/ui/components/input"
import { cn } from "@eurofit/ui/lib/utils"
import { ImageOff, Minus, Plus, Trash2 } from "lucide-react"

type CartItemProps = {
  item: FormattedCartItem
  index: number
}

export function CartItem({ index, item: { product, ...item } }: CartItemProps) {
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
  } = useCartQuantity({
    variant: { id: item.id, stock: item.stock },
  })

  return (
    <article className="flex items-start space-x-4">
      <div className="relative flex aspect-square size-16 items-center justify-center rounded-md bg-white shadow-sm">
        {product.image ? (
          <ImageWithRetry
            src={product.image}
            alt={product.title}
            width={64}
            height={64}
            className="rounded-md"
            priority={index < 3}
          />
        ) : (
          <ImageOff
            className="size-1/2 text-foreground/50"
            aria-label="Image not available"
          />
        )}
      </div>
      <div className="w-full space-y-2">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-sm text-pretty">{item.title}</h3>

          <Button
            variant="ghost"
            className="size-7 rounded-sm p-0 text-destructive hover:bg-destructive/10 *:[svg]:text-destructive!"
            onClick={remove}
            disabled={isPending}
          >
            <Trash2 className="size-3.5" />
            <span className="sr-only">Remove item</span>
          </Button>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">
              <span>{item.stock}</span> in stock
            </div>
            <div className="flex items-center space-x-2">
              <ButtonGroup>
                <Button
                  variant="outline"
                  className="size-7"
                  aria-label="Decrease quantity"
                  onClick={decrement}
                  disabled={!canDecrement || isPending}
                >
                  <Minus className="size-3" />
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
                  className={cn("h-7 w-14 text-center", {
                    "text-destructive-foreground border bg-destructive": false, // low items
                  })}
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="size-7"
                  aria-label="Increase quantity"
                  onClick={increment}
                  disabled={!canIncrement || isPending}
                >
                  <Plus className="size-3" />
                </Button>
              </ButtonGroup>
            </div>
          </div>

          {item.retailPrice && (
            <div className="flex flex-col text-right">
              <div className="text-xs leading-none text-muted-foreground">
                <span className="text-muted-foreground">{item.quantity}</span>
                &nbsp;x&nbsp;<span>{formatWithCommas(item.retailPrice)}</span>
              </div>

              <div className="initem leading-none">
                <span className="text-[10px]">Ksh</span>
                <span className="text-sm font-medium oldstyle-nums">
                  {formatWithCommas(item.retailPrice * item.quantity)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
