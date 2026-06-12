import type { CollectionBeforeChangeHook } from "payload"

type Args = {
  field: string
  startFrom?: number
  step?: number
}

export function autoincrement({
  field,
  startFrom: defaultNumber = 1000,
  step = 1,
}: Args): CollectionBeforeChangeHook {
  return async ({ req, operation, collection, data }) => {
    if (operation !== "create") return data
    const highest = await req.payload.find({
      collection: collection.slug,
      limit: 1,
      sort: "-" + field,
    })
    const next =
      (parseInt((highest.docs[0] as any)?.[field]) || defaultNumber) + step
    return { ...data, [field]: next }
  }
}
