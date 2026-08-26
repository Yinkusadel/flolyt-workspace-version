# Auth endpoints

Base path: `/api/users/auth` → `USER_BASE_URL` / `API_ENDPOINTS.USER` in
[`src/config/apiConfig.ts`](../../src/config/apiConfig.ts). Sign-in/sign-up/session endpoints
predate this per-domain doc convention (built directly from
[`flolyt-extras/auth-frontend-handoff.md`](../../flolyt-extras/auth-frontend-handoff.md), the
source of truth for all of auth) — this file only covers what was newly built under the
convention: the step-up confirmation pair, needed to unblock onboarding's markets/revenue-model
saves. See [[flolyt_governance_stepup_reminder]] for why this was deferred until now.

## POST /api/users/auth/step-up/request-code

- **Purpose:** Emails a fresh confirmation code for one sensitive action, even to an
  already-signed-in user — same two-step shape as login, but authenticated and bound to one
  action.
- **Auth:** authenticated.
- **Request:** `action` (string, required) — one of `raise_agent_spend_limit`,
  `override_send_stop_line`, `change_administrators`, `change_workspace_markets`,
  `change_revenue_model`.
- **Response:** `data` = the challengeId (uuid **string**, not wrapped in an object — differs
  from login's `request-code`, which nests it as `{ challengeId }`).
- **Used by:** `services/api/auth/request-step-up-code.ts`, `features/auth/use-step-up-confirmation.ts`, wired into `src/components/step-up-confirm-modal.tsx` — first consumer is `/onboarding/workspace`'s markets save.
- **Status:** wired, not yet verified against a real API call
- **Notes:** Per the handoff doc, `change_workspace_markets` and `change_revenue_model` are
  **always** required; the other 3 actions are conditional (only when the sensitive threshold is
  actually being raised/loosened) and have no UI wired to them yet.

## POST /api/users/auth/step-up/verify-code

- **Purpose:** Verifies the emailed code, producing a `challengeId` the real gated mutation can
  carry.
- **Auth:** authenticated.
- **Request:** `challengeId` (uuid, required), `code` (6-digit string, required).
- **Response:** `{ succeeded: boolean, messages: string[] }` — no `data` payload; success just
  means the challenge is now spendable.
- **Used by:** `services/api/auth/verify-step-up-code.ts`, `features/auth/use-step-up-confirmation.ts`.
- **Status:** wired, not yet verified against a real API call
- **Notes:** Verified challenges are single-use and expire in **2 minutes** — request fresh right
  before opening the confirmation modal, never cache one. Same "one message for every failure
  reason" shape as login's verify-code (wrong/expired/spent/no-such-challenge all read identically
  — don't branch on the message).

## Missing

_None flagged — this batch covered exactly the 2 step-up endpoints onboarding needed._
