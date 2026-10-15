# Home page — build plan

Wired 2026-09-15. The home page is `NewConversationRoute`
(`src/pages/conversations/new-conversation-route.tsx`, mounted at `/` and `/new-conversation` —
there is no `src/pages/home/`, see [[flolyt_flat_url_pattern]] for why routes don't nest under a
`home/` prefix). Endpoints documented and scaffolded in commit `69abaad`; this pass wires them into
the two components that were still on mock data. See [app-shell.md](../endpoints/app-shell.md) for
the endpoint contracts.

## What's wired

- **Greeting + composer placeholders** — `useGetHomePrompts()` (`GET /home/prompts`) feeds both
  the `<h1>` greeting and the typewriter phrases cycling through the composer's placeholder. This
  replaces the static `"What can I do for you?"` heading and the borrowed
  `MAPPING_QUESTIONS` (onboarding's example-question list) that the placeholder used to reuse.
  `GET /home/greeting` is **not** called from this screen — its own doc says `/home/prompts`
  already returns the same greeting, so calling both would be redundant. The greeting hook
  (`useGetHomeGreeting`) stays scaffolded but unused; that's intentional, not an oversight.
  - Loading: `<h1>` becomes a `Skeleton`; the placeholder overlay renders nothing (no borrowed
    copy standing in for real suggestions).
  - Error: heading falls back to the old static "What can I do for you?" copy (never a fake
    personalized greeting) with an inline "Couldn't load your suggestions — Retry" affordance; the
    composer itself stays fully usable either way.

## Carousel: wired 2026-09-17, on the corrected `guarded`/`facts`/`cards` shape

`useGetHome()` (`GET /home`) is wired into `home-carousel.tsx`. History, because it took three
passes to land here:

1. **2026-09-15** — briefly wired as one generic slide per raw `cards[]` entry, then reverted: a
   naive per-card render turned a workspace with a handful of conceptual groups into 10+ separate
   carousel slides.
2. **2026-09-16** — re-wired with `cards[]` grouped client-side into three panels, guessing a
   "business state" bucket from `cards[].figures.length > 0` since `GET /home`'s documented shape
   at the time was only `{ window, revenueModel, cards, refreshedAtUtc }` — no field existed yet
   for business-level money. That guess degraded gracefully (every real card had `figures: []`, so
   the guessed panel just never rendered) but was never actually correct.
3. **2026-09-17** — the real Scalar spec for this endpoint turned out to document two more
   top-level fields, `guarded` and `facts`, that were missing from the docs this pass had been
   built against. Money never lived on `cards[]` at all — it lives on these two. Corrected by
   reverting `home-carousel.tsx` to its pre-wiring mock (`git restore`) and rebuilding from that
   shape, since the original hand-authored mock cards turn out to map almost exactly onto the real
   fields:
   - `PastWeekCard` → **`GuardedCard`**, wired to `guarded` — kept the original mock's 3-column
     stat grid (PRESERVED / ROOMS / FOR YOU): PRESERVED is `preserved`, ROOMS is `roomsClosed`
     (`roomsOpen` isn't surfaced — no slot for it in the 3-stat design, and the user asked to keep
     it at 3 rather than grow to a 2×2 with an OPEN stat), FOR YOU is `decisionsWaitingOnYou`.
     Below the grid, a one-line summary (`"{decisionsWaitingOnYou} decision(s) waiting on you"`,
     shown only when > 0) replaces the original mock's hand-authored "1 approval waiting · Room
     2471, you are the named approver" line — the real `guarded` shape has no per-approval detail
     (which room, who's the approver) to back a line that specific, only the count. Then a
     scrollable biggest-exposure list linking to `/rooms/{roomId}` when one is given.
   - `RevenueFactsCard` → **`FactsCard`**, wired to `facts[]`. Each fact's "Ask about this" button
     navigates to `/conversations/new` with `state: { bootstrapToken: crypto.randomUUID(),
     prompt: fact.question }` — the exact pattern `NewConversationRoute.handleSubmit` uses for the
     composer itself, live-verified end to end (click → new conversation → agent starts working on
     the fact's own `question` text).
   - `NeedsYouCard` → unchanged in spirit, now built on a shared `CardListPanel`, still grouped
     from `cards[]` by `kind` (`"action"` → needs you) via the shared
     `splitHomeCardsByKind()` helper (`src/features/home/group-home-cards.ts`).

One carousel slide per part: `guarded` **always** shown (it's a fixed summary object, not a match
count — zeros/`"—"` render rather than the slide disappearing), `facts` and the needs-you
`cards[]` group skipped when empty (so 1-3 slides depending on the account). Every list shows
*every* item in its group — no cap, no "+N more" link to a generic destination — inside an
`overflow-y-auto` region that scrolls within the card's fixed height while the
eyebrow/headline/footer stay put. A `cards[]` row's title is the click target (styled per
[[link_hover_convention]]) when it has an `href`; rows with `href: null` render as plain text.

**2026-09-17, later same day: workspace notifications moved out of the carousel entirely.** The
other half of `cards[]` (`kind !== "action"` — what the workspace has been told, not what waits on
you) no longer has its own carousel slide. Per the user's direction, it's a **topbar notification
bell** (`NotificationBell`, `src/components/notification-bell.tsx`) instead — a `Bell` icon button
placed left of `UserMenu` in `topbar.tsx`, with a small unread dot (`bg-ultra`) shown when the
workspace group is non-empty. Clicking it opens a `DropdownMenu` with the same scrollable,
uncapped list the old `WorkspaceCard` panel had, plus a "Manage data sources" footer link to
`/data-sources`. Both surfaces share `splitHomeCardsByKind()` so the needs-you/workspace split
can't drift between them. This makes workspace updates reachable from **every** screen (verified
live from `/rooms`, not just `/`), where the carousel only ever existed on the home route. Same
`useGetHome()` query key across both call sites, so React Query dedupes the network request —
this isn't a second `GET /home` call, just a second reader of the same cached result.

Three real bugs surfaced by the live pull below and fixed before calling this done:

- **Content overflow, root cause.** The card frame's clip/scroll chain relies on `h-full` /
  `flex-1` resolving against a parent with a *definite* height, all the way up to the
  absolutely-positioned slide div (explicit inline `style={{ height: CARD_HEIGHT }}`). The slide
  renders its content through an extra wrapper div added only to hold the inactive-card
  `pointer-events-none` class
  (`<div className={cn(!isActive && "pointer-events-none")}>` in `home-carousel.tsx`) — that
  wrapper had no height class of its own, so it computed as `height: auto`. Per CSS, a percentage
  height (`h-full` = `height: 100%`) resolves against its *direct* parent, and against an
  `auto`-height parent it itself computes as `auto` — so the whole frame below it silently grew to
  fit content (measured 1173px against a 336px card) instead of clipping/scrolling at all. First
  two attempts at this (adding `overflow-hidden`/`line-clamp`, then flattening a redundant nested
  flex div) treated symptoms and didn't fix it, confirmed each time via
  `getBoundingClientRect`/`scrollHeight` diagnostics, not just a screenshot. The actual fix is one
  line — `h-full` added to that wrapper div — verified after with the same diagnostics
  (`frameRoot` height 334px matching the card, list `clientHeight` 178 vs `scrollHeight` 1018,
  i.e. genuinely clipped and scrollable).
- **Initial "cap + more link" design was the wrong call.** Before landing on scrolling, an earlier
  version capped each panel to 2-3 shown items with a "+N more" link to the panel's fixed footer
  destination — flagged by the user as hiding real items behind a link that "just routes
  anywhere" rather than to those specific items. Replaced with the scrollable list above; nothing
  is hidden.
- **Duplicate React keys.** `card.key` looked like a per-card id but is actually a *category* key
  — every action card in the real response carried `key: "decision"` and every notification card
  carried `key: "system"`, so keying rows on it collided (`console.error` on both real groups).
  Fixed by keying on `card.sourceId` (falls back to `` `${card.key}-${card.asOfUtc}` `` for the
  rare null case), which the real payload confirmed is actually unique per card.

**Live-verified 2026-09-17** (`ichigo@yopmail.com`, real pull, dev server on port 3000 per
[[flolyt_dev_server_port_3000]]):

- All four panels rendered correctly: `guarded` showed `PAST 30 DAYS`, `"—"` for `preserved`
  (empty array that pull) and real `0`/`0`/`2` for closed/open/decisions-waiting, with the
  biggest-exposure section correctly omitted (empty array) rather than shown blank. `facts` had
  exactly one entry (`"Nobody has said what counts as revenue here, so none of it is measured"`),
  `cards[]` split into 2 needs-you / 18 workspace exactly as the 2026-09-16 pull did.
- **`facts[].context` came back as `null` itself**, not an object with null sub-fields — the type
  in `get-home.ts` was `HomeFactContext` (non-nullable) and had to become
  `HomeFactContext | null`. Caught from the real payload, not exercised by any UI yet (`context`
  isn't rendered), but left wrong would have been a landmine for whoever wires it next.
- The "Ask about this" flow was clicked end to end: navigates to `/conversations/new`, the fact's
  own `question` text appears as the first message, and the agent starts responding — confirms the
  `bootstrapToken`/`prompt` nav-state contract actually round-trips through that route, not just
  that the `navigate()` call was reached.
- `kind` was exactly `"action"` (2 cards, both `figures: []`) or `"notification"` (18 cards) — the
  action/needs-you and notification/workspace split held exactly as assumed, no third `kind`
  observed.
- **`href` values that don't resolve to a route in this app** — rendered verbatim per
  [[flag_unreachable_routes]] rather than guessed at client-side, same call as the reverted pass.
  Previously known: `/digest?date=...`, `/data-platform/datasources/{id}`,
  `/settings/billing/credits`. **New from this pull:** `/intelligence/suggested-actions`,
  `/analytics`, `/customers` are also absent from `src/route/route.tsx`, and there is **no
  catch-all `*` route** in this app — clicking one of these renders a blank outlet rather than a
  404 page. `/inbox` resolves and is the most common `href` seen. This needs either the backend
  pointing these card kinds at real routes, or the frontend building out `/digest`,
  `/intelligence`, `/analytics`, `/customers`, and a settings/billing area (plus a catch-all route
  either way) — flagging per [[flag_unreachable_routes]] rather than fixing silently.

## Not in scope for this pass

- No click-to-select UI for individual `/home/prompts` suggestions — the composer only uses their
  `text` for the placeholder cycle. Each prompt also carries `intent`/`because`/`context`, unused
  here; wiring a suggestion-chip UI that submits one directly would be a separate, explicitly
  scoped feature.
- No `window` param control on `GET /home` (30/90/180/365) — always fetched with the server
  default. No UI existed for this before and none was requested.
