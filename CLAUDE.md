# CLAUDE.md

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

- **Server Actions**: Never throw expected errors. Return `ActionResult<T>` from `@/types/action-result.ts`.
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

| Group                     | Contents                                                                    |
| ------------------------- | --------------------------------------------------------------------------- |
| `app/(frontend)/(bare)/`  | Unauthenticated auth pages: login, sign-up, forgot-password, reset-password |
| `app/(frontend)/(store)/` | Storefront + `verify-email` (requires store shell)                          |
| `app/(payload)/`          | Payload CMS admin — auto-generated, do not edit                             |

### State Management

- **Jotai** — client/global UI state; provider at `src/providers/jotai.tsx`
- **TanStack Query** — server state/data fetching; provider at `src/providers/react-query.tsx`
- **Zod schemas** for forms live in `src/lib/schemas/`; server actions validate with these before calling Payload

### Payload CMS

- API mounted at `/payload/api` (not the default `/api`).
- Config at `src/payload.config.ts`.
- Import Payload config from `@payload-config` — do not use a relative path.

**Access control** (`src/access/`):

| Export                   | Scope      | Description                           |
| ------------------------ | ---------- | ------------------------------------- |
| `adminOnly`              | Collection | Admins only                           |
| `adminOrSelf`            | Collection | Admins or the record's own user       |
| `isAdmin`                | Boolean    | Underlying admin check                |
| `adminOnlyFieldAccess`   | Field      | Admins only                           |
| `everyone`               | Collection | Public                                |
| `checkRole(roles, user)` | Utility    | Base role check used by all the above |

- Add access control to every collection and every sensitive field.

**Reusable fields** (`src/fields/`):

- Use `activeField()` from `src/fields/active/` for any `isActive` checkbox.
- Pass extensions via `mergeWith` so array hooks accumulate rather than overwrite.

**Server actions** (`src/actions/auth/`): Validate with Zod → call Payload local API → handle typed errors. Never throw expected errors; return `ActionResult<T>`.

**Local API**:

- When using `limit: 1`, always set `pagination: false`.
- All DB IDs are UUIDs (`idType: "uuid"`, `allowIDOnCreate: true`). Treat all IDs as strings.

**Migrations**:

- Never edit generated migration files.
- After schema changes: run `payload migrate:create`, then commit both `.ts` and `.json` files.
- Register new migrations in `src/migrations/index.ts`.

**Types**: `payload-types.ts` is auto-generated. Never edit manually. Regenerate with `payload generate:types` after schema changes.

### Environment Variables

Validated at startup via `@t3-oss/env-nextjs` in `src/env.mjs`.

| Group     | Variables                                                                                                               |
| --------- | ----------------------------------------------------------------------------------------------------------------------- |
| Database  | `DATABASE_URI`, `PAYLOAD_SECRET`                                                                                        |
| Email     | `RESEND_API_KEY`, `SMTP_*`                                                                                              |
| Storage   | `SUPABASE_S3_*` (bucket, access key, secret, region, endpoint)                                                          |
| Payments  | `PAYSTACK_SECRET_KEY`, `PAYSTACK_PUBLIC_KEY`                                                                            |
| Turnstile | `CLOUDFLARE_TURNSTILE_SECRET_KEY`, `CLOUDFLARE_TURNSTILE_INVISIBLE_SECRET_KEY`                                          |
| Public    | `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITEKEY`, `NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_INVISIBLE_SITEKEY` |

### Email Templates

- Templates live in `packages/transactional/emails/`.
- Import generator functions into collections:
  ```ts
  import { generateVerificationEmailHTML } from "@eurofit/transactional/verification"
  ```
- Preview locally: `pnpm --filter @eurofit/transactional email` → `localhost:3333`

### User Roles

Defined in `src/const/user-roles.ts`: `admin` and `customer`. Roles are stored in JWT. The first user created is automatically promoted to admin via the `ensureFirstUserIsAdmin` hook.

### UI Components

- Components live in `packages/ui/src/components/`.
- Import pattern:
  ```tsx
  import { Button } from "@eurofit/ui/components/button"
  ```
- Global styles: `packages/ui/src/styles/globals.css` (Tailwind v4, covers all workspace apps/packages).
- Fonts (DM Sans, Montserrat) injected as CSS variables via `src/fonts/`, applied in the root layout body.
