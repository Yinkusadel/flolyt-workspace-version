# Wallet endpoints

Base path: `/api/payments/wallets` → `WALLET_BASE_URL` / `API_ENDPOINTS.WALLET` in
[`src/config/apiConfig.ts`](../../src/config/apiConfig.ts) — already present before this batch,
unused until now. Shapes ported from the working reference implementation in the sibling repo
`flolyt-dashboard` (`src/services/api/settings-and-teams/billing-and-usage/`,
`src/features/settings-and-teams/billing-and-usage/`) — **not independently confirmed against this
workspace's own Scalar instance**, per [[feedback_verify_against_endpoint_docs]].

The wallet is the account's actual money balance — it funds monthly-active-user billing,
per-message billing, and AI credit usage (see [[flolyt_ai_credits_endpoints]] for the separate
credits domain, which is a thing the wallet pays for, not a synonym for it).

## GET /api/payments/wallets/balance

- **Purpose:** Current wallet balance, currency, and last deposit/expense timestamps.
- **Request:** none.
- **Response:**
  ```ts
  interface WalletBalanceDto {
    id: string;
    companyId: string;
    balance: number;
    currency: string;
    dateCreated: string;
    isActive: boolean;
    lastDeposit: string | null;
    lastExpense: string | null;
  }
  ```
  Standard `{ data, messages, succeeded }` envelope.
- **Used by:** `services/api/wallet/get-wallet-balance.ts`, `features/wallet/use-get-wallet-balance.ts`, wired into `pages/plan-and-billing/index.tsx`'s balance hero.
- **Status:** wired

## GET /api/payments/wallets/transactions

- **Purpose:** Paginated wallet transaction history (deposits and debits).
- **Request:** query params `filter?` (transaction type, e.g. `"Credit" | "Debit"`), `page`
  (default 1), `pageSize` (default 10).
- **Response:**
  ```ts
  interface WalletTransactionDto {
    id: string;
    transactionDate: string;
    category: string;
    transactionType: string; // "Credit" | "Debit", string not enum on the wire
    description: string;
    amount: string; // stringified number, sometimes currency-formatted — strip non-numerics before use
  }
  ```
  `data` is the array; pagination fields (`currentPage`, `totalPages`, `totalCount`, `pageSize`,
  `hasPreviousPage`, `hasNextPage`) sit at the top level alongside `data`, not nested under it.
- **Used by:** `services/api/wallet/get-wallet-transactions.ts`, `features/wallet/use-get-wallet-transactions.ts`, wired into `pages/plan-and-billing/index.tsx`'s "Recent wallet activity" list.
- **Status:** wired

## GET /api/payments/wallets/transactions/{id}

- **Purpose:** A single transaction's full detail (adds `walletId`, `reference`).
- **Request:** `id` path param.
- **Response:** same shape as the list's row plus `walletId: string`, `reference: string | null`.
- **Used by:** `services/api/wallet/get-wallet-transaction-by-id.ts`, `features/wallet/use-get-wallet-transaction-by-id.ts`. No screen wired yet — the billing page only shows the list, not a per-transaction detail view.
- **Status:** scaffolded, not wired

## GET /api/payments/wallets/channels/usage-summary

- **Purpose:** Per-channel (email/SMS/WhatsApp/push) message count and cost over a time range.
- **Request:** `timeRange: "Day" | "Week" | "Month" | "Year" | "Custom"`, optional `startDate`/`endDate` for `"Custom"`.
- **Response:** `data = { channel, messageCount, totalCost }[]`.
- **Used by:** `services/api/wallet/get-wallet-channel-usage-summary.ts`, `features/wallet/use-get-wallet-channel-usage-summary.ts`. No screen wired yet.
- **Status:** scaffolded, not wired

## POST /api/payments/wallets/topup

- **Purpose:** Start a real-money wallet top-up via an external payment gateway.
- **Request:** `{ amount: number; currency?: string | null; description?: string | null;
  callbackUrl: string }` — confirmed against this endpoint's own Scalar/OpenAPI doc, pasted live by
  the user 2026-09-10. `callbackUrl` is documented as nullable, but a real live call with it
  null/omitted 422'd with `redirect_url should be a string` — **`redirect_url` is not this
  endpoint's own field name** (a first attempt at fixing this by renaming the request field to
  `redirect_url` was wrong and didn't change the error at all, which is itself the tell). Reading
  is that this backend forwards `callbackUrl` to a downstream payment gateway that uses its own
  `redirect_url` parameter name internally, and the 422 is that gateway's validation leaking
  through `responseMessage` — so despite the nullable typing, a real value is required in practice.
  Sent as `${window.location.origin}/plan-and-billing` — always resolves correctly in both dev and
  prod, no hardcoded domain needed (the reference hardcodes its own deployed origin instead).
  **Not yet re-confirmed live with a real value** — the doc-correction and the real-value fix landed
  together, un-tested as of this write-up.
- **Response — NOT the standard envelope:**
  ```ts
  interface TopupWalletResponse {
    status: string;
    responseMessage: string;
    transactionId: string;
    paymentUrl: string;
  }
  ```
  No `{data, messages, succeeded}` wrapper — this one sits unwrapped at the top level, same class
  of exception as `currency.md`'s two endpoints.
  **On a validation error, `responseMessage` is itself a JSON-encoded string** (confirmed live):
  `"{\"status\":false,\"error\":\"validation_error\",\"message\":\"...\",\"data\":{\"<field>\":
  {\"message\":\"...\"}}}"`. `get-server-error.ts` now unwraps this (parses it, surfaces the
  nested `message` plus any per-field messages from `data`) instead of dumping raw JSON text into
  a toast.
- **Used by:** `services/api/wallet/topup-wallet.ts`, `features/wallet/use-topup-wallet.ts`, wired into `pages/plan-and-billing/index.tsx`'s inline "Fund wallet" section. On success with a `paymentUrl`, the hook redirects the whole page there via `window.location.href` — there is nothing left to render in-app until the user returns from the payment gateway.
- **Status:** wired, request shape corrected against the live doc — not yet re-confirmed working

## Error shape difference from every other domain

Wallet error responses use `{ status, responseMessage }`, not the standard envelope's
`messages[]`/`message`. `src/services/get-server-error.ts` (the shared helper every service in
this app uses) was extended with a `responseMessage` fallback check to read these correctly instead
of falling through to a raw `JSON.stringify` — a safe additive change, doesn't affect any other
domain's error handling.
