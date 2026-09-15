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

## Carousel: wired, then reverted to mock

`useGetHome()` (`GET /home`) was briefly wired into `home-carousel.tsx`, replacing the three
hand-authored illustrative cards (`PastWeekCard`, `NeedsYouCard`, `EarlierRoomsCard`) with one
generic `HomeCardSlide` rendered per item in the real `cards[]` array. **Reverted 2026-09-15 at the
requester's call** — `home-carousel.tsx` is back to the original mocked 3-card version
(`git show HEAD:src/pages/conversations/home-carousel.tsx` before this pass, restored via
`git checkout`). Keeping the findings from that attempt here since they're still true of the real
endpoint and matter whenever this gets picked back up:

- The old mocked cards assumed shapes (an aggregate stat grid, a bundled "3 things need you" list)
  that don't exist in the real response — the API is a flat, individually-titled stream of
  actions/notifications, not a pre-aggregated summary. A generic per-card renderer is the right
  fit for it, not a simplification of the mock's design.
- **Not capped at 3.** A real pull on 2026-09-15 returned 20 cards — any future wiring needs a
  carousel that scales past 3, not a fixed 3-slot layout.
- Some `href` values on real cards don't resolve to routes in this app right now:
  `/digest?date=...`, `/data-platform/datasources/{id}`, and `/settings/billing/credits` are all
  absent from `src/route/route.tsx` — digest and data-platform were parked in `src/oldpages` during
  the rooms-first-home redesign (see [[flolyt_archived_sections_note]]), and billing lives at the
  flat `/plan-and-billing`, not under `/settings/*`. `/inbox` and room/conversation hrefs do
  resolve. Whoever wires this next should render `href` verbatim (don't guess a replacement
  client-side) and flag the mismatch per [[flag_unreachable_routes]] rather than silently
  patching it — this needs either the backend pointing those card kinds at real routes, or the
  frontend building out `/digest` and a settings/billing area.

## Not in scope for this pass

- No click-to-select UI for individual `/home/prompts` suggestions — the composer only uses their
  `text` for the placeholder cycle. Each prompt also carries `intent`/`because`/`context`, unused
  here; wiring a suggestion-chip UI that submits one directly would be a separate, explicitly
  scoped feature.
- No `window` param control on `GET /home` (30/90/180/365) — always fetched with the server
  default. No UI existed for this before and none was requested.
