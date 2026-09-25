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
  - **"AI conversations"** — an inline expand/collapse toggle (local `useState`, chevron rotates
    on open), **not** a `DropdownMenu`. A `DropdownMenu` was tried first (matching the avatar
    menu's Data/Settings toggle pattern in
    [src/components/user-menu.tsx](../../src/components/user-menu.tsx) literally), but Radix's
    `DropdownMenuContent` portals to `document.body` as a floating overlay — fine for a corner
    avatar menu, wrong for a persistent nav-list row: it rendered as a detached card overflowing
    past the sidebar's `w-nav` width over the page content, and on mobile its portal sat outside
    the drawer's own DOM subtree, so opening/using it could register as an outside click and
    close the whole drawer. Reverted to a plain conditional-render list (`max-h-64 overflow-y-auto
    pl-6`, indented under the toggle), fetched live via `useGetAiConversations`, collapsed by
    default. Selecting a conversation is a normal `Link` with `onClick={onClose}`, same as every
    other sidebar nav item — nothing portaled, so the drawer only closes on an intentional
    selection.
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

## Styling pass (2026-09-09) — `new-conversation-route.tsx`

The first cut had its own `px-6` on the page root, double-padding on top of `app-layout.tsx`'s
shared `<main className="p-page">` (a flat `--spacing-page: 22px` on every side, every
breakpoint — there's no separate mobile value, so "consistent" here just means *only* `p-page`,
no page adding its own on top, same as `pages/everyday/lifecycle/index.tsx`, which has zero
horizontal padding of its own). Removed it. The send button footer was also disproportionately
tall next to the textarea (`size-8` button in a `py-2.5` row); shrunk to `size-6.5` in `py-1.5`,
in line with this app's compact control sizing elsewhere (`Input` is `h-9`, default `Button` is
`h-8`).

Also reworked the page to read as a deliberate "AI moment" rather than a plain form, using tokens
already in this design system rather than inventing new ones: `font-serif` (Newsreader, the same
face `auth/shared/right-section.tsx` uses for its hero line) on the heading, the `--color-ultra`
accent (`text-ultra`/`bg-ultra-bg`/`border-ultra-border` — this app's existing AI/primary accent,
already wired to `--ring`) on a small sparkle badge and the send button, a soft `blur-3xl` ultra
glow behind the hero, and a staggered `animate-in fade-in slide-in-from-bottom-2` entrance
(the same `tailwindcss-animate` utilities `onboarding/finishing-up/index.tsx` already uses, just
applied on mount instead of on a timer).

Verified by rendering the same markup against the actual compiled `dist/assets/*.css` in a
throwaway static HTML file at mobile (390px) and desktop (1280px) viewports — this session still
couldn't complete a real sign-in to check the live authenticated route directly. Padding and
footer proportions confirmed visually; still worth a real look in a running dev server.

## Focus outline pass (2026-09-09) — thin animated gradient, not a solid ring

The prompt box's `focus-within` state originally used the same idiom as `Input`
(`focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50`, per
`src/components/ui/input.tsx`) — a solid 3px indigo ring. Asked to make it thinner and give it a
subtle animated gradient instead. Implemented as a layered border rather than a `ring` utility,
since Tailwind's `ring` can't animate a gradient:

- `src/index.css` gained one new global `@keyframes border-gradient-pan` (pans
  `background-position` 0%→100%→0% over a `300%`-sized gradient), added after the existing
  `@layer base` block — commented as a one-off keyframe, not a design token, so it doesn't need a
  home in the `@theme` block with the other tokens.
- The prompt box wrapper became `group relative`, with a new `aria-hidden` absolutely-positioned
  `-inset-px` div behind the visible box carrying the gradient
  (`linear-gradient(120deg, var(--color-ultra), var(--color-ultra-border), var(--color-ultra))`,
  `background-size: 300% 300%`, `animation: border-gradient-pan 5s ease infinite`) and
  `opacity-0 group-focus-within:opacity-100`. The visible box itself keeps its normal `border-line`
  border and switches to `group-focus-within:border-transparent` on focus, so the 1px inset gap
  reveals exactly a 1px animated gradient line, no glow/ring size.
- Confirmed visually the same way as the earlier styling pass: static HTML against the compiled
  build CSS, this time with the focus-within state forced on to see the outline itself (a plain
  screenshot can't show the pan motion, but the setup — one keyframe, one opacity-gated gradient
  layer — is unambiguous).

If this pattern is needed elsewhere later, it's reusable as-is; not extracted into a shared
component/utility since there's only one caller so far.

## Progress (2026-09-09) — SSE streaming chat thread at `/conversations/:id`

The base chat surface described above ("State of the reference implementation") is now built here.
`detail-route.tsx` is no longer a placeholder — it's the real thread UI, and the starting page no
longer sends the message itself.

- **Flow changed to match `PromptBox.tsx`'s bootstrap pattern, not the original non-streaming
  mutation.** `new-conversation-route.tsx` was originally wired to `POST
  /ai/conversations/messages` (`Accept: application/json`) via `use-send-ai-message.ts`, waiting
  for a `conversationId` back before navigating. Re-read `PromptBox.tsx` and it doesn't wait at
  all — it navigates immediately with a `bootstrapToken` + the prompt in nav `state`, and lets the
  *destination* page own the actual send over SSE, capturing `conversationId` off the stream's
  first `status` event. Ported that: `new-conversation-route.tsx` now just does
  `navigate("/conversations/new", { state: { bootstrapToken, prompt } })`; `send-message.ts` /
  `use-send-ai-message.ts` were deleted (nothing called them anymore, per the "no unused code"
  rule) in favor of the SSE hook below. `"new"` is the sentinel id — `detail-route.tsx` checks
  `id === "new"` to know it's bootstrapping rather than loading history.
