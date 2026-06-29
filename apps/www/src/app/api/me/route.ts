import { getCurrentUser } from "@/actions/auth/get-current-user"
import { captureError } from "@/lib/observability/capture-error"

export async function GET() {
  try {
    const user = await getCurrentUser()
    return Response.json({ id: user?.id ?? null })
  } catch (error) {
    captureError(error, { scope: "api.me" })
    return Response.json({ id: null })
  }
}
