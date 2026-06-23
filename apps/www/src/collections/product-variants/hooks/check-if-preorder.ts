import { ProductVariant } from "@/payload-types"
import { FieldHook } from "payload"

export const checkIfPreorder: FieldHook<
  ProductVariant,
  ProductVariant["isPreorder"],
  ProductVariant
> = ({ data }) => {
  if (data?.stock === undefined && data?.supplierStock === undefined) {
    throw new Error(
      "Stock and supplierStock fields are required to determine back-ordered status."
    )
  }
  const hasInHouseStock = data.stock !== undefined && data.stock > 0
  const hasSupplierStock =
    data.supplierStock !== undefined && data.supplierStock > 0
  return !hasInHouseStock && hasSupplierStock
}
