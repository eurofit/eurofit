import { Cart, ProductVariant } from "@/payload-types"
import { CollectionBeforeChangeHook } from "payload"

export const ensureSnapshots: CollectionBeforeChangeHook<Cart> = async ({
  data,
  originalDoc,
  req: { payload },
}) => {
  const areItemsChanged =
    JSON.stringify(data.items) !== JSON.stringify(originalDoc?.items)

  if (!areItemsChanged) return data

  const items = data.items
  const unPopulatedItemIds = items
    ?.map((i) => i.productVariant)
    .filter((i) => typeof i === "string")

  let productVariants: ProductVariant[]

  if (unPopulatedItemIds && unPopulatedItemIds.length > 0) {
    const productVariantsPromises = unPopulatedItemIds.map((id) =>
      payload.findByID({
        collection: "product-variants",
        id,
        depth: 2,
      })
    )

    productVariants = await Promise.all(productVariantsPromises)
  }

  const newItems = items?.map((i) => {
    const hasSnapshot =
      !!i.snapshot &&
      !!i.snapshot.inventoryStock &&
      !!i.snapshot.retailPrice &&
      !!i.snapshot.supplierStock

    if (hasSnapshot) {
      return i
    }

    const productVariant = productVariants.find(
      (pv) => pv.id === i.productVariant
    )

    return {
      ...i,
      snapshot: {
        retailPrice: productVariant?.retailPrice,
        inventoryStock: productVariant?.stock,
        supplierStock: productVariant?.supplierStock,
      },
    }
  })

  return {
    ...data,
    items: newItems,
  }
}
