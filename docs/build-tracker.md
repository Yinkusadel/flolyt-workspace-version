# Flolyt build tracker

Source of truth for design: `flolyt-kit-122/README.md` (kit overview + section table) and
`flolyt-kit-122/{nn}-{slug}.svg` (one SVG per screen, numbered to match the `#` column
below) — **except section 2a (what to do today), section 2b (goals), section 2c (digest),
section 3 (the lifecycle), and section 4 (rooms and decisions)**, each rebuilt from its own
newer `flolyt-figma-designs/Everyday Screens/` export (`flolyt-today/`, `flolyt-goals/`,
`flolyt-digest/`, `flolyt-lifecycle/`, `flolyt-rooms/` respectively; the whole
`Everyday Screens/` parent folder appeared on 2026-08-17); see each section's own header for
its source-of-truth note. A
`flolyt-figma-designs/Everyday Screens/flow-diagrams/` folder also exists now with
architecture-level route maps — use it as a sanity check before building a new section, but
each screen's own SVG footer still wins on the specific route.

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
| 13 | inbox | [x] | `/inbox` | Superseded by section 2d, built from `flolyt-inbox/` — see below |
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
| Shared tab templates: Overview, Cohorts, Markets, What changed, Agents, History | [x] | One component each, resolve per-stage data via `stage.slug`, wired for Acquire + Activate + Price + Adopt + Retain + Expand + Support + Renew + Advocate + Churn. Cohorts/Markets dispatch to per-stage components (`stage/activate/{cohorts,markets}-tab.tsx`, `stage/price/{cohorts,markets}-tab.tsx`, `stage/adopt/{cohorts,markets}-tab.tsx`, `stage/retain/{cohorts,markets}-tab.tsx`, `stage/expand/{cohorts,markets}-tab.tsx`, `stage/support/{cohorts,markets}-tab.tsx`, `stage/renew/{cohorts,markets}-tab.tsx`, `stage/advocate/{cohorts,markets}-tab.tsx`, `stage/churn/{cohorts,markets}-tab.tsx`) when a stage's own column set doesn't match the Acquire-shaped template — confirmed necessary by reading AC06/AC07/PR07/PR08/AD07/AD08/RT07/RT08/EX07/EX08/SU06/SU07/RN06/RN07/AV06/AV07/CH06/CH07 directly, not assumed. Agents/History/Changes/Overview templates gained small additive extensions (agent cards without an avatar, a "blocked" threshold status, a second closing callout, a per-stage closing-callout tone, a per-stage primary-callout tone, a mid-page History callout, a linkable Overview leak-table row, an overridable leak-table trend-column header, a linkable KPI card, a per-row learning-kept tone override, a leading Overview callout before the KPI cards, an optional "Assign an owner" header button on Overview/Agents) to fit Price/Adopt/Retain/Support/Renew/Advocate/Churn without forking them. `TriedRow.learningKept` widened once more for Churn's CH10 ("stop it", "built, unused") |
| Shared Compare-periods route | [x] | `stage/compare/compare-route.tsx` — own header, no tab bar. `buildEyebrow`/`buildRows` are now optional (Activate's AC12, Price's PR12, Adopt's AD12, Retain's RT12, Expand's EX12, Support's SU11, Renew's RN11, Advocate's AV11, and Churn's CH11 have no "how this comparison is built" section). Also gained an optional `insightTone` (default rose) for Churn's CH11, whose closing callout is ultra, not rose — the first stage to need it — plus `CompareRow.changeTone` widened with `"amber"` for CH11's "Reason known" row |
| Shared Definition route/editor | [x] | `stage/definition/definition-route.tsx` — built for Activate (AC01), serves any future stage via a `Record<slug, DefinitionData>` lookup the same way Overview does. Price's PR01, Adopt's AD01, Retain's RT01, Expand's EX01, Support's SU01, Renew's RN01, Advocate's AV01, and Churn's CH01 each dispatch to their own `stage/<slug>/definition-route.tsx` instead — each has a second section that isn't the shared verdict-comparison table (a needs-vs-has checklist for Price, a feature-count breakdown for Adopt, a reachability-by-day-window breakdown for Retain, a basket/plan/account/category breakdown for Expand, a silent-failure outcome breakdown for Support, a chose-it/recoverable outcome breakdown for Renew, a "what this stage is worth, conservatively" MEASURE/FIGURE/AGAINST/VERDICT breakdown for Advocate, a definition-window comparison — 30/60/90/120/180 days no order — for Churn). Churn's CH01 is also the second Definition screen (after Advocate's AV01) with its own "Assign an owner" header CTA |
| Generic `:id` detail-drilldown template | [x] | `stage/detail/detail-drilldown.tsx`, proven via Acquire's `channels/:id` and Price's `plans/:id`. Adopt's `features/:id` (AD04), Retain's `segments/:id` (RT05), Expand's `upgrade-paths/:id` (EX04), Renew's `book/:id` (RN13), and Advocate's `referrers/:id` (AV13) each dispatch to their own bespoke `stage/<slug>/*-detail-route.tsx`/`one-account-route.tsx`/`one-referrer-group-route.tsx` instead — friction/cost bar-charts, outcome tables, an ordered event timeline (Renew), or a two-column reading-comparison table (Advocate), not a checked-rows table + action cards. Support's Silent failures (SU13) is a further variant: same "own header, no tab bar" shape but reached from an Overview KPI card instead of a `:id` param, since it isn't really a drilldown of a list row. Churn has no `:id` drilldown at all — none of CH03/CH04/CH05 point at a single row's own page, so none was built |
| Shared modals: set-a-threshold, map-a-field, open-a-room, share-or-export | [x] | `stage/modals/` — stage-generic, take stage data as props |
| Renew's re-forecast-the-book modal (RN12) | [x] | `stage/modals/re-forecast-the-book-modal.tsx` — stage-specific (rebuild-basis radio list + a before/after number box), opens from the Renewal book tab's header CTA |
| Advocate's assign-an-owner modal (AV12) | [x] | `stage/modals/assign-an-owner-modal.tsx` — stage-specific (radio list of 3 candidate owners + a consequences list), opens from Definition/Overview/Agents' header CTA. Reused as-is for Churn (CH01/CH02/CH09's own "Assign an owner" CTAs) — Advocate and Churn are the two unowned stages in this build |
| Churn's send-the-reason-upstream modal (CH12) | [x] | `stage/modals/send-reason-upstream-modal.tsx` — stage-specific (a radio list of 3 recipients — a stage owner, another stage owner, or an existing room — plus a "what it arrives as" fact list), opens from an actionable reason's chip on the Reasons tab. Only the "Never activated" row has a wired preset, matching CH12's own content exactly; the other actionable rows render their chip without a click handler, the same "only one row has real data" pattern used by Price's plans/:id and Adopt's features/:id |
| Lifecycle map (`LC02`) | [x] | `lifecycle/index.tsx` — stage rail + root-cause table; ownership table moved to its own settings page |
| Lifecycle map first-run empty state (`LC01`) / market filter (`LC05`) | [ ] | Not wired — no demo stage is currently undefined and `?market=` isn't read yet |
| Stage ownership settings page (`LC04`) | [x] | `/lifecycle/settings` — relocated `OwnershipTable`, content unchanged |
| "Whole chain" screen (`CH13`) | [x] | `/lifecycle/churn/chain`, linked from the map's root-cause callout. No other Churn screen (CH01-CH12) references it — CH09's Agents tab was checked directly per the build brief and has no link to it |

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

### Advocate — complete

| Screen | Route | Status |
|---|---|---|
| Definition | `/lifecycle/advocate/definition` | [x] | stage-specific layout — AV01's second table is a "what this stage is worth, conservatively" MEASURE/FIGURE/AGAINST/VERDICT breakdown, not a candidate-signal comparison, see `stage/advocate/definition-route.tsx`; also the only Definition screen with its own "Assign an owner" header CTA |
| Overview | `/lifecycle/advocate` | [x] | shared template extended with a leading callout before the KPI cards (`leadTitle/leadBody/leadTone`, for AV02's "no owner" banner) and an optional `assignOwnerPreset` header button |
| Referrers | `/lifecycle/advocate/referrers` | [x] | unique tab; "Legacy Unlimited holders" row links to its own drilldown (AV13) |
| One referrer group | `/lifecycle/advocate/referrers/:id` | [x] | bespoke drilldown (two-column "Price's reading vs Advocate's reading" comparison table), not the generic DetailDrilldown template — only `legacy-unlimited-holders` has drilldown data, per AV13; reached from the Referrers tab's own row and the Overview leak table's matching row (reusing its existing `detailHref` field) |
| Referral quality | `/lifecycle/advocate/quality` | [x] | unique tab; route path is `quality` per AV04's own footer even though the tab label reads "Referral quality" — same route-vs-label mismatch as Adopt's `blind-spots`/Support's `drivers` |
| Rewards | `/lifecycle/advocate/rewards` | [x] | unique tab |
| Cohorts | `/lifecycle/advocate/cohorts` | [x] | stage-specific layout, see shared-architecture row above |
| Markets | `/lifecycle/advocate/markets` | [x] | stage-specific layout, see shared-architecture row above |
| What changed | `/lifecycle/advocate/changes` | [x] | fits the shared template as-is |
| Agents | `/lifecycle/advocate/agents` | [x] | shared template extended with the same optional `assignOwnerPreset` header button as Overview — Advocate is the only stage with no owner |
| History | `/lifecycle/advocate/history` | [x] | `TriedRow.learningKept` widened with one new literal value ("unresolved", amber tone) |
| Compare periods | `/lifecycle/advocate/compare` | [x] |
| Assign an owner (modal) | — | [x] | AV12, `stage/modals/assign-an-owner-modal.tsx` — stage-specific (radio list of 3 candidate owners + a "what happens the moment you assign" consequences list), opens from Definition/Overview/Agents' header CTA. AV10 History's own header CTA ("Search business memory") was left unwired, same precedent as every stage's Overview "Ask about this stage" button — decorative, not gating a real feature |

### Churn — complete (last of the 10 stages)

| Screen | Route | Status |
|---|---|---|
| Definition | `/lifecycle/churn/definition` | [x] | stage-specific layout — CH01's verdict table breaks down the "no order" definition window (30/60/90/120/180 days) by churned/yr, monthly rate, return-unaided and win-back response, not a candidate-signal comparison, see `stage/churn/definition-route.tsx`; also has its own "Assign an owner" header CTA, same as Advocate's AV01 |
| Overview | `/lifecycle/churn` | [x] | shared template as-is, using the existing `leadTitle/leadBody/leadTone` and `assignOwnerPreset` extension points (built for Advocate) — CH02's "the second stage with no owner" banner and header CTA |
| Reasons | `/lifecycle/churn/reasons` | [x] | unique tab; the "Never activated" row's actionable chip opens the churn-only send-the-reason-upstream modal (CH12) |
| Prediction | `/lifecycle/churn/prediction` | [x] | unique tab; reuses the shared `InsightCards` component (built for Activate) for its closing "a prediction nobody has ever acted on" 3-card section |
| Win-back | `/lifecycle/churn/win-back` | [x] | unique tab; route path is `win-back` per CH05's own footer, matching its tab label (no route-vs-label mismatch this time) |
| Cohorts | `/lifecycle/churn/cohorts` | [x] | stage-specific layout, see shared-architecture row above |
| Markets | `/lifecycle/churn/markets` | [x] | stage-specific layout, see shared-architecture row above — plus a bespoke "Ghana across all ten stages" cross-stage table (one row per stage, not a spotlight-card section) |
| What changed | `/lifecycle/churn/changes` | [x] | fits the shared template as data only — one row's team is "nobody" (the no-owner decision itself, rendered in rose rather than a department color) |
| Agents | `/lifecycle/churn/agents` | [x] | fits the shared template as-is (one agent, three cards, `assignOwnerPreset` reused) — no template changes needed |
| History | `/lifecycle/churn/history` | [x] | `TriedRow.learningKept` widened with two new literal values ("stop it", "built, unused"), both rose here via the existing `learningKeptTone` override |
| Compare periods | `/lifecycle/churn/compare` | [x] | surfaced the first genuinely new Compare-route extension point in the whole build — CH11's closing callout is ultra, not the hardcoded rose every prior stage's compare screen used, so `CompareData` gained an optional `insightTone` |
| Send the reason upstream (modal) | — | [x] | CH12, `stage/modals/send-reason-upstream-modal.tsx` — churn-only, opens from the Reasons tab |
| "The whole lifecycle, closed" (CH13) | `/lifecycle/churn/chain` | [x] | already built in a prior session, unchanged this pass |

**Fidelity note:** CH01's 30-day-window verdict row has a literal verdict chip reading "counts живых customers" — Cyrillic text embedded mid-sentence in an otherwise-English table. Transcribed exactly as the SVG has it rather than corrected, per the "SVG wins" rule, but flagged here as very likely a source-generation glitch (probably meant something like "counts current customers") worth checking against the original Figma file.

## The `/lifecycle` rebuild is now complete

All 10 stages (Acquire, Activate, Price, Adopt, Retain, Expand, Support, Renew, Advocate,
Churn) are built end to end — every Overview/tab/Definition/Compare/`:id` screen, all 12
action modals, the lifecycle map, and the ownership settings page. See the plan file
(`eager-snacking-charm.md`) for the original architecture goal; this tracker's per-stage
sections above are now the complete record of what shipped and where each stage diverged
from the shared templates.

## 2a. What to do today

**Rebuilt from scratch on 2026-08-18** from `flolyt-figma-designs/Everyday Screens/flolyt-today/`
(17 screens, T00–T16), superseding kit-122's frame 77 ("recommendations feed" — see section 11's
note) — same "old design source superseded, don't resurrect the old shape" situation as the
lifecycle and rooms rebuilds. Every SVG's own footer states its route (translated 1:1 from the
export's `/today/*` onto this repo's existing sidebar href `/what-to-do-today/*`, the same kind
of deliberate route rename the lifecycle rebuild did for `#/stage/:id`). Extraction was done by
two parallel research agents (T00–T08 / T09–T16), each producing a verbatim structured spec
before any code was written.

**Architecture:** `/what-to-do-today` (index) is ONE route covering T01 (empty), T02 ("day
four" onboarding, a distinct dataset from the steady-state list), T03 (default ranked list),
T05 (`?show=all`), T10 (`?scope=team`), T11 (`?scope=org`), and T12 (any of `?effort=`/`?owner=`/
`?view=`) — branches on `TODAY_ITEMS.length`/`WORKSPACE_AGE_DAYS` and query params, mirroring
Rooms' index branching. T04 (`/ranking`), T09 (`/snoozed`), T13 (`/waiting-on-data`), T14
(`/done`) and T06 (`/:id`) are dedicated routes — each has its own breadcrumb/header and no tab
bar, reusing `StageSubpageHeader`/`Callout`/`Chip`/`KpiCards` straight from
`@/pages/lifecycle/stage/` exactly as the Rooms rebuild did (confirmed generic enough, no fork
needed). T15 mounts at `/settings/today` per its own literal footer, not nested under
`/what-to-do-today`. T07 (assign an owner) and T08 (snooze or dismiss) are modals opened from
specific rows in the ranked table — only the rows they were actually shown against in the export
(the Ghana signup room's "no owner" row, the growth-vs-finance "needs you" row) are wired, same
"only one row has real data" pattern as Price's `plans/:id`. T16 (mobile) was treated as a
responsive-design constraint on the same routes via Tailwind breakpoints, not a separate page.

| Piece | Status | Notes |
|---|---|---|
| Index — empty / first-list / ranked / below-line / team-scope / org-scope / filters | [x] | `src/pages/what-to-do-today/index.tsx`. T01/T02 are wired but unreachable with the current mock (`TODAY_ITEMS` always has 4 items, `WORKSPACE_AGE_DAYS` is 41) — same "not wired, no demo state currently triggers it" situation as Rooms' R01/R02 |
| How this is ranked | [x] | `ranking-route.tsx`, `/what-to-do-today/ranking` |
| One recommendation (`:id`) | [x] | `item-detail-route.tsx` — only `r-8f2c` (the #1 item) has a built page, same "one reference row" pattern as Price's `plans/:id`; every other id falls back to a not-found state |
| Snoozed / Waiting on data / Done | [x] | `snoozed-route.tsx`, `waiting-on-data-route.tsx`, `done-route.tsx` |
| Settings | [x] | `settings-today-route.tsx`, mounted at `/settings/today` (sibling of `/what-to-do-today`, per T15's own footer) |
| Assign an owner / Snooze or dismiss modals | [x] | `modals/assign-an-owner-modal.tsx`, `modals/snooze-or-dismiss-modal.tsx` — wired only on the two rows the export shows them opened from |
| `tsc -b` clean + Playwright console-error sweep (12 routes) + modal click-test | [x] | Verified 2026-08-18 |

## 2b. Goals

**Built from scratch on 2026-08-18** from `flolyt-figma-designs/Everyday Screens/flolyt-goals/`
(17 screens, G00–G16), superseding kit-122's frames 75/76/78 ("set goals" / "goal tracker" /
"value and roi" — see section 11's note) — same "old design source superseded" situation as
today/lifecycle/rooms. Every SVG's own footer states its route. Extraction was done by two
parallel research agents (G01–G08 / G09–G16), each producing a verbatim structured spec before
any code was written.

**Architecture:** `/goals` (index, `src/pages/goals/index.tsx`) is ONE route covering G01
(empty — no goals set) and G07 (the populated tracker table) — branches on `GOAL_ROWS.length`,
mirroring Rooms/Today's index branching; G01 is wired but unreachable with the current mock
(`GOAL_ROWS` always has 5 rows), same "not wired, no demo state currently triggers it" situation
as Rooms' R01/Today's T01. `/goals/new` (G02–G06) is a 5-step client-local wizard — no `?step=`
param in any of G02–G06's own footers (the `G00` overview screen's summary listed step query
params, but the individual screens' own footers all just say `/goals/new`, so the per-screen
footer won per the established "SVG wins" rule) — built the same way as Rooms' `/rooms/new`.
`/goals/:goalId` (`GoalLayout` + `useGoalContext`, mirrors `RoomLayout`) resolves a goal; only
`repeat-90` (the 90-day repeat rate goal) is a fully-built detail page (G08 home + G09
`/off-track` + G13 `/contributions`), same "one reference row built in full" pattern as Today's
`r-8f2c` and Price's `plans/:id` — every other tracker row (net-revenue, second-orders,
involuntary-churn, contribution-margin) exists only as an index row, `GoalLayout`'s not-found
fallback catches any other `:goalId`. `/goals/tree` (G10, cascade) and `/goals/conflicts` (G11,
tension) are standalone routes reusing a hand-rolled recursive row renderer and 3-card tension
layout respectively. `/goals/:quarter/close` (G15, `quarter-close-route.tsx`) and `/value` (G14,
`src/pages/value/index.tsx`) are both standalone — `/value` is a **top-level sibling of
`/goals`, not nested under it**, per its own literal footer route and per
`EVERYDAY-routes.md`'s note that it's the shared ledger written by both Goals and room close-out.
G12 (change-the-target) is a modal opened from the goal detail page's "Edit this goal" button
(`goal/change-target-modal.tsx`), not a routed page, following the same "modals are local state,
not routes" pattern as every other shared modal in the app — even though its own footer names
`/goals/:id/edit`, opening it as an overlay on whatever page triggered it matched the rest of
the app better than adding a background-route pairing just for one modal. G16 (mobile) was
treated as a responsive-design constraint on the same routes via Tailwind breakpoints — the
tracker table becomes a stacked card list with thin progress bars below the `sm` breakpoint,
matching G16's own "bars, not sparklines" / "all five goals, none dropped" annotations.

People reused as-is from `@/pages/rooms/data.ts` (IFEOMA, TUNDE, AMARA, RAVI, ZAINAB, ADA,
KUNLE) — every one of the goals export's named owners matched an existing `PersonRef` constant
and `DEPARTMENT_COLORS` hex, confirmed by reading both before reusing rather than assumed.

| Piece | Status | Notes |
|---|---|---|
| Index — no goals set / tracker + agent findings | [x] | `src/pages/goals/index.tsx`, `data.ts`. Includes the G16 mobile stacked-card layout |
| Set a goal wizard (metric / baseline / target+owner / levers / review) | [x] | `src/pages/goals/new/` — `index.tsx` + one `step-*.tsx` per screen + `data.ts` |
| One goal (`:goalId`) | [x] | `goal/layout.tsx`, `goal/home-route.tsx`, `goal/data.ts` — only `repeat-90` built, matches the tracker's row 2 |
| Off track / Contributions | [x] | `goal/off-track-route.tsx`, `goal/contributions-route.tsx` |
| Change the target modal | [x] | `goal/change-target-modal.tsx`, opened from the goal detail page |
| Goal cascade / Goals in tension | [x] | `cascade-route.tsx` + `cascade-data.ts`, `conflicts-route.tsx` + `conflicts-data.ts` |
| Quarter close | [x] | `quarter-close-route.tsx` + `quarter-close-data.ts`, `/goals/:quarter/close` |
| Value and ROI | [x] | `src/pages/value/index.tsx` + `data.ts`, top-level `/value` |
| `tsc -b` clean + Playwright console-error sweep (9 routes × 3 breakpoints) + wizard click-through + modal click-test | [x] | Verified 2026-08-18 |

## 2c. Digest

**Built from scratch on 2026-08-19** from `flolyt-figma-designs/Everyday Screens/flolyt-digest/`
(17 screens, D00–D16), superseding kit-122's frame 79 ("daily digest" — see section 11's note)
— same "old design source superseded, don't resurrect the old shape" situation as
today/goals/lifecycle/rooms. Every SVG's own footer states its route. Extraction was done by
two parallel research agents (D00–D08 / D09–D16), each producing a verbatim structured spec
before any code was written.

**Architecture:** `/digest` (index, `src/pages/digest/index.tsx`) is ONE route covering D01
(first digest, day one), D02 (default steady-state digest), D03 (a quiet day), D07
(`?team=ea-cs`), D08 (`?scope=org`), and D15 (degraded/incomplete) — branches on query params
first, then on `WORKSPACE_AGE_DAYS`/`QUIET_DAY_ACTIVE`/`DIGEST_DEGRADED` mock flags in `data.ts`.
D01/D03/D15 are wired but unreachable with the current mock defaults, same "not wired, no demo
state currently triggers it" situation as every prior rebuild's empty/edge states. D07 only has
real content for `team=ea-cs` (East Africa CS); any other team value falls back to a not-found
state, matching the "one reference row" pattern used everywhere else in this app (Today's
`r-8f2c`, Price's `plans/:id`, Goals' `repeat-90`). D04 (`/digest/archive`), D06
(`/digest/weekly`) and D14 (`/digest/excluded`) are standalone routes. D05 (`/digest/:date`) only
has real content for `2026-08-11`; every other date falls back to a not-found state, same
pattern. D09–D11 (`/settings/digest`, `/settings/digest/channels`, `/settings/digest/quiet-hours`)
share a 4-tab bar (`settings/tabs.tsx`) with D12, but **D12 (`/settings/notifications`) is its
own top-level sibling route, not nested under `/settings/digest`** — confirmed by its own
literal footer even though it's reached via the same visual tab bar; the tabs component just
links across both route trees. D13 (edit a notification rule) is a modal opened from the one row
D12's own export shows it opened against (`A room opens above ₦25M`), same "shared modals are
local state, not routes" pattern as every other modal in the app. D16 (mobile) was treated as a
responsive-design constraint on `/digest` via Tailwind breakpoints, not a separate page — its own
inline tag reads `mobile · /digest` and it lacks the `Dxx · title` footer pair every routed
screen has.

New people introduced by this export and not on the existing `rooms/data.ts` roster: Grace
Mwangi, Peter Kariuki, Joy Nduta, David Otieno (all Customer Success, East Africa CS team) —
added to `src/pages/digest/data.ts`. Ada Obi, Ravi Mehta and Kunle were reused as-is from
`rooms/data.ts`, confirmed by reading both before reusing. The five tone colours this export
uses (amber/teal/rose/indigo/gray) mapped exactly onto the app's existing `Tone` type
(amber/teal/rose/ultra/neutral) — no new tone was needed.

| Piece | Status | Notes |
|---|---|---|
| Index — first digest / today / quiet day / team / exec / degraded | [x] | `src/pages/digest/index.tsx` + `states/*.tsx`. D01/D03/D15 wired but unreachable with current mock defaults |
| Archive | [x] | `archive-route.tsx`, `/digest/archive` |
| One past digest (`:date`) | [x] | `one-digest-route.tsx` — only `2026-08-11` built, every other date falls back to not-found |
| Weekly roll-up | [x] | `weekly-route.tsx`, `/digest/weekly` |
| Not in this digest | [x] | `excluded-route.tsx`, `/digest/excluded` |
| Settings — What gets in / Channels / Quiet hours | [x] | `settings/what-gets-in-route.tsx`, `settings/channels-route.tsx`, `settings/quiet-hours-route.tsx`, all under `/settings/digest` |
| Settings — Notification rules | [x] | `settings/notification-rules-route.tsx`, `/settings/notifications` (sibling of `/settings/digest`, per D12's own footer) |
| Edit a notification rule modal | [x] | `settings/edit-rule-modal.tsx`, opened from the one rule the export shows it against |
| `tsc -b` clean + Playwright console-error sweep (14 routes × 3 breakpoints) + modal click-test | [x] | Verified 2026-08-19 |

## 2d. Inbox

**Built from scratch on 2026-08-19** from `flolyt-figma-designs/Everyday Screens/flolyt-inbox/`
(17 screens, I00–I16), superseding kit-122's frame 13 ("inbox") and frame 94 ("reply inbox") —
same "old design source superseded" situation as today/goals/lifecycle/rooms/digest. I00 is an
index/route-map frame, not a product screen. Extraction was done by two parallel research agents
(I00–I08 / I09–I16), each producing a verbatim structured spec before any code was written.

**Architecture:** `/inbox` (index, `src/pages/inbox/index.tsx`) is ONE route covering I01 (nothing
waiting — the empty state), I02 (the default populated state) and I03 (`?group=`, grouped
triage) — branches on the `group` query param first, then on the `INBOX_EMPTY` mock flag in
`data.ts`. I01 is wired but unreachable with the current mock default, same "not wired, no demo
state currently triggers it" situation as every prior rebuild's empty/edge states. I14 ("no bulk
approve") is not a separate route — its own footer is a query-param variant of `/inbox`
(`/inbox?select=`) — so it's built as a client-side selection-mode state of `/inbox` itself
(check any item's checkbox via the header's "Select" toggle) rather than a page. I16 (mobile) is a
responsive-design note, not a route — it lacks the `Ixx · Title` footer pair every routed screen
has and is annotated `mobile · /inbox` instead; its guidance (Face ID re-auth, equal-weight
reject, visible exclusion counts) informs the responsive/mobile treatment of `/inbox` and
`/inbox/:id` rather than a separate page.

I04 (`/inbox/:id`) only has real content for `i-8f2c` (the reactivation approval); every other id
falls back to a not-found state, matching the "one reference row" pattern used everywhere else in
this app (Today's `r-8f2c`, Price's `plans/:id`, Digest's `2026-08-11`). I06
(`/inbox/replies/:id`) is the same pattern, built only for `r-4b19` (Amina B.'s erasure request).
I05 (`/inbox/replies`), I07 (`/inbox/routing`), I08 (`/inbox/routing/unroutable`), I09
(`/inbox/snoozed`), I10 (`/inbox/delegation`) and I13 (`/inbox/systems`) are standalone routes.
I11/I12 route under `/settings/authority` (not `/inbox`) per their own footers — a 2-tab bar
(`settings/authority-tabs.tsx`, Thresholds / Standing authority); the export's own tab bar also
shows "Escalation" and "Recent" tabs but neither has a screen in this design source, so they were
left out rather than built as dangling nav. I15 routes under `/settings/inbox`, also outside the
`/inbox` tree.

Since none of the built screens linked forward into replies/routing/snoozed/systems/delegation/
settings, an `InboxQuickLinks` strip (`src/pages/inbox/quick-links.tsx`) was added to the top of
all three `/inbox` states, and an "Approval authority" button was added to `/settings/inbox` —
same "flag and fix a dangling route on the spot" pattern as the digest-archive fix.

Team-dot colours in the routing tables (I07/I08) are an exact match for the existing
`DEPARTMENT_COLORS` palette (`lifecycle/data.ts`) — reused directly via a new `TeamDot`
component (`team-dot.tsx`) rather than inventing a parallel palette. `Chip`, `Callout`, `KpiCards`,
`KvList`, `StageSubpageHeader`, `ActorAvatar`/`PersonDot`/`AgentDot` were all reused as-is from
`lifecycle/stage/`, `digest/` and `rooms/` with zero forking. New customer identities this export
introduces (Chidi O., Amina B., Kwame A., Grace M., Tobi A. — all external customers replying to
campaigns) were modelled as a plain `Customer` type (name + location), not `PersonRef`, since they
aren't workspace staff and have no department.

| Piece | Status | Notes |
|---|---|---|
| Index — nothing waiting / your inbox / grouped triage / bulk-selection | [x] | `src/pages/inbox/index.tsx` + `states/*.tsx` + `bulk-selection-panel.tsx`. I01 wired but unreachable with current mock default |
| One inbox item (`:id`) | [x] | `item-detail-route.tsx` — only `i-8f2c` built, every other id falls back to not-found |
| Replies | [x] | `replies-route.tsx`, `/inbox/replies` |
| One reply (`:id`) | [x] | `one-reply-route.tsx` — only `r-4b19` built, every other id falls back to not-found |
| Routing rules | [x] | `routing/routing-rules-route.tsx`, `/inbox/routing` |
| Unroutable conditions | [x] | `routing/unroutable-route.tsx`, `/inbox/routing/unroutable` |
| Snoozed | [x] | `snoozed-route.tsx`, `/inbox/snoozed` |
| Delegate while away | [x] | `delegation-route.tsx`, `/inbox/delegation` |
| Systems | [x] | `systems-route.tsx`, `/inbox/systems` |
| Settings — Approval authority (thresholds / standing) | [x] | `settings/authority-thresholds-route.tsx`, `settings/authority-standing-route.tsx`, both under `/settings/authority` |
| Settings — Inbox settings | [x] | `settings/inbox-settings-route.tsx`, `/settings/inbox` |
| Sidebar badge (pending count) | [x] | `INBOX_PENDING_COUNT` wired into `components/sidebar.tsx`'s Inbox nav item |
| `tsc -b` clean + Playwright console-error sweep (15 routes × 3 breakpoints) + selection click-test | [x] | Verified 2026-08-19 |

## 4. Rooms and decisions

**Rebuilt from scratch on 2026-08-18** from `flolyt-figma-designs/Everyday Screens/flolyt-rooms/`
(42 screens, R01–R42), replacing the old kit-122-based section entirely (screens 27–35
below, plus the user-supplied Rooms index) — same "old design source superseded, don't
resurrect the old shape" situation as the lifecycle rebuild. Every SVG's own footer states
its route, which is what the rows below are keyed to. Extraction was done by three parallel
research agents (one per the export's own BATCH 1/2/3 grouping), each producing a verbatim
structured spec before any code was written — same "SVG wins, transcribe verbatim" discipline
as the lifecycle rebuild.

**Architecture:** `/rooms` (index) branches on data shape + `?q=`/`?state=` for all five index
states (R01–R05); `/rooms/new` is a 5-step client-local wizard (no `?step=` param — none of
R06–R11's footers show one); `/rooms/:roomId` (`RoomLayout` + `useRoomContext`, mirrors
lifecycle's `StageLayout`) resolves a room and its **own `status`** (`open`/`closed`/
`recovering`/`restricted`) branches the room's home route between the 3-pane workspace,
`ClosedRoom` (templated by a 5-value `outcome` enum), `ReopenedRoom`, and `RestrictedRoom`.
Every other open-room subpage (plays board, one-proposal, conflict, dissent, guardrails,
runs, people, cohort, collision, close-form, merge) reuses `StageSubpageHeader` straight from
`@/pages/lifecycle/stage/` — confirmed generic enough to not need a rooms-specific fork.
`/plays` (plays-at-scale) and `/rooms/subscriptions` are top-level cross-room surfaces,
siblings of `/rooms`, not nested under a room. R42 (mobile) was treated as a responsive-design
constraint on the same routes, not a separate page, consistent with the lifecycle rebuild's
"mobile/tablet/desktop designed together" rule.

**Steering (R28) is a local UI toggle, not a route** — its own footer reports the same
`/rooms/:id` route as the default workspace view, so `Workspace` swaps its center panel via
component state (a "Steer this agent →" link, shown only when a run is `working`) rather than
a URL change.

**One data-model simplification, deliberate:** R12/R13/R14 are three time-lapse snapshots of
the *same* room (just-created → first findings → live) all sharing the route `/rooms/:id` —
rather than modelling temporal state transitions with no real backend to drive them, only the
richest ("live", R14/R15's content) state was built, matching how the lifecycle rebuild always
picked one canonical state per reference screen rather than every mockup's point-in-time
variant.

**Only `second-order-never-happened` is a fully "open" reference room** (workspace, evidence
finding detail, plays board + one-proposal + 3 modals, conflict, dissent, guardrails, runs,
people + invite modal, cohort, collision, close-form, merge) — mirrors the lifecycle rebuild's
"Acquire is the reference stage" pattern. Four more rooms exist purely to demo the other
statuses their shared templates branch on: `weekend-push-fatigue` (recovering/reopened,
carries R37's first-opening content as history), `uk-checkout-latency` (closed ·
no_action_needed), `second-order-recovered` (closed · money_recovered, carries R35's own
content under a distinct id since the reference room itself stays "open" for the workspace
demo), `q3-pricing-review` (restricted). `superseded`/`disproven` outcomes have no dedicated
closed-state mockup in the export (R34's close-out form offers all 5 as radio options; only 3
had their own closed-view screens built) — `ClosedRoom`'s outcome-tone map still defines
colors for all 5 so adding a demo room later needs no template change.

| Piece | Status | Notes |
|---|---|---|
| Rooms index — empty / first-room / main / search / stale-recovering-archived | [x] | `src/pages/rooms/index.tsx` — one route, branches on `getRoomIndex().length` and `?q=`/`?state=`. R01 (empty) and R02 (first-room banner) are wired but unreachable with the current mock dataset (always >1 room), same "not wired, no demo state currently triggers it" situation as the lifecycle map's LC01 |
| New-room wizard | [x] | `src/pages/rooms/new/` — 5 steps + conditional R10 duplicate-detection interstitial before the R11 review, all client-local `useState`, not URL params |
| Room layout / status dispatch | [x] | `src/pages/rooms/room/room-layout.tsx`, `room-home-route.tsx` |
| 3-pane workspace (Decision/Evidence/Log tabs + Steering) | [x] | `src/pages/rooms/room/workspace/workspace.tsx` |
| Room states: closed (3 outcomes) / reopened / restricted | [x] | `src/pages/rooms/room/states/` |
| Evidence finding detail | [x] | `evidence-finding-route.tsx`, `/rooms/:id/evidence/:findingId` |
| Plays board + one-proposal + approve/edit/reject modals | [x] | `src/pages/rooms/room/plays/`, `src/pages/rooms/room/modals/`. Board (`/rooms/:id/plays`) had no in-app link from the room workspace itself until 2026-08-19 — fixed by making the workspace's right-pane "Plays" panel header a link, see [[flag_unreachable_routes]] |
| Conflict / dissent / guardrails / runs | [x] | `conflict-route.tsx`, `dissent-route.tsx`, `guardrails-route.tsx`, `runs-route.tsx` |
| People + invite modal / cohort / collision | [x] | `people-route.tsx` + `modals/invite-people-modal.tsx`, `cohort-route.tsx`, `collision-route.tsx` |
| Close-out form + merge | [x] | `close-out-route.tsx`, `merge-route.tsx` |
| Subscriptions + plays-at-scale (top-level) | [x] | `src/pages/rooms/subscriptions.tsx` (`/rooms/subscriptions`), `src/pages/rooms/plays-at-scale/index.tsx` (`/plays`) |
| `tsc -b` clean + Playwright console-error sweep across all new routes | [x] | Verified 2026-08-18 |

## 5. Audiences and campaigns (36–43)

| # | Screen | Status | Endpoint(s) | Notes |
|---|---|---|---|---|
| 36 | segments | [x] | | Superseded — rebuilt from scratch as `/segments` from the newer `flolyt-segments` export, see section 5a |
| 37 | audience builder | [ ] | | |
| 38 | audience at scale | [ ] | | |
| 39 | campaign studio | [x] | | Superseded — rebuilt as `/campaigns/new` from the newer `flolyt-campaigns` export, see section 5c |
| 40 | campaigns index | [x] | | Superseded — rebuilt as `/campaigns` from the newer `flolyt-campaigns` export, see section 5c |
| 41 | campaign send monitor | [x] | | Superseded — rebuilt as `/campaigns/sent` + `/campaigns/history` from the newer `flolyt-campaigns` export, see section 5c |
| 42 | campaign performance/lift | [ ] | | |
| 43 | experiment detail | [ ] | | |

## 5a. Segments

**Built from scratch on 2026-08-21** from
`flolyt-figma-designs/Customers Screens/flolyt-segments/flolyt-segments/` (16 frames, SG01–SG16),
superseding kit-122's frame 36 ("segments" — see section 5's note). This is the first section of a
new **Customers** group, sibling to Every day and Revenue, sourced from its own
`flolyt-figma-designs/Customers Screens/` export — four more sections (Customer health, Campaigns,
Experiments, Replies) are documented there as sibling folders, not yet built. SG00 is an
index/route-map frame, not a product screen. Content was transcribed from the export's own `sg.py`
generator source (same "read the `.py`, don't parse the SVG" approach as every Revenue section);
`cust.py` holds the five Customers sections' shared sidebar chrome, imported by each section's own
script the same way `rev.py` backs the Revenue sections.

**Route stays flat, per the established rule**: the section lives on disk at
`src/pages/customers/segments/` (folder nests under `src/pages/customers/` purely to mirror the
sidebar's CUSTOMERS group, same as `pages/revenue/*` and `pages/everyday/*`), but mounts at the
flat `/segments` — no `/customers` prefix — matching `/leakage-map`, `/funnel`, etc. Settings is
`/settings/segments`, outside the `/segments` tree, matching `/settings/leakage-map`.

**Architecture — index-branching on a query param first, then a mock flag:**
- `/segments` (`src/pages/customers/segments/index.tsx`) is ONE route covering SG01 (no segments
  defined yet), SG02 (20 minutes after the first segment was defined), SG03 (the default "all
  segments" table), and SG08 (`?q=`, search — the one state with no tab bar). `q` is checked
  first, then `SEGMENTS_STATE` (a 3-value mock flag defaulting to `"full"`) branches SG01/SG02/
  SG03 — SG01/SG02 are wired but unreachable with that default, same "not wired, no demo state
  currently triggers it" situation as every prior rebuild's empty/edge states.
- `/segments/reachability` (SG05), `/segments/overlap` (SG06), `/segments/drift` (SG07), and
  `/segments/retired` (SG13's base table) are standalone sibling routes that share the same
  5-tab bar (`tabs.tsx`) as the index's "All segments" state — same "shared tab bar, not one route
  subtree" pattern as Attribution's `tabs.tsx`.
- `/segments/new` (`new/index.tsx`) is the 3-step "Define a segment" wizard (SG09 who's in it →
  SG10 who's left out → SG11 review). Step position lives in `?step=`, not local `useState` —
  deliberately deviates from Scenario/Benchmarks' `new/` wizards (which use local state) per a
  since-adopted rule that page-level flow position belongs in the URL so a refresh mid-wizard
  doesn't strand the user back at step 1.
- `/segments/:id` (`segment-detail-route.tsx`) only has one built reference row: SG04
  (`lapsed-fee`) — every other id falls back to a not-found state, same "one/two reference rows"
  pattern as Leakage map's `:id`. Reachable in-app from the all-segments table's row link and
  SG02's first-segment banner.
- **SG12/SG13/SG14 are three bespoke modals**, each hardcoded to the one row the export shows it
  opened against — `freeze-a-segment-modal.tsx` ("Lapsed after the fee change"),
  `retire-a-segment-modal.tsx` ("Lagos, order failed in March"), and `use-a-segment-modal.tsx`
  ("Two features in week one") — wired from the all-segments table via a `rowAction` field set on
  exactly those three rows, same "only these three rows have a wired row action" pattern as
  Leakage map's `roomAction`.
- SG16 (mobile) was treated as a responsive-design constraint via Tailwind breakpoints
  (`hidden md:block` table / `md:hidden` stacked cards on the all-segments table) plus a
  purpose-built `reachability-bar.tsx` stacked bar for SG05, not a separate page — same call as
  every prior section's mobile frame.

**Cross-section reuse, confirmed by reading both before reusing:** all six named people in this
export (Ifeoma Nwosu, Ravi Mehta, Kunle, Amara Okeke, Ada Obi, Zainab Yusuf) are exact matches for
`IFEOMA`/`RAVI`/`KUNLE`/`AMARA`/`ADA`/`ZAINAB` in `rooms/data.ts` — reused directly, zero new
`PersonRef`s needed, and no new `AgentRef`s were needed either (RD/AQ/IC already existed).
`Chip`, `CHIP_INTERACTIVE_CLASS`, `Callout`, `KpiCards`, `PersonAvatar`, and `StageSubpageHeader`
were all reused from `lifecycle/stage/` and `components/` with zero forking. A local
`SegmentsKvList` (`kv-list.tsx`) was written instead of reusing an existing one, following the same
per-section-KvList precedent as Leakage map/Attribution (each section's own 7-value `SgTone` isn't
a drop-in match for another section's tone vocabulary).

| Piece | Status | Notes |
|---|---|---|
| Index — no segments yet / first segment / all segments / search | [x] | `src/pages/customers/segments/index.tsx` + `states/*.tsx`. SG01/SG02 wired but unreachable with `SEGMENTS_STATE`'s current default |
| Reachability / Overlap / Drift / Retired | [x] | `reachability-route.tsx`, `overlap-route.tsx`, `drift-route.tsx`, `retired-route.tsx` |
| Define a segment wizard | [x] | `new/index.tsx` + `new/step-*.tsx`, `/segments/new`, step position in `?step=` |
| One segment (`:id`) | [x] | `segment-detail-route.tsx` — only `lapsed-fee` built, every other id falls back to not-found |
| Freeze / Retire / Use a segment (modals) | [x] | `modals/*.tsx`, each hardcoded to the one row the export shows it against, wired via `rowAction` on the all-segments table |
| Settings | [x] | `settings/segments-settings-route.tsx`, `/settings/segments` |
| Sidebar "Segments" link | [x] | pre-existing stub already correctly pointed at `/segments` |
| `tsc -p tsconfig.app.json` clean + dev server + 11-route Playwright console/page-error sweep + 3-modal click-test | [x] | Verified 2026-08-21 |
| Cherry-picked onto `archive/mock-data` | [x] | Clean cherry-pick, no conflicts |

## 5b. Customer health

**Built from scratch on 2026-08-21** from
`flolyt-figma-designs/Customers Screens/flolyt-customer-health/flolyt-customer-health/` (16 frames,
HL01–HL16), the second section of the Customers group, sibling to Segments. Content was transcribed
from the export's own `hl.py` generator source (same "read the `.py`, don't parse the SVG" approach
as Segments and every Revenue section); `cust.py` is the same shared Customers sidebar-chrome script
Segments already used.

**Route stays flat, per the established rule**: lives on disk at
`src/pages/customers/customer-health/` (mirrors the sidebar CUSTOMERS group) but mounts at the flat
`/customer-health` — no `/customers` prefix — matching `/segments`. Settings is
`/settings/customer-health`, outside the `/customer-health` tree, matching `/settings/segments`.

**Architecture — index-branching on a query param first, then a mock flag, same shape as Segments:**
- `/customer-health` (`src/pages/customers/customer-health/index.tsx`) is ONE route covering HL01
  (no signal has a baseline yet), HL02 (the first signal, read for the first time), HL03 (the
  default "Signals" tab, all six signals), and HL05 (`?by=cohort`, the "By cohort" tab). `by` is
  checked first, then `HEALTH_STATE` (a 3-value mock flag defaulting to `"full"`) branches
  HL01/HL02/HL03 — HL01/HL02 are wired but unreachable with that default, same "not wired, no demo
  state currently triggers it" situation as every prior rebuild's empty/edge states.
- `/customer-health/coverage` (HL09), `/customer-health/changed` (HL10), and
  `/customer-health/thresholds` (HL11) are standalone sibling routes sharing the same 5-tab bar
  (`tabs.tsx`, mixing a query-param tab with sibling-route tabs — same pattern Benchmarks used) as
  the index's Signals/By-cohort states.
- `/customer-health/unowned` (HL08, "At risk with no owner") is also a standalone sibling route,
  reached from a link card on the By-cohort tab (HL05) rather than from the tab bar itself — it
  keeps the tab bar rendered with "By cohort" active for orientation, matching the export's own
  choice to draw the tab bar on that frame even though the URL isn't one of the tab's own hrefs.
- `/customer-health/no-score` (HL04, "Why there is no score") is a standalone route with its own
  `StageSubpageHeader` breadcrumb, no tab bar — reached from HL01's empty state.
- `/customer-health/:id` (`cohort-detail-route.tsx`) only has one built reference row: HL06
  (`lapsed-fee`) — every other id falls back to a not-found state, same "one/two reference rows"
  pattern as Segments' `:id`. Reachable from the By-cohort table's row link.
- **`/customers/:id` (`src/pages/customers/customer-detail-route.tsx`) is a new top-level route,
  outside the `/customer-health` tree entirely** — HL07's own footer states the route as
  `/customers/:id`, a cross-cutting customer profile rather than a Customer-health-specific screen
  (no sidebar item is named plain "Customers"), so it was mounted exactly as the export states
  rather than folded under `/customer-health`. Only `4118207` has real content, every other id
  falls back to not-found. Reachable via a link card added to the `lapsed-fee` cohort detail page
  ("One identifiable person in this cohort") — no export screen showed an explicit link to it, so
  this entry point was added per [[flag_unreachable_routes]].
- **HL12/HL13/HL14 are three bespoke modals**, each hardcoded to the one row/preset the export shows
  it opened against — `add-a-signal-modal.tsx` ("Reordered the same item", opened from the Signals
  tab's header CTA), `change-a-threshold-modal.tsx` ("Feature depth", opened from the Thresholds
  route's header CTA and from that row's own breach-count chip), and
  `contact-this-person-modal.tsx` (Customer 4,118,207, opened from a second header button on the
  customer detail page — HL07's own frame CTA is "See their reply", a separate button, so the
  detail page carries both).
- HL16 (mobile) was treated as a responsive-design constraint via Tailwind breakpoints, not a
  separate page — same call as every prior section's mobile frame.

**Cross-section reuse, confirmed by reading both before reusing:** every named person in this export
(Ifeoma, Tunde, Amara, Ravi, Zainab, Ada, Kunle) is an exact match for `rooms/data.ts`'s existing
`PersonRef`s, reused as plain owner strings in table rows (same shape as Segments' `owner` column)
rather than full `PersonRef` objects, since no avatar rendering was needed for them. The one
`AgentRef` used (Repeat & Decay, "RD") matches Segments' own `SG01_OBSERVATION_ROWS` literal.
`Chip`, `CHIP_INTERACTIVE_CLASS`, `Callout`, `KpiCards`, `PersonAvatar`, `StageSubpageHeader`, and
`BarRow` were all reused from `lifecycle/stage/` and `components/` with zero forking. A local
`HealthKvList` (`kv-list.tsx`) and `CoverageBar` (`coverage-bar.tsx`, a direct structural copy of
Segments' `ReachabilityBar`) were written per-section, same "own 7-value tone vocabulary" precedent
as every prior section.

| Piece | Status | Notes |
|---|---|---|
| Index — nothing yet / first signal / all signals / by cohort | [x] | `src/pages/customers/customer-health/index.tsx` + `states/*.tsx`. HL01/HL02 wired but unreachable with `HEALTH_STATE`'s current default |
| Why there is no score | [x] | `no-score-route.tsx`, `/customer-health/no-score` |
| At risk with no owner / Coverage / What changed / Thresholds | [x] | `unowned-route.tsx`, `coverage-route.tsx`, `changed-route.tsx`, `thresholds-route.tsx` |
| One cohort (`:id`) | [x] | `cohort-detail-route.tsx` — only `lapsed-fee` built, every other id falls back to not-found |
| One customer (`/customers/:id`, top-level) | [x] | `src/pages/customers/customer-detail-route.tsx` — only `4118207` built |
| Add a signal / Change a threshold / Contact this person (modals) | [x] | `modals/*.tsx`, each hardcoded to the one row/preset the export shows it against |
| Settings | [x] | `settings/customer-health-settings-route.tsx`, `/settings/customer-health` |
| Sidebar "Customer health" link | [x] | pre-existing stub already correctly pointed at `/customer-health` |
| `tsc -p tsconfig.app.json` clean + dev server + 12-route Playwright console/page-error sweep + 3-modal click-test + mobile viewport check | [x] | Verified 2026-08-21 |

## 5c. Campaigns

**Built from scratch on 2026-08-21** from
`flolyt-figma-designs/Customers Screens/flolyt-campaigns/flolyt-campaigns/` (18 frames,
CP01–CP18), the third section of the Customers group, sibling to Segments and Customer health.
Content was transcribed from the export's own `cp.py` generator source (same "read the `.py`,
don't parse the SVG" approach as every prior section); `cust.py` is the same shared Customers
sidebar-chrome script Segments and Customer health already used. CP00 is an index/route-map frame,
not a product screen.

**Route stays flat, per the established rule**: lives on disk at
`src/pages/customers/campaigns/` (mirrors the sidebar CUSTOMERS group) but mounts at the flat
`/campaigns` — no `/customers` prefix — matching `/segments` and `/customer-health`. Settings is
`/settings/campaigns`, outside the `/campaigns` tree, matching `/settings/customer-health`.

**Architecture — index-branching on a mock flag only, no query-param tab this time:**
- `/campaigns` (`src/pages/customers/campaigns/index.tsx`) is ONE route covering CP01 (nothing
  sent yet), CP02 (the first campaign, 20-minutes-scale), and CP03 (the default "Running now"
  table). `CAMPAIGNS_STATE` (a 3-value mock flag defaulting to `"full"`) branches between them —
  CP01/CP02 are wired but unreachable with that default, same "not wired, no demo state currently
  triggers it" situation as every prior rebuild's empty/edge states. Unlike Segments/Customer
  health, there's no extra query-param-branched tab at the index (no `?q=` or `?by=` frame in this
  export).
- `/campaigns/audiences` (CP05), `/campaigns/waiting` (CP06), `/campaigns/suppressed` (CP07), and
  `/campaigns/sent` (CP08) are standalone sibling routes sharing the same 6-tab bar (`tabs.tsx`) as
  the index's "Running" state.
- **`/campaigns/history` has no dedicated frame in the export** — `TABS` in `cp.py` lists six tabs
  but `S.save()` is only ever called for the other five. Same "tab with no frame" gap Scenario hit
  with its own History tab (see [[flolyt_scenario_rebuild]]). Built anyway, grounded in CP17's own
  "every change is logged, in the campaign log" line, widened into a chronological log of sends,
  approvals, incidents and standing-authority changes.
- `/campaigns/new` (`new/index.tsx`) is the 4-step "New campaign" wizard (CP09 who it reaches →
  CP10 what it says → CP11 guardrails → CP12 review). Step position lives in `?step=`, per
  [[url_param_over_state_for_page_flow]], same rule Segments' wizard established. Note: CP10's own
  footer CTA is labelled "Fix the copy" rather than "Next" — it still advances the wizard to step 3
  like every other step's CTA; the label is flavor text for that step's blocking-check content, not
  a different action. (Caught in click-testing: the first pass treated it as a non-advancing action
  and stranded the wizard at step 2 — fixed before landing.)
- `/campaigns/:id` (`campaign-detail-route.tsx`) only has one built reference row: CP04
  (`reactivation-1`) — every other id falls back to a not-found state, same "one/two reference
  rows" pattern as every prior section's `:id`. CP03's own table draws every campaign name as plain
  text, so the "wave one" row's name was made a link to keep the route reachable in-app, per
  [[flag_unreachable_routes]] — same treatment as Segments' all-segments table.
- `/campaigns/incidents/:id` (`incident-detail-route.tsx`) only has one built reference row: CP16
  (`1`, "When a send goes wrong") — every other id falls back to not-found.
- **CP13/CP14/CP15 are three bespoke modals.** `stop-a-campaign-modal.tsx` ("Reactivation · wave
  one") is wired via a `rowAction` field on that one Running-table row's state chip, same pattern
  as Segments' `rowAction`. `approve-a-campaign-modal.tsx` ("Reactivation · wave four") and
  `raise-a-standing-authority-modal.tsx` (Ada's reactivation grant) both open from the Waiting
  route's header — two separate header buttons for two separate frame CTAs, same "two CTAs on one
  page" precedent Customer health's HL07 established, used here because CP13 and CP14 solve two
  different problems for the one waiting campaign (approve it directly, or raise the cap that's
  blocking it) rather than two different frames' CTAs disagreeing about one screen.
- CP18 (mobile) was treated as a responsive-design constraint via Tailwind breakpoints (`hidden
  md:block` table / `md:hidden` stacked cards on the Running table), not a separate page — same
  call as every prior section's mobile frame.

**Cross-section reuse, confirmed by reading before reusing:** six of the seven named people in this
export (Ifeoma, Ravi, Ada, Tunde, Amara — Zainab only appears as a plain string) are exact matches
for `rooms/data.ts`'s existing `PersonRef`s; two agents (Repeat & Decay, Involuntary Churn) also
matched existing `AgentRef`s. One new agent was needed and added locally rather than to
`rooms/data.ts`: `PRODUCT_REASON` ("PR"), CP01's third proposal — not referenced anywhere in Rooms.
`Chip`, `CHIP_INTERACTIVE_CLASS`, `Callout`, `KpiCards`, `PersonAvatar`, and `StageSubpageHeader`
were all reused with zero forking. A local `CampaignsKvList` (`kv-list.tsx`) and `SuppressedBar`
(`suppressed-bar.tsx`, a structural copy of Customer health's `CoverageBar`) were written per
section, same "own tone vocabulary" precedent as every prior section.

| Piece | Status | Notes |
|---|---|---|
| Index — nothing sent / first campaign / running now | [x] | `src/pages/customers/campaigns/index.tsx` + `states/*.tsx`. CP01/CP02 wired but unreachable with `CAMPAIGNS_STATE`'s current default |
| Audiences / Waiting / Suppressed / Sent | [x] | `audiences-route.tsx`, `waiting-route.tsx`, `suppressed-route.tsx`, `sent-route.tsx` |
| History (no dedicated frame) | [x] | `history-route.tsx`, grounded in CP17's "campaign log" line |
| New campaign wizard | [x] | `new/index.tsx` + `new/step-*.tsx`, `/campaigns/new`, step position in `?step=` |
| One campaign (`:id`) | [x] | `campaign-detail-route.tsx` — only `reactivation-1` built, every other id falls back to not-found |
| One incident (`incidents/:id`) | [x] | `incident-detail-route.tsx` — only `1` built, every other id falls back to not-found |
| Approve / Raise a standing authority / Stop a campaign (modals) | [x] | `modals/*.tsx` — stop wired via `rowAction` on the Running table, approve/standing wired from the Waiting route's two header buttons |
| Settings | [x] | `settings/campaigns-settings-route.tsx`, `/settings/campaigns` |
| Sidebar "Campaigns" link | [x] | pre-existing stub already correctly pointed at `/campaigns` |
| `tsc -p tsconfig.app.json` clean + dev server + 15-route Playwright console/page-error sweep + 3-modal click-test + full 4-step wizard click-through + mobile viewport check | [x] | Verified 2026-08-21 |

## 5d. Experiments

**Built from scratch on 2026-08-21** from
`flolyt-figma-designs/Customers Screens/flolyt-experiments/flolyt-experiments/` (16 frames,
XP01–XP16), the fourth section of the Customers group, sibling to Segments, Customer health and
Campaigns. Content was transcribed from the export's own `xp.py` generator source (same "read the
`.py`, don't parse the SVG" approach as every prior section); `cust.py` is the same shared
Customers sidebar-chrome script the other three sections already use.

**Route stays flat, per the established rule**: lives on disk at
`src/pages/customers/experiments/` (mirrors the sidebar CUSTOMERS group) but mounts at the flat
`/experiments` — no `/customers` prefix — matching `/segments`, `/customer-health`, `/campaigns`.
Settings is `/settings/experiments`, outside the `/experiments` tree, matching
`/settings/campaigns`. The sidebar's "Experiments" link already pointed at `/experiments` before
this build started — nothing to wire there.

**Architecture — index-branching on a mock flag, then a 5-tab bar, same shape as Campaigns:**
- `/experiments` (`index.tsx`) is ONE route covering XP01 (nothing held back yet), XP02 (the first
  result, 9-days-scale), and XP03 (the default "Running" tab state). `EXPERIMENTS_STATE` (a
  3-value mock flag defaulting to `"full"`) branches between them — XP01/XP02 are wired but
  unreachable with that default, same "not wired, no demo state currently triggers it" situation
  as every prior rebuild's empty/edge states.
- Five tabs (Running/Results/Never included/Readability/History) share one `tabs.tsx`.
  `/experiments/results` (XP06), `/experiments/excluded` (XP05, "Never included" — the route
  segment follows the frame's own footer URL rather than the tab label), and
  `/experiments/readability` (XP12) are standalone sibling routes.
- **`/experiments/history` has no dedicated frame in the export** — `TABS` in `xp.py` lists five
  tabs but `S.save()` is only ever called for the other four. Same "tab with no frame" gap
  Scenario and Campaigns each hit with their own History tab (see
  [[flolyt_scenario_rebuild]], [[flolyt_campaigns_rebuild]]). Built anyway, grounded not in one
  adjacent line but in the vocabulary every other Experiments screen already repeats — "signed",
  "locked", "condition changed", "contamination detected" — widened into a chronological log of
  signings, closures, condition changes and contamination events.
- `/experiments/contaminated` (XP08, "When one breaks") is a dedicated route reached from the
  Running table's "contaminated" state chip on the wave-one row — same `rowAction` pattern as
  Campaigns' stop-a-campaign chip, but this one navigates instead of opening a modal.
- `/experiments/new` (`new/index.tsx`) is the 3-step "Design an experiment" wizard (XP09 the
  question → XP10 the holdout → XP11 review). Step position lives in `?step=`, per
  [[url_param_over_state_for_page_flow]], same rule Segments'/Campaigns' wizards established.
  Click-tested end to end via real button clicks (not just direct `?step=` navigation) after
  Campaigns' CP10 bug showed direct nav doesn't catch a wizard step that silently fails to
  advance — this one advanced correctly at every step.
- `/experiments/:id` (`experiment-detail-route.tsx`) has two built reference rows — XP04
  (`kenya-retry`, reached from the Running table) and XP07 (`weekend-cadence`, reached from the
  Results table) — every other id falls back to a not-found state, same "one/two reference rows"
  pattern [[flolyt_scenario_rebuild]] and [[flolyt_attribution_rebuild]] established.
- **XP13/XP14 are two bespoke modals**, both wired via `rowAction` fields on Running-tab table
  rows rather than a dedicated header button, since both target a specific row rather than a
  page-level action: `stop-early-modal.tsx` ("Reactivation · wave two") opens from that row's
  "clean" state chip in the main experiments table; `change-the-condition-modal.tsx` ("Basket
  prompt · rerun") opens from that row's "written" date in the second (condition) table. Neither
  preset's row counts need to match the real tables exactly — same "a modal's own base state
  doesn't have to match the live page" precedent [[flolyt_campaigns_rebuild]] established.
- XP16 (mobile) was treated as a responsive-design constraint via Tailwind breakpoints (`hidden
  md:block` table / `md:hidden` stacked cards on the Running table), not a separate page — same
  call as every prior section's mobile frame.

**Cross-section reuse, confirmed by reading before reusing:** all six named people in this export
(Ifeoma, Ravi, Ada, Tunde, Amara, Zainab) are exact matches for `rooms/data.ts`'s existing
`PersonRef`s — no new person or agent refs were needed, unlike Campaigns' `PRODUCT_REASON`.
`Chip`, `CHIP_INTERACTIVE_CLASS`, `Callout`, `KpiCards`, `BarTrack`, `PersonAvatar`, and
`StageSubpageHeader` were all reused with zero forking. A local `ExperimentsKvList`
(`kv-list.tsx`) was written per section, same "own tone vocabulary" precedent as every prior
section.

| Piece | Status | Notes |
|---|---|---|
| Index — nothing to measure / first result / running now | [x] | `index.tsx` + `states/*.tsx`. XP01/XP02 wired but unreachable with `EXPERIMENTS_STATE`'s current default |
| Results / Never included / Readability | [x] | `results-route.tsx`, `excluded-route.tsx`, `readability-route.tsx` |
| History (no dedicated frame) | [x] | `history-route.tsx`, grounded in the section's own recurring audit-trail vocabulary |
| When one breaks | [x] | `contaminated-route.tsx`, reached via the Running table's "contaminated" chip |
| New experiment wizard | [x] | `new/index.tsx` + `new/step-*.tsx`, `/experiments/new`, step position in `?step=` |
| One experiment (`:id`) | [x] | `experiment-detail-route.tsx` — `kenya-retry` and `weekend-cadence` built, every other id falls back to not-found |
| Stop early / Change the condition (modals) | [x] | `modals/*.tsx` — both wired via `rowAction` on Running-tab table rows |
| Settings | [x] | `settings/experiments-settings-route.tsx`, `/settings/experiments` |
| Sidebar "Experiments" link | [x] | pre-existing stub already correctly pointed at `/experiments` |
| `tsc -p tsconfig.app.json` clean + dev server + 13-route Playwright console/page-error sweep + full 3-step wizard click-through + 2-modal click-test + 2 detail-row link click-tests + mobile viewport check | [x] | Verified 2026-08-21 |

## 5e. Replies

**Built from scratch on 2026-08-21** from
`flolyt-figma-designs/Customers Screens/flolyt-replies/flolyt-replies/` (14 frames, RP01–RP14),
the fifth and final section of the Customers group, sibling to Segments, Customer health,
Campaigns and Experiments. Content was transcribed from the export's own `rp.py` generator
source (same "read the `.py`, don't parse the SVG" approach as every prior section); `cust.py` is
the same shared Customers sidebar-chrome script the other four sections already use. RP00 is an
index/route-map frame, not a product screen.

**Route stays flat, per the established rule**: lives on disk at `src/pages/customers/replies/`
(mirrors the sidebar CUSTOMERS group) but mounts at the flat `/replies` — no `/customers` prefix
— matching `/segments`, `/customer-health`, `/campaigns`, `/experiments`. Settings is
`/settings/replies`, outside the `/replies` tree, matching `/settings/experiments`. The sidebar's
"Replies" link already pointed at `/replies` before this build started.

**Architecture — index-branching on a mock flag, then a 5-tab bar, same shape as Campaigns and
Experiments:**
- `/replies` (`index.tsx`) is ONE route covering RP01 (nobody has written back yet), RP02 (the
  first reply, minutes-scale), and RP03 (the default "Needs an answer" tab state).
  `REPLIES_STATE` (a 3-value mock flag defaulting to `"full"`) branches between them — RP01/RP02
  are wired but unreachable with that default, same "not wired, no demo state currently triggers
  it" situation as every prior rebuild's empty/edge states.
- Five tabs (Needs an answer/Themes/Unanswered/Routing/Answered) share one `tabs.tsx`.
  `/replies/themes` (RP05), `/replies/unanswered` (RP06), and `/replies/routing` (RP07) are
  standalone sibling routes.
- **`/replies/answered` has no dedicated frame in the export** — `TABS` in `rp.py` lists five tabs
  but `S.save()` is only ever called for the other four. Same "tab with no frame" gap Scenario,
  Campaigns and Experiments each hit with their own no-frame tab (see
  [[flolyt_experiments_rebuild]]). Grounded this time in an exact arithmetic fact rather than
  lifted vocabulary: RP13's own "12,388 sent" figure is precisely 12,800 total messages minus the
  412 counted as never-answered on the Unanswered tab, so the number was already implied by two
  other screens rather than invented for this one.
- `/replies/4118207` (`conversation-detail-route.tsx`) and `/replies/4118207/answer`
  (`answer-route.tsx`) are two nested detail routes for the one flagship customer threaded through
  nearly the whole section (RP02, RP03, RP04, RP08, RP09 all reference them) — every other id on
  either route falls back to a not-found state. `/replies/4118207/answer`'s own "Send it" button
  resolves the send directly (toast + navigate back to `/replies`); RP09's modal is a separate,
  faster path to the same underlying action reachable straight from the Needs-an-answer table's
  draft-ready chip, skipping the two intermediate pages.
- `/replies/use` (RP12, "What a reply may be used for") is a standalone policy page, not part of
  the tab bar — reached from `/settings/replies`'s new secondary header button and from RP01's
  own empty-state secondary CTA, both per [[flag_unreachable_routes]].
- **RP09/RP10/RP11 are three bespoke modals**, each wired via a `rowAction` field on a specific
  table row rather than a page-level button: `send-an-answer-modal.tsx` ("Customer 4,118,207")
  opens from the Needs-an-answer table's draft-ready chip; `make-it-evidence-modal.tsx` ("Too many
  messages") opens from the Themes table's "Became a finding?" cell; `close-without-answering-modal.tsx`
  ("Customer 3,881,406") opens from the Unanswered table's "Fixable" cell on the "No channel to
  reply on" row. None of the three modals' own preset row-counts need to match the real tables
  exactly — same "a modal's own base state doesn't have to match the live page" precedent
  [[flolyt_campaigns_rebuild]] established.
- RP14 (mobile) was treated as a responsive-design constraint via Tailwind breakpoints, not a
  separate page — same call as every prior section's mobile frame.

**Cross-section reuse, confirmed by reading before reusing:** all five named people in this export
(Ravi, Ifeoma, Amara, Ada, Kunle) are exact matches for `rooms/data.ts`'s existing `PersonRef`s —
no new person or agent refs were needed, same as Experiments. `Chip`, `CHIP_INTERACTIVE_CLASS`,
`Callout`, `KpiCards`, `PersonAvatar`, and `StageSubpageHeader` were all reused with zero forking.
A local `RepliesKvList` (`kv-list.tsx`) was written per section, same "own tone vocabulary"
precedent as every prior section.

| Piece | Status | Notes |
|---|---|---|
| Index — nobody has written back / first reply / needs an answer | [x] | `index.tsx` + `states/*.tsx`. RP01/RP02 wired but unreachable with `REPLIES_STATE`'s current default |
| Themes / Unanswered / Routing | [x] | `themes-route.tsx`, `unanswered-route.tsx`, `routing-route.tsx` |
| Answered (no dedicated frame) | [x] | `answered-route.tsx`, grounded in the exact arithmetic implied by RP13's "12,388 sent" figure |
| One conversation (`:id`) + Draft an answer (`:id/answer`) | [x] | `conversation-detail-route.tsx`, `answer-route.tsx` — only `4118207` built on either, every other id falls back to not-found |
| What a reply may be used for | [x] | `use-route.tsx`, `/replies/use`, reachable from Settings' second header button and the empty state |
| Send an answer / Make it evidence / Close without answering (modals) | [x] | `modals/*.tsx` — each wired via `rowAction` on a different tab's table |
| Settings | [x] | `settings/replies-settings-route.tsx`, `/settings/replies` |
| Sidebar "Replies" link | [x] | pre-existing stub already correctly pointed at `/replies` |
| `tsc -p tsconfig.app.json` clean + dev server + 11-route Playwright console/page-error sweep + 3-modal click-test + conversation→answer→send click-through + settings→policy cross-link click-test + mobile viewport check | [x] | Verified 2026-08-21 |

**This completes the Customers sidebar group** (Segments, Customer health, Campaigns,
Experiments, Replies — all five sections built).

## 6. Revenue surfaces (44–50)

| # | Screen | Status | Endpoint(s) | Notes |
|---|---|---|---|---|
| 44 | leakage map consumer | [x] | | Superseded — rebuilt as `/leakage-map` from the newer `flolyt-leakage-map` export, see section 6a |
| 45 | leakage map accounts | [x] | | Superseded — same rebuild, see section 6a; the export has no separate "accounts mode", unlike Expand's own account view |
| 46 | involuntary churn/dunning | [ ] | | |
| 47 | revenue forecast | [ ] | | |
| 48 | business memory | [x] | | Superseded — rebuilt as `/business-memory` from the newer `flolyt-business-memory` export, see section 6g |
| 49 | customer profile consumer | [ ] | | |
| 50 | customer profile account | [ ] | | |

## 6a. Leakage map

**Built from scratch on 2026-08-19** from
`flolyt-figma-designs/Revenue Screens/flolyt-leakage-map/` (19 frames, LK01–LK19), superseding
kit-122's frames 44/45 ("leakage map consumer" / "leakage map accounts" — see section 6's note).
This is the first section of a new **Revenue** group, sibling to Every day, sourced from its own
`flolyt-figma-designs/Revenue Screens/` export — six more sections (Funnel, Scenario, Forecast,
Attribution, Value, Benchmarks) are documented there; Funnel was built next, same day, see
section 6b below, and Scenario followed on 2026-08-20, see section 6c. LK00 is an index/route-map
frame, not a product screen. Content was transcribed from the export's own `lk.py` generator
source (which holds every frame's exact copy as literal Python string arguments) rather than
parsed off the rendered SVG text nodes — confirmed more reliable than re-deriving copy from SVG
`<text>` elements, and it also resolved `Section.save()`'s auto-numbering (several frames are
saved under a provisional id in the source and land on their final `LKxx` number only once
sequenced — the on-disk filenames are what the routing below is keyed to).

**Route naming corrected 2026-08-19, after the first pass.** The export's own frame footers and
`REVENUE-GROUP.md` state the route as `/revenue/leaks` (`/settings/revenue/leaks` for settings),
and the section first shipped that way — but every other section in this app (Lifecycle, Rooms,
Digest, Inbox, Handoff, Goals, Value…) mounts at a flat top-level path that matches its sidebar
label, regardless of which folder group it lives in under `src/pages/`; nothing mounts under an
`/everyday/*` prefix even though those pages live in `pages/everyday/`. The user corrected this:
the **folder** nests under `src/pages/revenue/` purely for organization (matching the sidebar's
REVENUE group), but the **route** does not carry a `/revenue` prefix — same split as
`pages/everyday/lifecycle` → `/lifecycle`. Corrected to `/leakage-map` (sidebar label → kebab-case,
matching `business-memory`/`what-to-do-today`/`ai-teammates`) and `/settings/leakage-map`.
**Apply this same flat-URL rule to every future Revenue section** (Funnel → `/funnel`, not
`/revenue/funnel`; Scenario → `/scenario`; etc.) regardless of what the export's own footers say —
this is the one place in this app where "SVG/export wins on the route" is deliberately overridden
by the user's own architecture decision.

**Architecture — index-branching on query params first, then a mock flag:**
- `/leakage-map` (`src/pages/revenue/leakage-map/index.tsx`) is ONE route covering LK01 (nothing
  measured yet — before the 1 January baseline locks), LK02 (the first finding, 27 days since 4
  March), LK03 (the default populated map), LK05 (`?by=market`), LK06 (`?by=claim`), LK07
  (`?view=`, saved views — shown with "The map" tab still active, per its own footer), LK08
  (`?q=`, search — the one state with no tab bar at all), and LK11 (`?as=owner`, the "My stage"
  lens). `by`/`as`/`view`/`q` are checked in that order, then `LEAKAGE_MAP_STATE` (a 3-value mock
  flag defaulting to `"full"`) branches LK01/LK02/LK03 — LK01/LK02 are wired but unreachable with
  that default, same "not wired, no demo state currently triggers it" situation as every prior
  rebuild's empty/edge states.
- `/leakage-map/changed` (LK09), `/leakage-map/unmeasurable` (LK12), and
  `/leakage-map/detection` (LK13) are standalone sibling routes that share the same 6-tab bar
  (`tabs.tsx`) as the index states — spanning both the query-param states and these three routes,
  same "shared tab bar, not one route subtree" pattern as Digest's `settings/tabs.tsx`.
- `/leakage-map/:id` (`leak-detail-route.tsx`) only has two built reference rows: LK04
  (`delivery-fee-checkout`, the cross-stage "one leak, all ten stages" finding) and LK10
  (`adopt-depth`, the unowned Adopt line) — every other id falls back to a not-found state, same
  "one/two reference rows" pattern as Price's `plans/:id` and Today's `r-8f2c`. Reachable in-app
  from the map's own Adopt stage-name cell, the map's callout body, and the search result's
  release row.
- `/leakage-map/export` (LK17) and `/settings/leakage-map` (LK18) are standalone routes — the
  settings route sits outside the `/leakage-map` tree, matching the `/settings/digest` and
  `/settings/authority` precedent.
- **LK14/LK15/LK16 are three bespoke modals**, each hardcoded to the one row the export shows it
  opened against — `open-a-room-from-line-modal.tsx` (Adopt · feature depth, opened from its
  "none" room chip and the page-level "Open a room" button), `dispute-a-line-modal.tsx` (Price's
  ₦31M discount-only-buyers finding, opened from its room chip), and
  `reclassify-a-claim-modal.tsx` (Support's Lagos delivery failures finding, opened from its room
  chip) — same "hardcoded to one reference row, not generic" pattern as every other stage-specific
  modal in the app, since none of the three matched the shared `OpenARoomModal`'s own shape
  closely enough to reuse without forking it beyond recognition.
- LK19 (mobile) was treated as a responsive-design constraint on the main map table via Tailwind
  breakpoints (`hidden md:block` table / `md:hidden` stacked cards), not a separate page — same
  call as every prior section's mobile frame.

**Cross-section reuse, confirmed by reading both before reusing:** all eight named people in this
export (Ifeoma Nwosu, Tunde Bakare, Amara Okeke, Ravi Mehta, Zainab Yusuf, Sam Iyer, Ada Obi,
Kunle) are exact matches for `IFEOMA`/`TUNDE`/`AMARA`/`RAVI`/`ZAINAB`/`SAM`/`ADA`/`KUNLE` in
`rooms/data.ts` — reused directly, zero new `PersonRef`s needed. Four of ten agents also matched
existing `AgentRef`s (`REPEAT_DECAY`, `PRICE_MARGIN`, `INVOLUNTARY_CHURN`, `EXPANSION`); two new
ones this export introduces (`PRODUCT_REASON`, `CHURN_REASON`) were added locally to
`revenue/leakage-map/data.ts`. Two of the map's ten room names are exact matches for already-built rooms
— "Second order never happened" and "Cards failing on renewal night" — and link straight to
`/rooms/second-order-never-happened` and `/rooms/cards-failing-on-renewal-night`; the other eight
room names (e.g. "Fee shown before value") don't match any built room and render as plain text
rather than a fabricated link. `Chip`, `Callout`, `KpiCards`, `WideBarRow`, `StageSubpageHeader`,
and the shared `AssignAnOwnerModal` (reused as-is with a new Adopt-specific preset, LK10's own
"Zainab is the obvious candidate" framing) were all reused from `lifecycle/stage/` with zero
forking. A local `LeaksKvList` (`kv-list.tsx`) was written instead of reusing digest's `KvList`
because this section's tone vocabulary needed a sixth `muted`/ink-4 value on top of the app-wide
5-value `Tone` (for the export's own "—" / "Unavailable" / "always" rows) — `LkTone` is a superset
of `Tone`, not a fork of it.

**New UI this section introduces:** `lens-bar.tsx`'s `LensBar` — LK11's per-person "viewing as"
override (Ifeoma Nwosu, scoped to Retain), distinct from the sidebar's own Marketing/Sales/
Products/Everyone selector. Nothing else in the app has a named-person lens yet; if Value's `VL13`
("My rooms", Kunle) is built later from the Revenue export, this is the component to reuse.

| Piece | Status | Notes |
|---|---|---|
| Index — nothing measured / first leak / the map / by market / by claim / saved views / search / my stage | [x] | `src/pages/revenue/leakage-map/index.tsx` + `states/*.tsx`. LK01/LK02 wired but unreachable with `LEAKAGE_MAP_STATE`'s current default |
| What changed / Unmeasurable / Detection | [x] | `changed-route.tsx`, `unmeasurable-route.tsx`, `detection-route.tsx` |
| One leak (`:id`) | [x] | `leak-detail-route.tsx` — only `delivery-fee-checkout` and `adopt-depth` built, every other id falls back to not-found |
| Share and export | [x] | `export-route.tsx`, `/leakage-map/export` |
| Settings | [x] | `settings/leakage-map-settings-route.tsx`, `/settings/leakage-map` |
| Open a room from a line / Dispute a line / Reclassify a claim (modals) | [x] | `modals/*.tsx`, each hardcoded to the one row the export shows it against |
| Sidebar "Leakage map" link | [x] | pre-existing stub already correctly pointed at `/leakage-map` — briefly mis-pointed at `/revenue/leaks` mid-build, then reverted; see the route-naming note above |
| `tsc -b` clean + dev server + 14-route Playwright console/page-error sweep (including a not-found `:id`) + 3-modal click-test + a real-room cross-link click-test, re-run after the route rename | [x] | Verified 2026-08-19 |

## 6b. Funnel

**Built from scratch on 2026-08-19** from `flolyt-figma-designs/Revenue Screens/flolyt-funnel/`
(15 frames, FN01–FN15), superseding kit-122's frame 80 ("funnel explorer" — see section 12's
note). Second section of the Revenue group after Leakage map, same "read the export's own `.py`
generator source, not the rendered SVGs" approach — `fn.py` imports the same shared `rev.py`
chrome (`revnav`, `subtabs`, `steps`, `hero`, `empty`, `mobile`, `Section`) as `lk.py` did. FN00
is the index/route-map frame, not a product screen. On-disk filenames are the routing ground
truth (`Section.save()` auto-numbers past whatever literal id the script passes) — confirmed
against `fn.py`'s own `S.save()` call order.

**Route stays flat** per the rule established during Leakage map's build (see 6a above and
[[flolyt_flat_url_pattern]]): `/funnel`, not `/revenue/funnel`, even though the export's own frame
footers say `/revenue/funnel` throughout. Settings at `/settings/funnel`, not
`/settings/revenue/funnel`. The sidebar's "Funnel" link was already a pre-existing stub correctly
pointed at `/funnel` — no correction needed this time.

**Architecture — same index-branching shape as Leakage map:**
- `/funnel` (`src/pages/revenue/funnel/index.tsx`) is ONE route covering FN01 (not instrumented
  yet — 3 of 8 steps), FN02 (the first-run state, one step arrived overnight), FN03 (the default
  populated funnel, 8 steps with one Unavailable), FN06 (`?by=market`), FN07 (`?by=cohort`), and
  FN14 (the checkout stream degraded, two steps read Unavailable). `by` is checked first, then
  `FUNNEL_STATE` (a 4-value mock flag defaulting to `"full"`) branches FN01/FN02/FN14 — all three
  are wired but unreachable with that default, same "not wired, no demo state currently triggers
  it" situation as every prior rebuild's empty/edge states (verified by temporarily flipping the
  flag and sweeping each one).
- `/funnel/gaps` (FN08), `/funnel/compare` (FN05, "Where it bent"), and `/funnel/history` (FN12)
  are standalone sibling routes sharing the same 6-tab bar (`tabs.tsx`) as the index states —
  same "shared tab bar, not one route subtree" pattern as Leakage map's `tabs.tsx`.
- `/funnel/:step` (`step-detail-route.tsx`) only has one built reference row —
  `checkout-to-order` (FN04, "Reached checkout → placed a first order") — every other id falls
  back to a not-found state, same "one/two reference rows" pattern as Leakage map's `:id`.
- `/funnel/steps/new` (`new-step/`) is the "Define a step" wizard (FN09/FN10) — no `?step=` param
  in the source footer for either frame (both save to the same route), so step state is
  client-local, same pattern as Goals' `/goals/new`.
- FN11 ("Request instrumentation") is one bespoke modal, hardcoded to `checkout.fee_shown`,
  opened from `/funnel/gaps`'s page-level button — same "hardcoded to the one row the export
  shows it against" pattern as Leakage map's three modals.
- `/settings/funnel` (FN13, "What counts as a step") is a standalone route outside the `/funnel`
  tree, matching the `/settings/leakage-map` precedent.
- FN15 (mobile) was treated as a responsive-design constraint (the step-bar list is already a
  vertical stack, naturally mobile-friendly without a separate layout; every wide table gets
  `overflow-x-auto`), not a separate page — same call as every prior section's mobile frame.

**Cross-section reuse, confirmed by reading before reusing:** all named people (Sam Iyer, Zainab
Yusuf, Ifeoma Nwosu, Ravi Mehta) are exact matches for `SAM`/`ZAINAB`/`IFEOMA`/`RAVI` in
`rooms/data.ts`; three of four agents (`REPEAT_DECAY`, `ACQUISITION_QUALITY`, `PRICE_MARGIN`)
matched existing `AgentRef`s and the fourth (`PRODUCT_REASON`) was already defined in Leakage
map's own `data.ts` and reused directly rather than redefined — the first cross-*Revenue-section*
reuse in the group. `Chip`, `Callout`, `KpiCards`, `BarRow`/`BarTrack`, `StageSubpageHeader`, and
`usePageBreadcrumb` were all reused from `lifecycle/stage/` and the shared breadcrumb context with
zero forking. A local `FunnelKvList` (`kv-list.tsx`) was written instead of reusing Leakage map's
`LeaksKvList`, same reasoning as before — this section's tone vocabulary (`FnTone`: `ok`/`warn`/
`risk`/`ai`/`muted`/`neutral`/`num`) doesn't match `LkTone`'s value set closely enough to share the
type. A local `FunnelStepBars` (`step-bars.tsx`) renders the horizontal funnel-with-drop-off rows
(FN03/FN14) — no existing shared component matched that shape (label + count, a bar, and a
drop-off line below), so it was purpose-built rather than forked from `BarRow`/`WideBarRow`.

| Piece | Status | Notes |
|---|---|---|
| Index — not instrumented yet / first step / the funnel / by market / by cohort / degraded | [x] | `src/pages/revenue/funnel/index.tsx` + `states/*.tsx`. FN01/FN02/FN14 wired but unreachable with `FUNNEL_STATE`'s current default |
| Not instrumented / Compare / History (siblings) | [x] | `gaps-route.tsx`, `compare-route.tsx`, `history-route.tsx` |
| One step (`:step`) | [x] | `step-detail-route.tsx` — only `checkout-to-order` built, every other id falls back to not-found |
| Define a step (wizard) | [x] | `new-step/index.tsx` + `step-what.tsx`/`step-event.tsx`/`step-rail.tsx`, `/funnel/steps/new` |
| Request instrumentation (modal) | [x] | `modals/request-instrumentation-modal.tsx`, hardcoded to `checkout.fee_shown`, opened from `/funnel/gaps` |
| Settings | [x] | `settings/funnel-settings-route.tsx`, `/settings/funnel` |
| Sidebar "Funnel" link | [x] | pre-existing stub already correctly pointed at `/funnel` |
| `tsc -b` clean + dev server + 10-route Playwright console/page-error sweep (including a not-found `:step`) + modal open/close click-test + wizard step-1→2 click-test + all 3 unreachable mock states swept individually | [x] | Verified 2026-08-19 |

## 6c. Scenario

**Built from scratch on 2026-08-20** from
`flolyt-figma-designs/Revenue Screens/flolyt-scenario/flolyt-scenario/` (15 frames, SC01–SC15),
third section of the Revenue group after Leakage map and Funnel. Same "read the export's own
`.py` generator source, not the rendered SVGs" approach — `sc.py` imports the same shared `rev.py`
chrome as `lk.py`/`fn.py` did. SC00 is the index/route-map frame, not a product screen. On-disk
filenames are the routing ground truth (`Section.save()` auto-numbers past whatever literal id
the script passes) — confirmed against `sc.py`'s own `S.save()` call order, which matched the
on-disk sequence 1:1 this time (no reordering needed).

**Route stays flat** per [[flolyt_flat_url_pattern]]: `/scenario`, not `/revenue/scenarios`, even
though the export's own frame footers say `/revenue/scenarios` throughout. Settings at
`/settings/scenario`, not `/settings/revenue/scenarios`. The sidebar's "Scenario" link was already
a pre-existing stub correctly pointed at `/scenario` — no correction needed.

**Architecture — same index-branching shape as Leakage map/Funnel:**
- `/scenario` (`src/pages/revenue/scenario/index.tsx`) is ONE route covering SC01 (nothing
  modelled yet), SC02 (the first scenario, 40 minutes after saving), and SC03 (the default
  populated "Saved scenarios" list with the 4-tab bar). A 3-value `SCENARIO_STATE` mock flag
  (`empty`/`first`/`full`, defaulting to `"full"`) branches these — `empty`/`first` are wired but
  unreachable with that default, same "not wired, no demo state currently triggers it" situation
  as every prior rebuild's empty/edge states.
- `/scenario/blocked` (SC10), `/scenario/actuals` (SC09, "Against what happened"), and
  `/scenario/history` are standalone sibling routes sharing the same 4-tab bar (`tabs.tsx`) as the
  index's Saved state — same "shared tab bar, not one route subtree" pattern as prior sections.
  **History has no dedicated frame in the export** (SC01–SC15 cover the other three tabs plus the
  wizard/detail/modals/settings/mobile, none of them History) — built consistent with the
  timeline vocabulary SC08 already established (When/What/Who/Effect), widened across every saved
  scenario rather than just S-114's own.
- `/scenario/new` (`new/`) is the "Model a change" wizard (SC04–SC07 — the change, who it
  reaches, assumptions, the result). No `?step=` param in the source footer (all four frames save
  to the same route), so step state is client-local, same pattern as Funnel's `/funnel/steps/new`
  and Goals' `/goals/new`. The result step (SC07) ends with "Save as S-114", which toasts and
  navigates to `/scenario/s-114`.
- `/scenario/:id` (`scenario-detail-route.tsx`) has two built reference rows — `s-114` (SC08,
  "Reverse the delivery fee", the fully-detailed one with a timeline table) and `s-131`
  ("Reactivation wave three", built lighter from SC13's own stats block since it has no dedicated
  "one-scenario" frame of its own) — every other id falls back to a not-found state, same
  "one/two reference rows" pattern as Leakage map's/Funnel's `:id`/`:step`.
- Three bespoke modals (`modals/*.tsx`), each hardcoded to the one scenario the export shows it
  opened against — same "hardcoded, not generalized" pattern as Leakage map's three modals:
  - SC11 "Change an assumption" — opens from `/scenario/s-114`, fixed to its weakest input ("it
    returns over 9 weeks" → 14 weeks).
  - SC12 "Share a scenario" — opens from the Saved list's share icon (S-114's row only), fixed to
    S-114's own share preset.
  - SC13 "Turn it into something" — opens from `/scenario/s-131`, and its primary action
    ("Attach to the room") actually navigates to `/rooms/second-order-never-happened`, the same
    room LK03/LK04 already link to from Leakage map.
- `/settings/scenario` (SC14) is a standalone route outside the `/scenario` tree, matching the
  `/settings/funnel` precedent.
- SC15 (mobile) was treated as a responsive-design constraint (tables scroll, cards stack), not a
  separate page — same call as every prior section's mobile frame.

**Cross-section reuse, confirmed by reading before reusing:** all named people (Ada Obi, Kunle,
Ifeoma Nwosu, Ravi Mehta, Zainab Yusuf, Tunde Bakare, Sam Iyer) are exact matches for
`ADA`/`KUNLE`/`IFEOMA`/`RAVI`/`ZAINAB`/`TUNDE`/`SAM` in `rooms/data.ts`; both agents
(`PRICE_MARGIN`, `REPEAT_DECAY`) matched existing `AgentRef`s with no new people or agents needed.
`Chip`, `Callout`, `KpiCards`, `PersonAvatar`, `StageSubpageHeader`, and `usePageBreadcrumb` were
all reused from `lifecycle/stage/` and the shared breadcrumb context with zero forking. A local
`ScenarioKvList` (`kv-list.tsx`) was written instead of reusing Funnel's `FunnelKvList` — this
section's tone vocabulary (`ScTone`) is identical in shape to `FnTone` but kept as its own type per
the established "each section owns its tone type" convention. A local `RangeBars` (`range-bars.tsx`)
renders the "what moves the range" sensitivity bars (SC07) — closest to Funnel's `FunnelStepBars`
but a different shape (percent-of-spread rather than count/percent-of-total), so purpose-built
rather than forked.

| Piece | Status | Notes |
|---|---|---|
| Index — no scenarios yet / the first scenario / saved scenarios | [x] | `src/pages/revenue/scenario/index.tsx` + `states/*.tsx`. `empty`/`first` wired but unreachable with `SCENARIO_STATE`'s current default |
| Blocked / Against what happened / History (siblings) | [x] | `blocked-route.tsx`, `actuals-route.tsx`, `history-route.tsx` — History has no dedicated frame, built consistent with SC08's timeline shape |
| One scenario (`:id`) | [x] | `scenario-detail-route.tsx` — `s-114` and `s-131` built, every other id falls back to not-found |
| Model a change (wizard) | [x] | `new/index.tsx` + `step-change.tsx`/`step-reach.tsx`/`step-assumptions.tsx`/`step-result.tsx`/`step-rail.tsx`, `/scenario/new` |
| Change an assumption / Share a scenario / Turn it into something (modals) | [x] | `modals/*.tsx`, hardcoded to S-114/S-114/S-131 respectively |
| Settings | [x] | `settings/scenario-settings-route.tsx`, `/settings/scenario` |
| Sidebar "Scenario" link | [x] | pre-existing stub already correctly pointed at `/scenario` |
| `tsc -b` clean + dev server route sweep + all 3 modals click-tested + wizard step-1→4 click-tested + both unreachable mock states swept individually | [x] | Verified 2026-08-20 |

## 6d. Attribution

**Built from scratch on 2026-08-20** from
`flolyt-figma-designs/Revenue Screens/flolyt-attribution/flolyt-attribution/` (16 frames,
AT01–AT16), fourth section of the Revenue group after Leakage map/Funnel/Scenario, superseding
kit-122's frame 82 ("attribution" — see section 6's note). Same "read the export's own `.py`
generator source, not the rendered SVGs" approach — `at.py` imports the same shared `rev.py`
chrome as `lk.py`/`fn.py`/`sc.py` did. AT00 is the index/route-map frame, not a product screen.
On-disk filenames are the routing ground truth (`Section.save()` auto-numbers past whatever
literal id the script passes — several frames are saved under a provisional id and land on their
final `ATxx` number only once sequenced).

**Route stays flat** per [[flolyt_flat_url_pattern]]: `/attribution`, not `/revenue/attribution`,
even though the export's own frame footers say `/revenue/attribution` throughout. Settings at
`/settings/attribution`, not `/settings/revenue/attribution`. The sidebar's "Attribution" link was
already a pre-existing stub correctly pointed at `/attribution` — no correction needed.

**Architecture — same index-branching shape as Leakage map/Funnel/Scenario:**
- `/attribution` (`index.tsx`) is ONE route covering AT01 (nothing attributed yet), AT02 (the
  first holdout closes), and AT03 (the default populated "Attributed" board with the 5-tab bar). A
  3-value `ATTRIBUTION_STATE` mock flag (`empty`/`first`/`full`, defaulting to `"full"`) branches
  these — `empty`/`first` are wired but unreachable with that default, same "not wired" situation
  as every prior rebuild's empty/edge states.
- `/attribution/holdouts` (`holdouts-route.tsx`) is a second branching route: AT05 (four holdouts
  running, clean) versus AT14 (one holdout contaminated by a resend that bypassed the hold list),
  on its own 2-value `HOLDOUT_STATE` flag (`clean`/`contaminated`, defaulting to `"clean"`) — a new
  pattern for this app, a mock flag scoped to one tab route rather than the section index.
- `/attribution/overlap`, `/attribution/unattributable`, and `/attribution/methods` are standalone
  sibling routes sharing the same 5-tab bar (`tabs.tsx`) as the index's Attributed state — same
  "shared tab bar, not one route subtree" pattern as prior sections.
- `/attribution/holdouts/new` (`new-holdout/`) is the "Design a holdout" wizard (AT11–AT12 — size
  and duration, then who is excluded). No `?step=` param in the source footer, so step state is
  client-local, same pattern as Funnel's/Scenario's wizards. Step 2 reuses the exact same exclusion
  list as `/attribution/holdouts`' own "who is never held back" table (`AT_EXCLUDED_ROWS` in
  `data.ts`) — identical content in the export, so shared rather than duplicated.
- `/attribution/:id` (`intervention-detail-route.tsx`) has one built reference row — `retry-0900`
  (AT04, "Retry cards at 09:00 local") — every other id falls back to a not-found state, same
  "one/two reference rows" pattern as every prior section's `:id`/`:step`.
- `/attribution/disputes/:id` (`dispute-detail-route.tsx`) has one built reference row — `1`
  (AT13, "₦16M claimed twice") — a new secondary detail-route shape for this app (a dispute is not
  an intervention, so it gets its own `/disputes/` sub-path rather than overloading `/attribution/:id`).
- Two bespoke modals (`modals/*.tsx`), each hardcoded to the one row the export shows it opened
  against — same "hardcoded, not generalized" pattern as every prior section's modals:
  - AT09 "Credit a recovery" — opens from the Kenya retry window row on `/attribution/holdouts`
    (the one holdout closing "today"), fixed to its own preset.
  - AT10 "Mark it unattributable" — opens from the Accra reactivation row on
    `/attribution/unattributable`, fixed to its own preset.
- `/settings/attribution` (AT15) is a standalone route outside the `/attribution` tree, matching
  the `/settings/scenario` precedent.
- AT16 (mobile) was treated as a responsive-design constraint (tables scroll, cards stack), not a
  separate page — same call as every prior section's mobile frame.

**Cross-section reuse, confirmed by reading before reusing:** all named people (Ravi Mehta, Ifeoma
Nwosu, Zainab Yusuf, Tunde Bakare, Amara Okeke, Sam Iyer, Ada Obi, Kunle) are exact matches for
`RAVI`/`IFEOMA`/`ZAINAB`/`TUNDE`/`AMARA`/`SAM`/`ADA`/`KUNLE` in `rooms/data.ts` — zero new people
needed, the first section where all eight named people already existed. One new agent was needed:
`ATTRIBUTION_SIGNAL` ("Attribution Signal"), the agent that reads the Tunde/Ravi overlap dispute
and refuses to pick a side — none of the seven existing `rooms/data.ts` agents fit, so it was
defined locally in `attribution/data.ts`, same "defined locally, available for reuse" precedent as
Funnel's `PRODUCT_REASON`. `Chip`, `Callout`, `KpiCards`, `PersonAvatar`, `StageSubpageHeader`, and
`usePageBreadcrumb` were all reused from `lifecycle/stage/` and the shared breadcrumb context with
zero forking. A local `AttributionKvList` and `AttributionBars` were written fresh rather than
reusing Scenario's `ScenarioKvList`/`RangeBars` — this section's tone vocabulary (`AtTone`) is
identical in shape but kept as its own type per the established "each section owns its tone type"
convention.

| Piece | Status | Notes |
|---|---|---|
| Index — nothing attributed yet / first holdout closes / the board | [x] | `index.tsx` + `states/*.tsx`. `empty`/`first` wired but unreachable with `ATTRIBUTION_STATE`'s current default |
| Holdouts (clean / contaminated) | [x] | `holdouts-route.tsx` + `states/the-holdouts.tsx`/`states/contaminated-holdout.tsx`. `contaminated` wired but unreachable with `HOLDOUT_STATE`'s current default |
| Overlap / Unattributable / Methods (siblings) | [x] | `overlap-route.tsx`, `unattributable-route.tsx`, `methods-route.tsx` |
| One intervention (`:id`) | [x] | `intervention-detail-route.tsx` — `retry-0900` built, every other id falls back to not-found |
| One dispute (`disputes/:id`) | [x] | `dispute-detail-route.tsx` — `1` built, every other id falls back to not-found |
| Design a holdout (wizard) | [x] | `new-holdout/index.tsx` + `step-size.tsx`/`step-exclusions.tsx`/`step-rail.tsx`, `/attribution/holdouts/new` |
| Credit a recovery / Mark it unattributable (modals) | [x] | `modals/*.tsx`, hardcoded to Kenya retry window / Accra reactivation respectively |
| Settings | [x] | `settings/attribution-settings-route.tsx`, `/settings/attribution` |
| Sidebar "Attribution" link | [x] | pre-existing stub already correctly pointed at `/attribution` |
| `tsc -b` clean + dev server route sweep + both modals click-tested + wizard step-1→2 click-tested + both unreachable mock states swept individually | [x] | Verified 2026-08-20 |

## 6e. Benchmarks

**Built from scratch on 2026-08-20** from
`flolyt-figma-designs/Revenue Screens/flolyt-benchmarks/flolyt-benchmarks/` (16 files on disk,
BM00–BM15), fifth section of the Revenue group after Leakage map/Funnel/Scenario/Attribution. Same
"read the export's own `.py` generator source, not the rendered SVGs" approach — `bm.py` imports
the same shared `rev.py` chrome. BM00 is the index/route-map frame, not a product screen. Note:
`bm.py`'s own internal `S.save("BM02", ...)` id is reused once (both "the first comparison" and
"against our own past" save under the literal id `"BM02"`) — the on-disk SVG filenames are treated
as the routing ground truth, same "on-disk wins over the script's own internal id" precedent as
Attribution.

**Route stays flat** per [[flolyt_flat_url_pattern]]: `/benchmarks`, not `/revenue/benchmarks`,
even though the export's own frame footers say `/revenue/benchmarks` throughout. Settings at
`/settings/benchmarks`, not `/settings/revenue/benchmarks`. The sidebar's "Benchmarks" link was
already a pre-existing stub correctly pointed at `/benchmarks` — no correction needed.

**Architecture — same index-branching shape as Leakage map/Funnel/Scenario/Attribution, plus a new
query-param-tab wrinkle:**
- `/benchmarks` (`index.tsx`) is ONE route covering BM01 (nothing to compare yet), BM02-disk (the
  baseline locks overnight, a first unreadable zero), and BM03-disk (the default populated "Our own
  past" state with the 5-tab bar). A 3-value `BENCHMARK_STATE` mock flag (`empty`/`first`/`full`,
  defaulting to `"full"`) branches these — `empty`/`first` are wired but unreachable with that
  default, same "not wired" situation as every prior rebuild's empty/edge states.
- **New pattern this section adds:** two of the five tabs — "Market vs market" and "Stage vs
  stage" — are NOT sibling routes but `?by=market`/`?by=stage` query params read inside the same
  `/benchmarks` `index.tsx` (same query-param-tab shape as the Digest rebuild), independent of
  `BENCHMARK_STATE`. The other two non-index tabs ("Against a holdout", "Not compared") are
  ordinary sibling routes, same as every prior section's tab bar.
- `/benchmarks/holdouts` (`holdouts-route.tsx`, BM06-disk) — the causal comparisons. Its "Design a
  holdout" action reuses Attribution's already-built `/attribution/holdouts/new` wizard rather than
  duplicating a second holdout designer — the first cross-section reuse of a full built flow in the
  Revenue group (previous cross-links, like Scenario's room link, only reused a destination page,
  not another section's wizard).
- `/benchmarks/refused` (`refused-route.tsx`, BM08-disk) is the "Not compared" tab landing;
  `/benchmarks/limits` (`limits-route.tsx`, BM09-disk) is a secondary page linked from it — the
  export gives both frames the same `subtabs(p, "Not compared", ...)` call but two different routes
  in their own footers, so both are built as siblings under one tab, cross-linked to each other.
- `/benchmarks/like-for-like` (`like-for-like-route.tsx`, BM10-disk) is linked from the "Our own
  past" tab's own table (a "What has to match…" footer link), same "secondary page off a tab, not
  in the tab bar itself" shape as `limits`.
- `/benchmarks/new` (`new/`) is the "Build a comparison" wizard (BM11–BM12 — what against what,
  then what has to match). No `?step=` param in the source footer, so step state is client-local,
  same pattern as every prior section's wizard. Saving navigates to `/benchmarks/repeat-rate`,
  since the wizard's own preset (Nigeria vs UK repeat rate) is exactly that page's subject.
- `/benchmarks/:id` (`repeat-rate-detail-route.tsx`) has one built reference row — `repeat-rate`
  (BM07-disk, "One comparison in full") — every other id falls back to a not-found state, same
  "one/two reference rows" pattern as every prior section's `:id`/`:step`. Linked from the "Our own
  past" table's first row.
- One bespoke modal (`modals/add-an-external-benchmark-modal.tsx`, BM12-disk/BM13-disk) — "Add an
  external benchmark", opened from `/benchmarks/refused`'s header action, hardcoded to its own
  preset (a 34% food-delivery figure) with no form that actually adds anything — same
  "hardcoded, not generalized, the refusal is the feature" pattern as every prior section's modals.
- `/settings/benchmarks` (BM13-disk/BM14-disk) is a standalone route outside the `/benchmarks`
  tree, matching the `/settings/attribution` precedent. Like every other Revenue section's settings
  page (`/settings/funnel`, `/settings/scenario`, `/settings/attribution`, `/settings/value`), it
  has no in-app link pointing to it yet — a pre-existing gap across the whole settings family, not
  new to this section, flagged here per [[flag_unreachable_routes]] rather than fixed unilaterally
  since it would need a decision about where a cross-section settings entry point belongs.
- BM15-disk (mobile) was treated as a responsive-design constraint (tables scroll, cards stack),
  not a separate page — same call as every prior section's mobile frame.

**Cross-section reuse, confirmed by reading before reusing:** the "RD" agent avatar on BM02-disk's
first-comparison card is an exact match for `REPEAT_DECAY` ("Repeat & Decay") in `rooms/data.ts` —
fitting, since the frame is about a repeat-rate figure — the first Revenue section needing zero new
people or agents at all. `Chip`, `Callout`, `KpiCards`, `PersonAvatar`, `StageSubpageHeader`, and
`usePageBreadcrumb` were all reused from `lifecycle/stage/` and the shared breadcrumb context with
zero forking. A local `BenchmarksKvList` (`kv-list.tsx`) was written fresh rather than reusing
Attribution's `AttributionKvList` — this section's tone vocabulary (`BmTone`) is identical in shape
but kept as its own type per the established "each section owns its tone type" convention. No bars
component was needed (this section is table- and hero-driven, not bar-chart-driven).

| Piece | Status | Notes |
|---|---|---|
| Index — nothing to compare yet / first comparison / our own past | [x] | `index.tsx` + `states/*.tsx`. `empty`/`first` wired but unreachable with `BENCHMARK_STATE`'s current default |
| Market vs market / Stage vs stage (query-param tabs) | [x] | `states/market-against-market.tsx`/`states/stage-against-stage.tsx`, rendered by `index.tsx` on `?by=market`/`?by=stage` |
| Against a holdout | [x] | `holdouts-route.tsx` — "Design a holdout" reuses `/attribution/holdouts/new` |
| Not compared (refused) / Where comparison breaks (limits) | [x] | `refused-route.tsx`, `limits-route.tsx` — cross-linked to each other |
| Like for like | [x] | `like-for-like-route.tsx`, linked from the "Our own past" table |
| One comparison in full (`:id`) | [x] | `repeat-rate-detail-route.tsx` — `repeat-rate` built, every other id falls back to not-found |
| Build a comparison (wizard) | [x] | `new/index.tsx` + `step-what.tsx`/`step-matching.tsx`/`step-rail.tsx`, `/benchmarks/new` |
| Add an external benchmark (modal) | [x] | `modals/add-an-external-benchmark-modal.tsx`, hardcoded preset, opens from `/benchmarks/refused` |
| Settings | [x] | `settings/benchmarks-settings-route.tsx`, `/settings/benchmarks` — no in-app entry point yet, same as every other Revenue section's settings page |
| Sidebar "Benchmarks" link | [x] | pre-existing stub already correctly pointed at `/benchmarks` |
| `tsc -b` clean + dev server route sweep (11 routes incl. a not-found `:id`) + modal click-tested + wizard step-1→2→save click-tested through to the toast+navigate | [x] | Verified 2026-08-20 |

## 6f. Forecast

**Built from scratch on 2026-08-21** from
`flolyt-figma-designs/Revenue Screens/flolyt-forecast/flolyt-forecast/` (14 frames, FC01–FC14),
the sixth Revenue section built (after Leakage map/Funnel/Scenario/Attribution/Benchmarks) but,
per `REVENUE-GROUP.md`'s own gap-closure note, the **fourth child of the Revenue group in sidebar
order** — it sits between Scenario and Attribution, both in the sidebar and in `route.tsx`. Same
"read the export's own `.py` generator source, not the rendered SVGs" approach — `fc.py` imports
the same shared `rev.py` chrome. FC00 is the index/route-map frame, not a product screen. This is
a brand-new section (not a kit-122 supersession) — `REVENUE-AUDIT.md` had flagged Forecast as an
orphaned structural gap, closed by this export.

**Route stays flat** per [[flolyt_flat_url_pattern]]: `/forecast`, not `/revenue/forecast`, even
though the export's own frame footers say `/revenue/forecast` throughout. Settings at
`/settings/forecast`, not `/settings/revenue/forecast`. The sidebar had no "Forecast" item at all
(the one gap this section's own build request called out) — added between "Scenario" and
"Attribution" with a `LineChart` icon.

**Architecture — same index-branching shape as every prior Revenue section, plus a query-param-tab
pair like Benchmarks':**
- `/forecast` (`index.tsx`) is ONE route covering FC01 (nothing to forecast from — no baseline, no
  owner has committed to a number), FC02 (the first forecast, Kunle's 88.4% renewal figure), and
  FC03 (the default populated "Next 90 days" state with the 6-tab bar). A 3-value `FORECAST_STATE`
  mock flag (`empty`/`first`/`full`, defaulting to `"full"`) branches these — `empty`/`first` are
  wired but unreachable with that default, same "not wired" situation as every prior rebuild's
  empty/edge states.
- **Tab-frame gap, same shape as Scenario's History:** `fc.py`'s own `TABS` list has six entries,
  but no frame ever calls `subtabs(p, "By stage", TABS)` — only "Next 90 days", "By market",
  "Blocked", "Against actuals" and "History" get an active frame. Built `?by=stage` anyway, reusing
  FC03's own per-stage table (dropping the summary cards), the same "reuse an adjacent frame's data
  shape rather than inventing new copy" call Scenario's History made for an identical kind of gap.
  "By market" (`?by=market`, FC05-disk) is the section's other query-param tab, mirroring
  Benchmarks' `?by=market`/`?by=stage` pair exactly. "Blocked" (`/forecast/blocked`, FC06-disk),
  "Against actuals" (`/forecast/actuals`, FC07-disk) and "History" (`/forecast/history`, FC12-disk)
  are ordinary sibling routes, same as every prior section's tab bar.
- `/forecast/:stage` (`stage-detail-route.tsx`) has one built reference row — `renew` (FC04-disk,
  "One forecast") — every other stage falls back to a not-found state, same "one/two reference
  rows" pattern as every prior section's `:id`/`:step`. Linked from the "Next 90 days" and "By
  stage" tables' Renew row.
- `/forecast/:stage/re-forecast` (`re-forecast/`) is the "Re-forecast" wizard (FC08–FC09 — what has
  changed, then your number). No `?step=` param in the source footer, so step state is
  client-local, same pattern as every prior section's wizard. Only `renew` renders the wizard
  content (every other `:stage` gets a lightweight "not available for this stage" fallback, since
  no other stage has a built re-forecast flow). Saving navigates to `/forecast/renew`, since signing
  a number is exactly that page's subject.
- Two bespoke modals, hardcoded to specific figures, not generalized — same pattern as every prior
  section's modals: `modals/an-overdue-re-forecast-modal.tsx` (FC10-disk, "An overdue re-forecast")
  opens from the "Next 90 days"/"By stage" tables' Renew row via its "overdue" chip; the primary
  action is "Ask Kunle" (a toast, not a navigation — re-forecasting is Kunle's job, not the viewer's).
  `modals/revise-a-signed-forecast-modal.tsx` (FC11-disk, "Revise a signed forecast") opens from a
  "Revise a signed forecast" button on `/forecast/actuals` — the export's own modal base frame is
  the "Against actuals" tab even though its preset content (Retain, 29.8% → 27.9%) is a live
  forecast rather than one of that table's own closed rows, the same "read the preset content
  itself, not just which tab frame the modal was drawn over" call the Attribution rebuild made.
- `/settings/forecast` (FC13-disk) is a standalone route outside the `/forecast` tree, matching the
  `/settings/benchmarks` precedent.
- FC14-disk (mobile) was treated as a responsive-design constraint (tables scroll, cards stack), not
  a separate page — same call as every prior section's mobile frame.

**Cross-section reuse, confirmed by reading before reusing:** all 6 named people (Kunle, Ifeoma,
Ravi, Zainab, Tunde, Amara) plus Ada and Sam mentioned by name are exact matches for existing
`rooms/data.ts` refs, including departments (e.g. Ifeoma → Marketing, matching her FC12-disk
avatar row exactly) — the second Revenue section (after Attribution) needing zero new people or
agents at all. `Chip`, `Callout`, `KpiCards`, `PersonAvatar`, `StageSubpageHeader`, and
`usePageBreadcrumb` were all reused from `lifecycle/stage/` and the shared breadcrumb context with
zero forking. A local `ForecastKvList` (`kv-list.tsx`) was written fresh rather than reusing
Benchmarks' `BenchmarksKvList` — this section's tone vocabulary (`FcTone`) is identical in shape but
kept as its own type per the established "each section owns its tone type" convention. No bars
component was needed (this section is table- and hero-driven, not bar-chart-driven).

| Piece | Status | Notes |
|---|---|---|
| Index — nothing to forecast from / the first forecast / next 90 days | [x] | `index.tsx` + `states/*.tsx`. `empty`/`first` wired but unreachable with `FORECAST_STATE`'s current default |
| By stage (query-param tab, no dedicated frame) / By market (query-param tab) | [x] | `states/by-stage.tsx` (reuses FC03's table), `states/by-market.tsx`, rendered by `index.tsx` on `?by=stage`/`?by=market` |
| Blocked | [x] | `blocked-route.tsx` |
| Against actuals | [x] | `actuals-route.tsx` — also hosts the "Revise a signed forecast" modal |
| History | [x] | `history-route.tsx` |
| One forecast (`:stage`) | [x] | `stage-detail-route.tsx` — `renew` built, every other stage falls back to not-found |
| Re-forecast (wizard) | [x] | `re-forecast/index.tsx` + `step-what-changed.tsx`/`step-your-number.tsx`/`step-rail.tsx`, `/forecast/:stage/re-forecast` |
| An overdue re-forecast (modal) | [x] | `modals/an-overdue-re-forecast-modal.tsx`, opens from the Renew row's "overdue" chip |
| Revise a signed forecast (modal) | [x] | `modals/revise-a-signed-forecast-modal.tsx`, opens from `/forecast/actuals` |
| Settings | [x] | `settings/forecast-settings-route.tsx`, `/settings/forecast` — no in-app entry point yet, same as every other Revenue section's settings page |
| Sidebar "Forecast" link | [x] | added between "Scenario" and "Attribution" with a `LineChart` icon — this section's own build request flagged it as missing |
| `tsc -b` clean + dev server route sweep (10 routes incl. a not-found `:stage`) + both modals click-tested + wizard step-1→2→save click-tested through to the toast+navigate + `empty`/`first` mock states swept individually by temporarily flipping and reverting | [x] | Verified 2026-08-21 |

## 6g. Business memory

**Built from scratch on 2026-08-21** from
`flolyt-figma-designs/Knowledge Screens/flolyt-business-memory/flolyt-business-memory/` (18 frames,
ME01–ME18), superseding kit-122's frame 48 ("business memory" — see section 6's note, row 937).
This is the first section of a brand-new **Knowledge** group, sibling to Every day/Revenue/
Customers — the sidebar's KNOWLEDGE group already listed all four of its sections (Business
memory, Playbooks, Community, Recognition) pointing at their flat routes before any of them were
built; three more sections (Playbooks, Community, Recognition) are documented as sibling folders
in the same `Knowledge Screens/` export, not yet built. Kept under this tracker's old section-6
numbering (not a new top-level "Knowledge" section number) purely to match this file's own
convention of anchoring a rebuild's letter to whichever legacy kit-122 range it superseded — the
same reason Handoff (an Every day sidebar section) sits under legacy section 7 rather than 3.
Content was transcribed from the export's own `me.py` generator source (plus shared `know.py`
sidebar chrome), same "read the `.py`, don't parse the SVG" approach as every prior section.

**Route stays flat, per the established rule**: the section lives on disk at
`src/pages/knowledge/business-memory/` (folder nests under `src/pages/knowledge/` purely to
mirror the sidebar's KNOWLEDGE group, same as `pages/customers/*` and `pages/revenue/*`), but
mounts at the flat `/business-memory` — no `/knowledge` prefix, and not the export's own
`/knowledge/memory` footer route either. This exactly reused the old superseded page's route, so
no sidebar change was needed. Settings is `/settings/business-memory`, outside the
`/business-memory` tree, matching `/settings/leakage-map`.

**Architecture — index-branching on a query param first, then a mock flag:**
- `/business-memory` (`index.tsx`) is ONE route covering ME01 (no room has closed yet), ME02
  (the first learning, written by a room that claimed ₦0), ME03 (the default "all 61 learnings"
  table), and ME08 (`?q=`, search — the one state with no tab bar). `q` is checked first, then
  `MEMORY_STATE` (a 3-value mock flag defaulting to `"full"`) branches ME01/ME02/ME03 — ME01/ME02
  are wired but unreachable with that default, same "not wired, no demo state currently triggers
  it" situation as every prior rebuild's empty/edge states.
- `/business-memory/superseded` (ME05), `/constraints` (ME06), `/challenged` (ME09), `/questions`
  (ME10), and `/review` (ME14) are standalone sibling routes sharing the same 6-tab bar
  (`tabs.tsx`, underline style per the house rule — not the export's own pill-tab rendering) as
  the index's "Learnings" state.
- `/business-memory/sources` (ME07, "Where these come from") and `/business-memory/undocumented`
  (ME11, "Not written down" — Peter Kariuki's four-day departure countdown, reusing `PersonDot`
  and the same hero-banner shape as Handoff's `/settings/departures`) are standalone routes with
  their own header and no tab bar, reached via crumb/in-app links rather than a tab.
- `/business-memory/new` (`new/index.tsx`) is the 2-step "Write a learning" wizard (ME12 the claim
  → ME13 scope and evidence). Step position lives in `?step=`, not local `useState`, per the
  since-adopted URL-over-state rule for wizards.
- `/business-memory/:id` (`learning-detail-route.tsx`) only has one built reference row: ME04
  (`first-order-discount`) — every other id falls back to a not-found state, same "one/two
  reference rows" pattern as every prior section's `:id` route. Reachable from the Learnings
  table's row link.
- **ME15/ME16 are two bespoke modals**, each hardcoded to the one row the export shows it opened
  against — `cite-a-learning-modal.tsx` ("Unsubscribes fell 41% after the cadence change," wired
  from the Learnings table) and `supersede-a-learning-modal.tsx` ("Reactivation works best on a
  Thursday," wired from the Superseded table) — via a `rowAction` field set on exactly those two
  rows, same "only this row has a wired row action" pattern as Segments' SG12/13/14.
- ME18 (mobile) was treated as a responsive-design constraint via Tailwind breakpoints (`hidden
  md:block` table / `md:hidden` stacked cards on the Learnings table), not a separate page — same
  call as every prior section's mobile frame.

**Cross-section reuse, confirmed by reading both before reusing:** Kunle, Tunde, Zainab
(`CHALLENGED_ROWS`) and Repeat & Decay/Orchestrator (`REVIEW_ROWS`) are exact matches for
`KUNLE`/`TUNDE`/`ZAINAB`/`REPEAT_DECAY`/`ORCHESTRATOR` in `rooms/data.ts`; Peter Kariuki
(`ME11_HERO`) is an exact match for `PETER` in `digest/data.ts` — all reused directly, zero new
`PersonRef`s needed. One new `AgentRef` was needed (`ACTIVATION`, "AC") — not on the existing
rooms/lifecycle roster, added locally to this section's own `data.ts` rather than the shared
roster, same precedent as Digest's locally-added East Africa CS people. `Callout`, `Chip`/
`CHIP_INTERACTIVE_CLASS`, `KpiCards`, `StageSubpageHeader`, `PersonDot`/`AgentDot`, and
`usePageBreadcrumb` were all reused from `lifecycle/stage/`, `rooms/actor.tsx`, and the shared
breadcrumb context with zero forking. A local `BusinessMemoryKvList` (`kv-list.tsx`) and a new
`QuoteCard` (`quote-card.tsx`, the serif-face "a learning stated as a sentence" card used on
ME02/ME04/first-learning) were written fresh — the quote card's left accent strand from the
export's own `quote()` python helper was flattened per the house "no card strands" rule.

| Piece | Status | Notes |
|---|---|---|
| Index — nothing learned yet / first learning / all 61 / search | [x] | `index.tsx` + `states/*.tsx`. ME01/ME02 wired but unreachable with `MEMORY_STATE`'s current default |
| One learning (`:id`) | [x] | `learning-detail-route.tsx` — only `first-order-discount` built, every other id falls back to not-found |
| Superseded / Constraints / Challenged / Open questions / Due for review | [x] | `superseded-route.tsx`, `constraints-route.tsx`, `challenged-route.tsx`, `questions-route.tsx`, `review-route.tsx`, all sharing `tabs.tsx` |
| Where these come from / Not written down | [x] | `sources-route.tsx` (`/business-memory/sources`), `undocumented-route.tsx` (`/business-memory/undocumented`) — both standalone, no tab bar |
| Write a learning (wizard) | [x] | `new/index.tsx` + `step-claim.tsx`/`step-scope.tsx`/`step-rail.tsx`, `?step=`, `/business-memory/new` |
| Cite a learning / Supersede a learning (modals) | [x] | `modals/cite-a-learning-modal.tsx`, `modals/supersede-a-learning-modal.tsx` — each wired via `rowAction` on one table row |
| Settings | [x] | `settings/business-memory-settings-route.tsx`, `/settings/business-memory` |
| Sidebar "Business memory" link | [x] | pre-existing KNOWLEDGE-group stub already correctly pointed at `/business-memory` |
| Old `src/pages/business-memory/` (kit-122 static mock) removed | [x] | Fully superseded, zero remaining references |
| `tsc -b` clean + dev server + 13-route Playwright console/page-error sweep + both modals click-tested | [x] | Verified 2026-08-21 |

## 7. Teams (51–58)

| # | Screen | Status | Endpoint(s) | Notes |
|---|---|---|---|---|
| 51 | team marketing | [ ] | | |
| 52 | team product | [ ] | | |
| 53 | team sales | [ ] | | |
| 54 | team customer success | [ ] | | |
| 55 | team engineering | [ ] | | |
| 56 | executive unit economics | [ ] | | |
| 57 | cross-functional handoff | [x] | | Superseded — rebuilt as `/handoff` from the newer `flolyt-handoff` export, see section 7a |
| 58 | routing | [ ] | | |

## 7a. Handoff

**Built from scratch on 2026-08-19** from `flolyt-figma-designs/Everyday Screens/flolyt-handoff/`
(17 screens, H00–H16), superseding kit-122's frame 57 ("cross-functional handoff" — see section 7's
note) — same "old design source superseded, don't resurrect the old shape" situation as
today/goals/digest/inbox/lifecycle/rooms. H00 is an index/route-map frame, not a product screen.
Extraction was done by two parallel research agents (H00–H08 / H09–H16), each producing a verbatim
structured spec before any code was written. A `flolyt-figma-designs/Everyday Screens/flow-diagrams/
07-handoff.svg` route map was also read first as an architecture sanity check, per
[[flolyt_flow_diagrams]] — it confirmed "Overdue" is a state filter on the index (`?state=overdue`),
not its own route, and that H02 (index)/H06 (one obligation)/H07 (accept-or-dispute) were the
diagram's own "missing — recommended" additions that make the section a working surface rather than
just H04's one illustrative chain.

**Architecture — index-branching on query params first, then a mock flag:**
- `/handoff` (`src/pages/handoff/index.tsx`) is ONE route covering H01 (no handoffs yet — empty
  state), H02 (default populated chains index), H03 (`?owner=me`) and H10 (`?state=overdue`) —
  `owner`/`state` query params are checked first, then the `HANDOFF_EMPTY` mock flag. H01 is wired
  but unreachable with the current default, same "not wired, no demo state currently triggers it"
  situation as every prior rebuild's empty state. "Owed by me" and "Owed to me" tabs both point at
  `/handoff?owner=me` — that one built page (H03) already shows both directions, and no separate
  screen exists for an owed-to-me-only view.
- `/handoff/:id` (`chain/chain-layout.tsx` + `chain-home-route.tsx`) resolves a chain and branches on
  its own `status`, mirroring Rooms' `RoomLayout`/`RoomHomeRoute` split — `closed` renders
  `closed-chain-route.tsx` (H14, own header, no tab bar), everything else renders
  `live-chain-route.tsx` (H04, timeline + insights) under a 2-tab bar (`chain-tabs.tsx`: The chain /
  Obligations). H05's own tab bar shows a third "Timeline" tab, but no screen in this export backs a
  separate timeline view — H04 already is one — so it was left out rather than built as dangling nav,
  same call as Inbox's `authority-tabs.tsx` dropping Escalation/Recent. Only two chains have a full
  build: `delivery-fee` (live, the flagship "one cause, five teams" example threaded through nearly
  every screen) and `card-retry` (closed, H14's own reference). The other four chains in H02's index
  table (`lagos-delivery-failures`, `discount-leakage`, `ghana-signup-drop`, `weekend-push-fatigue`)
  exist only as index rows; `ChainLayout`'s not-found fallback catches any other `:id`.
- `/handoff/:id/obligations` (`obligations-route.tsx`, H05) — only meaningful for the live
  `delivery-fee` chain. The "Hold releases against revenue 14 days" row (the one unaccepted
  obligation) gets a "Review" action opening the Accept-or-dispute modal with H07's own exact
  content; the overdue row (`renewal-reforecast`) links to its own detail page.
- `/handoff/:id/o/:oid` (`obligation/one-obligation-route.tsx`, H06) — only `renewal-reforecast`
  ("Re-forecast the August renewal book") has a full build, same "one reference row" pattern as
  Today's `r-8f2c`, Price's `plans/:id`, Digest's `2026-08-11`, Inbox's `i-8f2c`. This is the
  section's canonical demo obligation, threaded through H06/H09/H10/H16 with consistent numbers
  (₦88M, due 9 Aug, Kunle → Joy Nduta).
- **H07 (Accept or dispute) is a generic modal** (`obligation/accept-dispute-modal.tsx`) — the four
  options and their descriptions are shared product copy, so only the summary chip/subtitle/default
  selection vary per call site (unlike every other modal in this app, which is hardcoded to one
  obligation). Opened from `renewal-reforecast`'s own page and from the "Hold releases" row's
  "Review" action. Selecting "Pass it on" hands off to the Reassign modal via an `onPassItOn`
  callback rather than duplicating that flow.
- **H09 (Reassign)** (`obligation/reassign-modal.tsx`) is hardcoded to `renewal-reforecast` (Kunle →
  Joy Nduta/Ravi Mehta/Peter Kariuki), matching every other modal's "one reference row" precedent.
  Opened from the one-obligation page's "Reassign" button and from Accept-or-dispute's "Pass it on".
- **H08 (Create handoffs from a decision)** is wired into Rooms, not `/handoff` — its own route is
  `modal · /rooms/:id/decision`, and its dimmed backdrop (a room decided 08:02 by Ifeoma Nwosu,
  ₦412M at risk, 148,000 customers) is an exact match for the existing reference room
  `second-order-never-happened`'s own `decisionDoc` (`rooms/room/data.ts`). Added a "Create
  handoffs" button to that room's Decision panel (`rooms/room/workspace/workspace.tsx`,
  `DecisionPanelBody`), gated on `room.id === "second-order-never-happened"`, opening
  `handoff/create-from-decision-modal.tsx` — the 4 drafted obligations it creates are exactly the
  ones populating the `delivery-fee` chain's own obligations table.
- `/handoff/load` (`load-route.tsx`, H12) — "By team" tab is fully built (team load bars +
  Engineering's own detail table); "By person" reuses H10's own "four of six sit with one person"
  copy verbatim rather than fabricating an org-wide per-person breakdown the source doesn't have.
- `/settings/handoff-escalation` (H11), `/settings/departures` (H13, built for the one reference
  departure the export shows, Peter Kariuki) and `/settings/handoff` (H15) are standalone routes,
  outside the `/handoff` tree — matching the `/settings/digest` vs `/settings/notifications` and
  `/settings/authority` vs `/inbox` precedents.
- H16 (mobile) was treated as a responsive-design constraint on `/handoff` via Tailwind
  breakpoints, not a separate page — it carries the `H16 · Mobile handoff` footer pair but its route
  annotation is `mobile · /handoff`, not a real route, same signal used to rule out T16/G16/D16/I16/
  rooms' mobile frames as non-routes in every prior rebuild.

**Proactive unreachable-route fix, per [[flag_unreachable_routes]]:** the sidebar's "Handoff" nav
item already existed and pointed at `/handoff` before this session (added ahead of the route being
built — a pre-existing dangling link, now resolved by this build). Separately, `/handoff/load`,
`/settings/handoff-escalation`, `/settings/departures` and `/settings/handoff` had no in-app link
pointing to them once built. Fixed the same way as Inbox's `InboxQuickLinks`: added
`HandoffQuickLinks` (`src/pages/handoff/quick-links.tsx`), a thin nav strip mounted on all four
`/handoff` states (empty/index/owed-by-me/overdue) linking to all four.

**Reuse:** `Chip`, `Callout`, `KpiCards`, `StageSubpageHeader`, `WideBarRow`/`BarTrack` from
`@/pages/lifecycle/stage/` and `TeamDot` from `@/pages/inbox/` reused with zero forking (confirmed
generic enough yet again). `ActorAvatar`/`PersonDot` and the `rooms/data.ts` roster (ADA, RAVI,
KUNLE, SAM, AMARA, ZAINAB, IFEOMA) reused as-is — Sam Iyer, Ravi Mehta, Amara Okeke, Zainab Yusuf
and Ifeoma Nwosu are exact initials/department matches for this export's own names. H06 calls Kunle
"Kunle Ade" (a surname the existing `KUNLE` record doesn't have); kept the existing record rather
than forking identity over one screen's fuller name, same "SVG wins on content, roster wins on
identity" call as Today's Ravi Mehta/Ravi Menon note. Peter Kariuki, Joy Nduta and David (Otieno)
were **not** new people — they're exact matches (name, initials, Customer Success department) for
`PETER`/`JOY`/`DAVID` already added to `digest/data.ts` for the East Africa CS team; reused directly
from there instead of re-adding them.

**Verification pattern, same as prior rebuilds:** `npx tsc -b` clean, dev server + a 13-route ×
3-breakpoint (390/834/1440) Playwright console/page-error sweep (including a not-found `:id` and
the Rooms decision panel this section now touches), and a click-test of all three modals
(accept-or-dispute → dispute selection, reassign → candidate selection, create-from-decision →
uncheck a row → create) — all passed clean. Screenshot review at 1440px and 390px confirmed fidelity
against the transcribed specs for the index, reassign modal and create-handoffs modal.

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
| 75 | set goals | [x] | | Superseded — rebuilt as `/goals/new` from the newer `flolyt-goals` export, see section 2b |
| 76 | goal tracker | [x] | | Superseded — rebuilt as `/goals` from the newer `flolyt-goals` export, see section 2b |
| 77 | recommendations feed | [x] | | Superseded — rebuilt as `/what-to-do-today` from the newer `flolyt-today` export, see section 2a |
| 78 | value and roi | [x] | | Superseded — rebuilt as `/value` from the newer `flolyt-goals` export, see section 2b |
| 79 | daily digest | [x] | | Superseded — rebuilt as `/digest` from the newer `flolyt-digest` export, see section 2c |

## 12. Analysis surfaces (80–84)

| # | Screen | Status | Endpoint(s) | Notes |
|---|---|---|---|---|
| 80 | funnel explorer | [x] | | Superseded — rebuilt as `/funnel` from the newer `flolyt-funnel` export, see section 6b |
| 81 | scenario simulator | [ ] | | |
| 82 | attribution | [x] | | Superseded — rebuilt as `/attribution` from the newer `flolyt-attribution` export, see section 6d |
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
| 94 | reply inbox | [x] | `/inbox/replies` | Superseded by section 2d, built from `flolyt-inbox/` — see below |

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
