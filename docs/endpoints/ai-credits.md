# AI credits endpoints

Base path: `/api/flolyt/payments/credits` → `AICREDITS_BASE_URL` / `API_ENDPOINTS.AICREDITS` in
[`src/config/apiConfig.ts`](../../src/config/apiConfig.ts) — already present in `apiConfig.ts`
before this batch, unused until now. Shapes ported from the working reference implementation in
the sibling repo `flolyt-dashboard` (`src/services/api/ai-credits/`, `src/features/ai-credit/`) —
**not independently confirmed against this workspace's own Scalar instance**, per
[[feedback_verify_against_endpoint_docs]]. Standard `{ data, messages, succeeded }` envelope on all
six.

## GET /api/flolyt/payments/credits/balance

- **Purpose:** The current account's credit balance — paid + free, daily/monthly free limits, when
  the free allowance last reset.
- **Request:** none.
- **Response:**
  ```ts
  interface CreditBalanceDto {
    accountId: string;
    companyId: string;
    paidCredits: number;
    freeCredits: number;
    dailyFreeCreditsUsed: number;
    dailyFreeLimit: number;
    monthlyFreeLimit: number;
    totalAvailable: number;
    lastMonthlyReset: string | null;
  }
  ```
- **Used by:** `services/api/ai-credits/get-credit-balance.ts`,
  `features/ai-credits/use-get-credit-balance.ts`, wired into `components/user-menu.tsx`'s
  "Credits" block (Available / Free monthly credits / Daily limit rows).
- **Status:** wired
- **Notes:** the live `insufficient_credits` error surfaced in the chat panel (see
  [[flolyt_chat_panel_build]]) reports the *shortfall* for one operation, not the account balance —
  this endpoint is the only place the actual balance is read.

## GET /api/flolyt/payments/credits/packs

- **Purpose:** Purchasable credit packs (name, credit count, tenant-currency pricing).
- **Request:** none.
- **Response:**
  ```ts
  interface CreditPackDto {
    name: string;
    displayName: string;
    credits: number;
    price: { currency: string; amount: number; costPerCredit: number } | null;
    allPrices: { currency: string; amount: number; costPerCredit: number }[];
  }
  ```
  `data` is an array.
- **Used by:** `services/api/ai-credits/get-credit-packs.ts`,
  `features/ai-credits/use-get-credit-packs.ts`. No screen wired yet — no credits-purchase page
  exists in this app.
- **Status:** scaffolded (service + hook, build-clean), not wired

## POST /api/flolyt/payments/credits/purchase

- **Purpose:** Buy one credit pack by name.
- **Request:** `{ packName: string }`.
- **Response:** `data = { packName, creditsAdded, amountCharged, newCreditBalance }`.
- **Used by:** `services/api/ai-credits/purchase-credit-pack.ts`,
  `features/ai-credits/use-purchase-credit-pack.ts` (invalidates `credit-balance`, `credit-packs`,
  `credit-overview` on success). No screen wired yet.
- **Status:** scaffolded, not wired

## GET /api/flolyt/payments/credits/operations

- **Purpose:** The list of billable operation types and their credit cost (e.g. what a chat send
  or a workflow generation costs).
- **Request:** none.
- **Response:** `data = { name, displayName, description, creditCost }[]`.
- **Used by:** `services/api/ai-credits/get-credit-operations.ts`,
  `features/ai-credits/use-get-credit-operations.ts`. No screen wired yet.
- **Status:** scaffolded, not wired

## GET /api/flolyt/payments/credits/usage

- **Purpose:** This account's own usage history — totals, per-operation-type breakdown, daily
  series.
- **Request:** none.
- **Response:**
  ```ts
  interface CreditUsageDto {
    id: string;
    totalCreditsUsed: number;
    totalCreditsPurchased: number;
    totalAmountSpent: number;
    usageByOperationType: Record<string, number>;
    dailyUsage: { date: string; creditsUsed: number; freeCreditsUsed: number; paidCreditsUsed: number; operationCounts: Record<string, number> }[];
    lastActivity: string;
  }
  ```
- **Used by:** `services/api/ai-credits/get-credit-usage.ts`,
  `features/ai-credits/use-get-credit-usage.ts`. No screen wired yet.
- **Status:** scaffolded, not wired

## GET /api/flolyt/payments/credits/overview

- **Purpose:** Platform-wide credit economics (total sold/consumed, revenue, pack distribution,
  top-consuming companies) — reads as a platform-admin surface, not a per-workspace one, based on
  the shape (`topConsumers` keyed by `companyId`). Unconfirmed whether this account even has
  permission to call it from a regular workspace context.
- **Request:** none.
- **Response:**
  ```ts
  interface CreditOverviewDto {
    id: string;
    totalCreditsSold: number;
    totalCreditsConsumed: number;
    totalRevenueFromPacks: number;
    packPurchaseDistribution: Record<string, number>;
    globalUsageByOperationType: Record<string, number>;
    topConsumers: { companyId: string; totalCreditsUsed: number; totalCreditsPurchased: number; totalSpent: number; lastActivity: string }[];
    lastUpdated: string;
  }
  ```
- **Used by:** `services/api/ai-credits/get-credit-overview.ts`,
  `features/ai-credits/use-get-credit-overview.ts`. No screen wired yet.
- **Status:** scaffolded, not wired
- **Notes:** double-check auth/scope before wiring this one anywhere in the regular app shell —
  it may belong under `PLATFORM_ADMIN` instead.
