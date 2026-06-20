import * as Sentry from "@sentry/nextjs"

type CaptureContext = {
  /** Logical area the error came from, e.g. "checkout", "paystack-webhook". */
  scope: string
  /** Searchable key/value pairs (string | number | boolean only). */
  tags?: Record<string, string | number | boolean>
  /** Structured, non-searchable detail attached under the `scope` key. */
  context?: Record<string, unknown>
  /** Identity of the affected user, when known. */
  user?: { id: string; email?: string }
}

/**
 * Sends an exception to Sentry with consistent tagging. Use this anywhere an
 * error is caught and swallowed (server actions return `ActionResult`, Payload
 * hooks continue, webhooks ack) so the failure is still observable.
 */
export function captureError(error: unknown, info: CaptureContext): void {
  Sentry.captureException(error, (scope) => {
    scope.setTag("scope", info.scope)
    if (info.tags) scope.setTags(info.tags)
    if (info.context) scope.setContext(info.scope, info.context)
    if (info.user) scope.setUser(info.user)
    return scope
  })
}

/**
 * Trace-correlated structured logger. `enableLogs` is on in all three Sentry
 * runtime configs, so these ship to Sentry's log explorer; when emitted inside
 * an active span they link back to the trace. Attribute values must be
 * `string | number | boolean` — never `undefined`, arrays, or objects.
 */
export const logger: typeof Sentry.logger = Sentry.logger
