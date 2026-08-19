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
