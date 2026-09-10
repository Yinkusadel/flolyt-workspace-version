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
- **Request:** `{ amount: number; currency?: string | null; description?: string | null; callbackUrl?: string | null }`.
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
  of exception as `currency.md`'s two endpoints. Confirmed against the reference implementation's
  own typing, not independently verified live.
- **Used by:** `services/api/wallet/topup-wallet.ts`, `features/wallet/use-topup-wallet.ts`, wired into `pages/plan-and-billing/index.tsx`'s inline "Fund wallet" section. On success with a `paymentUrl`, the hook redirects the whole page there via `window.location.href` — there is nothing left to render in-app until the user returns from the payment gateway.
- **Status:** wired
- **Notes:** `callbackUrl` isn't set from this app yet (the reference hardcodes its own deployed
  origin) — worth revisiting once this app has a real deployed URL to send the gateway back to
  after payment; currently omitted (`undefined`), so whatever the backend defaults to applies.

## Error shape difference from every other domain

Wallet error responses use `{ status, responseMessage }`, not the standard envelope's
`messages[]`/`message`. `src/services/get-server-error.ts` (the shared helper every service in
this app uses) was extended with a `responseMessage` fallback check to read these correctly instead
of falling through to a raw `JSON.stringify` — a safe additive change, doesn't affect any other
domain's error handling.
