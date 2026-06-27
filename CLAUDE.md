# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Security

- Never surface unexpected error messages to the user.

## Claude

- Never add Claude as a co-author in commit messages.
- All commits must follow Conventional Commits (enforced by commitlint + husky).

## Naming Conventions

**Variables must be self-documenting. Names must communicate intent without requiring comments.**

Boolean variables must use semantic prefixes that make their truthiness obvious:

| Prefix   | Use for                                                  |
| -------- | -------------------------------------------------------- |
| `is`     | State or identity — `isAdmin`, `isActive`                |
| `has`    | Possession — `hasVerifiedEmail`, `hasActiveSubscription` |
| `can`    | Permission — `canEditPost`, `canCheckout`                |
| `should` | Conditional intent — `shouldRedirect`, `shouldRefetch`   |
| `did`    | Past action — `didAcceptTerms`                           |

- Use strictly clean code-skill, everytime you are writing a code

```typescript
// Bad
const turnstileOk = await verifyTurnstile(token, secret)
const result = await verifyTurnstile(token, secret)
const valid = await verifyTurnstile(token, secret)

// Good
const isTurnstileValid = await verifyTurnstile(token, secret)
```

Applies everywhere: variables, function return values, Zod output fields, and state atoms.

## Monorepo

- No relative imports inside `packages/`. Always use the full workspace path alias declared in `tsconfig` / package `exports`.
  - ❌ `"./component"`
  - ✅ `"@workspace-name/components"`
  - ✅ `"@/components"`

## Next.js

> **Next.js 16 note**: APIs, conventions, and file structure may differ from training data. When in doubt, read `node_modules/next/dist/docs/` before writing code. Heed deprecation notices.

- **Server Actions**: Never throw expected errors. Return `ActionResult<T>` from `@/types/action-result.ts`.
- Use Server actions only as post. When client need an action or query payload data, use api routes.
- **Navigation**: Use `useRouter` from `nextjs-toploader/app`, not `next/navigation`, for programmatic client-side navigation — only inside children of the NextJS Top Loader provider.
- **Auth-guarded pages**: Call `getCurrentUser()` from `@/actions/auth/get-current-user` and `redirect()` before any rendering logic.

## Zod Schemas

- Move every schema to an atomic file under `@/lib/schemas`, grouped by feature, except when schema is only one atomic premetive eg: string | number | boolean.
  - Example: `lib/schemas/auth/login.ts`

## Turnstile / Form Protection

- Every form in `apps/www` that submits data to the server must be protected by Turnstile.
- Every Turnstile widget must have a unique `id` prop.
  - Examples: `login-form-turnstile`, `signup-form-turnstile`

## UI

- Prefer shadcn components. When a shadcn component doesn't exist, compose one from existing shadcn primitives.
- Add new shadcn components from the repo root:
  ```bash
  pnpm dlx shadcn@latest add <component> -c apps/www
  ```

## Env variables

- Always use env from @/env.mjs to get the variable, not directly the process.env

---

## Commands

```bash
# Development
pnpm dev              # all apps
pnpm www:dev          # www only (preferred)

# Quality
pnpm lint
pnpm typecheck
pnpm format

# Build
pnpm build

# Email (preview at localhost:3333)
pnpm --filter @eurofit/transactional email

# Payload CMS
pnpm --filter www payload generate:types       # regenerate payload-types.ts
pnpm --filter www payload generate:importmap   # regenerate admin importMap.js
pnpm --filter www payload migrate:create       # create new migration
pnpm --filter www payload migrate              # run pending migrations
```

---

## Architecture

**Monorepo**: pnpm + Turborepo

| Package                      | Purpose                                                                   |
| ---------------------------- | ------------------------------------------------------------------------- |
| `apps/www`                   | Next.js 16 + Payload CMS v3 — main app                                    |
| `packages/ui`                | Shared shadcn/ui component library                                        |
| `packages/transactional`     | React Email templates (verification, forgot-password, order-confirmation) |
| `packages/eslint-config`     | Shared ESLint config                                                      |
| `packages/typescript-config` | Shared TypeScript config                                                  |

**`apps/www` stack**: Next.js 16, React 19, Payload CMS v3, PostgreSQL (`@payloadcms/db-postgres`), Tailwind CSS v4, TanStack Query, Jotai, Zod v4, React Hook Form, Resend, Supabase S3, Paystack, Cloudflare Turnstile.

