import { getTotalBrands } from "@/lib/utils/brands/get-total-brands"
import { floorToNearest } from "@/lib/utils/math"

export async function TotalBrands() {
  const result = await getTotalBrands()
  const total = result.success ? result.data.total : 0
  return <span>{floorToNearest(total, 10)}</span>
}
