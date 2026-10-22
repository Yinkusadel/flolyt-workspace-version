# Auth endpoints

Base path: `/api/users/auth` → `USER_BASE_URL` / `API_ENDPOINTS.USER` in
[`src/config/apiConfig.ts`](../../src/config/apiConfig.ts). Sign-in/sign-up/session endpoints
predate this per-domain doc convention (built directly from
[`docs/auth-and-lifecycle-frontend-handoff.md`](../auth-and-lifecycle-frontend-handoff.md), the
single source of truth for auth and lifecycle; it replaced the older gitignored
`flolyt-extras/auth-frontend-handoff.md`) — this file only covers what was newly built under the
convention: the step-up confirmation pair, needed to unblock onboarding's markets/revenue-model
saves. See [[flolyt_governance_stepup_reminder]] for why this was deferred until now.

## GET /api/users/auth/me

- **Purpose:** Returns the signed-in user, read from the User record the token names.
- **Auth:** authenticated.
- **Response:** `data` = `{ id, email, firstName, lastName, phoneNumber, isActive, role, companyId, companyName, onboardingRequired }`.
- **Used by:** `services/api/auth/get-current-user.ts`, `features/auth/use-get-current-user.ts`, wired into `features/auth/use-verify-login-code.ts` right after `login/verify-code` succeeds.
- **Status:** wired.
- **Notes:** Replaces `GET /api/v3/users/registration/{email}` for this post-login lookup — that
  endpoint reads self-signup registrations only and 404s for anyone who joined by accepting a
  team invitation. `companyId` is null and `onboardingRequired` is true until the workspace
  association lands, which for a fresh invitee is a few seconds after they accept — this hook
  still sources `companyId`/`companyName`/`onboardingRequired` from the JWT claim and the
  verify-code response respectively, not from this call, so that lag doesn't matter here.
  `services/api/auth/get-user-by-email.ts` (registration/{email}) is kept as-is for
  `features/auth/use-sign-up.ts`'s "already exists" branch, which runs before login and has no
  token to call `/me` with.

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
- **Status:** wired — first real call returns `500`, see bug below
- **Notes:** All 5 actions are **conditional** per the handoff doc (corrected 2026-10-21: markets
  and revenue model used to be "always required"). `change_workspace_markets` and
  `change_revenue_model` need a code only for an actual change after initial configuration; the
  first declaration, initial setup corrections and unchanged retries need none. So every caller
  attempts bare first and only opens the code dialog when the server replies "Confirm this change
  with the code we emailed you." (`isStepUpRequiredMessage`). Only `change_workspace_markets`,
  `change_revenue_model` and `change_administrators` have UI wired; the other 2 are for governance.

## Onboarding correction, 2026-10-21 (handoff doc line ~141)

Do not open the email-code dialog automatically on `/onboarding/workspace` (markets) or
`/onboarding/business-model`. The backend exempts an unfinished onboarding record: it closes the
exemption once setup finishes, any datasource has been connected (even if later disconnected), a
leakage grid exists or a revenue ledger has been built. `GET /api/v3/workspace/revenue-model`
returns `requiresStepUpToChange` with the same condition as the write. Re-sending the same value
never needs a code. A non-administrator can never change either setting.

Frontend: both screens submit with `stepUpChallengeId: null`; the hooks
(`use-update-workspace-markets.ts`, `use-update-revenue-model.ts`) take an `onStepUpRequired`
callback fired from both `onSuccess` (`succeeded:false`) and `onError`. The Settings Markets page
(`src/pages/markets`) attempts bare first too.

## Token role lag after workspace creation (found live 2026-10-21)

The access token from sign-in carries role `Member`. The `Administrator` role only appears on a
**refreshed** token, and only about 9 to 13 seconds after `POST /workspace`; a refresh straight
after creation still returns `Member`. Until then `PUT /markets` and `PUT /revenue-model` answer
400 "Only an administrator can change the workspace's ..." (a 400, not a 401, so the axios
interceptor never refreshes). Frontend fix: `onboarding/start/index.tsx` calls
`waitForAdministratorToken()` after creation, refreshing every 1.5s (max 8 tries) until the JWT
role is not `Member`. Live-verified end to end on a fresh account: markets 200, revenue model 200,
no code asked, one toast each. Not verified live: a later actual change still asking for a code.

Backend note: login `request-code` always answers 200, but codes stopped arriving to disposable
inboxes after repeated sign-ups from one machine (looks like throttling, unconfirmed).

## Bug found testing against the real API, 2026-08-26

`POST /step-up/request-code` returns `500` for every action, always:

```json
{
  "type": "https://datatracker.ietf.org/doc/html/rfc7231#section-6.6.1",
  "title": "Server Failure",
  "status": 500,
  "detail": "FLOLYT_STEP_UP_CODE_TEMPLATE_ID is not set. Confirmation codes cannot be delivered, which would make every guarded action impossible to complete.",
  "instance": "/api/users/auth/step-up/request-code"
}
```

Backend config gap, not a frontend bug — `FLOLYT_STEP_UP_CODE_TEMPLATE_ID` (presumably the email
template id used to deliver the code) isn't set on the server. **Blocks the entire step-up flow**
for all 5 actions until fixed server-side — markets and revenue-model saves can't complete, and
the step-up round trip still hasn't been verified end-to-end because of this. Flag to the backend
team; nothing to change here.

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
