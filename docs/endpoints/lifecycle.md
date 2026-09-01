# Lifecycle domain endpoints

Everything under `/api/flolyt/lifecycle/*`, first pasted 2026-08-31 from a written description,
then **corrected 2026-08-31 against the real Scalar/OpenAPI reference** (the user pasted the
actual spec + example responses). That correction matters: every GET response below is wrapped in
the standard `{ data, messages, succeeded }` envelope — the first pass had documented each GET's
raw inner shape with no envelope, which was wrong for all 11 GET endpoints. Nullability below is
also now sourced from the spec's own example payloads (a field shown as `null` in the example is
recorded as nullable here), not guessed from the prose description alone. Five sibling endpoints
(`/search`, `/home`, `/inbox`, `/command-bar`, `/sources`) were pasted alongside these in the same
doc page but are cross-cutting (workspace home / inbox / command palette / search), not
lifecycle-specific — not recorded here; file them under their own domain doc when we get to those
surfaces.

Status: 18 endpoints documented. Service + hook files exist for all 18
(`src/services/api/lifecycle/*`, `src/features/lifecycle/*`). Only `GET /lifecycle/map` is wired
into an actual page (`/lifecycle`'s map page, partially — see tracker below); the rest have
service/hook infrastructure ready but no page consuming them yet.

## Screen-section coverage tracker

Working method: go section by section (the on-screen header, not the whole page) — see
[[feedback_incremental_endpoint_coverage]]. Update this table as we confirm or wire each row.
Legend: ✅ covered · ⚠️ partial (see note) · ❌ not covered · ❓ open question for backend.

### `/lifecycle` — the map page (LC02)

| On-screen section (header text) | Needs | Endpoint | Status |
| --- | --- | --- | --- |
| "The customer lifecycle" stage cards — name/department | `StageRail`, `data.ts` `Stage.name`/`department` | `GET /lifecycle/map` → `stages[].name`/`owningTeam` | ✅ **wired** (`index.tsx`) — name and `owningTeam`→department are live. Per [[feedback_no_hardcoded_fallback]]: an unrecognized `owningTeam` string (or the query still loading/erroring) renders as unavailable/neutral, never a fallback to the `data.ts` mock department — `owningTeam`'s exact string values are still unconfirmed against a live response, verify on first real paste. `owner`/`openRoomCount` aren't rendered on the card itself, so not touched today. |
| Stage cards — ₦ at-stake figure | `Stage.amount`/`amountLabel` | `GET /lifecycle/map` → `stages[].atStake` | ✅ **wired** (`index.tsx`/`stage-rail.tsx`) — renders whatever `atStake.value`/`state` the API returns per stage. No client-side allowlist of which stages get a figure. **Correction 2026-08-31, confirmed by a live response:** the "measured only for activate/retain/churn" claim below (under GET /lifecycle/map's Notes) is wrong for `atStake` — all 10 stages returned the identical wrapper shape, each with its own `missingSource` (e.g. acquire needs "an acquisition-channel source", price needs "plan and discount economics"). That 3-stage restriction is real for `population`'s lifecycle-fallback classifier, a different field — the original doc conflated the two. **UI, same day, final state:** when `state` is `"unavailable"` the card shows a lucide `Info` icon (not the word "Unavailable" repeated across the whole row, and not the dash-with-dotted-underline first tried — that read as clickable rather than hoverable). Hovering/focusing it opens a dark rounded chat-bubble tooltip (`InfoTooltip` component in `stage-rail.tsx`) showing **both** `atStake.missingSource` ("Missing: …") and `atStake.wouldUnlock` ("Would unlock: …") as two lines. That tooltip is rendered via `createPortal` to `document.body`, positioned with `getBoundingClientRect()` on open — not CSS `absolute`/native `title` — because the card row's `overflow-x-auto` forces `overflow-y` to clip too (a CSS quirk: setting one overflow axis to non-`visible` forces the other to compute to `auto`), which would cut off any tooltip positioned relative to its card. `createPortal` is already used elsewhere in this repo (`stage/overview/overview-tab.tsx`'s `headerActionsEl` slot) so this is a proven-safe pattern under the repo's preact/compat setup — see [[preact_radix_dialog_crash]] for why a Radix Tooltip/Popover isn't used instead. A one-time discovery hint (`StageRail`'s `showHint` state) auto-appears ~500ms after the cards render, styled the same way (rounded chat bubble with a tail), reading "Hover the info icon on a card to see why it's unavailable," visible for 5000ms then fades — added because the icon alone wasn't self-explanatory on first sight. The `amountLabel` caption ("at stake"/"referred") under the figure was removed entirely — it was a hardcoded `data.ts` string with no live backing and, after the Advocate fix below, would read "at stake" on every card anyway. Also fixed same day: Advocate's `amountLabel` was hardcoded to `"referred"` in `data.ts` (a leftover "₦0 CAC — referred" design idea), but the live `atStake.wouldUnlock` text for Advocate reads "what Advocate is costing you" — the same cost/leak framing as every other stage, no field anywhere supports a distinct positive "referred" framing. Changed to `"at stake"` for all 10. |
| Stage cards — second metric line ("894k/yr", "6 plans", "1.4× ARPU"...) | `Stage.metric` | none | ❌ no field anywhere returns a stage-specific unit ratio like this. **Not `population`** — confirmed by reading the original design's own headline text per stage (`data.ts`), this line is a different, bespoke concept on almost every card, not one shared field: Acquire "894k / yr" is an annualized population count (the one stage where it's even close to `population` — and Acquire's live `population` is `null`/unavailable anyway); Activate "41% reach value" is a conversion rate (366k/894k); Price "6 plans" counts pricing plans, not customers; Adopt "2.1 features avg" is a per-customer average; Retain "27% repeat" and Renew "88.4% projected" and Churn "3.1%/mo" are rates; Expand "1.4× ARPU" is a multiplier; Support "12.8k tickets" counts support tickets, not customers; Advocate "124k referrers" counts a customer subtype, not the stage's whole population. So this can't be satisfied by a single generic field the way `population` is — it would need either a new bespoke per-stage "headline KPI" field (e.g. `{ label, value }` computed however each stage's own domain logic works) or each stage's own detail endpoint growing a bespoke figure for it later. ❓ still open — ask backend directly, and hand them this per-stage breakdown rather than just "no field exists." Per [[feedback_backend_gap_comment_convention]]: the JSX line is commented out in `stage-rail.tsx` (`// ❌ Backend does NOT provide: metric`), not rendered as "Unavailable" — that word would be a fabrication since there's no live signal for this field, unlike `atStake`'s. |
| "Where the same root cause shows up · [event]" table | `RootCauseSpotlight`, `ROOT_CAUSE_ROWS` (stage/department/free-text symptom) | `GET /lifecycle/changes/{changeId}/impact` → `stages[].effect` | ⚠️ **not wired, reminder to ask backend still open (2026-08-31).** Gives numeric `delta`/`percentChange`/`status`, not the narrative sentence ("abandonment at the fee step rose 3.1×") — needs client-side templating from a per-stage vocabulary the endpoint doesn't supply. **Also:** no discovery path for *which* `changeId` the map page should spotlight — no `GET /lifecycle/changes` list endpoint, and `/map`'s own `callouts[]` carries no `changeId` reference. ❓ Ask backend how the map page is meant to know which change to feature. |
| "One change. Five teams." callout card | `RootCauseSpotlight`'s static copy | `GET /lifecycle/changes/{changeId}/impact` → `callouts[]` (key/tone/headline/body) | ⚠️ **not wired** — shape matches, blocked on the same changeId-discovery question above (reminder to ask backend still open). |
| Teal "Advocacy feeds acquisition…" banner | `ADVOCACY_LOOP_NOTE` | `GET /lifecycle/map` → `callouts[]` | ✅ **wired** (`index.tsx`/`stage-rail.tsx`) — matched by content (`/advoc/i` against headline/body) since the doc doesn't document a `key` value for this callout. Per [[feedback_no_hardcoded_fallback]]: no match found → the banner doesn't render at all, it no longer falls back to the mock copy. Verify the real key on first live paste and switch to matching on it. |
| "Owner, lead agent and review cadence… on stage ownership" footer link | link only, no data | n/a | ✅ (just a `<Link>`, settings page is its own screen) |

### Per-stage screens (Overview, What changed, Cohorts, Compare, Chain, etc.)

Not started (no endpoint wired into any per-stage page yet) — but four screens were live-checked
2026-08-31 (Playwright, signed in as `ichigo@yopmail.com`) against their candidate endpoints, one
stage-screen header at a time, per [[feedback_incremental_endpoint_coverage]]:

**"[Stage name]" Overview tab** (`/lifecycle/{stage}`) — `GET /lifecycle/stages/{stageKey}`. Covers
the KPI-card row only partially, and inconsistently per stage — this is NOT a safe blanket "card 1
= population" mapping. Checked against live screenshots of `/lifecycle/price`, `/lifecycle/adopt`,
`/lifecycle/retain`, `/lifecycle/support` (values are still `data.ts` mock, not live-refetched for
these 4): Acquire/Activate's "Acquired · 12 months" card is a real `population` match; Retain's
identical "Acquired · 12 months / 894,000" card is NOT its own `population` — it's echoing Acquire's
top-of-funnel number for context, a different concept than "who's in Retain now"; Price's "Customers
with revenue" (90-day revenue filter), Support's "Something went wrong"/"Told us about it" (monthly
incident rates against active-customer count), and every stage's "At stake" card (that's `/map`'s
`atStake`, a different endpoint) don't match `population`/`rateOfChange`/`primaryConversion` at all.
`rateOfChange`/`primaryConversion` were live-confirmed unavailable for both `acquire` and `activate`
(see that endpoint's entry above) — not yet available for any stage. Net: 0-2 of each stage's 4 KPI
cards are backed by this endpoint's fields; the rest need per-stage backend-gap comments, same
treatment as the map page's metric line. ❓ open — this needs the same per-stage audit the metric
line got before wiring anything.

**"What changed" tab** (`/lifecycle/price/changes`, tab bar shared across all stages) —
`GET /lifecycle/stages/{stageKey}/change-registry`. **Best match found so far** — the live table
("DATED CHANGES THAT MOVED SOMETHING IN THIS STAGE": date · team-dot · title · effect subtitle ·
status chip) lines up column-for-column with `entries[]`: date → `occurredOnUtc`, team dot/label →
`team`, title → `title`, and the status chip ("causal finding"/"no effect"/"not instrumented") looks
like a friendlier label over `effect.status`'s documented enum (`measured`/`no_effect`/`too_recent`/
`outside_history`/`not_instrumented` — "causal finding" is presumably `measured`, not yet confirmed
live). The two amber callouts at the bottom ("The 4 March delivery fee is a pricing change and it
was never reviewed as one," "One change on this list has no owner and no date") match the response's
top-level `callouts[]`. The header's "Add a change" button is exactly `POST /lifecycle/changes`'s
already-noted target. **Only unconfirmed piece:** each row's effect subtitle ("Effective price +₦350
on 61% of orders") — plausibly templated from `effect.delta`/`percentChange`/`caveat`, not yet
verified whether `caveat` supplies this sentence directly or it still needs client-side templating
like the root-cause table. ❓ needs one live `change-registry` response pasted to confirm `effect`'s
exact shape and close this out. **Cross-stage check, same day:** `/lifecycle/acquire/changes` and
`/lifecycle/churn/changes` were also screenshotted — same shared `ChangesTab` component (per
`stage-tabs-config.ts`), same columns, only the row data differs, confirming this isn't a
Price-only shape. Churn's page also surfaced a 4th status-chip value not seen on Price/Acquire —
"measuring" (distinct from "causal finding"/"no effect"/"not instrumented") — plausibly the
doc's `too_recent` status, and a "nobody" team row for its ownerless "This stage was given no
owner" entry, consistent with Churn's documented no-owner-by-design status.

**"History" tab** (`/lifecycle/price/history`, tab bar shared across all stages) — **correction to
this doc's own prior claim.** The `GET /lifecycle/stages/{stageKey}/changes` entry above said "target
`stage/history/history-tab.tsx`," assuming population-trend data belonged on a tab literally called
History. A live screenshot shows this tab renders two completely different tables — "Goals that
depend on this stage" (goal/owner/target/today/pace/this-stage's-part) and "What has already been
tried here" (a room/experiment log: what/when/result/measured-how/learning-kept, with chips like
"validated"/"contested"/"blocked in 2024") — neither resembling a population-over-time series at all.
These look sourced from the Goals and Rooms domains, not lifecycle. **`GET /lifecycle/stages/
{stageKey}/changes` currently has no confirmed UI target anywhere in the built app** — the doc's
"target" note above is wrong and should not be trusted until a real target screen is found (if one
exists) or this is asked of backend/design directly.

