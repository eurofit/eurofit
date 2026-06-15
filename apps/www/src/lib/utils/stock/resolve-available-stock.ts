/** Available units for a variant: in-house stock, else supplier (backorder) stock. */
export function resolveAvailableStock(
  stock: number | null | undefined,
  supplierStock: number | null | undefined
): number {
  return (stock ?? 0) || (supplierStock ?? 0)
}
