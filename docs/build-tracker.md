# Flolyt build tracker

Source of truth for design: `flolyt-kit-122/README.md` (kit overview + section table) and
`flolyt-kit-122/{nn}-{slug}.svg` (one SVG per screen, numbered to match the `#` column
below) — **except section 3 (the lifecycle)**, which was rebuilt from the newer
`flolyt-figma-designs/Everyday Screens/flolyt-lifecycle/` export (path moved under a new
`Everyday Screens/` parent on 2026-08-17); see that section's own header for its
source-of-truth note. A `flolyt-figma-designs/Everyday Screens/flow-diagrams/` folder also
exists now with architecture-level route maps — use it as a sanity check before building a
new stage, but each screen's own SVG footer still wins on the specific route.

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

**Rebuilt from `flolyt-figma-designs/Everyday Screens/flolyt-lifecycle/`** (139 SVGs), replacing the old
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
| Shared tab templates: Overview, Cohorts, Markets, What changed, Agents, History | [x] | One component each, resolve per-stage data via `stage.slug`, wired for Acquire + Activate + Price + Adopt + Retain + Expand + Support + Renew. Cohorts/Markets dispatch to per-stage components (`stage/activate/{cohorts,markets}-tab.tsx`, `stage/price/{cohorts,markets}-tab.tsx`, `stage/adopt/{cohorts,markets}-tab.tsx`, `stage/retain/{cohorts,markets}-tab.tsx`, `stage/expand/{cohorts,markets}-tab.tsx`, `stage/support/{cohorts,markets}-tab.tsx`, `stage/renew/{cohorts,markets}-tab.tsx`) when a stage's own column set doesn't match the Acquire-shaped template — confirmed necessary by reading AC06/AC07/PR07/PR08/AD07/AD08/RT07/RT08/EX07/EX08/SU06/SU07/RN06/RN07 directly, not assumed. Agents/History/Changes/Overview templates gained small additive extensions (agent cards without an avatar, a "blocked" threshold status, a second closing callout, a per-stage closing-callout tone, a per-stage primary-callout tone, a mid-page History callout, a linkable Overview leak-table row, an overridable leak-table trend-column header, a linkable KPI card, a per-row learning-kept tone override) to fit Price/Adopt/Retain/Support/Renew without forking them |
| Shared Compare-periods route | [x] | `stage/compare/compare-route.tsx` — own header, no tab bar. `buildEyebrow`/`buildRows` are now optional (Activate's AC12, Price's PR12, Adopt's AD12, Retain's RT12, Expand's EX12, Support's SU11, and Renew's RN11 have no "how this comparison is built" section) |
| Shared Definition route/editor | [x] | `stage/definition/definition-route.tsx` — built for Activate (AC01), serves any future stage via a `Record<slug, DefinitionData>` lookup the same way Overview does. Price's PR01, Adopt's AD01, Retain's RT01, Expand's EX01, Support's SU01, and Renew's RN01 each dispatch to their own `stage/<slug>/definition-route.tsx` instead — each has a second section that isn't the shared verdict-comparison table (a needs-vs-has checklist for Price, a feature-count breakdown for Adopt, a reachability-by-day-window breakdown for Retain, a basket/plan/account/category breakdown for Expand, a silent-failure outcome breakdown for Support, a chose-it/recoverable outcome breakdown for Renew) |
| Generic `:id` detail-drilldown template | [x] | `stage/detail/detail-drilldown.tsx`, proven via Acquire's `channels/:id` and Price's `plans/:id`. Adopt's `features/:id` (AD04), Retain's `segments/:id` (RT05), Expand's `upgrade-paths/:id` (EX04), and Renew's `book/:id` (RN13) each dispatch to their own bespoke `stage/<slug>/*-detail-route.tsx`/`one-account-route.tsx` instead — friction/cost bar-charts, outcome tables, or (Renew's case) an ordered event timeline, not a checked-rows table + action cards. Support's Silent failures (SU13) is a further variant: same "own header, no tab bar" shape but reached from an Overview KPI card instead of a `:id` param, since it isn't really a drilldown of a list row |
| Shared modals: set-a-threshold, map-a-field, open-a-room, share-or-export | [x] | `stage/modals/` — stage-generic, take stage data as props |
| Renew's re-forecast-the-book modal (RN12) | [x] | `stage/modals/re-forecast-the-book-modal.tsx` — stage-specific (rebuild-basis radio list + a before/after number box), opens from the Renewal book tab's header CTA |
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

### Retain — complete

| Screen | Route | Status |
|---|---|---|
| Definition | `/lifecycle/retain/definition` | [x] | stage-specific layout — RT01's verdict table breaks reachability/response down by day-window (0-30 through 121+), not a candidate-signal comparison, see `stage/retain/definition-route.tsx` |
| Overview | `/lifecycle/retain` | [x] |
| Repeat curve | `/lifecycle/retain/repeat-curve` | [x] | unique tab |
| Segments | `/lifecycle/retain/segments` | [x] | unique tab; its 7 rows have no drilldown data of their own |
| One segment | `/lifecycle/retain/segments/:id` | [x] | bespoke drilldown (sub-segment table + "cost of waiting" bar-chart section), not the generic DetailDrilldown template — only `acquired-mar-may` has drilldown data, per RT05; reached from the Overview leak table's "Acquired Mar–May" row (added an optional `LeakRow.detailHref` field to the shared Overview template for this), not from the Segments tab — RT05's content matches the Overview cohort, not any of the Segments tab's own rows |
| Reactivation | `/lifecycle/retain/reactivation` | [x] | unique tab |
| Cohorts | `/lifecycle/retain/cohorts` | [x] | stage-specific layout, see shared-architecture row above |
| Markets | `/lifecycle/retain/markets` | [x] | stage-specific layout, see shared-architecture row above |
| What changed | `/lifecycle/retain/changes` | [x] | shared template extended with an optional primary-callout tone (`insightTone`, default amber) — Retain's primary closing callout is ultra/blue, not amber |
| Agents | `/lifecycle/retain/agents` | [x] | shared template extended with `AgentCard.footnoteTone` (default ultra) — Retain's third card's footnote is amber, not blue |
| History | `/lifecycle/retain/history` | [x] | shared template extended with an optional mid-page callout (`midInsightTitle/Body/Tone`) between the goals and tried-actions tables, and `TriedRow.learningKept` widened with two new literal values ("works, aimed late", "the open approval") |
| Compare periods | `/lifecycle/retain/compare` | [x] |
| Build an audience (modal) | — | [x] | RT13, opens from the Reactivation tab's header CTA |

### Expand — complete

| Screen | Route | Status |
|---|---|---|
| Definition | `/lifecycle/expand/definition` | [x] | stage-specific layout — EX01's table breaks the four kinds of expansion (basket/plan/account/category) down by value added, median lift, reversibility and owner, not a candidate-signal comparison, see `stage/expand/definition-route.tsx` |
| Overview | `/lifecycle/expand` | [x] |
| Upgrade paths | `/lifecycle/expand/upgrade-paths` | [x] | unique tab; reuses the shared `InsightCards` component (built for Activate) for its closing 3-card section |
| One upgrade path | `/lifecycle/expand/upgrade-paths/:id` | [x] | bespoke drilldown (orders-per-month breakdown table + "what a prompt would be worth" 3-card section), not the generic DetailDrilldown template — only `pay-as-you-go-lagos-plus` has drilldown data, per EX04 |
| Basket | `/lifecycle/expand/basket` | [x] | unique tab, mostly blocked on `order_lines` (same gap as Price's Margin); reuses the shared `RequestInstrumentationModal` (built for Adopt's AD13, already stage-generic) with Expand's own preset rather than a new modal |
| Accounts | `/lifecycle/expand/accounts` | [x] | unique tab — the same stage read in "accounts mode" (1,204 named businesses) instead of consumer mode |
| Cohorts | `/lifecycle/expand/cohorts` | [x] | stage-specific layout, see shared-architecture row above |
| Markets | `/lifecycle/expand/markets` | [x] | stage-specific layout, see shared-architecture row above |
| What changed | `/lifecycle/expand/changes` | [x] | uses the existing `insightTone`/`secondInsightTone` optional fields (rose primary, ultra second) |
| Agents | `/lifecycle/expand/agents` | [x] | 3 cards under a "watching this stage · 2" eyebrow (the same agent appears twice, once per mode) — literal copy from EX10, not a bug; uses `AgentCard.footnoteTone` for the third card |
| History | `/lifecycle/expand/history` | [x] | `TriedRow.learningKept` widened with four new literal values ("works at small scale", "never cross-sold", "net negative", "validated · a wash") |
| Compare periods | `/lifecycle/expand/compare` | [x] |
| Model an upgrade offer (modal) | — | [x] | EX13, opens from the Upgrade paths tab's header CTA |

### Support — complete

| Screen | Route | Status |
|---|---|---|
| Definition | `/lifecycle/support/definition` | [x] | stage-specific layout — SU01's table breaks the 39,600 silent failures down by outcome and repeat rate, not a candidate-signal comparison, see `stage/support/definition-route.tsx` |
| Overview | `/lifecycle/support` | [x] |
| Contact drivers | `/lifecycle/support/drivers` | [x] | unique tab; route path is `drivers` per SU03's own footer even though the tab label reads "Contact drivers"; reuses the shared `InsightCards` component for its 3-card reclassification timeline |
| Resolution | `/lifecycle/support/resolution` | [x] | unique tab |
| Deflection | `/lifecycle/support/deflection` | [x] | unique tab |
| Silent failures | `/lifecycle/support/silent` | [x] | own header, no tab bar — reached from the Overview's "Revenue behind silent failures" KPI card, not a tab or a leak-table row; its own numbers match that KPI card exactly, per SU13. Added an optional `Kpi.href` field to the shared `KpiCards` component for this (same "small optional field" pattern as Retain's `LeakRow.detailHref`) |
| Cohorts | `/lifecycle/support/cohorts` | [x] | stage-specific layout, see shared-architecture row above |
| Markets | `/lifecycle/support/markets` | [x] | stage-specific layout, see shared-architecture row above |
| What changed | `/lifecycle/support/changes` | [x] | uses the existing `insightTone`/`secondInsightTone` optional fields (rose primary, teal second) |
| Agents | `/lifecycle/support/agents` | [x] | 3 cards under a "watching this stage · 1" eyebrow (all three are the same agent, "Support Signal", read three ways) — literal copy from SU09, same pattern as Expand's Agents; uses `AgentCard.footnoteTone` for cards two and three |
| History | `/lifecycle/support/history` | [x] | `TriedRow.learningKept` widened with three new literal values ("validated · best in lifecycle", "under review", "the obvious next test") |
| Compare periods | `/lifecycle/support/compare` | [x] |
| Reclassify a driver (modal) | — | [x] | SU12, opens from the Contact drivers tab's header CTA |

### Renew — complete

| Screen | Route | Status |
|---|---|---|
| Definition | `/lifecycle/renew/definition` | [x] | stage-specific layout — RN01's verdict table breaks the outcome down by whether the customer chose it and how recoverable it is (Renewed/Cancelled/Paused/Card failed/Lapsed silently), not a candidate-signal comparison, see `stage/renew/definition-route.tsx` |
| Overview | `/lifecycle/renew` | [x] |
| Renewal book | `/lifecycle/renew/book` | [x] | unique tab; route path is `book` per RN03's own footer even though the tab label reads "Renewal book"; header CTA opens the stage-specific re-forecast-the-book modal |
| One account | `/lifecycle/renew/book/:id` | [x] | bespoke drilldown (ordered event timeline, not a checked-rows table + action cards) — only `kano-textiles` has drilldown data, per RN13; reached from the Renewal book tab's "Business accounts · 90 days" row (added an optional `RenewBookRow.detailHref` field for this, same pattern as Retain's `LeakRow.detailHref`) |
| Dunning | `/lifecycle/renew/dunning` | [x] | unique tab |
| Pauses | `/lifecycle/renew/pauses` | [x] | unique tab |
| Cohorts | `/lifecycle/renew/cohorts` | [x] | stage-specific layout, see shared-architecture row above |
| Markets | `/lifecycle/renew/markets` | [x] | stage-specific layout, see shared-architecture row above |
| What changed | `/lifecycle/renew/changes` | [x] | uses the existing `insightTone` optional field (rose) |
| Agents | `/lifecycle/renew/agents` | [x] | 2 named agent cards plus a third "what neither can do" card with no avatar (amber tone) — matches the existing `AgentCard` shape (empty `initials` string omits the avatar) with no extension needed |
| History | `/lifecycle/renew/history` | [x] | `TriedRow.learningKept` widened with two new literal values ("4 hrs waiting", "reverse it"), plus a new optional `learningKeptTone` override (Renew's "never proposed" row is rose here, not the usual amber) and `GoalRow.partTone`/`TriedRow.whenTone` widened with `"teal"`/`"rose"` respectively to match RN10's exact chip colors |
| Compare periods | `/lifecycle/renew/compare` | [x] |
| Re-forecast the book (modal) | — | [x] | RN12, opens from the Renewal book tab's header CTA |

### Remaining 2 stages — not started

Each needs: `stage/<slug>/data.ts`, its 1-3 unique tabs, its `:id` drilldown wiring where it
has a list-style tab, and its one stage-specific modal where applicable. The shared tabs/
layout/modals above are already done, so each stage is materially smaller than Acquire
was. Verify each stage's Cohorts/Markets/Changes/Agents/History/Definition screens against
their own SVGs before assuming the shared templates fit unmodified — Activate's Cohorts/
Markets, Price's Definition, Adopt's Definition/one-feature drilldown, and Retain's,
Expand's, Support's and Renew's Definition/Cohorts/Markets did not (see shared-architecture
row above). Also check whether a stage's action modal can reuse an existing stage-generic
modal (Expand's Basket tab reused Adopt's `RequestInstrumentationModal` outright) before
building a new one, and whether a screen is reached from an Overview KPI card rather than a
tab (Support's Silent failures) before assuming every extra screen needs a tab-list entry.

| Stage | Status | Notes |
|---|---|---|
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
