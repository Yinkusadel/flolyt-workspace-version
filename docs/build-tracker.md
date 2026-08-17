# Flolyt build tracker

Source of truth for design: `flolyt-kit-122/README.md` (kit overview + section table) and
`flolyt-kit-122/{nn}-{slug}.svg` (one SVG per screen, numbered to match the `#` column
below) — **except section 3 (the lifecycle)**, which was rebuilt from the newer
`flolyt-figma-designs/flolyt-lifecycle/` export; see that section's own header for its
source-of-truth note.

Update this file as we go: flip `Status` when a screen's implementation starts/lands, fill
`Endpoint(s)` with the service/hook file(s) built for it, and use `Notes` for corrections
the user makes to the Figma/kit so we don't lose them between sessions.

**Status legend:** `[ ]` not started · `[~]` in progress · `[x]` built · `[!]` needs
correction (see Notes)

---

## 1. Getting started (01–09)

| # | Screen | Status | Endpoint(s) | Notes |
|---|---|---|---|---|
| 01 | sign up | [ ] | | |
| 02 | sign in | [x] | `services/api/auth/sign-in.ts`, `features/auth/use-sign-in.ts` | Built email+password (matches existing hook), not the SVG's magic-link/SSO flow — see user decision in session |
| 03 | create workspace | [ ] | | |
| 04 | business model | [ ] | | |
| 05 | connect first source | [ ] | | |
| 06 | source connected | [ ] | | |
| 07 | meet your agents | [ ] | | |
| 08 | invite team and roles | [ ] | | |
| 09 | workspace first run | [ ] | | |

## 2. Every day (10–14)

| # | Screen | Status | Endpoint(s) | Notes |
|---|---|---|---|---|
| 10 | command bar | [ ] | | |
| 11 | workspace home consumer | [ ] | | |
| 12 | workspace home accounts | [ ] | | |
| 13 | inbox | [ ] | | |
| 14 | search | [ ] | | |

## 3. The lifecycle

**Rebuilt from `flolyt-figma-designs/flolyt-lifecycle/`** (139 SVGs), replacing the old
kit-122-based section entirely — each stage went from one flat overview page to a
multi-tab mini-app. Every SVG's footer states its own route (e.g.
`A14 · Acquire · history` → `/lifecycle/:stage/history`), which is what the rows below are
keyed to. See the rebuild plan for the full architecture (shared `StageLayout` +
`StageTabsLayout`, one `data.ts` per stage, generic `:id` drilldown template, 12 action
modals). Acquire is the completed reference stage; the remaining 10 stages reuse its
shared tabs/layout/modals and need only their own `data.ts` + 1-3 unique tabs each.

### Shared architecture (all stages route through this)

