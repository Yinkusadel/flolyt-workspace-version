# Chat panel — build plan

Started 2026-09-09. This build has no Figma source — it's ported from a working implementation
in the sibling repo `flolyt-dashboard` (`Flolyts-space/flolyt-dashboard`, a different local
checkout, not part of this repo). This file is the working plan: what exists over there, what's
copied here for reference, and what's still undecided before wiring starts here.

## Source material (lives in `flolyt-dashboard`, NOT this repo)

| What | Path in `flolyt-dashboard` |
|---|---|
| Chat hooks/types (the actual chatting logic) | `src/features/ai-agent/` |
| — SSE send + stream parsing | `src/features/ai-agent/use-ai-conversation-message.ts` |
| — shared types | `src/features/ai-agent/ai-types.ts` |
| — conversation list/detail/archive/sample-prompts hooks | `src/features/ai-agent/use-get-ai-conversation*.ts`, `use-archive-ai-conversation.ts`, `use-get-ai-sample-prompts.ts` |
| — broadcast preview + generic response parsing | `parse-broadcast-preview.ts`, `parse-broadcast-response.ts`, `response-parser.ts` |
| Where the hook is actually wired into a UI (chat driving a canvas) | `src/pages/WorkflowStudio/index.tsx` |
| Chat-adjacent panel components | `src/pages/WorkflowStudio/NewCanva/WorkflowCommentPanel.tsx`, `Canvas-thinking-state.tsx`, `AiResponseCtaButtons.tsx` |

These are reference-only — read them for the pattern, don't assume the paths still exist verbatim
next time this doc is opened; re-check before copying code wholesale.

## Copied into this repo for reference

- [`agent-hardening-frontend-design.md`](./agent-hardening-frontend-design.md) — full backend
  contract for the durable-run chat surface (endpoints, SSE event catalogue, run lifecycle,
  proposal cards, reconnect). Copied verbatim from `flolyt-dashboard/docs/` on 2026-09-09.
- [`agent-hardening-build-checklist.md`](./agent-hardening-build-checklist.md) — the reference
  repo's own tracker against that design doc, copied the same day. **Important:** most of it is
  unchecked — see "State of the reference implementation" below.

## The endpoint (confirm against Scalar before wiring, per [[endpoint_docs_convention]])

```
POST /api/flolyt/ai/conversations/messages
```

Body, as of the spec pasted 2026-09-09 (matches §3.1 of the design doc):

```jsonc
{
  "conversationId": null,       // null ⇒ new conversation
  "message": "...",             // required
  "mode": null,                 // optional surface-mode passthrough
  "interactiveReply": null      // NEW field — Dictionary<string,string>, answers to a prior
                                 // input_request event; not yet consumed by use-ai-conversation-message.ts
}
```

`Accept: text/event-stream` → SSE stream. `Accept: application/json` → one complete
`AgentMessageResult`. SSE mode is a POST, so `EventSource` can't be used — `fetch` +
`ReadableStream`, same pattern as [[api_endpoint_style]] would need adapting for.

Other endpoints in the same family (from the design doc, not yet confirmed against this
workspace's own Scalar instance):

```
GET    /api/flolyt/ai/conversations/?pageNumber=1&pageSize=20
GET    /api/flolyt/ai/conversations/{id}          → incl. activeRunId
DELETE /api/flolyt/ai/conversations/{id}          → archive (soft delete)
GET    /api/flolyt/ai/conversations/sample-prompts
GET    /api/flolyt/command-center/runs/{id}
GET    /api/flolyt/command-center/runs/{id}/stream
POST   /api/flolyt/command-center/runs/{id}/cancel
POST   /api/flolyt/command-center/runs/{id}/steer
GET    /api/flolyt/ai/proposals?conversationId={guid}&includeDecided=false
POST   /api/flolyt/ai/proposals/{id}/accept
POST   /api/flolyt/ai/proposals/{id}/reject
```

**Do not assume these exist verbatim in this workspace's backend** — confirm each one in Scalar
before wiring, per [[feedback_verify_against_endpoint_docs]] and
[[feedback_stop_on_truncated_endpoint_fields]]. This table is carried over from the reference
repo's doc, not independently verified against this project's API.

## State of the reference implementation (why this matters for scoping our build)

`use-ai-conversation-message.ts` in `flolyt-dashboard` only implements the **base chat surface**:
SSE send/parse, `status`/`run_queued`/`tool_call`/`reasoning_step`/`response_chunk`/
`workflow_generated`/`broadcast_preview`/`suggested_action`/`error` events, a typewriter effect,
and it captures `runId` — but does nothing with it yet (no cancel, no steer, no reconnect, no
proposal cards). `ai-types.ts` has no `AgentProposalEventDto`, no `interactiveReply` handling, no
`activeRunId` on the conversation type.

Per the checklist, the durable-run "hardening" work (Stages 0-5 of the design doc) is **mostly
unbuilt even in the reference repo**: Stage 0 (types/services) and Stage 2 (`RunStatusBar`
stop/steer) are partially done; Stages 3 (proposal cards), 4 (reconnect), and 5 (resilience) are
not started.

**Implication for this build:** when we build the chat panel here, the honest starting point is
the same base surface the reference hook already has working (send message, stream response,
reasoning steps, tool calls, conversation list) — not the full hardened design. The design doc is
there so we don't paint ourselves into a corner (e.g. capture `runId` from `run_queued` even in
v1, since retrofitting it later is the whole point of Stage 1), but treat Stages 3-5 as future
work, not v1 scope, unless told otherwise.

