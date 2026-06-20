// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import { env } from "@/env.mjs"
import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: env.NEXT_PUBLIC_SENTRY_DSN,

  // Group issues by deploy environment.
  environment: process.env.NODE_ENV,

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  // TODO: lower (or use tracesSampler) once traffic grows — keep checkout/webhook at 1.0.
  tracesSampleRate: 1,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Enable sending user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: true,
})
