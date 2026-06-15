import { ProductVariant } from "@/payload-types"
import { FieldHook } from "payload"

export const checkIfOutOfStock: FieldHook<
  ProductVariant,
  ProductVariant["isOutOfStock"],
  ProductVariant
> = ({ data }) => {
  if (data?.stock === undefined || data?.supplierStock === undefined) {
    throw new Error(
      `
      Error: (product-variants/hooks/check-if-out-stock) used in afterRead field hook.
      Cannot determine out of stock status because both 'stock' or 'supplierStock' fields are undefined.
      This afterRead hook runs after selected fields only are included. Ensure "stock" and "supplierStock" is selected in the query.
        `
    )
  }

  if (data.stock && data.stock > 0) return false
  if (data.supplierStock && data.supplierStock > 0) return false

  return true
}
