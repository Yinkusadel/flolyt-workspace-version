# AI proposals

Base path: `/api/flolyt/ai/proposals` → `AI_PROPOSALS_BASE_URL` / `API_ENDPOINTS.AI_PROPOSALS` in
[`src/config/apiConfig.ts`](../../src/config/apiConfig.ts). Pasted live by the user from the
workspace's own Scalar doc, 2026-09-10.

The AI never executes a mutating action (opening a room, sending a campaign, etc.) directly mid-
conversation. Instead it writes a *proposal* row here and pushes a live `event: proposal` nudge
down the chat's SSE stream (see [[flolyt_chat_panel_build]]) — the SSE payload
(`proposalId`/`toolName`/`argumentsJson`/`conversationId`/`runId`/`createdAtUtc`) is a subset of
this endpoint's own row, not a separate source of truth. This is why `GET` takes an optional
`conversationId` filter: same data, scoped either to "this chat" (inline card) or to everything
still waiting on the signed-in user (a future Inbox "needs a decision from you" card, see
[[flolyt_inbox_rebuild]] — not built yet, tracked separately).

`argumentsJson` is a JSON-encoded string, not a nested object — parse it once to get the tool's
actual arguments. For `open_room_on_cohort` specifically, three of those arguments
(`rulesJson`, `peopleJson`, `agentsJson`) are themselves JSON-encoded strings one level deeper.
Other `toolName`s will have their own argument shapes; nothing here assumes `open_room_on_cohort`
is the only one, so the card renders any argument it doesn't specifically recognize as a plain
key/value row rather than dropping it.

## GET /api/flolyt/ai/proposals

- **Purpose:** List agent proposals — pending by default.
- **Request:** query params `conversationId?` (uuid), `includeDecided?` (bool, default `false`).
- **Response:**
  ```ts
  interface AiProposalDto {
    id: string;
    conversationId: string | null;
    runId: string | null;
    toolName: string;
    argumentsJson: string;
    finalArgumentsJson: string | null;
    status: string;
    decidedBy: string | null;
    decidedAtUtc: string | null;
    executionResultJson: string | null;
    createdAtUtc: string;
  }
  ```
  `data` is the array. Standard `{ data, messages, succeeded }` envelope.
- **Used by:** `services/api/ai-proposals/get-ai-proposals.ts`, `features/ai-proposals/use-get-ai-proposals.ts`, wired into `pages/conversations/detail-route.tsx` (merged with the live SSE `proposal` events for the open conversation).
- **Status:** wired (chat only)

## POST /api/flolyt/ai/proposals/{id}/accept

- **Purpose:** Accept a pending proposal and execute it under the caller's identity. Reviewing the
  card is the approval — no step-up code. Only the person the proposal waits on, a member of its
  room with enough approval reach, or a workspace admin may accept; anyone else is refused. What
  runs is exactly what was on the card — a send whose audience/time moved since proposing is
  refused with what moved, not silently re-computed.
- **Request:** `{ editedArgumentsJson: string | null }` — optional edited arguments; `null` runs
  the proposal as-is.
- **Response:**
  ```ts
  interface AiProposalDecisionResult {
    proposalId: string;
    status: string;
    executionResultJson: string | null;
  }
  ```
  Standard envelope.
- **Used by:** `services/api/ai-proposals/accept-ai-proposal.ts`, `features/ai-proposals/use-decide-ai-proposal.ts`, wired into `pages/conversations/proposal-card.tsx`'s Accept button. No arguments-editing UI yet — always sends `editedArgumentsJson: null`.
- **Status:** wired (chat only)

## POST /api/flolyt/ai/proposals/{id}/defer

- **Purpose:** Hold a pending proposal with a named objection. Not a reject — the objection stays
  on record whether or not it turns out to be right.
- **Request:** `{ because: string }` — **required**, not optional; a hold with no reason is
  refused since it's indistinguishable from nobody having decided.
- **Response:** same `AiProposalDecisionResult` shape as accept.
- **Used by:** `services/api/ai-proposals/defer-ai-proposal.ts`, `features/ai-proposals/use-decide-ai-proposal.ts`, wired into the card's "Hold" button (reveals a required reason textarea before submitting).
- **Status:** wired (chat only)

## POST /api/flolyt/ai/proposals/{id}/reject

- **Purpose:** Reject a pending proposal outright. Same who-may rule as accept/defer.
- **Request:** none.
- **Response:** same `AiProposalDecisionResult` shape.
- **Used by:** `services/api/ai-proposals/reject-ai-proposal.ts`, `features/ai-proposals/use-decide-ai-proposal.ts`, wired into the card's "Reject" button.
- **Status:** wired (chat only)

## Also wired: the Inbox side

[[flolyt_inbox_rebuild]]'s "Needs a decision from you" section
(`pages/everyday/inbox/states/normal-state.tsx`) called this same `GET` unscoped (no
`conversationId` — "everything waiting on me across every conversation") and renders each row
with the same `proposal-card.tsx` component the chat panel uses, rather than inventing a second
card. The old mock `DECISION_CARDS`/`DecisionCard` type and its derived `INBOX_PENDING_COUNT`
sidebar badge were deleted, not kept as a fallback — `components/sidebar.tsx`'s Inbox badge now
counts the same live list. Bulk-select was deliberately left off these cards: accept only allows
"one card, one person, one decision," so select-mode still applies to the "Someone mentioned you"
table but not here.
