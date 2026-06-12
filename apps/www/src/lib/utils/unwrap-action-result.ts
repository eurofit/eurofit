import { ActionResult } from "@/types/action-result"

/**
 * Returns an action's data, or throws its message on failure — so callers (e.g.
 * TanStack Query mutations) can rely on a thrown error for the failure path.
 */
export function unwrapActionResult<T>(result: ActionResult<T>): T {
  if (!result.success) {
    throw new Error(result.message)
  }

  return result.data
}
