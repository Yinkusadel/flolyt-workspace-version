# Archived pages

Everything under here was pulled out of `src/pages` for the redesign that made
the conversation/chat screen the new home. None of it is wired into
`src/route/route.tsx` — it's dead code, kept only so a section can be
restored on request instead of rebuilt.

## What's here

- `everyday/lifecycle`, `everyday/goals`, `everyday/what-to-do-today`,
  `everyday/digest`, `everyday/inbox`, `everyday/handoff`
- `revenue/*` (leakage-map, funnel, scenario, value, forecast, attribution, benchmarks)
- `customers/*` (segments, customer-health, campaigns, experiments, replies)
- `knowledge/*` (business-memory, playbooks, community, recognition)
- `agents/*` (ai-teammates, marketplace, governance, agent-builder, agent-detail)
- `data/*` (data-sources, data-health, schema, identity)
- `home.tsx` — the old dynamic dashboard placeholder that used to sit at `/`

## What stayed live (in `src/pages`)

`auth`, `onboarding`, `teams`, `plan-and-billing` and `conversations` (now home).
`rooms` stayed live at first, then was archived too on 2026-10-10 (see below).

## Shared code that got pulled out before the move

A handful of files inside `lifecycle` turned out to be load-bearing for Rooms,
onboarding, and other kept pages, not lifecycle-specific. These were
relocated (not archived) so kept pages don't depend on this folder:

| Old location (`lifecycle/...`)   | New home                               |
| --------------------------------- | --------------------------------------- |
| `stage/chip.tsx`                  | `src/components/ui/chip.tsx`            |
| `stage/kpi-cards.tsx`             | `src/components/ui/kpi-cards.tsx`       |
| `stage/stage-subpage-header.tsx`  | `src/components/ui/stage-subpage-header.tsx` |
| `stage/rail.tsx` (`Callout`, progress rail) | `src/components/ui/rail.tsx`  |
| `stage-rail.tsx`'s `InfoTooltip`  | `src/components/ui/info-tooltip.tsx` (the rest of `stage-rail.tsx`, `StageRail`, stayed archived) |
| `data.ts` (stage taxonomy, `DEPARTMENT_COLORS`) | `src/lib/lifecycle-data.ts` |
| `format-measured-value.ts`        | `src/lib/format-measured-value.ts`      |

If you restore Lifecycle, point it at these shared locations rather than
copying the files back — kept pages (Rooms especially) now depend on them
living there.

Rooms' "Create handoffs from a decision" modal
(`pages/rooms/room/workspace/create-from-decision-modal.tsx`) was also
duplicated out of the archived Handoff section into a small, self-contained
copy (own `TeamDot`, own mock obligations list) so Rooms didn't need to
depend on `oldpages/everyday/handoff`.

## Restoring a section

1. `git mv src/oldpages/<path> src/pages/<path>`
2. Re-add its routes to `src/route/route.tsx` (check git history for this
   file from before this redesign for the exact route tree).
3. Re-add its nav entry to `NAV_SECTIONS` in `src/components/sidebar.tsx`.
4. If it references any of the shared files in the table above, point it at
   the new `@/components/ui/...` / `@/lib/...` path, not the old
   `@/oldpages/...` one.

## Leakage Map V2 first build (archived 2026-10-04)

`revenue/leakage-map-v2-first-build/` is the first V2-wired Leakage Map page
(the one that stacked one amount per currency per market and fell apart with
multiple markets). Archived for the from-scratch rebuild at
`src/pages/leakage-map`; `src/features/leakage/*` hooks stayed live. Its
imports were repointed to `@/oldpages/revenue/leakage-map-v2-first-build/...`.
See `docs/leakage-map/v3-rebuild-plan.md`.

## Rooms (archived 2026-10-10)

The whole Rooms section (`oldpages/rooms`: the wired index, subscriptions, the new-room wizard,
plays-at-scale, and the mock Room detail pages with their Decision/Evidence/Log workspace) moved
here when Rooms started being rebuilt from the new design in
`flolyt-figma-designs/New-pages-pattern/Flolyt Rooms-png/`, one section at a time. Plan and order:
`docs/rooms/revenue-threat-room-build-plan.md`.

Live now at `/rooms` and `/rooms/:roomId` are only small "being rebuilt" stubs
(`src/pages/rooms/index.tsx`). The routes `/rooms/new`, `/rooms/subscriptions` and `/plays` were
removed. The services and hooks (`src/services/api/rooms`, `src/features/rooms`) stayed live.

Shared helpers that Rooms used and other pages borrowed were moved out first:
`src/lib/initials.ts`, `src/lib/format-activity.ts`, `src/lib/actor-types.ts`.

Copy sections back from here where they fit, instead of restoring the folder wholesale.