**"Definition" screen** (`/lifecycle/price/definition`, reached via the Overview tab's "How this
stage is defined" header link) — `GET /lifecycle/stages/{stageKey}/definition`. Partial, roughly
half the screen. **Matches well:** the "A customer is in Price when" 3-option list ("They have
chosen a plan" · billing.plan_id · 1.31M / "They have seen a price" · any order or plan view · 4.2M /
"They have paid anything," selected · orders or billing · 894,000 ever, 1.1M active) maps cleanly
onto `candidates: [{eventKey, description, datasourceId, estimatedRows, population}]`, with the
selected option matching `current.entryEventKey`. The header's "last changed 12 January by Ravi
Mehta" plausibly maps to `current.effectiveFromUtc`/`createdBy`. **Doesn't match at all:** the
"What this stage needs, and what it has" table (6 rows: Plan and price per customer, Discounts
applied, Currency and FX rate, Cost of goods per order, Payment processing cost, Delivery cost per
order — each with a connection-status caption like "nothing connected · every margin figure is
unavailable" or "Nigeria and Kenya only · Ghana and UK unavailable") has no corresponding field
anywhere in the documented `GET /definition` shape — that response describes the stage's entry-event
definition, not a per-input data-source readiness table. This is its own gap, same class as the
metric-line one, not yet asked of backend. Both callouts (info box up top, red "Four of six inputs
are present..." box at the bottom) are narrative copy with no backing field, as expected.

## Per-endpoint entries

Every GET below returns `{ data: <shape below>, messages: string[], succeeded: boolean }` —
the envelope is omitted from each `Response:` line for brevity; only the `data` shape is shown.
Mutations (PUT/POST/DELETE) show their real top-level shape including the envelope, since several
return something other than the full resource (e.g. `data: null`, `data: changeId`).

### GET /lifecycle/map

- **Purpose:** The ten business stages in spine order — owning team, named owner, lead agent, review cadence, open room count, at-stake amount, population.
- **Auth:** Bearer token (workspace-scoped).
- **Request:** none.
- **Response `data`:** `{ stages: [{ key, name, position, owningTeam, owner: {ownerUserId, displayName, isActive} | null, leadAgentKey, leadAgentName, reviewCadence, atStake, openRoomCount, population, populationSource, definitionVersion, populationComputedAtUtc, populationCaveat }], callouts: [{key, tone, headline, body}], marketLens: {countryCode, currencyCode, isPrimary} | null }`. **`atStake` and `population` are NOT bare nullable numbers** — confirmed 2026-08-31 from a real response pasted by the user (the written spec's example had glossed over this): both are a "measured value" wrapper, `{ value: number | null, state: string, missingSource?: string, wouldUnlock?: string }` — `missingSource`/`wouldUnlock` are present only when `state` is `"unavailable"` (omitted entirely, not null, when available). `populationSource`/`definitionVersion`/`populationComputedAtUtc` are plain nullable fields, separate from the `population` wrapper — only `openRoomCount` is a guaranteed real number ("a true zero, unlike the other figures here"). **This wrapper is very likely reused across other lifecycle endpoints** for any field the prose describes as "unavailable and says why" (candidates: `primaryConversion`, departures' `observedValue`/`reachability`, `rateOfChange`, `delta`, `change`/`changePercent`, `endPopulation`/`averagePopulation`, `customersAdded`/`customersRemoved`, cohort values) — that's inferred from this one confirmed example, not verified per-field. Check a real response before wiring any other endpoint's "measured" numeric fields; don't assume bare `number | null`.
- **Used by:** **wired** — `src/pages/everyday/lifecycle/index.tsx` (name/`owningTeam`/`atStake` on `StageRail`'s cards, `callouts[]` for the advocacy banner) via `src/features/lifecycle/use-get-lifecycle-map.ts` / `src/services/api/lifecycle/get-lifecycle-map.ts`. `marketLens` not consumed yet (LC05's `?market=` filter still not wired).
- **Status:** wired (partial — see coverage tracker above for exactly which fields).
- **Notes:** `atStake` measured only for activate/retain/churn per the doc's own description. Churn carries no `owningTeam`/`owner` by design.

### PUT /lifecycle/map/{stageKey}/owner

- **Purpose:** Assign the accountable human owner for a business stage.
- **Auth:** Bearer token; owner must be a workspace member.
- **Request:** path `stageKey`; body `{ ownerUserId: uuid }`.
- **Response:** `{ data: null, messages, succeeded }`.
- **Used by:** service + hook exist (`update-stage-owner.ts` / `use-update-stage-owner.ts`), not wired into a page yet — target the "Assign an owner" modal (Advocate/Churn overview CTAs).
- **Status:** service/hook ready, not wired.
- **Notes:** Refused for `churn` — no single-person accountability for a stage that aggregates every other stage's losses.

### GET /lifecycle/market/{country}

- **Purpose:** The map read through one declared market — same shape as `GET /map`, `atStake` filtered to that market's currency cells.
- **Auth:** Bearer token.
- **Request:** path `country`.
- **Response `data`:** same shape as `GET /lifecycle/map`, with `marketLens` populated.
- **Used by:** service + hook exist (`get-lifecycle-market.ts` / `use-get-lifecycle-market.ts`), not wired — LC05's `?market=` filter, not currently wired in the UI at all.
- **Status:** service/hook ready, not wired.
- **Notes:** Unknown country fails with the declared market list rather than silently showing the whole workspace. `population` stays workspace-wide (nothing maps a customer to a market yet) — only `atStake` narrows.

### GET /lifecycle/leakage-map

- **Purpose:** Where revenue is going, by row (lifecycle stage and/or segment) × condition × market.
- **Auth:** Bearer token.
- **Request:** none.
- **Response `data`:** `{ revenueModel, grids: [{ grid, markets, conditions: [{key,label}], cells: [{rowKey, rowLabel, conditionKey, conditionLabel, currency, amount, customerCount, missingSource, wouldUnlock, method}] }], computedAtUtc }`. `amount`/`customerCount`/`missingSource`/`method` are all nullable per the spec's example — a cell either carries a figure (amount+method) or names what's missing (missingSource+wouldUnlock), never an estimate/zero standing in for unknown. The spec's own example marks the cell object as having **additional properties beyond what's listed here** ("Additional Properties Truncated") — `LeakageMapCellDto` is not treated as exhaustive in the service file.
- **Used by:** service + hook exist (`get-leakage-map.ts` / `use-get-leakage-map.ts`), not wired — candidate source for the 7 stages' `atStake` that `/map` itself can't provide (see coverage tracker, needs backend confirmation).
- **Status:** service/hook ready, not wired.
- **Notes:** No revenue-model-selected workspace gets `grids: []`/`revenueModel: null` — treat as "ask the question," not an empty state. Figures never blended across currencies.

### GET /lifecycle/distribution

- **Purpose:** Customer counts + lifetime revenue per lifecycle stage, rolled up to the 3 business stages the lifecycle axis reaches (activate/retain/churn).
- **Auth:** Bearer token.
- **Request:** none.
- **Response `data`:** `{ totalCustomers, lifecycleStages: [{stage, customerCount, lifetimeRevenue, percentOfBase}], businessStages: [...], computedAtUtc }`. `computedAtUtc` is nullable per the spec's example.
- **Used by:** service + hook exist (`get-lifecycle-distribution.ts` / `use-get-lifecycle-distribution.ts`), not wired.
- **Status:** service/hook ready, not wired.
- **Notes:** Every lifecycle stage returned including zero-count ones; business stages with no source are omitted (not zeroed).

### GET /lifecycle/stages/{stageKey}

- **Purpose:** One stage's live state — population, departures (grouped by exit-rule cause), rate of change, restating flag.
- **Auth:** Bearer token.
- **Request:** path `stageKey`.
- **Response `data`:** `{ stageKey, stageName, position, owningTeam, leadAgentKey, leadAgentName, reviewCadence, population, populationSource, definitionVersion, populationComputedAtUtc, populationCaveat, rateOfChange, primaryConversion, departures: [{cause, toStageKey, toStageName, conditionKey, size, observedValue, observedValueCaveat, reachability, reachabilityCaveat, claim: {statement, grade, confidence: number}, roomOpen}], restating, callouts: [...] }`. `population`/`populationSource`/`definitionVersion`/`populationComputedAtUtc`, and each departure's `size`, are nullable per the spec's example. **Confirmed 2026-08-31 from two live responses (`acquire`, `activate`):** `population`, `rateOfChange`, and `primaryConversion` are each the same "measured value" wrapper as `GET /map`'s `atStake` — `{ value: number | null, state: string, missingSource?: string, wouldUnlock?: string }` — not the bare nullable numbers the written spec implied. This confirms the wrapper-reuse guess flagged under `GET /map`'s notes, now verified for these three fields specifically.
- **Used by:** service + hook exist (`get-stage.ts` / `use-get-stage.ts`), not wired — target Overview tab's KPI numbers, but NOT its bespoke per-row leak-table narrative (see coverage tracker note on Overview).
- **Status:** service/hook ready, not wired.
- **Notes:** `primaryConversion` unavailable throughout (nothing models it yet) — confirmed live for both `acquire` and `activate`. `rateOfChange` was also unavailable for both (same `missingSource`: "a count for this month and the one before it") — not yet confirmed available for any stage. Departures' `observedValue`/`reachability` are unavailable and say why (no customer-record match in the warehouse); both live responses returned `departures: []` (empty array, not populated rows) and `callouts: []`/one entry — not yet seen a stage with actual departure rows. `population` is genuinely unavailable for `acquire` (`missingSource`: "a definition for Acquire — nothing yet says who is in it") but available for `activate` via `populationSource: "lifecycle-fallback"` — consistent with `GET /map`'s note that the fallback classifier only covers activate/retain/churn. `owningTeam` confirmed live: `"Marketing"` for acquire, `"Product"` for activate — matches `data.ts`'s mock department values for both, first live confirmation of this field (still worth re-checking on `GET /map` itself, which returns it from a different call). `leadAgentKey`/`leadAgentName` confirmed format: kebab-case key, Title Case name (e.g. `"acquisition-quality"` / `"Acquisition Quality"`). `reviewCadence` confirmed lowercase string enum (`"weekly"`, `"daily"`). Activate's one live callout, `{key: "population-from-fallback", tone: "context", ...}`, confirms a `"context"` tone value not previously seen (distinct from `GET /map`'s callout tones).

### GET /lifecycle/stages/{stageKey}/changes

- **Purpose:** Month-by-month population history for one stage, flagging definition-change/restated months.
- **Auth:** Bearer token.
- **Request:** path `stageKey`; query `from`/`to` (RFC 3339, default 12-month restatement window).
- **Response `data`:** `{ stageKey, stageName, restating, periods: [{periodStartUtc, population, delta, isDefinitionChange, isRestated, definitionVersion, restatedFromVersion, asOfUtc}] }`. `population`/`delta` nullable — unavailable rather than zero whenever either bounding month is unmeasured.
- **Used by:** service + hook exist (`get-stage-changes.ts` / `use-get-stage-changes.ts`), not wired — target `stage/history/history-tab.tsx`.
- **Status:** service/hook ready, not wired.
- **Notes:** Distinct from `change-registry` below — this is the population trend, not dated causes.

### GET /lifecycle/stages/{stageKey}/change-registry

- **Purpose:** The stage's "What changed" tab — every dated registry change, measured against this stage's own history.
- **Auth:** Bearer token.
- **Request:** path `stageKey`.
- **Response `data`:** `{ stageKey, stageName, entries: [{id, occurredOnUtc, title, team, source, affectedStageKeys, effect: {status, delta, percentChange, caveat}, sourceRoomId}], callouts: [...] }`
- **Used by:** service + hook exist (`get-stage-change-registry.ts` / `use-get-stage-change-registry.ts`), not wired — target `stage/changes/changes-tab.tsx`. Row's `id` is the `changeId` for the impact drilldown below.
- **Status:** service/hook ready, not wired.
- **Notes:** `effect.status` ∈ measured/no_effect/too_recent/outside_history/not_instrumented — each a distinct, real state, not a fallback chain.

### POST /lifecycle/changes

- **Purpose:** Record a dated business change a person knows about but Flolyt can't see (a partner's price change, a policy shift).
- **Auth:** Bearer token; open to any member.
- **Request:** `{ occurredOnUtc, title, team?, description?, affectedStageKeys? }`.
- **Response:** `{ data: changeId (uuid), messages, succeeded }`.
- **Used by:** service + hook exist (`create-change.ts` / `use-create-change.ts`), not wired — target the "Add a change" header button on `changes-tab.tsx`.
- **Status:** service/hook ready, not wired.
- **Notes:** Future `occurredOnUtc` refused. `affectedStageKeys` never filters measurement, only records intent — the impact view flags stages that moved which weren't listed.

### POST /lifecycle/changes/from-room

- **Purpose:** Promote a room's decision onto the change registry.
- **Auth:** Bearer token; requires room membership/ownership/administration.
- **Request:** `{ roomId, occurredOnUtc, title?, affectedStageKeys? }`.
- **Response:** `{ data: changeId (uuid), messages, succeeded }`.
- **Used by:** service + hook exist (`create-change-from-room.ts` / `use-create-change-from-room.ts`), not wired.
- **Status:** service/hook ready, not wired.
- **Notes:** One promotion per room opening; a reopened room's new decision is a new change.

### DELETE /lifecycle/changes/{changeId}

- **Purpose:** Remove a registry entry.
- **Auth:** Bearer token; recorder can remove their own, administrator can remove any.
- **Request:** path `changeId`.
- **Response:** `{ data: changeId, messages, succeeded }`.
- **Used by:** service + hook exist (`delete-change.ts` / `use-delete-change.ts`), not wired.
- **Status:** service/hook ready, not wired.

### GET /lifecycle/changes/{changeId}/impact

- **Purpose:** One change measured against every stage — the release-impact drilldown and "the skeleton of the whole-chain view."
- **Auth:** Bearer token.
- **Request:** path `changeId`.
- **Response `data`:** `{ changeId, title, occurredOnUtc, team, source, affectedStageKeys, sourceRoomId, stages: [{stageKey, stageName, effect: {status, delta, percentChange, caveat}}], callouts: [...] }` (all 10 stages always returned, in spine order).
- **Used by:** service + hook exist (`get-change-impact.ts` / `use-get-change-impact.ts`), not wired — target `activate/release-impact-route.tsx` (`/lifecycle/:stage/changes/:id`, already has a live `:id` param) and, pending the routing fix noted in the coverage tracker, `stage/chain/chain-route.tsx`.
- **Status:** service/hook ready, not wired.
- **Notes:** 404 if the change isn't in this workspace's registry. "Moved-where-nobody-expected" callout names stages that moved but weren't in `affectedStageKeys`.

### GET /lifecycle/stages/{stageKey}/definition

- **Purpose:** A stage's current definition (if any), full version history, and candidate entry events.
- **Auth:** Bearer token.
- **Request:** path `stageKey`.
- **Response `data`:** `{ stageKey, stageName, canEdit, isDefined, fallbackInUse, fallbackNote, current: {version, entryEventKey, exitRules: [{kind, eventKey, days, movesToStageKey}] | null, exclusions: [{kind, mergeKey}] | null, effectiveFromUtc, createdByUserId, createdBy, createdAtUtc} | null, history: [{version, createdAtUtc, createdByUserId, createdBy, isCurrent}], candidates: [{eventKey, description, datasourceId, estimatedRows, population}] }`. `candidates[].description`/`population` nullable per the spec's example.
- **Used by:** service + hook exist (`get-stage-definition.ts` / `use-get-stage-definition.ts`), not wired — target `stage/definition/definition-route.tsx`.
- **Status:** service/hook ready, not wired.
- **Notes:** New workspace has `isDefined: false`/`current: null` for all 10 — never seeded. `fallbackInUse` marks activate/retain/churn using the classifier's recency thresholds until defined.

### PUT /lifecycle/stages/{stageKey}/definition

- **Purpose:** Save a stage definition. Requires a preview token, unconditionally.
- **Auth:** Bearer token.
- **Request:** path `stageKey`; body `{ previewToken (uuid), entryEventKey, exitRules, exclusions }`.
- **Response:** `{ data: {stageKey, version, supersededVersion, effectiveFromUtc}, messages, succeeded }`; `409` if the body doesn't match what the token was issued for.
- **Used by:** service + hook exist (`update-stage-definition.ts` / `use-update-stage-definition.ts`, which surfaces the 409 as a distinct `onTokenMismatch` callback rather than a generic error), not wired.
- **Status:** service/hook ready, not wired.
- **Notes:** Token single-use, expires 30 min.

### POST /lifecycle/stages/{stageKey}/definition/preview

- **Purpose:** What a proposed definition would break — customers moved, figures restated, cohorts/goals invalidated — plus the save token.
- **Auth:** Bearer token; only the stage's owner or a workspace administrator.
- **Request:** path `stageKey`; body `{ entryEventKey, exitRules, exclusions }`.
- **Response:** `{ data: {previewToken, expiresAtUtc, stageKey, wouldBeVersion, customersAdded, customersRemoved, figuresAffected, cohortsBroken, goalsInvalidated, learningsScoped}, messages, succeeded }` — corrected 2026-08-31, the first pass wrongly had this response unwrapped. `figuresAffected`/`cohortsBroken`/`goalsInvalidated`/`learningsScoped` all share one shape: `{measured, items: string[], unmeasuredReason}`. `customersAdded`/`customersRemoved` nullable per the spec's example.
- **Used by:** service + hook exist (`preview-stage-definition.ts` / `use-preview-stage-definition.ts`), not wired.
- **Status:** service/hook ready, not wired.

### POST /lifecycle/entry-events/measure

- **Purpose:** Count distinct customers behind each candidate entry event, for the definition screen.
- **Auth:** Bearer token.
- **Request:** query `force` (bool, default false).
- **Response:** `{ data: number, messages, succeeded }`.
- **Used by:** service + hook exist (`measure-entry-event.ts` / `use-measure-entry-event.ts`), not wired.
- **Status:** service/hook ready, not wired.
- **Notes:** ❓ Neither the original doc nor the real spec documents a field identifying *which* candidate event a call measures — the request is just `force`, despite the purpose line saying "each candidate entry event." Looks like a real gap, not something to guess at; ask backend before wiring this into the definition screen. Bounded per call with a timeout; counts cached for a day unless `force=true`.

### GET /lifecycle/stages/{stageKey}/cohorts

- **Purpose:** Entry cohorts by arrival month, with observed lifetime value per cohort.
- **Auth:** Bearer token.
- **Request:** path `stageKey`; query `months` (3-12, default 6).
- **Response `data`:** `{ stageKey, stageName, cohorts, undatedCustomers, currency, valueCaveat, callouts: [...] }` — ❓ neither the doc nor the real spec's example specifies the per-cohort row shape (the example just shows `cohorts: null`); don't invent fields, confirm before rendering a table.
- **Used by:** service + hook exist (`get-stage-cohorts.ts` / `use-get-stage-cohorts.ts`), not wired — target `stage/{acquire,...}/cohorts-tab.tsx`.
- **Status:** service/hook ready, not wired.
- **Notes:** Only lifecycle-bridged stages can cohort; a definition-backed stage returns "cohorts unavailable" (per-customer rows deliberately not kept).

### GET /lifecycle/stages/{stageKey}/compare

- **Purpose:** Last N months vs the N before, population only (for now).
- **Auth:** Bearer token.
- **Request:** path `stageKey`; query `months` (1-12, default 3).
- **Response `data`:** `{ stageKey, stageName, windowMonths, before: {fromUtc, toUtc, monthsInWindow, monthsMeasured, endPopulation, averagePopulation, restatedMonths}, after: {...}, change, changePercent, definitionChangedInside, callouts: [...] }`. `endPopulation`/`averagePopulation`/`change`/`changePercent` all nullable per the spec's example.
- **Used by:** service + hook exist (`get-stage-compare.ts` / `use-get-stage-compare.ts`), not wired — target `stage/compare/compare-route.tsx`.
- **Status:** service/hook ready, not wired.
- **Notes:** Only population compares today — CAC/repeat-rate/value-per-customer need sources nothing models yet, response says so rather than faking a row.