- **`src/features/ai-conversations/use-ai-conversation-messages.ts`** — the SSE hook, ported from
  `flolyt-dashboard`'s `use-ai-conversation-message.ts` and trimmed to **text-only v1 scope**
  (explicit user decision): handles `status` (incl. `conversation_id:` prefix parsing to capture
  the new id), `run_queued` (captures `runId`, unused — same "capture now, wire up later" reasoning
  the design doc itself argues for), `tool_call`, `reasoning_step`, `response_chunk` (drives the
  typewriter effect), and `error`. Deliberately does **not** handle `workflow_generated`,
  `broadcast_preview`, or `suggested_action` — this app has no ReactFlow canvas / broadcast-draft
  surface for those to drive, unlike `WorkflowStudio`. Auth via `fetch` + the same
  `COOKIE_KEYS.AUTH_TOKEN` cookie `axiosInstance` already reads (confirmed identical cookie name
  between both repos). Also carries a conversation-switch reset effect (dropping streamed state
  when `initialConversationId` changes to a different real id, e.g. picking another thread from the
  sidebar) that the reference needed for the same reason (`WorkflowStudio`'s `routeScopeKey`) since
  React Router reuses the component instance across param changes rather than remounting it.
- **History for existing conversations** — added `GET_BY_ID` wiring that didn't exist yet:
  `src/services/api/ai-conversations/get-conversation-by-id.ts` +
  `src/features/ai-conversations/use-get-ai-conversation-by-id.ts`. `detail-route.tsx` merges
  history messages with the live-streamed ones (deduped by role+timestamp+content).
- **Delete conversation** — `src/services/api/ai-conversations/archive-conversation.ts` (`DELETE
  /ai/conversations/{id}`, the same endpoint the reference calls "archive" but the UI presents as
  delete) + `use-archive-ai-conversation.ts`. Surfaced in the sidebar's conversation list as a
  per-row menu — **not** a Radix `DropdownMenu` (portal-to-body breaks the mobile drawer, see
  [[feedback_no_dropdown_menu_for_sidebar_nav]]) but a fully inline, non-portaled menu: an
  always-visible (not hover-revealed — hover doesn't exist on touch, this was corrected mid-build)
  kebab button toggles local `useState`, closed via a plain `document.addEventListener("mousedown")`
  effect checking a ref, not a Radix dismissable layer. Confirms via a `Dialog`-based modal (the
  existing `close-without-answering-modal.tsx` pattern), and redirects to `/new-conversation` if you
  delete the conversation you're currently viewing.
- **UI polish, several corrections mid-build:**
  - Sparkle (`lucide-react`) badges swapped for the real Flolyt logo (`assets/logo.png`, per
    [[flolyt_logo_asset]]) on both the starting-page hero and the thread's empty state — badge sized
    up to `size-12`/`size-7` image after an initial pass read as too small/faint.
  - The per-message sparkle marker above each AI response was removed entirely — flagged as
    unwanted, not just resized.
  - The user bubble went through two passes: first just a tinted bordered box (`rounded-card`),
    corrected to an actual bubble (`bg-ultra`, white text) — still wasn't right (still no tail),
    corrected again to a real WhatsApp-style tail: `rounded-tr-none` on the bubble plus a CSS
    border-triangle (`border-width: 8px 8px 0 0`, one side colored) butted against that now-sharp
    corner. The first tail attempt (`-right-2`, i.e. positioned outside the bubble's own box) caused
    a page-wide horizontal-scroll bug — see the min-w-0/overflow entry below.
  - `ReasoningTrace` (the collapsible "N reasoning steps" block shown while streaming) was upgraded
    from plain bullets to match `ActivityItemComp.tsx`'s convention: a `Database` icon for
    `tool_call` steps vs. a status circle (spinner while active, checkmark once superseded) for
    `reasoning_step` ones. Required tagging each captured step with a `kind` field in the hook
    itself (not part of the wire payload — the SSE event type already tells us this, the DTO
    doesn't). Also caught before shipping: this app's palette has no `emerald` token at all (grepped
    `index.css` to confirm) — the equivalent "positive" state color here is `teal`
    (`--color-teal`/`-bg`/`-border`), used instead.
  - **Horizontal-scroll bug** — reported as "why is it scrolling left to right, it shouldn't
    scroll left to right." Root cause: the bubble tail's `-right-2` position placed it 8px outside
    its own container's box with no `overflow-x-hidden` between it and the page, so any bubble near
    the column's right edge forced the whole `main` region to scroll sideways by a few pixels
    (`app-layout.tsx`'s flex chain already has `min-w-0` — that wasn't the gap; a genuinely
    overflowing descendant was). Fixed at the source (reserved the 8px via `pr-2` padding on the
    tail's wrapper instead of letting it spill past the box) and defensively elsewhere: `min-w-0` +
    `wrap-break-word` added to every text-bearing flex child in the message list (mirroring the
    explicit `min-w-0` guards already present in `ActivityItemComp.tsx`'s `ai_response`/`tool_call`
    rendering — that pattern exists there for exactly this reason), plus `overflow-x-hidden` on the
    message-list scroll container as a backstop.

**Verified:** `npm run build` (`tsc -b && vite build`) passes clean after every change above.
**Still not verified live:** a real authenticated round trip against the backend — this sandbox has
never completed the OTP sign-in flow. In particular unverified: whether the backend's actual SSE
framing matches the `event:`/`data:` parsing here, and whether the `status` event really prefixes
the new id as `conversation_id:<id>` the way the reference assumes.

**Still open, deferred on purpose:** everything in the hardening checklist beyond `runId` capture
(Stop, steer, reconnect, proposal cards) — Stages 3-5 of `agent-hardening-frontend-design.md`.

## Progress (2026-09-09) — first live-verified round trip, two bugs found and fixed

The user ran this in their own dev server against the real, signed-in backend — the first time any
part of this build has been checked against a live backend rather than just `npm run build` and
static-CSS screenshots. Two real bugs surfaced and were fixed; both confirmed live.

- **No loading state between send and first byte** — reported via a screenshot: sent "hello," the
  network tab showed the SSE request sitting `(pending)`, 0.0kB transferred, and the UI showed
  nothing at all in that gap. Root cause: `currentPhase` in
  `use-ai-conversation-messages.ts` only got set once the first `status` SSE event was parsed out
  of the response body — so if the server takes a while to write its first byte (or the connection
  is just slow to open), there's a real window where `isStreaming` is `true` but `currentPhase` is
  still `null`, and `detail-route.tsx`'s phase indicator only renders when `currentPhase` is
  truthy. Fixed by calling `setCurrentPhase("submitted")` synchronously at the top of `sendMessage`,
  before the `fetch` call — the "Thinking…" spinner now shows the instant you hit send, not once
  the server responds. **Confirmed live** ("i can see it now").
- **Delete menu on the last row hides below the list** — reported via a screenshot of the sidebar's
  "AI conversations" list: opening the kebab menu on the last row made it invisible instead of
  showing "Delete." Root cause: the row menu renders inline inside the list's own
  `overflow-y-auto` `max-h-64` container (deliberately, to avoid the `DropdownMenu`-portal bug — see
  [[feedback_no_dropdown_menu_for_sidebar_nav]]), so a menu opening downward (`top-full`) from a row
  near the bottom extends past that container's own scroll boundary and gets clipped there — it's
  not a stacking/z-index problem, the container's `overflow-y-auto` genuinely cuts it off. Fixed
  with a `toggleRowMenu` handler in `sidebar.tsx` that measures the trigger's position against the
  list container (`getBoundingClientRect`) when opening. **First version of this fix was itself
  wrong** — it only checked room below and flipped up unconditionally when insufficient, which
  broke on a short list (as few as 2 conversations): the *top* row got flipped up too (also not
  enough room below it, in a short list) and clipped at the container's *top* edge instead, caught
  live by the user immediately after this shipped. Corrected to compare room on both sides
  (`spaceAbove`/`spaceBelow`) and open toward whichever is larger, not a one-directional threshold.

**Implication:** sign-in and the base send → stream → render round trip now have at least one live
confirmation outside this sandbox. The backend's SSE framing (`event:`/`data:` lines) and the
`status` event's `conversation_id:<id>` prefix convention are therefore very likely correct as
implemented — worth re-confirming on the next live session rather than treating as fully proven,
since only the loading-state symptom (not the full send→respond→render path) was explicitly
verified end-to-end here.

## Progress (2026-09-09) — debug logging restored, sidebar list didn't refresh after sending

- **Debug logging** — the reference hook (`use-ai-conversation-message.ts`) logs `🔥 SSE status`,
  `🔥 SSE headers`, `🔥 SSE chunk` (per read), `🔥 SSE event` (per parsed event), and `❌ Send
  message failed` on error. These were deliberately dropped during the initial port as dev noise
  not worth shipping in clean code — flagged by the user as a real difference from the reference,
  and reinstated verbatim given the integration is still being actively live-debugged against a
  backend whose exact SSE contract isn't fully confirmed yet. Worth stripping once the integration
  is fully trusted, not before.
- **Sidebar conversation list didn't update after sending, needed a manual refresh** — confirmed:
  `queryClient.invalidateQueries({ queryKey: ["ai-conversations"] })` only ran inside the
  `if (parsed.state === "complete")` branch, i.e. only if the backend's stream explicitly emits an
  event whose `state` field is exactly `"complete"` before closing. If it signals completion any
  other way (the connection just ends, a different field/casing, no final event at all), that
  invalidate never runs, and the sidebar's list — mounted persistently, so it would otherwise
  auto-refetch on invalidate — never hears about the new/updated conversation until something else
  causes a refetch (a full reload). Moved the invalidate into the `finally` block instead, so it
  fires unconditionally whenever `sendMessage` finishes for any reason (normal completion, error,
  or an abort that still produced a response) — not proven yet whether the "complete" event
  actually never fires or fires under a different shape; the `finally` fix is correct either way
  since it doesn't depend on parsing that event.

## Progress (2026-09-10) — full live send/stream/render cycle captured, two more bugs

The user sent a bootstrap message end-to-end against the real backend and captured the entire SSE
log (see the events dump — this is the first time this session has seen an actual, complete
transcript of the backend's event shape). Two bugs found from that one exchange, both from the
history/live-stream merge in `detail-route.tsx`, neither backend-side.

- **The whole exchange rendered twice.** `dedupeMessages`'s key was `role-timestamp-content`. The
  user's message exists as two logically-identical-but-differently-timestamped copies: the
  optimistic one pushed locally the instant `sendMessage` runs (browser `Date.now()`), and the one
  that comes back once `GET_BY_ID` history resolves (server timestamp) — the history query goes
  from disabled to enabled the moment the bootstrap flow's `onConversationCreated` swaps the URL
  from `/conversations/new` to the real id, and it can resolve either before or after the SSE
  stream finishes. Same problem hits the assistant reply once it's persisted. Because the
  timestamps never matched, dedup never recognized either pair as the same message. Fixed by
  dropping `timestamp` from the dedupe key entirely (`role-content` only) — a false-positive dedupe
  (two genuinely different messages with identical role+content) is a far rarer, lower-stakes
  failure than this was.
- **A `[Tools called: ...] [Data context: ...]` line rendered as if Flolyt said it.** Confirmed
  from the SSE log that this text is **not** part of any `response_chunk` — the actual reply starts
  clean at `"Aye"`. It's a separate row in the history array's `messages`, with a role our type
  didn't account for (`AiConversationMessage.role` only declared `"user" | "assistant"`). Given
  this is the same backend family as `flolyt-dashboard`, and `WorkflowStudio/index.tsx` explicitly
  filters `msg.role === 'context'` out of its chat messages into a separate
  `historicalReasoningSteps` array for exactly this kind of tool-call/data-context summary line,
  the role is almost certainly `"context"`. Widened the type to include it and filters it out of
  `fromHistory` before merging — v1 scope doesn't build a historical-reasoning-trace UI for it (only
  the *live* turn gets `ReasoningTrace`), so for now it's simply dropped rather than rendered as
  chat content. If a real design for showing past reasoning steps is wanted later, this is where
  those rows would be picked back up from, the same way `historicalReasoningSteps` does in the
  reference.

**Not yet re-confirmed live** — both fixed and build-verified, not yet re-tested against the real
backend in this session.

## Progress (2026-09-10) — error events weren't visually distinct, `insufficient_credits` seen live

The user hit a real `insufficient_credits` error live (captured in the SSE log — a `status`
event with `state: "error"` and a colon-prefixed code in `message`
(`"insufficient_credits:This operation requires 18 credits but you only have 9 available..."`),
followed by a proper `error` eventType event carrying the same text cleanly in `errorMessage`, no
prefix). Asked directly: "are we handling this error event type?" — yes, functionally (the `error`
case already pushed a message and stopped the stream), but it rendered as a plain gray line with a
literal `"Error: "` text prefix, indistinguishable from a normal reply — easy to miss for something
actionable like a credit top-up prompt.

- Gave error messages their own role instead of stuffing them into `"assistant"` with a string
  prefix: `AiConversationMessage.role` widened again, now `"user" | "assistant" | "context" |
  "error"` — `"error"` is local-only, pushed by the hook itself (the `error` SSE case and the
  network/fetch-failure `catch` block), never something the backend sends as a persisted role.
- `detail-route.tsx` renders `role === "error"` as its own branch: a rose-toned card
  (`border-rose-border bg-rose-bg text-rose`, this app's standard error token trio) with an
  `AlertTriangle` icon, instead of falling through to the plain-paragraph assistant branch.
- Only used `parsed.errorMessage` (clean, no prefix) from the `error` eventType — did **not** try
  to parse the colon-prefixed `status(state:"error")` event's `message` field
  (`insufficient_credits:...`), since the `error` eventType always follows it with the same text
  already clean. No credits-purchase page/route exists in this app yet
  (grepped `route.tsx`, nothing) — didn't invent a CTA button linking anywhere, just styled the
  message itself; add a "Buy credits" action once that surface exists.

Build-verified, not yet re-confirmed live.

## v3 API handoff received (2026-09-25) — supersedes the endpoint list and event vocabulary above

Backend sent a full v3 handoff doc:
[`frontend-agent-v3-handoff.md`](./frontend-agent-v3-handoff.md). This is now the authoritative
spec for this whole feature — everything above in this file describing `/api/flolyt/ai/*` and the
`tool_call`/`reasoning_step`/`response_chunk` event vocabulary was written against the old
contract and needs re-verification before it's trusted again. Old routes stay live as
**temporary legacy aliases** during migration (`Deprecation: true` header, `successor-version`
link on routes with a v3 equivalent), so nothing already built is broken today — but new or
changed work should target v3 directly.

**Biggest breaking change for what's already built here:** the current `ReasoningTrace` UI in
`detail-route.tsx` renders `tool_call` and `reasoning_step` events (added 2026-09-09, see the
"Progress" entries above). The v3 doc explicitly says *"Do not render `reasoningSteps`,
`reasoning_step`, or `tool_call` for agent runs... those legacy fields remain only for
compatibility with other application surfaces."* The v3 model replaces that trace with a
`progress` event (`progress.message` only — deliberately scrubbed of tool names, arguments, SQL,
credentials, and model reasoning) and a terminal `final_response` carrying a structured
`AgentResponseV2` (`markdown` + `findings[]`/`metrics[]`/`evidence[]`/`caveats[]`/`actions[]`), not
a plain-text `response_chunk`. `response_chunk` and `suggested_action` still exist but only as
"temporary v1 projections" for back-compat.

Other things that change once we migrate:
- Endpoint base moves `/api/flolyt/ai/*` → `/api/v3/conversations|runs|proposals|evidence/*`; add
  header `X-Flolyt-Agent-Contract: v3` on every agent request so backend telemetry attributes it
  to this client.
- `POST /api/v3/conversations/messages` keeps the same `conversationId`/`message`/`mode`/
  `interactiveReply` body shape already anticipated in this doc — no request-body change.
- The run lifecycle is now a first-class, documented resource (`GET /api/v3/runs/{runId}`,
  `.../stream`, `.../cancel`, `.../steer`) — this is the Stop/steer/reconnect "hardening" work
  this file already deferred (see [[flolyt_chat_panel_build]]'s "Not started" note); v3 gives it a
  real contract to build against instead of the old design-doc guess.
- New evidence-traversal endpoint (`GET /api/v3/evidence/{kind}/{referenceId}`) has no v1
  equivalent — entirely new surface, for rendering findings' evidence/source-resolution graph.
- New `AgentRun.execution` diagnostics block (routing kind, source resolution, knowledge
  retrieval, execution plan) — explicitly diagnostic/read-only, not to be presented as model
  reasoning or a user-editable control.

**Not building against this yet.** This entry is the "read it, don't act on it" checkpoint before
the next chat-panel work session. Re-read the full handoff doc fresh when that work starts —
don't rely on this summary alone.

## Progress (2026-09-25) — v3 endpoints, services, hooks, and types added (SSE hook/UI untouched)

First real slice of the v3 migration, scoped deliberately to endpoint plumbing only — no changes
to the SSE hook's event handling or to any rendered UI (`ReasoningTrace` still renders
`tool_call`/`reasoning_step` as before; that rework is still pending, see the section above).

- **Found and fixed a real routing bug while cross-checking, not something the doc changed:**
  `AGENT_RUNS_BASE_URL` in `apiConfig.ts` pointed at `/api/v3/command-center/runs`, which matches
  neither the v3 doc's `/api/v3/runs/{runId}` nor its documented legacy alias
  (`/api/flolyt/ai/runs/*`). Had zero callers anywhere in the app at the time, so fixing it broke
  nothing. Also added the missing `AGENT_RUNS.STREAM` route and a new `AI_EVIDENCE` block — neither
  existed before.
- **`AI_CONVERSATIONS_BASE_URL`/`AI_PROPOSALS_BASE_URL` needed no path change** — this app already
  prefixes every domain with `/api/v3/` as its own general versioning convention (`ROOMS_BASE_URL`,
  `TEAMS_BASE_URL`, etc. all do this), unrelated to the doc's "Agent API v3" naming. Only new work
  here was the header (see below).
- **New types**, split by where the shapes are actually shared rather than duplicated per file:
  `src/features/ai-conversations/agent-intelligence-types.ts` (`IntelligenceReference`,
  `ImpactStatement`, `EvidenceStatusAssessment`, `EvidenceStatus` — used by both structured
  responses and evidence traversal), `agent-response-types.ts` (`AgentResponseV2`,
  `SuggestedActionV2`, `ResponseProvenanceBundle`), `src/features/agent-runs/agent-run-types.ts`
  (`AgentRun`, `SourceResolution`, `SourceCandidateState`), `src/features/ai-evidence/ai-evidence-types.ts`
  (`CanonicalIntelligenceProjection`). Deliberately left out `PromptStateEvent`/`AgentProgressEvent`
  (the SSE-only types) — those belong to the still-deferred SSE rework, not this endpoints pass.
- **New services + hooks**, following the existing `ai-conversations`/`ai-proposals` axios+
  react-query shape (standard `{ data, messages, succeeded }` envelope, try/catch → thrown `Error`):
  `src/services/api/agent-runs/{get-agent-run,cancel-agent-run,steer-agent-run}.ts` +
  `src/features/agent-runs/use-{get,cancel,steer}-agent-run.ts`; `src/services/api/ai-evidence/get-evidence.ts`
  + `src/features/ai-evidence/use-get-evidence.ts`. All four agent-run/evidence calls send
  `X-Flolyt-Agent-Contract: v3` as a **per-call** header (not added to the shared `axiosInstance`
  globally), since the doc frames it as identifying agent-API traffic specifically, not every
  request the app makes.
- **`steerAgentRun`'s request body is a guess** — the doc never states the POST body shape for
  `/runs/{id}/steer`, only that a stored steering entry looks like `{ text, addedBy, addedAtUtc,
  consumed }`. Sending `{ text }`; flagged in a code comment. Confirm against Scalar before wiring
  any UI to this call.
- **Existing conversation types extended, additively:** `AiConversationDetailDto` gained
  `activeRunId?: string | null` (GET_BY_ID's documented reconnect field — nothing consumes it yet,
  same "capture now, wire later" pattern as `runId` before it) and `AiConversationMessage` gained
  `structuredResponse?: AgentResponseV2 | null` + `responseContractVersion?: string | null` (the
  doc says history reads and sync JSON responses expose these; nothing reads them yet either).

**Verified:** `npm run build` (`tsc -b && vite build`) and a standalone `npx tsc -b` both pass
clean, no new errors or unused-import warnings.

**Still open, deferred on purpose:** wiring any of this into the SSE hook or UI — `activeRunId`/
`structuredResponse` aren't read anywhere yet, and the run/evidence hooks have no caller. That's
the next slice, whenever it's picked up.

## Progress (2026-09-25) — SSE hook and message UI migrated to the v3 event vocabulary

Second slice of the v3 migration: `use-ai-conversation-messages.ts` now speaks the documented v3
events instead of the old `tool_call`/`reasoning_step` ones, and `detail-route.tsx` renders the
structured response's caveats/actions. The run/evidence hooks from the previous slice still have
no caller — Stop/steer buttons and a reconnect flow are separate, still-deferred work.

- **`tool_call`/`reasoning_step` cases removed outright**, not just ignored — v3 explicitly says
  not to render either for agent runs. Checked first whether this was actually the "biggest
  breaking change" flagged when the handoff doc first arrived: it's smaller in practice than
  feared, because this app's `WorkingStatus` component only ever showed a single current-activity
  line (`latestStep`'s description), never a full reasoning-trace list — there was no multi-step
  trace UI to tear out, just one derived string to re-source.
- **`progress` is now that string's source.** New `progress: AgentProgressEvent | null` hook state,
  set on the `progress` SSE case, replaces `reasoningSteps`' role in `WorkingStatus`'s subline and
  in the "is a proposal or a progress update more recent" comparison (previously compared against
  the last reasoning step's timestamp). `ReasoningStep` the type is deleted — grepped first to
  confirm it (and `reasoningSteps`/`onReasoningStep`) had exactly three callers, all touched here.
- **`final_response` now drives what actually gets stored as the assistant message.** New
  `finalResponseRef` holds the event's `structuredResponse`/`responseContractVersion` the moment
  it arrives; the existing completion path (still triggered by `state === "complete"`, unchanged)
  now prefers `structuredResponse.markdown` over the plain accumulated `response_chunk` text, and
  attaches `structuredResponse`/`responseContractVersion` onto the pushed `AiConversationMessage`.
  `response_chunk` keeps driving the live typewriter exactly as before — the doc says it carries
  "the same Markdown as the final response," so the visible text shouldn't visibly change, but the
  message now also carries the structured findings/caveats/actions data once it lands.
- **New cases, all additive, matching the doc's own descriptions:** `run_queued` (captures
  `runId` into a new `activeRunId` state — this SSE event previously had no case at all, despite a
  since-removed comment claiming it was "captured, unused"; it wasn't, actually check before
  trusting an old capture-comment), `input_request` (captured into a loosely-typed `inputRequest`
  state — the doc doesn't define this payload's shape beyond "render the choices/free-text
  control," so no UI reads it yet), `run_state` (folds `message` into `currentPhaseMessage` so a
  stray reconcile-after-reconnect event doesn't silently vanish, even with no reconnect flow built).
  `run_cancelled` stops the stream (`setIsStreaming(false)`) without pushing a message — no Stop
  button exists yet to trigger this from the UI side, but a server/other-surface cancellation
  arriving on this connection is now handled instead of falling through unmatched.
- **UI: caveats and actions**, rendered under `AiResponseRenderer` for any message carrying
  `structuredResponse`. `AiResponseCaveats` (`src/pages/conversations/ai-response/response-caveats.tsx`)
  is a plain amber `Info`-icon callout per finding's caveat, mirroring [[lifecycle_callout_info_icon]]'s
  convention. `AiResponseActions` (`.../response-actions.tsx`) renders `SuggestedActionV2[]` as
  chip-style buttons: `AskAgent` sends the label as a follow-up prompt (reuses the existing
  suggested-prompt send path); everything else resolves through a new
  `resolveSuggestedActionRoute` (`src/features/ai-conversations/map-suggested-action-target.ts`).
- **Real gap found while writing that resolver, not invented:** the doc's initial action-resource
  catalog is `segment`, `campaign`, `datasources`, `channels`, `room` — grepped `route.tsx` and only
  `room` (`/rooms/:roomId`) and `data-sources` are live top-level routes today. `segment`/`channels`
  only exist inside the archived `src/oldpages` lifecycle build; `campaign` has no route at all.
  Per the doc's own instruction ("ignore unknown resource names... never treat a label/parameter/
  model-authored text as a URL"), those three resolve to `null` and the action is hidden — same
  outcome as an actually-unknown resource, not a guess at a dead or archived page. Revisit once
  those surfaces exist live.
- **`Info` icon caveat + chip action styling is a first pass, not a validated design** — no Figma
  reference exists for this feature (per the top of this doc) and the v3 findings/metrics/evidence
  card UI the doc frames as the primary way to show structured data is explicitly **not** attempted
  here; this pass only surfaces caveats/actions since those map cleanly onto affordances this app
  already has (the Callout convention, chip-style buttons). A real findings/metrics/evidence
  presentation is separate design work, still open.

**Verified:** `npx tsc -b` and `npm run build` both clean, no new errors.
**Not verified live:** none of this has been exercised against a real streaming response yet —
whether the backend actually emits `progress`/`final_response`/`run_queued` on this connection
(as opposed to only the old `tool_call`/`reasoning_step`/`response_chunk` events it was confirmed
to send live on 2026-09-10) is unconfirmed. If it doesn't yet, this UI will just show the
generic phase fallback with no live activity text and no structured caveats/actions until the
backend's SSE payload actually catches up to the handoff doc — worth a real session to check.

**Still open, deferred on purpose:** Stop/steer buttons (the `agent-runs` hooks from the previous
slice have no caller yet), the reconnect flow (`activeRunId` on the conversation detail response
isn't read either), `input_request`'s actual choice/free-text UI, and a real findings/metrics/
evidence presentation.

## Progress (2026-09-25) — first live v3 SSE capture, one real bug found and fixed

The user ran two real sends against the live backend and captured the full event log for both —
the first live confirmation of the v3 event vocabulary itself (previous live confirmations, back
on 2026-09-09/10, only ever saw the old `tool_call`/`reasoning_step`/`response_chunk` vocabulary).

**Confirmed correct, matches what was built:**
- `run_queued` really does arrive as its own event with a bare `runId`, no `progress`/other
  fields — `activeRunId` capture works as written.
- `progress` events match the implemented `AgentProgressEvent` shape exactly (`stage`, `message`,
  `atUtc`); no `percent` field was sent, consistent with it being documented optional.
- `response_chunk`'s streamed text and `final_response.structuredResponse.markdown` were
  byte-identical in both captured exchanges — confirms the "swapping in structuredResponse.markdown
  won't visibly change the rendered text" assumption from the previous entry was correct, not just
  a guess from the doc's wording.
- The legacy `suggested_action` event fired **alongside** `final_response`, carrying the same
  action as `structuredResponse.actions[0]` in one exchange — confirms ignoring `suggested_action`
  (no case for it in the switch) was the right call: it's genuinely duplicate data, already
  covered by the richer channel, not a silently-dropped signal.

**One real bug found and fixed:** the first `progress` event of every send carries the same
internal `"conversation_id:<id>"` sentinel the `status` case already knows to filter out of
user-facing copy — but it arrives in `progress.message`, a field the `status` filter never
touches. Before this fix, the raw guid would flash in the `WorkingStatus` subline for one render
until the next `progress` event (the real "Preparing the analysis." text) overwrote it a moment
later. Fixed by skipping that specific `progress` update in the switch case
(`use-ai-conversation-messages.ts`) rather than trying to generalize the `status` case's filter.

**A second exchange also surfaced a real gap in the actions work from the previous slice** — a
live `openRoom` action whose `target.resource` was `"room"` with **no `resourceId`**, carrying
`grid`/`rowKey`/`conditionKey`/`currency` in `parameters` instead. The previous slice's
`resolveSuggestedActionRoute` fell back to the bare `/rooms` list for exactly this shape, which
would have silently discarded all four of those params and sent the user to the wrong place
(worse than not showing a button at all). Fixed by removing that fallback — full detail, including
the live payload, is in the new reference section below. Also caught: the live `kind` value was
`"openRoom"` (camelCase), not the doc's documented `"OpenRoom"` (PascalCase) — harmless today since
resolution keys off `target.resource`, not `kind`, but `SuggestedActionV2["kind"]` was widened to
accept any string rather than assert a casing that's now known to be unconfirmed.

**Verified:** `npx tsc -b` clean after all three fixes.
**Still not exercised live:** Stop/steer/reconnect (no caller yet), `input_request` (no live
example seen yet either — both captured exchanges completed without one), and the actual New Room
wizard prefill that would make the `openRoom`-without-`resourceId` action work end to end.

## Reference: action-resource routing (`SuggestedActionV2`) — what resolves and what doesn't

Kept as its own lookup section (not buried in a dated entry above) since this is exactly the kind
of thing worth checking back on before touching `AiResponseActions`
(`src/pages/conversations/ai-response/response-actions.tsx`) or `resolveSuggestedActionRoute`
(`src/features/ai-conversations/map-suggested-action-target.ts`) again.

**Resolves to a real page today:**
- `resource: "datasources"` → `/data-sources`, always (no `resourceId` needed).
- `resource: "room"` **with a `resourceId`** → `/rooms/{resourceId}`.

**Hidden — no live destination, or not enough information to build one. Not a guess:**
- `resource: "segment"` / `"channels"` — no live top-level route. Both exist only inside the
  archived `src/oldpages` lifecycle build (`stage-tabs-config.ts`'s `segments`/`channels` tabs).
  Needs a real live page for either before this can resolve to anything.
- `resource: "campaign"` — no route at all anywhere in `route.tsx`. Same: needs a real page first.
- `resource: "room"` **without a `resourceId`** — confirmed live 2026-09-25 that the backend sends
  exactly this shape for an "open a room from a leak" suggestion:
  ```json
  {
    "id": "rooms.open_from_leak",
    "kind": "openRoom",
    "label": "Open or join a room on flolyt intelligence — second-purchase window · churn risk",
    "target": { "resource": "room" },
    "parameters": { "grid": "segment", "rowKey": "<guid>", "conditionKey": "churn_risk", "currency": "NGN" },
    "eligibility": { "eligible": true, "requiredCapabilities": ["open_room_on_leak"] }
  }
  ```
  There's no id to link to — the real identifying info lives in `parameters`. Those four fields
  line up with the **New Room wizard**'s Step 1 condition
  (`src/pages/rooms/new/step-condition.tsx`, a `{ title, conditionKey }` value) and Step 2 audience
  rules (`RoomSegmentRuleInput`, `src/services/api/rooms/estimate-new-room-cohort.ts`), not a plain
  route. Building this for real means the wizard (`src/pages/rooms/new/index.tsx`) accepting these
  four params as one-shot prefill data (distinct from [[url_param_over_state_for_page_flow]], which
  is about *step position*, not initial field values — likely still nav `state`, not a query
  param) and seeding `StepCondition`/`StepAudience`'s initial values from them. Until that exists,
  this shape is hidden rather than linked to the bare `/rooms` list, which would silently discard
  all four params — a wrong destination is worse than no button.
- **`kind` doesn't reliably match the handoff doc's enum** — the doc lists `'OpenRecord' |
  'OpenWorkspaceSurface' | 'OpenRoom' | 'ConnectSource' | 'AskAgent'` (PascalCase); the live payload
  above sent `"openRoom"` (camelCase). Resolution keys off `target.resource`, not `kind` (except
  the `AskAgent` special case), so this hasn't broken anything — `SuggestedActionV2["kind"]` was
  just widened to accept any string. Don't tighten it back to the doc's literal union without
  re-confirming real casing live first.

## Progress (2026-09-25) — Stop, steer, and reconnect wired

Third slice: the `agent-runs` hooks built earlier now have callers. All three share one thing —
the SSE event-handling switch used to live only inside `sendMessage`, and reconnect needed the
exact same handling a second time for a GET stream instead of a POST one. Rather than duplicate
it, `use-ai-conversation-messages.ts` was split into:
- `dispatchStreamEvent(parsed, resolvedEventType)` — the switch itself, now returning `true` for a
  terminal event (`error`, `run_cancelled`) instead of `return`-ing out of a shared loop it no
  longer owns directly.
- `consumeStream(response)` — the chunk-read/buffer/parse loop, calling `dispatchStreamEvent` per
  event and stopping when it returns `true` or `state === "complete"` finishes the message.
- `sendMessage` and the new `reconnectRun` both just build their own request (POST vs. GET,
  different URL) and hand the `Response` to `consumeStream` — no other logic duplicated.

**Reconnect** (`reconnectRun(runId)` in the hook, wired in `detail-route.tsx`): on loading an
existing conversation, reads `history.data.activeRunId`; if present, fetches `GET
/api/v3/runs/{id}` via the already-built `useGetAgentRun`, and only opens the run's own stream
(`GET /api/v3/runs/{id}/stream`) when its status is `queued`/`running`/`awaiting_approval` — a
`done`/`failed`/`cancelled` run needs no reconnect, its message is already in the persisted
history. Guarded against re-firing for the same runId (`reconnectedRunIdRef`, same idiom as the
bootstrap-token guard already in this file) and against double-connecting over a send already
streaming live in this tab (`!isStreaming`). `reconnectRun` sets `activeRunId` directly from its
argument rather than waiting on a `run_queued` event — confirmed by reading the stream contract
that reopening an existing run's stream doesn't re-emit `run_queued`, so waiting for one would
mean Stop/steer never becoming available after a reconnect.

**Stop**: a small "Stop" chip next to the working-status line while `activeRunId` exists. Calls
`useCancelAgentRun().cancelRun(activeRunId)` (the documented "request cancellation" — doesn't
promise the run stops instantly) **and** the hook's own `abortStream()` in the same click, so the
local UI stops immediately rather than waiting for a `run_cancelled` event to round-trip back.

**Steer**: a second chip toggles a one-line inline input (Escape to cancel) that calls
`useSteerAgentRun().steerRun({ runId, text })`. **Still unverified:** the request body shape —
flagged when the service was first built and still true now that it has a real caller — the
handoff doc never states `/runs/{id}/steer`'s POST body, only the stored `steering[].text` shape;
sending `{ text }` is inferred, not confirmed. Watch the first live steer attempt for a 4xx.

**Verified:** `npx tsc -b` and `npm run build` both clean.
**Not verified live:** none of Stop/steer/reconnect has been exercised against the real backend
yet — no run has lasted long enough in a live session to click Stop, no reconnect scenario (kill
the page mid-run, reopen) has been tried, and steer's body shape is still a guess. All three need
a real session to confirm.

## Correction (2026-09-26) — Stop moved onto the composer's send button

First pass put Stop as its own chip next to the working-status line, alongside the "Add a note"
steer chip. Flagged as the wrong affordance — Claude's own chat UI (screenshot supplied) puts stop
in the send button's own spot: the same control that sends a message becomes the stop button in
place once one is streaming, not a separate control elsewhere. Corrected:

- The composer's send button (`ArrowUp` in `detail-route.tsx`) now does double duty — `onClick`
  switches between `handleSend`/`handleStop` and the icon between `ArrowUp`/`Square` based on
  `isStreaming`, styled `bg-ink` while in stop mode. Removed the standalone Stop chip entirely.
  Steer's "Add a note" chip stays where it was — it's a genuinely separate action, not another way
  to stop, so it wasn't part of what was wrong.
- **`handleStop` also had a latent bug this surfaced:** it required `activeRunId` to be set before
  doing anything, so clicking it in the brief window between hitting send and the `run_queued`
  event arriving would silently no-op — the button would look clickable but do nothing. Fixed to
  always call `abortStream()` (the local stop) unconditionally first, and only call the server-side
  `cancelRun` when `activeRunId` happens to be known yet. Matches the reference UI's stop button,
  which responds the instant it's clicked regardless of server-side state.

**Verified:** `npx tsc -b` + `npm run build` clean. **Not verified live** — same as the rest of
this slice, still needs a real click during an actual streaming response.