## Open questions before we start

- Does this workspace's backend even expose the run/proposal endpoints yet, or only the base
  `/ai/conversations/messages` + SSE surface? Needs a Scalar check.
- Where does the chat panel live in this app — a dedicated page, or a persistent panel like
  `flolyt-dashboard`'s `WorkflowCommentPanel`? Not yet decided.

## Progress (2026-09-09) — sidebar entry points + starting page

First real slice, built directly (not ported verbatim — adapted to this app's own paper/ink
design tokens and route conventions, not `flolyt-dashboard`'s dark surface-800 theme). Went
through two passes — the first pass put a plain "Conversation" link under EVERY DAY and an inline
always-expanded accordion list in the main nav flow; corrected below to match what was actually
asked for. Only the corrected (current) shape is described here.

- **Sidebar** ([src/components/sidebar.tsx](../../src/components/sidebar.tsx)) — a block sitting
  above the "EVERY DAY" section, not inside it:
  - **"New conversation"** — a plain `NavLink` to `/new-conversation` (the starting page).
  - **"AI conversations"** — a `DropdownMenu` trigger (not an inline/always-visible accordion),
    styled like a nav row with a chevron, modeled directly on the avatar menu's Data/Settings
    toggle pattern in [src/components/user-menu.tsx](../../src/components/user-menu.tsx):
    `DropdownMenuTrigger asChild` wrapping the styled button, `DropdownMenuContent` popover
    (`max-h-80 w-64 overflow-y-auto`) holding `DropdownMenuItem asChild` + `Link` rows, fetched
    live via `useGetAiConversations`. Selecting one navigates to `/conversations/:id` and closes
    the popover (Radix's default `onSelect` behavior) and the mobile drawer (`onClose` on the
    `Link`).
  - Removed the non-functional "Ask anything…" ⌘K button — its `onSearchClick` prop was dead
    (nothing in `app-layout.tsx` ever passed it).
- **Services/hooks** — following the `rooms` domain's exact service/hook shape (not the reference
  repo's wrapper-hook style):
  - `src/services/api/ai-conversations/get-conversations.ts` + `use-get-ai-conversations.ts` —
    `GET /ai/conversations` (`AI_CONVERSATIONS.LIST`, already in `apiConfig.ts` — someone had
    pre-added the whole `AI_CONVERSATIONS` and `AGENT_RUNS` endpoint blocks before this session,
    unused until now). Response/query shape matches the live spec pasted 2026-09-09 exactly:
    `scope` query param (`Visible` | `Own` | `SharedWithMe`), and each row carries `ownerUserId`,
    `ownerName`, `isOwn`, `visibility` alongside the fields guessed in the first pass.
  - `src/services/api/ai-conversations/send-message.ts` + `use-send-ai-message.ts` — `POST
    /ai/conversations/messages` in **non-streaming** mode (`Accept: application/json`, per §3.1 of
    the design doc), not the SSE mode. Deliberate scope cut: the starting page only needs a
    `conversationId` back to redirect with, not the full typewriter/reasoning-step stream — that
    belongs to whatever eventually renders `/conversations/:id`.
- **Pages** — moved out of `pages/everyday/` into a new top-level `src/pages/conversations/`,
  since neither route is actually part of the Everyday section anymore (both are sidebar entry
  points that sit above it):
  - `new-conversation-route.tsx` — the starting page ("What can I do for you?" + prompt textarea),
    registered at `/new-conversation`. On submit, calls the real `sendAiMessage` mutation and
    navigates to `/conversations/{conversationId}` on success.
  - `detail-route.tsx` — intentionally blank per instruction: a bordered placeholder card, no chat
    UI. Registered at `conversations/:id`. Exported as `AiConversationDetailRoute` in `route.tsx`
    (not `ConversationDetailRoute` — that name was already taken by
    `src/pages/customers/replies/conversation-detail-route.tsx`).
  - Breadcrumb: `/new-conversation` gets a static `"New conversation"` entry in
    `app-layout.tsx`'s `getBreadcrumb`; `/conversations/:id` uses `usePageBreadcrumb` from inside
    the component instead (matches the convention — no static title exists for an unbuilt detail
    page), linking back to `/new-conversation`.

**Verified:** `npm run build` (`tsc -b && vite build`) passes clean after both passes. **Not
verified:** the actual submit → real backend → real `conversationId` → redirect round trip, or how
the sidebar/pages render for a signed-in user — this session couldn't complete sign-in (email OTP)
to reach an authenticated view. Per [[feedback_mutation_flows_need_live_submit]], treat the
send-message mutation as unverified against the real backend until someone actually submits a
prompt in a running dev server.

**Still open, deferred on purpose:** the SSE streaming hook (`use-ai-conversation-message.ts`'s
full port), the actual chat thread UI at `/conversations/:id`, and everything in the hardening
checklist (Stop, steer, reconnect, proposals).
