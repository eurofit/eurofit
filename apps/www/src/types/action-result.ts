export type ActionResult<T = { ok: true }> =
  | { success: true; data: T }
  | { success: false; code: number; message: string }
