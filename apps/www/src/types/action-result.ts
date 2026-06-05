export type ActionResult<T extends Record<string, unknown> = { ok: true }> =
  | { success: true; data: T }
  | { success: false; code: number; message: string }
