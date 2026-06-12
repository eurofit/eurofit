import { ProductVariant } from "@/payload-types"
import { FieldHook } from "payload"

export const checkIfLowStock: FieldHook<
  ProductVariant,
  ProductVariant["isLowStock"],
  ProductVariant
> = ({ data }) => {
  if (data?.stock === undefined && data?.supplierStock === undefined) {
    throw new Error(
      `
      Error: (product-variants/hooks/check-if-low-stock) used in afterRead field hook.
      Cannot determine low stock status because both 'stock' and 'supplierStock' fields are undefined.
      This afterRead hook runs after selected fields only are included. Ensure "stock" and "supplierStock" is selected in the query.
        `
    )
  }

  const isLowStock =
    data?.stock != undefined ? data.stock > 0 && data.stock <= 5 : false
  const isLowsupplierStock =
    data?.supplierStock != undefined
      ? data.supplierStock > 0 && data.supplierStock <= 5
      : false
  return isLowStock || isLowsupplierStock
}
