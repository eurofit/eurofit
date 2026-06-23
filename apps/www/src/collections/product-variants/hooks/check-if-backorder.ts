import { ProductVariant } from "@/payload-types"
import { FieldHook } from "payload"

export const checkIfBackorder: FieldHook<
  ProductVariant,
  ProductVariant["isBackorder"],
  ProductVariant
> = ({ data }) => {
  if (!data || (data.stock === undefined && data.supplierStock === undefined)) {
    throw new Error(
      "Stock and supplierStock fields are required to determine back-order status."
    )
  }
  const hasInHouseStock = data.stock != null && data.stock > 0
  const hasSupplierStock = data.supplierStock != null && data.supplierStock > 0
  return !hasInHouseStock && hasSupplierStock
}
