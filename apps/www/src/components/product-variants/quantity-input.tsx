"use client"

import { useCartQuantity } from "@/hooks/use-cart-quantity"
import { ProductVariant } from "@/types/product-variant"
import { Button } from "@eurofit/ui/components/button"
import { Input } from "@eurofit/ui/components/input"
import { Spinner } from "@eurofit/ui/components/spinner"
import { cn } from "@eurofit/ui/lib/utils"
import { Minus, Plus } from "lucide-react"

type QuantityInputProps = {
  variant: ProductVariant
  userId?: string | null
}

export function QuantityInput({ variant }: QuantityInputProps) {
  const {
    quantity,
    isInCart,
    isDirty,
    min,
    max,
    canIncrement,
    canDecrement,
    setQuantity,
    increment,
    decrement,
    add,
    isPending,
  } = useCartQuantity({ variant })

  return (
    <div className="relative flex w-full items-center gap-0.5">
      {isInCart && (
        <Button
          size="icon"
          className="rounded-none"
          aria-label="Decrease quantity"
          disabled={!canDecrement || isPending}
          onClick={decrement}
        >
          <Minus aria-hidden="true" />
        </Button>
      )}

      <Input
        type="number"
        min={min}
        max={max}
        value={quantity}
        onChange={(event) =>
          setQuantity(
            Number.isNaN(event.target.valueAsNumber)
              ? min
              : event.target.valueAsNumber
          )
        }
        className="w-16 rounded-none bg-background text-center text-sm shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50"
        aria-label="Quantity input"
        inputMode="numeric"
        pattern="[0-9]*"
        placeholder="1"
      />

      {isInCart && (
        <Button
          size="icon"
          className="rounded-none"
          aria-label="Increase quantity"
          disabled={!canIncrement || isPending}
          onClick={increment}
        >
          <Plus aria-hidden="true" />
        </Button>
      )}

      {(!isInCart || isDirty) && (
        <Button
          className={cn({
            "rounded-none bg-green-600 text-white hover:bg-green-700": isDirty,
            "rounded-none": !isDirty,
          })}
          disabled={isPending}
          onClick={() => add()}
        >
          {isPending && <Spinner />}
          {isPending ? null : isDirty ? "Change" : "Add"}
        </Button>
      )}
    </div>
  )
}
