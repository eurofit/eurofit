import * as z from "zod"

export function isUuid(text: string | null | undefined) {
  return z.uuid().safeParse(text).success
}
