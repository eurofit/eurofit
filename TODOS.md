# TODOs

> This file tracks deferred security and correctness issues that are too large or
> infrastructure-dependent to fix in a single PR. Each entry was identified during
> the checkout-flow security audit and deliberately left out of the immediate fix
> set. Every item here represents a known gap — do not close an entry without a
> corresponding migration, test, or cron that proves the gap is sealed.

## apps/www

### C-01 · Stock / Oversell Race Condition

**Severity:** CRITICAL  
**Related files:**

- `src/collections/orders/hooks/validate-order-items.ts` — stock check with no lock or decrement
- `src/collections/product-variants/index.ts` — `stock` and `supplierStock` fields

`validateOrderItems` reads available stock at hook-run time but never decrements or locks the
row. Two concurrent checkouts for the last unit both pass, both get paid, and one order cannot
be fulfilled.

**Proposed fix:** Inside `validateOrderItems`, after the stock check, run an atomic SQL
`UPDATE product_variants SET stock = stock - quantity WHERE id = ? AND stock >= quantity` via
`req.payload.db`. Verify `rowsAffected > 0` and abort order creation if the row was already
claimed by a concurrent request. Alternatively use `pg_advisory_xact_lock` per variant ID
so concurrent checkout requests serialize on the lock.

---

### H-03 · Implement Error Tracking Service

**Severity:** HIGH  
**Related files:**

- `src/app/api/webhooks/paystack/route.ts` — `after()` callback currently uses `console.error`
- `src/collections/transactions/hooks/send-order-confimation-email.tsx` — email send failure uses `console.error`

`console.error` is a temporary stopgap. Payment failures silently disappear in production
unless the server log is actively monitored. Wire a real error tracking service (Sentry,
Datadog, BetterStack, etc.) so that any failure inside the webhook handler or the email hook
creates an alert and an audit trail.

---

### M-08 · Orphan Reconciliation Cron

**Severity:** MEDIUM  
**Related files:**

- `src/lib/payment/handle-charge-success.ts` — sole entry point that confirms an order
- `src/lib/orders/resolve-order-for-payment.ts` — queries unpaid orders by Paystack reference
- `src/lib/orders/mark-order-as-paid.ts` — sets `paymentStatus = "paid"`

If the Paystack webhook is never delivered (network failure, cold-start timeout) or the
`after()` callback fails silently, a customer is charged at Paystack but their order stays
`paymentStatus = "unpaid"` indefinitely. No automated recovery path exists.

**Proposed fix:** Schedule a cron (Vercel Cron, pg_cron, or a standalone job) that:

1. Calls `paystack.transaction.list()` for the last rolling window (e.g., past 24 h).
2. Cross-references against orders where `paymentStatus = "unpaid"` AND
   `paystackAccessCode IS NOT NULL` AND `createdAt < (now - 1 hour)`.
3. Flags or auto-reconciles any mismatch by re-running `handleChargeSuccess` for the
   relevant reference.
