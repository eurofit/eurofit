import { v7 as uuidv7 } from "uuid"
import * as z from "zod"

export function ensureUuid(text: string | null | undefined) {
  const { success: isValidUuid, data } = z.uuid().safeParse(text)

  if (isValidUuid) {
    return data
  }

  return uuidv7()
}