### Import Path Aliases (`apps/www`)

| Alias                      | Resolves to                           |
| -------------------------- | ------------------------------------- |
| `@/`                       | `src/`                                |
| `@eurofit/ui/components/*` | `packages/ui/src/components/*.tsx`    |
| `@eurofit/ui/lib/*`        | `packages/ui/src/lib/*.ts`            |
| `@eurofit/ui/globals.css`  | `packages/ui/src/styles/globals.css`  |
| `@eurofit/transactional/*` | `packages/transactional/emails/*.tsx` |

### Route Groups

| Group                     | Contents                                                                                                                          |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `app/(frontend)/(bare)/`  | Pages rendered without the store shell: auth (login, sign-up, forgot/reset-password, resend-verification), `checkout`, `sitemaps` |
| `app/(frontend)/(store)/` | Storefront + `verify-email`, `thank-you` (requires store shell)                                                                   |
| `app/(payload)/`          | Payload CMS admin — auto-generated, do not edit                                                                                   |

### Agent-Ready / SEO Endpoints

The app exposes machine-readable surfaces for agents and crawlers: `src/app/.well-known/{api-catalog,oauth-authorization-server,oauth-protected-resource}/route.ts`, static `public/.well-known/{mcp,agent-skills}`, and `src/app/auth.md/route.ts`. When changing auth, the public API, or available skills, keep these in sync.

### Collections

All registered collections (in `src/collections/index.ts`): `users`, `addresses`, `media`, `pages`, `packages`, `serviceAreas`, `brands`, `categories`, `products`, `productVariants`, `productReviews`, `stockAlerts`, `labels`, `tags`, `wishlists`, `carts`, `orders`, `orderStatus`, `transactions`, `discounts`.

### Globals

Three globals (`src/globals/`): `nav`, `footer`, `settings`. Fetched server-side via actions in `src/actions/get-nav.ts` etc.

### Layout Blocks

`pages` builds layouts from Payload blocks. Each block in `src/blocks/<name>/` pairs a config (`index.tsx`, the Payload block definition) with a `component.tsx` (the frontend renderer). Registered blocks (`src/blocks/index.ts`): `slider`, `productList`, `faq`, `richText`. When adding a block: define the config, write the renderer, register it in `index.ts`, then run `payload generate:types`.

### API Routes vs Server Actions

- Payload's own REST/GraphQL API is mounted at `/payload/api`.
- App-level data routes live under `src/app/api/` (e.g. `products`, `brands/search`, `cart`, `reviews`, `delivery`, `wishlist`) — these back client-side queries, per the "server actions for mutations, API routes for client reads" rule.
- `src/app/api/crons/**` are cron endpoints (e.g. guest abandoned-cart cleanup), guarded by the `CRON_SECRET` bearer token.
- `src/app/api/webhooks/paystack` handles `charge.success`; `src/app/api/healthz` is the health check.

### Middleware / Guest Session

The app uses `src/proxy.ts` (not a `middleware.ts` file) as the Next.js middleware entry point. It calls `ensureGuestSession` on every non-API/admin/static request to maintain a sliding-expiry guest session cookie (`_ef_g`, 30 days).

Cart is identified by **either** `userId` (authenticated) or the `guestSessionId` cookie (anonymous). The `ensureGuestSessionId()` server action in `src/actions/ensure-guest-session-id.ts` creates the cookie on first visit; sliding expiry is handled by the middleware.

### State Management

- **Jotai** — client/global UI state; provider at `src/providers/jotai.tsx`
- **TanStack Query** — server state/data fetching; provider at `src/providers/react-query.tsx`
- **Zod schemas** for forms live in `src/lib/schemas/`; server actions validate with these before calling Payload

### Payload CMS

- API mounted at `/payload/api` (not the default `/api`).
- Config at `src/payload.config.ts`.
- Import Payload config from `@payload-config` — do not use a relative path.

**Access control** (`src/access/`):

| Export                   | Scope      | Description                                              |
| ------------------------ | ---------- | -------------------------------------------------------- |
| `adminOnly`              | Collection | Admins only                                              |
| `adminOrSelf`            | Collection | Admins or the record's own user                          |
| `userOwned`              | Collection | Admins or records where `user` field equals current user |
| `isAdmin`                | Boolean    | Underlying admin check                                   |
| `adminOnlyFieldAccess`   | Field      | Admins only                                              |
| `everyone`               | Collection | Public                                                   |
| `checkRole(roles, user)` | Utility    | Base role check used by all the above                    |

