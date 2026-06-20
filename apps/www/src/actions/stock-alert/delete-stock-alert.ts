"use server"

import { getCurrentUser } from "@/actions/auth/get-current-user"
import { captureError } from "@/lib/observability/capture-error"
import { ActionResult } from "@/types/action-result"
import config from "@payload-config"
import { revalidatePath } from "next/cache"
import { getPayload } from "payload"
import { z } from "zod"

const inputSchema = z.object({ id: z.string().min(1) })

type Args = z.input<typeof inputSchema>

export async function deleteStockAlert(args: Args): Promise<ActionResult> {
  const parsed = inputSchema.safeParse(args)
  if (!parsed.success) {
    return { success: false, code: 400, message: "Invalid input." }
  }

  const { id } = parsed.data

  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, code: 401, message: "You must be signed in." }
    }

    const payload = await getPayload({ config })

    const existing = await payload.findByID({
      collection: "stock-alerts",
      id,
      depth: 0,
    })

    const ownerId =
      typeof existing.user === "object" ? existing.user?.id : existing.user

    if (ownerId !== user.id) {
      return { success: false, code: 403, message: "Not allowed." }
    }

    await payload.delete({ collection: "stock-alerts", id })

    revalidatePath("/account/stock-alerts")

    return { success: true, data: { ok: true } }
  } catch (error) {
    captureError(error, { scope: "stock-alerts.delete" })
    return {
      success: false,
      code: 500,
      message: "Something went wrong. Please try again.",
    }
  }
}
