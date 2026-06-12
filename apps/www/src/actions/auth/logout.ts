"use server"

import { ActionResult } from "@/types/action-result"
import config from "@payload-config"
import { logout as payloadLogout } from "@payloadcms/next/auth"

export async function logout(): Promise<ActionResult> {
  try {
    await payloadLogout({ config })
    return { success: true, data: { ok: true } }
  } catch {
    return { success: false, code: 500, message: "Logout failed." }
  }
}
