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
