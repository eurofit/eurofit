"use client"

import { Whatsapp } from "@/components/icons/whatsapp"
import { site } from "@/const/site"
import { useCartQuantity } from "@/hooks/use-cart-quantity"
import { buildPriceInquiryMessage } from "@/lib/utils/build-price-inquiry-message"
import { buildWhatsAppLink } from "@/lib/utils/build-wa-link"
import { ProductVariant } from "@/types/product-variant"
import { Button } from "@eurofit/ui/components/button"
import { ButtonGroup } from "@eurofit/ui/components/button-group"
import { Input } from "@eurofit/ui/components/input"
import { Spinner } from "@eurofit/ui/components/spinner"
import { cn } from "@eurofit/ui/lib/utils"
import { Minus, Plus, ShoppingCart } from "lucide-react"
import Link from "next/link"

type ProductDetailCartActionsProps = {
  variant: Pick<
    ProductVariant,
    "id" | "stock" | "sku" | "title" | "variant" | "price"
  >
  inStock: boolean
}

export function ProductDetailCartActions({
  variant,
  inStock,
}: ProductDetailCartActionsProps) {
  const shouldInquirePrice = variant.price == null

  if (shouldInquirePrice) {
    return (
      <div className="relative flex w-full items-stretch gap-2 max-md:fixed max-md:right-0 max-md:bottom-0 max-md:left-0 max-md:z-50 max-md:bg-background max-md:p-4">
        <Button
          size="lg"
          variant="outline"
          className="text-whatsapp h-12 flex-1 rounded-md px-6 text-base font-semibold"
          asChild
        >
          <Link
            href={buildWhatsAppLink({
              phone: site.contact.whatsapp,
              message: buildPriceInquiryMessage(variant),
            })}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Whatsapp aria-hidden="true" />
            Inquire Price
          </Link>
        </Button>
      </div>
    )
  }

  return <PurchaseActions variant={variant} inStock={inStock} />
}

function PurchaseActions({ variant, inStock }: ProductDetailCartActionsProps) {
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
