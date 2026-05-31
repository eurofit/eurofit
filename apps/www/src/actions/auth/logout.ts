"use server"

import config from "@/payload.config"
import { logout as payloadLogout } from "@payloadcms/next/auth"

export async function logout() {
  const res = await payloadLogout({
    config,
  })

  return res
}