| Piece | Status | Notes |
|---|---|---|
| `:stage`-param route tree (`route.tsx`) | [x] | Collapsed the old 11 flat routes into one parameterized subtree, mirroring `:roomId` |
| `StageLayout` / `StageTabsLayout` / `StageSubpageHeader` | [x] | `src/pages/lifecycle/stage/{layout,stage-tabs-layout,stage-subpage-header}.tsx` |
| Shared tab templates: Overview, Cohorts, Markets, What changed, Agents, History | [x] | One component each, resolve per-stage data via `stage.slug`, wired for Acquire + Activate + Price + Adopt. Cohorts/Markets dispatch to per-stage components (`stage/activate/{cohorts,markets}-tab.tsx`, `stage/price/{cohorts,markets}-tab.tsx`, `stage/adopt/{cohorts,markets}-tab.tsx`) when a stage's own column set doesn't match the Acquire-shaped template — confirmed necessary by reading AC06/AC07/PR07/PR08/AD07/AD08 directly, not assumed. Agents/History/Changes templates gained small additive extensions (agent cards without an avatar, a "blocked" threshold status, a second closing callout, a per-stage closing-callout tone) to fit Price/Adopt without forking them |
| Shared Compare-periods route | [x] | `stage/compare/compare-route.tsx` — own header, no tab bar. `buildEyebrow`/`buildRows` are now optional (Activate's AC12, Price's PR12, and Adopt's AD12 have no "how this comparison is built" section) |
| Shared Definition route/editor | [x] | `stage/definition/definition-route.tsx` — built for Activate (AC01), serves any future stage via a `Record<slug, DefinitionData>` lookup the same way Overview does. Price's PR01 and Adopt's AD01 each dispatch to their own `stage/<slug>/definition-route.tsx` instead — both have a second section that isn't the shared verdict-comparison table (a needs-vs-has checklist for Price, a feature-count breakdown for Adopt) |
| Generic `:id` detail-drilldown template | [x] | `stage/detail/detail-drilldown.tsx`, proven via Acquire's `channels/:id` and Price's `plans/:id`. Adopt's `features/:id` (AD04) dispatches to its own bespoke `stage/adopt/feature-detail-route.tsx` instead — a friction bar-chart + outcomes table, not a checked-rows table + action cards |
| Shared modals: set-a-threshold, map-a-field, open-a-room, share-or-export | [x] | `stage/modals/` — stage-generic, take stage data as props |
| Lifecycle map (`LC02`) | [x] | `lifecycle/index.tsx` — stage rail + root-cause table; ownership table moved to its own settings page |
| Lifecycle map first-run empty state (`LC01`) / market filter (`LC05`) | [ ] | Not wired — no demo stage is currently undefined and `?market=` isn't read yet |
| Stage ownership settings page (`LC04`) | [x] | `/lifecycle/settings` — relocated `OwnershipTable`, content unchanged |
| "Whole chain" screen (`CH13`) | [x] | `/lifecycle/churn/chain`, linked from the map's root-cause callout |

### Acquire — complete (reference stage)

| Screen | Route | Status |
|---|---|---|
| Overview (+ not-defined empty state) | `/lifecycle/acquire` | [x] |
| Funnel | `/lifecycle/acquire/funnel` | [x] |
| Channels | `/lifecycle/acquire/channels` | [x] |
| One channel | `/lifecycle/acquire/channels/:id` | [x] |
| Cohorts | `/lifecycle/acquire/cohorts` | [x] |
| Unit economics | `/lifecycle/acquire/unit-economics` | [x] |
| Markets | `/lifecycle/acquire/markets` | [x] |
| What changed | `/lifecycle/acquire/changes` | [x] |
| Agents | `/lifecycle/acquire/agents` | [x] |
| History | `/lifecycle/acquire/history` | [x] |
| Compare periods | `/lifecycle/acquire/compare` | [x] |
| Set a threshold / Map a field / Open a room / Share or export (modals) | — | [x] |

### Activate — complete

| Screen | Route | Status |
|---|---|---|
| Definition | `/lifecycle/activate/definition` | [x] |
| Overview | `/lifecycle/activate` | [x] |
| Time to value | `/lifecycle/activate/time-to-value` | [x] |
| Paths | `/lifecycle/activate/paths` | [x] |
| One path | `/lifecycle/activate/paths/:id` | [x] |
| Cohorts | `/lifecycle/activate/cohorts` | [x] | stage-specific layout, see shared-architecture row above |
| Markets | `/lifecycle/activate/markets` | [x] | stage-specific layout, see shared-architecture row above |
| What changed | `/lifecycle/activate/changes` | [x] |
| Release impact (one change) | `/lifecycle/activate/changes/:id` | [x] | custom layout (before/after window + cross-stage impact table), not the generic `:id` drilldown template — AC09's shape didn't fit it |
| Agents | `/lifecycle/activate/agents` | [x] |
| History | `/lifecycle/activate/history` | [x] |
| Compare periods | `/lifecycle/activate/compare` | [x] |
| Open a war room (modal) | — | [x] | AC13, scoped to the guest-checkout path detail |

### Price — complete

| Screen | Route | Status |
|---|---|---|
| Definition | `/lifecycle/price/definition` | [x] | stage-specific layout — PR01 swaps the shared verdict-comparison table for a needs-vs-has checklist, see `stage/price/definition-route.tsx` |
| Overview | `/lifecycle/price` | [x] |
| Plans | `/lifecycle/price/plans` | [x] |
| One plan | `/lifecycle/price/plans/:id` | [x] | only `legacy-unlimited` has drilldown data, per PR04 |
| Margin | `/lifecycle/price/margin` | [x] | unique tab, entirely blocked on COGS |
| Discounting | `/lifecycle/price/discounting` | [x] | unique tab |
| Cohorts | `/lifecycle/price/cohorts` | [x] | stage-specific layout, see shared-architecture row above |
| Markets | `/lifecycle/price/markets` | [x] | stage-specific layout, see shared-architecture row above |
| What changed | `/lifecycle/price/changes` | [x] | shared template extended with an optional second closing callout for PR09's two distinct findings |
| Agents | `/lifecycle/price/agents` | [x] | shared template extended with a "blocked" threshold status and avatar-less agent cards |
| History | `/lifecycle/price/history` | [x] |
| Compare periods | `/lifecycle/price/compare` | [x] |
| Connect a COGS source (modal) | — | [x] | PR13, opens from the Margin tab's header CTA |

### Adopt — complete

| Screen | Route | Status |
|---|---|---|
| Definition | `/lifecycle/adopt/definition` | [x] | stage-specific layout — AD01's verdict table breaks down retention by feature count (0-4+), not a candidate-signal comparison, see `stage/adopt/definition-route.tsx` |
| Overview | `/lifecycle/adopt` | [x] |
| Features | `/lifecycle/adopt/features` | [x] |
| One feature | `/lifecycle/adopt/features/:id` | [x] | bespoke drilldown (friction bar-chart + outcomes table), not the generic DetailDrilldown template — only `scheduled-delivery` has drilldown data, per AD04 |
| Depth | `/lifecycle/adopt/depth` | [x] | unique tab |
| Not instrumented | `/lifecycle/adopt/blind-spots` | [x] | unique tab; route path is `blind-spots` per AD06's own footer even though the tab label reads "Not instrumented" |
| Cohorts | `/lifecycle/adopt/cohorts` | [x] | stage-specific layout, see shared-architecture row above |
| Markets | `/lifecycle/adopt/markets` | [x] | stage-specific layout, see shared-architecture row above |
| What changed | `/lifecycle/adopt/changes` | [x] |
| Agents | `/lifecycle/adopt/agents` | [x] |
| History | `/lifecycle/adopt/history` | [x] | shared template extended with a per-stage closing-callout tone (Acquire/Activate are ultra, Price is amber, Adopt is rose) — fixes a fidelity gap where Price's own closing banner was previously hardcoded to the wrong tone |
| Compare periods | `/lifecycle/adopt/compare` | [x] |
| Request instrumentation (modal) | — | [x] | AD13, opens from the Not instrumented tab's header CTA |

### Remaining 7 stages — not started

Each needs: `stage/<slug>/data.ts`, its 1-3 unique tabs, its `:id` drilldown wiring where it
has a list-style tab, and its one stage-specific modal where applicable. The shared tabs/
layout/modals above are already done, so each stage is materially smaller than Acquire
was. Verify each stage's Cohorts/Markets/Changes/Agents/History/Definition screens against
their own SVGs before assuming the shared templates fit unmodified — Activate's Cohorts/
Markets, Price's Definition, and Adopt's Definition/one-feature drilldown did not (see
shared-architecture row above).

| Stage | Status | Notes |
|---|---|---|
| Retain | [ ] | |
| Expand | [ ] | |
| Support | [ ] | |
| Renew | [ ] | |
| Advocate | [ ] | |
| Churn | [ ] | Also owns `/lifecycle/churn/chain` (CH13, already built above) |

## 4. Rooms and decisions (27–35)

| # | Screen | Status | Endpoint(s) | Notes |
|---|---|---|---|---|
| 27 | room cohort war room | [x] | | `/rooms/second-order-never-happened`. Static mock data in `src/pages/rooms/data.ts` |
| 28 | room account war room | [x] | | `/rooms/northwind-retail` — not linked from the Rooms index (see note below) |
| 29 | room evidence tab | [x] | | `/rooms/:roomId/evidence`, shared across war-room and persistent kinds |
| 30 | room log tab | [x] | | `/rooms/:roomId/log` |
| 31 | room account persistent | [x] | | `/rooms/northwind-retail-persistent` — not linked from the Rooms index |
| 32 | room empty/recovering/archived | [x] | | Implemented as three real rooms' Decision-tab states, not a single spec sheet — see `lagos-delivery-failures` (empty), `cards-failing-on-renewal-night` (recovering), `discount-only-buyers` (archived) |
| 33 | proposal review states | [x] | | Implemented as `ProposalCard`'s pending/editing/decided states inside the Decision-tab play board |
| 34 | run status states | [x] | | Implemented as `RunStatusBar`'s state machine; only queued/running/cancelRequested/cancelled are reachable from the UI, failed/reconnect are defined but not demo-wired |
| 35 | plays at scale | [x] | | Per user: this is the room's own Plays tab, not a separate cross-room surface — built as `PlaysTab`, `/rooms/:roomId/plays` |
| — | Rooms index | [x] | | `/rooms` — screen supplied directly by the user (not in the 122-frame kit). Lists cohort war rooms only, per its own subtitle ("about a cohort, not a customer"); the two Northwind Retail rooms (account war room + persistent) are reachable by direct link only |
| 115 | approve with re-auth | [x] | | `ApproveReauthModal`, opens from a play's Approve button when `reauthAmount` is set |
| 121 | pause an agent | [x] | | `src/pages/ai-teammates/pause-agent-modal.tsx` — reachable from the room header's agent chip and from the new `/ai-teammates` stub page |

## 5. Audiences and campaigns (36–43)

| # | Screen | Status | Endpoint(s) | Notes |
|---|---|---|---|---|
| 36 | segments | [x] | | `/segments` — static mock data in `src/pages/segments/data.ts`. Segments table is a plain `<table>` in `overflow-x-auto` (matches log-tab.tsx's pattern); on mobile that scrolls Size/30-day change/Used by off-screen with no scroll affordance — flagged to user, not yet fixed |
| 37 | audience builder | [ ] | | |
| 38 | audience at scale | [ ] | | |
| 39 | campaign studio | [ ] | | |
| 40 | campaigns index | [ ] | | |
| 41 | campaign send monitor | [ ] | | |
| 42 | campaign performance/lift | [ ] | | |
| 43 | experiment detail | [ ] | | |

## 6. Revenue surfaces (44–50)

| # | Screen | Status | Endpoint(s) | Notes |
|---|---|---|---|---|
| 44 | leakage map consumer | [ ] | | |
| 45 | leakage map accounts | [ ] | | |
| 46 | involuntary churn/dunning | [ ] | | |
| 47 | revenue forecast | [ ] | | |
| 48 | business memory | [x] | | `/business-memory` — static mock data in `src/pages/business-memory/data.ts`; search + filter pills (Validated/Observed/Superseded/Account-scoped) are real client-side state, not just decorative |
| 49 | customer profile consumer | [ ] | | |
| 50 | customer profile account | [ ] | | |

## 7. Teams (51–58)

| # | Screen | Status | Endpoint(s) | Notes |
|---|---|---|---|---|
| 51 | team marketing | [ ] | | |
| 52 | team product | [ ] | | |
| 53 | team sales | [ ] | | |
| 54 | team customer success | [ ] | | |
| 55 | team engineering | [ ] | | |
| 56 | executive unit economics | [ ] | | |
| 57 | cross-functional handoff | [ ] | | |
| 58 | routing | [ ] | | |

## 8. Governance and infrastructure (59–66)

| # | Screen | Status | Endpoint(s) | Notes |
|---|---|---|---|---|
| 59 | agent autonomy | [x] | | `/governance` — sidebar already had a stubbed "Governance" link under AGENTS (leftover from the old 559-screen nav); wired it to this page. Row toggles are local state only, "Save changes" just toasts |
| 60 | frequency and fatigue | [ ] | | |
| 61 | compliance consent | [ ] | | |
| 62 | consent at scale | [ ] | | |
| 63 | delivery mesh | [ ] | | |
| 64 | data sources | [ ] | | |
| 65 | markets and currency | [ ] | | |
| 66 | ai teammates directory | [ ] | | `/ai-teammates` currently has only a minimal stub (agent list + Pause action) built to host screen 121 — the real directory screen isn't built |

## 9. Mobile (67–69)

| # | Screen | Status | Endpoint(s) | Notes |
|---|---|---|---|---|
| 67 | mobile home | [ ] | | |
| 68 | mobile room | [ ] | | |
| 69 | mobile approvals | [ ] | | |

## 10. System (70–74)

| # | Screen | Status | Endpoint(s) | Notes |
|---|---|---|---|---|
| 70 | failure states | [ ] | | |
| 71 | design system core | [ ] | | |
| 72 | design system multiplayer | [ ] | | |
| 73 | design system vocabulary | [ ] | | |
| 74 | design system lifecycle/teams | [ ] | | |

## 11. Goals and daily prioritisation (75–79)

| # | Screen | Status | Endpoint(s) | Notes |
|---|---|---|---|---|
| 75 | set goals | [ ] | | |
| 76 | goal tracker | [ ] | | |
| 77 | recommendations feed | [ ] | | |
| 78 | value and roi | [ ] | | |
| 79 | daily digest | [ ] | | |

## 12. Analysis surfaces (80–84)

| # | Screen | Status | Endpoint(s) | Notes |
|---|---|---|---|---|
| 80 | funnel explorer | [ ] | | |
| 81 | scenario simulator | [ ] | | |
| 82 | attribution | [ ] | | |
| 83 | benchmarking | [ ] | | |
| 84 | health scoring | [ ] | | |

## 13. Playbooks, experiments, agents (85–90)

| # | Screen | Status | Endpoint(s) | Notes |
|---|---|---|---|---|
| 85 | playbook library | [ ] | | |
| 86 | playbook activation | [ ] | | |
| 87 | experiments | [ ] | | |
| 88 | agent builder | [ ] | | |
| 89 | agent detail | [ ] | | |
| 90 | agent marketplace | [ ] | | |

## 14. Data and identity (91–94)

| # | Screen | Status | Endpoint(s) | Notes |
|---|---|---|---|---|
| 91 | data health | [ ] | | |
| 92 | entity resolution | [ ] | | |
| 93 | schema mapping | [ ] | | |
| 94 | reply inbox | [ ] | | |

## 15. Admin and security (95–101)

| # | Screen | Status | Endpoint(s) | Notes |
|---|---|---|---|---|
| 95 | members and roles | [ ] | | |
| 96 | security and sso | [ ] | | |
| 97 | audit log | [ ] | | |
| 98 | data and residency | [ ] | | |
| 99 | notification rules | [ ] | | |
| 100 | integrations | [ ] | | |
| 101 | plan and billing | [ ] | | |

## 16. Extensibility and community (102–107)

| # | Screen | Status | Endpoint(s) | Notes |
|---|---|---|---|---|
| 102 | developer portal | [ ] | | |
| 103 | embedded and white label | [ ] | | |
| 104 | dashboard builder | [ ] | | |
| 105 | community | [ ] | | |
| 106 | recognition | [ ] | | |
| 107 | language and format | [ ] | | |

## 17. Mobile (108–110)

| # | Screen | Status | Endpoint(s) | Notes |
|---|---|---|---|---|
| 108 | mobile leakage map | [ ] | | |
| 109 | mobile notifications | [ ] | | |
| 110 | mobile approval | [ ] | | |

## 18. Source catalogue and authorisation (111–112)

| # | Screen | Status | Endpoint(s) | Notes |
|---|---|---|---|---|
| 111 | connect source catalogue (165 connectors) | [ ] | | |
| 112 | connect source authorise (read-only scopes) | [ ] | | |

## 19. Action modals (113–122)

| # | Screen | Status | Endpoint(s) | Notes |
|---|---|---|---|---|
| 113 | invite people | [ ] | | |
| 114 | audience builder modal | [ ] | | |
| 115 | approve with re-auth | [ ] | | |
| 116 | export for the board | [ ] | | |
| 117 | share a view | [ ] | | |
| 118 | map a field | [ ] | | |
| 119 | notification rule | [ ] | | |
| 120 | change plan | [ ] | | |
| 121 | pause an agent | [ ] | | |
| 122 | erasure review | [ ] | | |