- Add access control to every collection and every sensitive field.

**Reusable fields** (`src/fields/`):

- Use `activeField()` from `src/fields/active/` for any `isActive` checkbox.
- Pass extensions via `mergeWith` so array hooks accumulate rather than overwrite.

**Server actions** (`src/actions/auth/`): Validate with Zod → call Payload local API → handle typed errors. Never throw expected errors; return `ActionResult<T>`.

**Local API**:

- Never pass the `payload` instance as a function argument — `getPayload({ config })` is cached, so call it again inside the function.
- When using `limit: 1`, always set `pagination: false`.
- All DB IDs are UUIDs (`idType: "uuid"`, `allowIDOnCreate: true`). Treat all IDs as strings.

**Migrations**:

- Never edit generated migration files.
- After schema changes: run `payload migrate:create`, then commit both `.ts` and `.json` files.
- Register new migrations in `src/migrations/index.ts`.

**Types**: `payload-types.ts` is auto-generated. Never edit manually. Regenerate with `payload generate:types` after schema changes.

### Environment Variables

Validated at startup via `@t3-oss/env-nextjs` in `src/env.mjs`.

| Group         | Variables                                                                                                               |
| ------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Database      | `DATABASE_URI`, `PAYLOAD_SECRET`                                                                                        |
| Email         | `RESEND_API_KEY`, `SMTP_*`                                                                                              |
| Storage       | `SUPABASE_S3_*` (bucket, access key, secret, region, endpoint)                                                          |
| Payments      | `PAYSTACK_SECRET_KEY`, `PAYSTACK_PUBLIC_KEY`                                                                            |
| Turnstile     | `CLOUDFLARE_TURNSTILE_SECRET_KEY`(Managed Turnstile), `CLOUDFLARE_TURNSTILE_INVISIBLE_SECRET_KEY`                       |
| Cron          | `CRON_SECRET` (bearer token guarding `src/app/api/crons/**`)                                                            |
| Observability | `NEXT_PUBLIC_SENTRY_DSN`, `NEXT_PUBLIC_GTM_ID`                                                                          |
| Public        | `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITEKEY`, `NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_INVISIBLE_SITEKEY` |

### Email Templates

- Templates live in `packages/transactional/emails/`.
- Import generator functions into collections:
  ```ts
  import { generateVerificationEmailHTML } from "@eurofit/transactional/verification"
  ```
- Preview locally: `pnpm --filter @eurofit/transactional email` → `localhost:3333`

### User Roles

Defined in `src/const/user-roles.ts`: `admin` and `customer`. Roles are stored in JWT. The first user created is automatically promoted to admin via the `ensureFirstUserIsAdmin` hook.

### Known Open Issues

`TODOS.md` tracks deliberate deferred gaps — do not close them without the prescribed fix:

- **C-01 (CRITICAL, open)** — Stock oversell race condition in `validateOrderItems` (`src/collections/orders/hooks/validate-order-items.ts`): stock is read but never atomically decremented/locked.
- **H-03 (RESOLVED)** — Error tracking is now wired via Sentry (see Observability below). Kept in `TODOS.md` only to track configuring Sentry alerts on the `paystack-webhook` / `order-confirmation-email` scopes.
- **M-08 (MEDIUM, open)** — No orphan-reconciliation cron: if a Paystack webhook is never delivered, the customer is charged but their order stays `paymentStatus = "unpaid"`. Orphans are now observable (a `Sentry.logger.warn` fires) but auto-recovery is still missing.

### Observability

Sentry is wired across `apps/www` (`instrumentation.ts`, `instrumentation-client.ts`, `sentry.*.config`). Do not swallow errors with bare `console.error` — route caught/swallowed errors through the shared `captureError()` helper in `src/lib/observability/`, passing a `scope` tag. Payment and email pipelines are traced with `Sentry.startSpan`.

### UI Components

- Components live in `packages/ui/src/components/`.
- Import pattern:
  ```tsx
  import { Button } from "@eurofit/ui/components/button"
  ```
- Global styles: `packages/ui/src/styles/globals.css` (Tailwind v4, covers all workspace apps/packages).
- Fonts (DM Sans, Montserrat) injected as CSS variables via `src/fonts/`, applied in the root layout body.
