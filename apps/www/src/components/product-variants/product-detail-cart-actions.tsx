"use client"

import { useCartQuantity } from "@/hooks/use-cart-quantity"
import { ProductVariant } from "@/types/product-variant"
import { Button } from "@eurofit/ui/components/button"
import { ButtonGroup } from "@eurofit/ui/components/button-group"
import { Input } from "@eurofit/ui/components/input"
import { Spinner } from "@eurofit/ui/components/spinner"
import { cn } from "@eurofit/ui/lib/utils"
import { Minus, Plus, ShoppingCart } from "lucide-react"

type ProductDetailCartActionsProps = {
  variant: Pick<ProductVariant, "id" | "stock">
  inStock: boolean
}

export function ProductDetailCartActions({
  variant,
  inStock,
}: ProductDetailCartActionsProps) {
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
    <div className="relative flex w-full items-stretch gap-2 max-md:fixed max-md:right-0 max-md:bottom-0 max-md:left-0 max-md:z-50 max-md:bg-background max-md:p-4">
      {isInCart && (
        <ButtonGroup className="h-12">
          <Button
            variant="outline"
            className="size-12 rounded-md"
            aria-label="Decrease quantity"
            disabled={!canDecrement || isPending}
            onClick={decrement}
          >
            <Minus className="size-4" aria-hidden="true" />
          </Button>

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
            className="h-12 w-20 rounded-none text-center"
            aria-label="Quantity input"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="1"
          />

          <Button
            variant="outline"
            className="size-12 rounded-md"
            aria-label="Increase quantity"
            disabled={!canIncrement || isPending}
            onClick={increment}
          >
            <Plus className="size-4" aria-hidden="true" />
          </Button>
        </ButtonGroup>
      )}

      <Button
        size="lg"
        className={cn("h-12 flex-1 rounded-md px-6 text-base font-semibold", {
          "bg-green-600 text-white hover:bg-green-700": isDirty,
        })}
        disabled={isPending || !inStock}
        onClick={() => add()}
      >
        {isPending ? (
          <Spinner />
        ) : isDirty ? (
          "Update"
        ) : (
          <>
            <ShoppingCart className="size-5" />
            Add to cart
          </>
        )}
      </Button>
    </div>
  )
}
