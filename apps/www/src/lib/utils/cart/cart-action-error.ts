import "server-only"

import { ActionResult } from "@/types/action-result"
import { APIError } from "payload"

/** A failure result, assignable to any `ActionResult<T>`. */
type ActionFailure = Extract<ActionResult<unknown>, { success: false }>

/** Friendly, non-leaky messages for the validation errors the cart can raise. */
const FRIENDLY_MESSAGE_BY_STATUS: Record<number, string> = {
  400: "We couldn't update your cart. Please check item availability and try again.",
  403: "This item is currently unavailable.",
  404: "This item is no longer available.",
}

const GENERIC_MESSAGE = "Something went wrong. Please try again later."

export function invalidCartInput(): ActionFailure {
  return { success: false, code: 400, message: "Invalid input." }
}

/**
 * Translates a thrown error into an `ActionResult` failure. Raw error text is
 * never surfaced unless Payload explicitly marked it public; otherwise a
 * friendly message is chosen by status code.
 */
export function toCartActionError(error: unknown): ActionFailure {
  if (error instanceof APIError) {
    const code = error.status ?? 400
    const message = error.isPublic
      ? error.message
      : (FRIENDLY_MESSAGE_BY_STATUS[code] ?? GENERIC_MESSAGE)

    return { success: false, code, message }
  }

  return { success: false, code: 500, message: GENERIC_MESSAGE }
}
