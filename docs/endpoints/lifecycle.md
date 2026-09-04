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
lifecycle-specific — **now recorded in [`app-shell.md`](app-shell.md)**, their full specs were
pasted 2026-09-04.

Status: **all 69 lifecycle-scoped endpoints from the original sidebar list now documented**
(18 original + 4 new core + 24 per-stage tab-specific + 23 churn-routing/analytics/agents/
governance — see the batch-3 and batch-4 sections below), plus the 5 cross-cutting app-shell
endpoints in [`app-shell.md`](app-shell.md) (74 total across both files). **Service + hook files
now exist for all 69** (`src/services/api/lifecycle/*`, `src/features/lifecycle/*` — scaffolded
2026-09-04, typechecks clean via `npx tsc --noEmit -p tsconfig.app.json`): the original 18's stale
fields (`GET /map`, `GET /market/{country}`, `GET /stages/{stageKey}`, `GET /stages/{stageKey}/
compare`, `GET .../change-registry`, `GET /changes/{id}/impact`, `POST /changes`) were corrected,
and all 51 new endpoints (4 core + 24 tab-specific + 23 governance/agents/churn-routing) got fresh
service+hook pairs. Only `GET /lifecycle/map` is wired into an actual page (`/lifecycle`'s map
page, partially — see tracker below); everything else has service/hook infrastructure ready but no
page consumes it yet — that's the next real step.

**2026-09-04:** the lifecycle domain has ~116 routes total (69 documented in this file + the ~70
adjacent `/rooms`/`/claims` routes, out of scope here — see [`rooms.md`](rooms.md)) — see
[`lifecycle-reference.md`](lifecycle-reference.md) for the full-surface master reference (tab
matrix per stage, the `/screens` tab-discovery endpoint, the `Measured<T>` convention confirmed as
policy everywhere in this domain). This file stays the live-verified source of truth for exact
field shapes; the user pasted the full lifecycle endpoint set in 4 batches this same day —
**batch 1**: 15 lifecycle + 5 app-shell endpoints. **Batch 2**: 10 more (`distribution`, `screens`,
`cohorts`, `markets`, `history`, `compare`, `market/{country}`, `changes` POST/from-room/DELETE).
**Batch 3**: `change-registry`/`changes/{id}/impact` updates plus 24 per-stage tab-specific
endpoints. **Batch 4 (final)**: churn routing (`route-upstream`/`routings`/`acknowledge`), churn
and support analytics, `stages/{stageKey}/agents`, `teams`, `watchable-metrics`, the full
conditions/governance/instrumentation-request set — closing out every route in the original
sidebar list. **Code (`src/services/api/lifecycle/*`, `src/features/lifecycle/*`) is still
untouched, per the user's standing "wait until everything's in" call** — next real step is
updating/scaffolding all 51 stale-or-missing service+hook files against this now-complete doc.

## Screen-section coverage tracker

Working method: go section by section (the on-screen header, not the whole page) — see
[[feedback_incremental_endpoint_coverage]]. Update this table as we confirm or wire each row.
Legend: ✅ covered · ⚠️ partial (see note) · ❌ not covered · ❓ open question for backend.

### `/lifecycle` — the map page (LC02)

| On-screen section (header text) | Needs | Endpoint | Status |
| --- | --- | --- | --- |
| "The customer lifecycle" stage cards — name/department | `StageRail`, `data.ts` `Stage.name`/`department` | `GET /lifecycle/map` → `stages[].name`/`owningTeam` | ✅ **wired** (`index.tsx`) — name and `owningTeam`→department are live. Per [[feedback_no_hardcoded_fallback]]: an unrecognized `owningTeam` string (or the query still loading/erroring) renders as unavailable/neutral, never a fallback to the `data.ts` mock department — `owningTeam`'s exact string values are still unconfirmed against a live response, verify on first real paste. `owner`/`openRoomCount` aren't rendered on the card itself, so not touched today. |
| Stage cards — ₦ at-stake figure | `Stage.amount`/`amountLabel` | `GET /lifecycle/map` → `stages[].atStake` | ✅ **wired** (`index.tsx`/`stage-rail.tsx`) — renders whatever `atStake.value`/`state` the API returns per stage. No client-side allowlist of which stages get a figure. **Correction 2026-08-31, confirmed by a live response:** the "measured only for activate/retain/churn" claim below (under GET /lifecycle/map's Notes) is wrong for `atStake` — all 10 stages returned the identical wrapper shape, each with its own `missingSource` (e.g. acquire needs "an acquisition-channel source", price needs "plan and discount economics"). That 3-stage restriction is real for `population`'s lifecycle-fallback classifier, a different field — the original doc conflated the two. **UI, same day, final state:** when `state` is `"unavailable"` the card shows a lucide `Info` icon (not the word "Unavailable" repeated across the whole row, and not the dash-with-dotted-underline first tried — that read as clickable rather than hoverable). Hovering/focusing it opens a dark rounded chat-bubble tooltip (`InfoTooltip` component in `stage-rail.tsx`) showing **both** `atStake.missingSource` ("Missing: …") and `atStake.wouldUnlock` ("Would unlock: …") as two lines. That tooltip is rendered via `createPortal` to `document.body`, positioned with `getBoundingClientRect()` on open — not CSS `absolute`/native `title` — because the card row's `overflow-x-auto` forces `overflow-y` to clip too (a CSS quirk: setting one overflow axis to non-`visible` forces the other to compute to `auto`), which would cut off any tooltip positioned relative to its card. `createPortal` is already used elsewhere in this repo (`stage/overview/overview-tab.tsx`'s `headerActionsEl` slot) so this is a proven-safe pattern under the repo's preact/compat setup — see [[preact_radix_dialog_crash]] for why a Radix Tooltip/Popover isn't used instead. A one-time discovery hint (`StageRail`'s `showHint` state) auto-appears ~500ms after the cards render, styled the same way (rounded chat bubble with a tail), reading "Hover the info icon on a card to see why it's unavailable," visible for 5000ms then fades — added because the icon alone wasn't self-explanatory on first sight. The `amountLabel` caption ("at stake"/"referred") under the figure was removed entirely — it was a hardcoded `data.ts` string with no live backing and, after the Advocate fix below, would read "at stake" on every card anyway. Also fixed same day: Advocate's `amountLabel` was hardcoded to `"referred"` in `data.ts` (a leftover "₦0 CAC — referred" design idea), but the live `atStake.wouldUnlock` text for Advocate reads "what Advocate is costing you" — the same cost/leak framing as every other stage, no field anywhere supports a distinct positive "referred" framing. Changed to `"at stake"` for all 10. |
| Stage cards — second metric line ("894k/yr", "6 plans", "1.4× ARPU"...) | `Stage.metricValue`/`metricLabel` | `GET /lifecycle/map` → `stages[].headline` | ✅ **wired 2026-09-04, redesigned same day.** The exact bespoke-per-stage-KPI gap flagged below (2026-08-31) is answered by the fresh spec's new `headline` field: `{key, label, unit, value, missingSource, wouldUnlock, computedAtUtc, yearOverYear}`, the map card's one always-present figure, computed today for 6 of 10 stages (new customers, repeat share, order-problem-then-lapsed customers, plans in use, plans up-for-renewal) — the other 4 are declared but gated, same `missingSource`/`wouldUnlock`-when-unavailable convention as `atStake`. **Live-checked against a real response**, two rounds: round 1 concatenated a formatted value + `label` into one truncated string, which read as a bare, contextless number for the `count`-unit stages ("3" alone, for Price) and duplicated the literal word "Unavailable" on top of the amount tile's own "Unavailable" (two identical icons on Activate/Expand/Support/Advocate, no visual distinction) — flagged by the user as inconsistent. **Round 2, same day — card redesigned as a proper stat tile, mirroring `atStake`'s own value-or-icon shape:** `stage-rail.tsx` now renders `metricValue` (or the `InfoTooltip` icon in its place when the headline is gated) with `metricLabel` always shown underneath as a small caption — `formatHeadlineValue` only formats the number, the label is a separate line, never concatenated. Card widened `w-32`→`w-36` for the extra caption line; `title={metricLabel}` added for the cases CSS `truncate` clips. Fixes two real formatting bugs found in the same live response: retain's `repeat_share` came back a 0-1 fraction (`0.9567`) with `unit: "share"` — needed a ×100 + `%` conversion, first pass wrongly showed "0.9567 share"; adopt's `features_used` came back an unrounded float (`10.0748175182481...`) with `unit: "average"` — needed rounding to 2dp. `formatHeadlineValue` now treats `share`/`ratio`/`rate` as percent-like (×100, 1dp) and rounds every other value to 1-2dp before compact-formatting past 1000. Confirmed live unit strings so far: `count`, `share`, `average` — `average` falls through to the same numeric rounding as `count` (no literal suffix rendered; the caption already carries the word "average" inline, e.g. adopt's label is literally "features used, on average"). Live stage→headline mapping confirmed: acquire = new customers (360), price = plans in use (3), renew = up for renewal (18), churn = lapsed (390), retain = buy again/repeat share (95.7%), adopt = features used on average (10.07) — the 6 computed stages; activate/expand/support/advocate are the 4 gated ones. `mini-stage-rail.tsx` (Overview tab, still fully mock/unwired) was updated for the `metric`→`metricValue` rename only, not redesigned — out of scope, tracked separately under "Per-stage screens" below. |
| "Where the same root cause shows up · [event]" table | `RootCauseSpotlight`, `ROOT_CAUSE_ROWS` (stage/department/free-text symptom) | ~~`GET /lifecycle/changes/{changeId}/impact`~~ → **`GET /lifecycle/churn/chain`**, `stages[].symptom`/`.effect` | ⚠️ **not wired, but both blockers below are resolved 2026-09-04 — corrected target found, no longer open questions.** `GET /lifecycle/changes/{changeId}/impact` was the wrong candidate: its `stages[].effect` is only numeric (`delta`/`percentChange`/`status`), no narrative sentence. **`GET /lifecycle/churn/chain` is the real match** — its `stages[].symptom` is a backend-supplied narrative string per stage (nullable), no client-side templating needed, and `title` gives the section's own headline framing ("[event]"). **The changeId-discovery gap is also resolved by this same endpoint**, not by a separate list endpoint: `changeId` is an *optional* query param — omit it and the backend itself picks "the change whose effects reached the most stages," exactly the "one event, spotlight it" behavior this table needs. Service + hook already scaffolded (`get-churn-chain.ts` / `use-get-churn-chain.ts`). See that endpoint's own entry below for the full shape. |
| "One change. Five teams." callout card | `RootCauseSpotlight`'s static copy | ~~`GET /lifecycle/changes/{changeId}/impact`~~ → **`GET /lifecycle/churn/chain`**, `stagesThatMoved`/`stagesThatNoticed`/`callouts[]` | ⚠️ **not wired, same corrected target as the row above.** `stagesThatMoved` is exactly the "Five teams" count; `callouts[]` (stages that moved with nobody writing anything down, fastest/slowest desk to notice, stages that moved with no owner) covers this card's copy directly — no separate templating needed here either. |
| Teal "Advocacy feeds acquisition…" banner | `ADVOCACY_LOOP_NOTE` | `GET /lifecycle/map` → `callouts[]` | ✅ **wired** (`index.tsx`/`stage-rail.tsx`) — matched by content (`/advoc/i` against headline/body) since the doc doesn't document a `key` value for this callout. Per [[feedback_no_hardcoded_fallback]]: no match found → the banner doesn't render at all, it no longer falls back to the mock copy. Verify the real key on first live paste and switch to matching on it. |
| "Owner, lead agent and review cadence… on stage ownership" footer link | link only, no data | n/a | ✅ (just a `<Link>`, settings page is its own screen) |

### Per-stage screens (Overview, What changed, Cohorts, Compare, Chain, etc.)

**Stage header subtitle** (under the stage name, every tab-bar page — `stage-tabs-layout.tsx`) —
built 2026-09-04 against `GET /lifecycle/map` (not a per-stage endpoint), reusing the same
`headline`/`atStake`/`owningTeam` fields `stage-rail.tsx`'s cards already prove correct, **then
commented out the same day** rather than shipped — `atStake` is real for only activate/retain/churn
today, so most stages' three-clause sentence would read as a string of gated icons instead of the
settled line the design calls for. The implementation (`StageHeadlineSubtitle`, commented out in
`stage-tabs-layout.tsx`) is left in place, ready to re-enable once more of these fields are live —
each clause stays an independent field, never combined into a derived number. The old
hand-authored `Stage.headline` mock sentence (e.g. "894,000 acquired in twelve months · ₦74M at
stake · owned by Marketing") was deleted from `data.ts` regardless, along with the `headline`
field on `Stage` — confirmed unused elsewhere first — so the header currently shows just the stage
name, no subtitle, per [[feedback_no_hardcoded_fallback]] (no reverting to the mock once touched).
`formatHeadlineValue` was moved out of `index.tsx` into a shared `format-measured-value.ts` export
either way, so the map page and this (dormant) subtitle share one formatting implementation.

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

**"History" tab** (`/lifecycle/price/history`, tab bar shared across all stages) — **resolved
2026-09-04, the real endpoint exists and matches.** This doc previously guessed `GET /lifecycle/
stages/{stageKey}/changes` (population trend) was the target, then corrected that to "no confirmed
target" after a live screenshot showed two unrelated tables — "Goals that depend on this stage" and
"What has already been tried here" (a room/experiment log). **The 2026-09-04 spec paste adds
`GET /lifecycle/stages/{stageKey}/history`, not one of the original 18, and it's an exact match:**
`attempts[]` is the room/experiment log (`roomId`, `decision`, `outcomeKind`/`outcomeNote`/`delta`,
`howMeasured` with `contacted`/`heldBack`/`liftPoints` against a holdout, `learningState` — matches
"what/when/result/measured-how/learning-kept" with chips like "validated"/"contested" column-for-
column), and `learnings[]` is business memory (`claimId`, `statement`, `grade`, `learningState`).
**`goalDependencies` is a confirmed, permanent gap, not a wiring gap** — the spec states plainly
"nothing models goals yet," so the "Goals that depend on this stage" table has no backing field at
all and needs the [[feedback_backend_gap_comment_convention]] treatment, not a fetch. `GET .../changes`
(population trend) genuinely has no UI target in this app — that finding stands, unrelated to History.

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

- **Purpose:** The ten business stages in spine order — owning team, named owner, lead agent, review cadence, open room count, at-stake amount, population, and a per-stage `headline` figure for the map card.
- **Auth:** Bearer token (workspace-scoped).
- **Request:** none.
- **Response `data`:** `{ stages: [{ key, name, position, headline: {key, label, unit, value, missingSource, wouldUnlock, computedAtUtc, yearOverYear}, owningTeam, owner: {ownerUserId, displayName, isActive} | null, leadAgentKey, leadAgentName, reviewCadence, atStake, openRoomCount, population, populationSource, definitionVersion, populationComputedAtUtc, populationCaveat }], callouts: [{key, tone, headline, body}], marketLens: {countryCode, currencyCode, isPrimary} | null, referralReach: {referred, shareOfAcquisition, newCustomers, windowDays} | null }`. **`atStake` and `population` are NOT bare nullable numbers** — confirmed 2026-08-31 from a real response pasted by the user (the written spec's example had glossed over this): both are a "measured value" wrapper, `{ value: number | null, state: string, missingSource?: string, wouldUnlock?: string }` — `missingSource`/`wouldUnlock` are present only when `state` is `"unavailable"` (omitted entirely, not null, when available). `populationSource`/`definitionVersion`/`populationComputedAtUtc` are plain nullable fields, separate from the `population` wrapper — only `openRoomCount` is a guaranteed real number ("a true zero, unlike the other figures here"). **This wrapper is very likely reused across other lifecycle endpoints** for any field the prose describes as "unavailable and says why" (candidates: `primaryConversion`, departures' `observedValue`/`reachability`, `rateOfChange`, `delta`, `change`/`changePercent`, `endPopulation`/`averagePopulation`, `customersAdded`/`customersRemoved`, cohort values) — that's inferred from this one confirmed example, not verified per-field. Check a real response before wiring any other endpoint's "measured" numeric fields; don't assume bare `number | null`.
- **Used by:** **wired** — `src/pages/everyday/lifecycle/index.tsx` (name/`owningTeam`/`atStake` on `StageRail`'s cards, `callouts[]` for the advocacy banner) via `src/features/lifecycle/use-get-lifecycle-map.ts` / `src/services/api/lifecycle/get-lifecycle-map.ts`. `marketLens` not consumed yet (LC05's `?market=` filter still not wired). `headline`/`referralReach` are new as of the 2026-09-04 spec paste, not wired.
- **Status:** wired (partial — see coverage tracker above for exactly which fields).
- **Notes:** Churn carries no `owningTeam`/`owner` by design. **`atStake`-restriction note, corrected back 2026-09-04:** the 2026-08-31 "correction" above (in the coverage tracker's stage-cards row) concluded `atStake` is measured for all 10 stages because a live response showed "the identical wrapper shape" for each — but that observation is trivially true of any `{value, state, missingSource, wouldUnlock}` field and doesn't by itself disprove a 3-stage restriction. **The freshly pasted 2026-09-04 spec text is unambiguous and matches that same live response's actual field-by-field content** (acquire/price were cited in that response as carrying `missingSource`, i.e. `state: "unavailable"` — never a real value): "`atStake` is measured for the three stages the customer-lifecycle axis reaches (activate, retain, churn) and unavailable for the other seven, each naming the source it is waiting on." Treat this as confirmed policy — real `atStake` values only for activate/retain/churn, the other 7 stages always carry `missingSource`/`wouldUnlock` instead. `headline` is the map card's one always-present figure (6 of 10 stages computed today: new customers, repeat share, order-problem-then-lapsed customers, plans in use, plans up-for-renewal — the other 4 declared but gated, never computed on the request path). `headline.yearOverYear` compares the SAME MONTH a year ago as a share of where it started (a flow-vs-flow comparison) — a different question from the stage overview's own `yearOverYear` below, which compares population; refuses when the stage's headline definition changed in between.

### PUT /lifecycle/map/{stageKey}/owner — correction 2026-09-04

**The "Refused for churn" note below is wrong per the freshly pasted 2026-09-04 spec text**, which
reads: "Names the person accountable for a business stage — **any of the ten, churn included**. The
owner must be a member of this workspace, and must be a person: agents lead stages but
accountability stays human. Losses surfacing in churn are still attributed to the stage that caused
them; its owner answers for the stage's own work, not for everyone else's." Whoever wrote the
original entry below inferred "no single-person accountability for churn" from prose elsewhere in
the doc describing churn as an aggregate — that inference doesn't hold up against the endpoint's own
description, which explicitly includes churn. **Don't refuse churn client-side when this gets
wired** — verify with a real 409/400 test against churn before trusting either version further.

### PUT /lifecycle/map/{stageKey}/owner

- **Purpose:** Assign the accountable human owner for a business stage.
- **Auth:** Bearer token; owner must be a workspace member.
- **Request:** path `stageKey`; body `{ ownerUserId: uuid }`.
- **Response:** `{ data: null, messages, succeeded }`.
- **Used by:** service + hook exist (`update-stage-owner.ts` / `use-update-stage-owner.ts`), not wired into a page yet — target the "Assign an owner" modal (Advocate/Churn overview CTAs).
- **Status:** service/hook ready, not wired.
- **Notes:** **Corrected 2026-09-04 — see the callout right above `GET /map`'s entry.** This used to say "refused for churn," which the freshly pasted spec text directly contradicts: churn is explicitly included ("any of the ten... churn included"). `ownerUserId` must be a workspace member **and a person**, not an agent — agents lead stages but accountability stays human. Losses surfacing in churn are still attributed to the stage that caused them; churn's own owner answers for churn's work only, not everyone else's.

### GET /lifecycle/market/{country}

- **Purpose:** The map read through one declared market — same shape as `GET /map`, `atStake` filtered to that market's currency cells.
- **Auth:** Bearer token.
- **Request:** path `country`.
- **Response `data`:** same shape as `GET /lifecycle/map` (`headline`/`owner`/`referralReach` included — see that entry, this one gained the same fields in the 2026-09-04 spec paste), with `marketLens` populated.
- **Used by:** service + hook exist (`get-lifecycle-market.ts` / `use-get-lifecycle-market.ts`), not wired — LC05's `?market=` filter, not currently wired in the UI at all. Service file predates `GET /map`'s new fields, needs the same update.
- **Status:** service/hook ready (stale, same gap as `GET /map`), not wired.
- **Notes:** Unknown country fails with the declared market list rather than silently showing the whole workspace — a lens that fails open would read as "this market looks exactly like the whole business," the precise misreading a lens exists to prevent. `population` stays workspace-wide (nothing maps a customer to a market yet) — only `atStake` narrows; the response's own `marketLens`-scope callout states this on the payload so no client has to remember to hardcode it. Money is never converted or blended across markets, same as everywhere else in this domain.

### GET /lifecycle/leakage-map

- **Purpose:** Where revenue is going, by row (lifecycle stage and/or segment) × condition × market.
- **Auth:** Bearer token.
- **Request:** query `stage` (string, optional) — narrows to one business stage's own leak table for that stage's page (see Notes for the reachability limit).
- **Response `data`:** `{ revenueModel, grids: [{ grid, markets, conditions: [{key,label}], cells: [{rowKey, rowLabel, conditionKey, conditionLabel, currency, amount, customerCount, missingSource, wouldUnlock, method}] }], computedAtUtc, stage, stageUnreachable }`. `amount`/`customerCount`/`missingSource`/`method` are all nullable per the spec's example — a cell either carries a figure (amount+method) or names what's missing (missingSource+wouldUnlock), never an estimate/zero standing in for unknown. The spec's own example marks the cell object as having **additional properties beyond what's listed here** ("Additional Properties Truncated") — `LeakageMapCellDto` is not treated as exhaustive in the service file. **Added 2026-09-04, confirmed from the fresh spec:** `stage`/`stageUnreachable` are top-level, both nullable — `stageUnreachable` carries a sentence explaining why (see Notes), only populated when `?stage=` was passed for one of the 7 unreachable stages.
- **Used by:** `get-leakage-map.ts` / `use-get-leakage-map.ts`, wired 2026-09-01 to `/rooms/new`'s Step 1 (condition step) as the `conditionKey` vocabulary picker — grouped in the dropdown by `grid` (deduped by `condition.key` across grids, since `POST /rooms/new` only takes a bare `conditionKey`, never `grid`). Still a candidate source for the 7 stages' `atStake` that `/map` itself can't provide (see coverage tracker, needs backend confirmation) — that use is separate and still not wired. `?stage=` filter itself not wired anywhere yet — target is each stage's own leak-table section (see per-stage screens, §01 of `lifecycle-reference.md`).
- **Status:** partially wired (rooms/new condition step only).
- **Notes:** No revenue-model-selected workspace gets `grids: []`/`revenueModel: null` — treat as "ask the question," not an empty state (rendered as an amber prompt on the condition step, not an empty dropdown). Figures never blended across currencies. **Confirmed 2026-09-01 from a live response:** `grid` values are meaningful categories, not arbitrary — seen `lifecycle_stage` (conditions: repeat_decay, involuntary_churn, abandonment, refunds, discount_dependency) and `segment` (spoilage, leakage, churn_risk, activation, expansion_gap), each with `markets: []`/`cells: []` in that response. No key collision seen between the two grids' conditions in this sample. **`?stage=` filter, confirmed from the 2026-09-04 spec:** rows are customer states and a stage is a business stage, so the filter has to cross through the lifecycle bridge — **only Activate, Retain and Churn can be read this way**; the other 7 stages return `cells: []` (no rows) plus `stageUnreachable` naming why, which the UI must render explicitly rather than showing a silently-empty table. The segment grid is omitted entirely under a stage filter, since segments aren't stages.

### GET /lifecycle/distribution

- **Purpose:** Customer counts + lifetime revenue per lifecycle stage, rolled up to the 3 business stages the lifecycle axis reaches (activate/retain/churn).
- **Auth:** Bearer token.
- **Request:** none.
- **Response `data`:** `{ totalCustomers, lifecycleStages: [{stage, customerCount, lifetimeRevenue, percentOfBase}], businessStages: [...], computedAtUtc }`. `computedAtUtc` is nullable per the spec's example.
- **Used by:** service + hook exist (`get-lifecycle-distribution.ts` / `use-get-lifecycle-distribution.ts`), not wired.
- **Status:** service/hook ready, not wired.
- **Notes:** Every lifecycle stage returned including zero-count ones — a zero count means nobody is there, whereas an absent stage would be indistinguishable from one that was never measured. Business stages with no data source are omitted rather than reported as zero. **Confirmed unchanged 2026-09-04** — the fresh spec paste matches this entry exactly, no shape drift.

### GET /lifecycle/stages/{stageKey}/screens

- **Purpose:** The tab bar for one stage's screens beyond the 9 every stage shares — for each
  stage-specific tab, either its `route` (built) or the source it's waiting on (`needs`/
  `wouldUnlock`). One registry call instead of ~28 endpoints each individually returning
  "unavailable" — a client learns what's missing before clicking, not after. See
  [`lifecycle-reference.md`](lifecycle-reference.md) §3 for the full per-stage tab matrix (32/33
  built) and the `status` semantics (`built`/`source-missing`/`not-built`) in detail — this entry
  just records the real response shape.
- **Auth:** Bearer token.
- **Request:** path `stageKey`.
- **Response `data`:** `{ stageKey, stageName, screens: [{key, name, answers, isBuilt, status, route, needs, blocked, wouldUnlock}], built, gated, unbuilt, callouts: [{key, tone, headline, body}] }`. `route`/`needs`/`blocked`/`wouldUnlock` all nullable per the spec's example (each screen carries exactly the pair relevant to its `status`).
- **Used by:** not wired — no service/hook file exists yet (new endpoint as of the 2026-09-04 spec paste).
- **Status:** documented, not scaffolded.
- **Notes:** `isBuilt` says whether the screen exists at all; `route` is where it lives when it does. `needs` names the source that would turn a gated screen on, `wouldUnlock` says what answering it would then unlock; `blocked` carries a render-ready one-sentence version of the same for clients that want one string. Most stages are mostly gated in a fresh workspace — most stage-specific questions need cost of goods, ad spend, a helpdesk, or delivery telemetry, none of which Flolyt holds by default. The **shared 9 stage screens are not listed here** — they apply regardless of what `/screens` returns, this endpoint is stage-specific tabs only. Good candidate for driving the stage-page tab bar dynamically instead of hardcoding which tabs exist per stage in `stage-tabs-config.ts` — worth revisiting once this is scaffolded.

### GET /lifecycle/stages/{stageKey}

- **Purpose:** One stage's live state — population, departures (grouped by exit-rule cause), rate of change, restating flag.
- **Auth:** Bearer token.
- **Request:** path `stageKey`.
- **Response `data`:** `{ stageKey, stageName, position, owningTeam, leadAgentKey, leadAgentName, reviewCadence, population, populationSource, definitionVersion, populationComputedAtUtc, populationCaveat, rateOfChange, yearOverYear, yearOverYearCaveat, primaryConversion, atStake, departures: [{cause, toStageKey, toStageName, conditionKey, size, observedValue, observedValueCaveat, reachability, reachabilityCaveat, claim: {statement, grade, type, confidence: number}, roomOpen, trend: {direction, reading, shareChange, countChange, monthsCompared, missingSource}}], restating, callouts: [...], referralReach: {referred, shareOfAcquisition, newCustomers, windowDays} | null, owner: {ownerUserId, displayName, isActive} | null, ownershipStanding: {ownerUserId, unownedSinceUtc, unownedMonths, reason, isOwned} }`. `population`/`populationSource`/`definitionVersion`/`populationComputedAtUtc`, and each departure's `size`, are nullable per the spec's example. **Confirmed 2026-08-31 from two live responses (`acquire`, `activate`):** `population`, `rateOfChange`, and `primaryConversion` are each the same "measured value" wrapper as `GET /map`'s `atStake` — `{ value: number | null, state: string, missingSource?: string, wouldUnlock?: string }` — not the bare nullable numbers the written spec implied. This confirms the wrapper-reuse guess flagged under `GET /map`'s notes, now verified for these three fields specifically. **Added 2026-09-04 from the fresh spec, not yet live-verified:** `yearOverYear`/`yearOverYearCaveat`, `atStake` (decided by the same code `GET /map` uses, so the two surfaces can't disagree — same 3-stage real-value restriction applies, see that entry's corrected note), `referralReach` (Advocate only, presumably null elsewhere), `owner`, `ownershipStanding`, and each departure's `claim.type` + `trend` sub-object are all new fields not in the original 18-endpoint pass — likely share the measured-value wrapper convention where nullable, but confirm against a real response before assuming the exact shape.
- **Used by:** service + hook exist (`get-stage.ts` / `use-get-stage.ts`) — **wired 2026-09-05 for Acquire and Activate**, Overview tab's KPI numbers only, NOT its bespoke per-row leak-table narrative (see coverage tracker note on Overview). `overview-tab.tsx` has a per-stage `build{Stage}Kpis` function (`buildAcquireKpis`, `buildActivateKpis`) rather than one generic mapper, since which of the design's original 4 cards has a backing field differs per stage (Acquire drops "Blended CAC"; Activate drops "Median time to value" — that one exists on `GET /lifecycle/activate/time-to-value` instead, not this endpoint, so pulling it in here was deferred rather than composed across two endpoints). The other 8 stages still read `data.ts` mock `kpis`. Not yet checked against a real response for Activate (Acquire was, 2026-08-31).
- **Status:** wired (acquire, activate), not yet wired for the other 8 stages.
- **Notes:** `primaryConversion` unavailable throughout (nothing models it yet) — confirmed live for both `acquire` and `activate`. `rateOfChange` was also unavailable for both (same `missingSource`: "a count for this month and the one before it") — not yet confirmed available for any stage. Departures' `observedValue`/`reachability` are unavailable and say why (no customer-record match in the warehouse); both live responses returned `departures: []` (empty array, not populated rows) and `callouts: []`/one entry — not yet seen a stage with actual departure rows. `population` is genuinely unavailable for `acquire` (`missingSource`: "a definition for Acquire — nothing yet says who is in it") but available for `activate` via `populationSource: "lifecycle-fallback"` — consistent with `GET /map`'s note that the fallback classifier only covers activate/retain/churn. `owningTeam` confirmed live: `"Marketing"` for acquire, `"Product"` for activate — matches `data.ts`'s mock department values for both, first live confirmation of this field (still worth re-checking on `GET /map` itself, which returns it from a different call). `leadAgentKey`/`leadAgentName` confirmed format: kebab-case key, Title Case name (e.g. `"acquisition-quality"` / `"Acquisition Quality"`). `reviewCadence` confirmed lowercase string enum (`"weekly"`, `"daily"`). Activate's one live callout, `{key: "population-from-fallback", tone: "context", ...}`, confirms a `"context"` tone value not previously seen (distinct from `GET /map`'s callout tones). **From the 2026-09-04 spec text:** `yearOverYear` compares this month against the SAME MONTH a year ago as a share of where it started (cancels seasonality) — unavailable until the stage has 13 months of readings, or if it held nobody a year ago; `yearOverYearCaveat` is set when the definition changed inside that year (the figure is real, but part of the movement is the meaning moving, not the business). Each departure group's `trend` compares two periods the same way the stage-level `compare` endpoint does, scoped to that one cause. While `restating`, `population`/`rateOfChange` carry the restating state and `departures` comes back empty — those figures were computed under a meaning the workspace already replaced.

### GET /lifecycle/stages/{stageKey}/changes

- **Purpose:** Month-by-month population history for one stage, flagging definition-change/restated months.
- **Auth:** Bearer token.
- **Request:** path `stageKey`; query `from`/`to` (RFC 3339, default 12-month restatement window).
- **Response `data`:** `{ stageKey, stageName, restating, periods: [{periodStartUtc, population, delta, isDefinitionChange, isRestated, definitionVersion, restatedFromVersion, asOfUtc}] }`. `population`/`delta` nullable — unavailable rather than zero whenever either bounding month is unmeasured.
- **Used by:** service + hook exist (`get-stage-changes.ts` / `use-get-stage-changes.ts`), not wired — **no confirmed UI target** (the coverage tracker's "History tab" note above previously guessed `stage/history/history-tab.tsx`, which is wrong — that tab's real endpoint is `GET .../history` below).
- **Status:** service/hook ready, not wired.
- **Notes:** Distinct from `change-registry` below — this is the population trend, not dated causes.

### GET /lifecycle/stages/{stageKey}/history

- **Purpose:** The stage's History tab — everything already tried on this stage. Rooms opened on
  it (`attempts[]`) and the business-memory claims scoped to it (`learnings[]`).
- **Auth:** Bearer token.
- **Request:** path `stageKey`.
- **Response `data`:** `{ stageKey, stageName, attempts: [{roomId, title, decision, condition, openedAtUtc, closedAtUtc, status, outcomeKind, outcomeNote, delta, currency, howMeasured: {holdoutPercent, noHoldoutBecause, measuredOverDays, primaryMeasure, revenueBasis, contacted, heldBack, liftPoints, recovered}, learningState}], learnings: [{claimId, statement, grade, type, learningState, recordedAtUtc, roomId}], goalDependencies, callouts: [...] }`. `decision`/`closedAtUtc`/`outcomeKind`/`outcomeNote`/`delta`/`roomId` (on learnings) nullable per the spec's example. `goalDependencies` is `null` in the example and, per the prose, permanently so — see Notes.
- **Used by:** service + hook exist (`get-stage-history.ts` / `use-get-stage-history.ts`) — **wired 2026-09-05**, `stage/history/history-tab.tsx` (shared across all 10 stages, generic on `stage.slug`, same dispatch pattern as the What-changed tab). The "Goals that depend on this stage" table is dropped entirely per the permanent-gap note below — commented out, not fetched. The "What has already been tried" table now reads `attempts[]`: What←`title`, When←`closedAtUtc ?? openedAtUtc`, Result←`delta`+`currency` (falling back to `outcomeNote`/`outcomeKind`, or "Still open" while `closedAtUtc` is null), Measured how←a composed line from `howMeasured` (`primaryMeasure`, holdout percent or `noHoldoutBecause`, `liftPoints` when present, `measuredOverDays`), Learning kept←`learningState` mapped through the real 6-value vocabulary (not the ~20 freeform mock labels this tab used before — all 10 stages' `*_GOAL_ROWS`/`*_TRIED_ROWS`/`*_HISTORY_INSIGHT` mocks removed). **`learnings[]` (the business-memory claims list) is not yet consumed anywhere** — richer/broader than `attempts[].learningState` (includes claims not tied to a room), left for a future pass rather than forced into the existing two-table design this session. Not yet checked against a real response.
- **Status:** wired (all 10 stages), not yet live-verified.
- **Notes:** A room opened on a customer state (e.g. "slipping") appears under whichever stage it bridges to, not literally under a stage called that. `howMeasured` carries the plan declared at open plus the contacted/held-back figures at close; `liftPoints` is in percentage points against the holdout, unavailable naming why when there was none (`noHoldoutBecause`). `learnings[]` includes superseded and rejected claims, not just currently-valid ones — each carries the contract's full learning-state vocabulary: `validated` / `observation` / `constraint` / `superseded` / `rejected` / `room-open`. **`goalDependencies` is permanently unavailable** — the spec states plainly "nothing models goals yet," not a temporary gap — the "Goals that depend on this stage" table this tab's design calls for has no backing field at all and needs the `// ❌ Backend does NOT provide` treatment per [[feedback_backend_gap_comment_convention]], not a fetch that will eventually resolve.

### GET /lifecycle/stages/{stageKey}/change-registry

- **Purpose:** The stage's "What changed" tab — every dated registry change in the workspace, each measured against **this stage's own** monthly history (full month before the change vs first full month after).
- **Auth:** Bearer token.
- **Request:** path `stageKey`.
- **Response `data`:** `{ stageKey, stageName, entries: [{id, occurredOnUtc, title, team, source, kind, affectedStageKeys, effect: {status, delta, percentChange, caveat}, sourceRoomId}], callouts: [...] }`. **`kind` added 2026-09-04** — matches `POST /changes`' new `kind` field (`action`/`absence_of_action`), previously undocumented here.
- **Used by:** service + hook exist (`get-stage-change-registry.ts` / `use-get-stage-change-registry.ts`) — **wired 2026-09-04**, `stage/changes/changes-tab.tsx` (the shared "What changed" template used by all 10 stages, generic on `stage.slug`). Row's `id` is the `changeId` for the impact drilldown below, not yet linked from this table — only Activate's own `release-impact-route.tsx` exists today and this component doesn't assume every stage has one. Removed every stage's `*_CHANGE_ROWS`/`*_CHANGES_INSIGHT` mock (10 files) — the per-stage "insight" callouts are now the endpoint's own live `callouts[]`, same pattern as Funnel/Channels. Acquire's Acquire-only "How a change gets onto this list" explainer (`ACQUIRE_CHANGE_SOURCE_ROWS`) was dropped entirely — it was static help copy, not backed by any field. Not yet checked against a real response.
- **Status:** wired (all 10 stages), not yet live-verified. `kind` field not yet surfaced in the UI.
- **Notes:** `effect.status` ∈ `measured` (it moved — a movement around a date, never an attribution) / `no_effect` (both months measured, movement inside the 2% noise floor — a real answer, distinct from not having looked) / `too_recent` (the after-month hasn't finished) / `outside_history` (the stage's history doesn't reach the change) / `not_instrumented` (the stage has never been counted at all) — each a distinct, real state, not a fallback chain. `effect.caveat` is set when the stage's own definition moved inside the comparison window — part of the movement is the meaning moving, not the business. Distinct from `GET .../changes` above — that's the population's month-by-month history; this is the registry of dated causes to read that history against. **The row's effect-line text is still the open question flagged below** (whether `caveat` supplies a ready sentence) — `changes-tab.tsx` doesn't guess a metric name (the old mock's "First-order completion −7.0 pts" style text implied a metric label the API doesn't give); it shows `percentChange`/`delta` plainly instead, with `caveat` appended verbatim when present, deliberately avoiding client-side sentence templating.

### POST /lifecycle/changes

- **Purpose:** Record a dated business change a person knows about but Flolyt can't see (a partner's price change, a policy shift, a release from a system with no feed).
- **Auth:** Bearer token; open to any member — the registry's value is completeness, and the cautionary case the spec cites is a change nobody wrote down being misdiagnosed from five desks for twenty weeks.
- **Request:** `{ occurredOnUtc, title, team?, description?, affectedStageKeys?, kind? }`. **`kind` is new as of the 2026-09-04 spec** — `"action"` (default) or `"absence_of_action"` — not in the original 18-endpoint pass.
- **Response:** `{ data: changeId (uuid), messages, succeeded }`.
- **Used by:** service + hook exist (`create-change.ts` / `use-create-change.ts`), not wired — target the "Add a change" header button on `changes-tab.tsx`. Service file predates `kind`, needs updating.
- **Status:** service/hook ready (stale — missing `kind`), not wired.
- **Notes:** **Workspace-level, deliberately** — one change surfaces as different symptoms in different stages, so it's recorded once and every stage's own registry measures it against that stage's own history. `occurredOnUtc` is when it took effect **in the world**, not when it was written down; a future date is refused. `affectedStageKeys` is the recorder's claim of scope and may be empty (the most honest answer at recording time) — it never filters measurement, only records intent; the impact view flags stages that moved which weren't listed. `kind: "absence_of_action"` indexes things that were *supposed* to happen and didn't, dated from when the omission took effect — because unexecuted decisions produce measurable drops too, not just executed ones.

### POST /lifecycle/changes/from-room

- **Purpose:** Promote a room's decision onto the change registry.
- **Auth:** Bearer token; requires room membership (or ownership/administration) — a restricted room's decision is only its own people's to publish onto the workspace-wide registry.
- **Request:** `{ roomId, occurredOnUtc, title?, affectedStageKeys? }`.
- **Response:** `{ data: changeId (uuid), messages, succeeded }`.
- **Used by:** service + hook exist (`create-change-from-room.ts` / `use-create-change-from-room.ts`), not wired.
- **Status:** service/hook ready, not wired.
- **Notes:** **A deliberate promotion, not an automatic hook on deciding** — two facts must come from a person: whether the decision changed anything *outside* the room at all ("watch and wait" is a decision and not a change), and `occurredOnUtc` — the date it took effect in the world (the ship date), which is not the date the room committed. One promotion per room opening; a reopened room's new decision is a new change. `title` is optional while the decision statement is short enough to be one; a longer decision needs its own title, with the full statement plus any guardrails travelling in `description` either way. `affectedStageKeys` defaults to the stage the room was opened on. The created entry carries `sourceRoomId` so a registry reader can walk back to the reasoning, dissent, and falsifiers behind the change.

### DELETE /lifecycle/changes/{changeId}

- **Purpose:** Remove a registry entry.
- **Auth:** Bearer token; recorder can remove their own, administrator can remove any — nobody else, since the registry is shared evidence and a row somebody may have read their stage's movement against shouldn't vanish on one member's whim.
- **Request:** path `changeId`.
- **Response:** `{ data: changeId, messages, succeeded }`.
- **Used by:** service + hook exist (`delete-change.ts` / `use-delete-change.ts`), not wired.
- **Status:** service/hook ready, not wired.

### GET /lifecycle/changes/{changeId}/impact

- **Purpose:** One change measured against every stage — the release-impact drilldown and "the skeleton of the whole-chain view." Each effect is computed inside the stage that owns it, by the same code the change-registry rows use, so the two surfaces can't disagree.
- **Auth:** Bearer token.
- **Request:** path `changeId`.
- **Response `data`:** `{ changeId, title, occurredOnUtc, team, source, kind, affectedStageKeys, sourceRoomId, stages: [{stageKey, stageName, effect: {status, delta, percentChange, caveat}}], callouts: [...] }` (all 10 stages always returned, in spine order). **`kind` added 2026-09-04**, same field as `POST /changes`.
- **Used by:** service + hook exist (`get-change-impact.ts` / `use-get-change-impact.ts`), not wired — target `activate/release-impact-route.tsx` (`/lifecycle/:stage/changes/:id`, already has a live `:id` param) and, pending the routing fix noted in the coverage tracker, `stage/chain/chain-route.tsx`. Service file predates `kind`, needs updating.
- **Status:** service/hook ready (stale — missing `kind`), not wired.
- **Notes:** 404 if the change isn't in this workspace's registry. **The stages that did NOT move are part of the finding** — all 10 always come back, not just the affected ones. "Moved-where-nobody-expected" callout names stages that moved but weren't in `affectedStageKeys` — one release reading as five unrelated symptoms from five desks is exactly the failure this screen exists to catch early. Every figure here is a movement around a date, **never an attribution** — nothing has a held-back comparison group, and the callouts say so explicitly.

### PUT /lifecycle/stages/{stageKey}/conversion

- **Purpose:** Names which of a stage's exits counts as *succeeding* — what turns the Overview
  tab's `primaryConversion` from unavailable into a real share between 0 and 1.
- **Auth:** Bearer token; stage owner or workspace administrator only.
- **Request:** path `stageKey`; body `{ conditionKey: string | null }`. `conditionKey` must be one
  of the current definition's exit-rule `conditionKey`s (the Overview tab's departure groups carry
  them) — `null` clears the binding, and `primaryConversion` honestly reads unavailable again.
- **Response:** `{ data: null, messages, succeeded }`.
- **Used by:** not wired — no service/hook file exists yet (new endpoint as of the 2026-09-04 spec
  paste, not one of the original 18).
- **Status:** documented, not scaffolded.
- **Notes:** Deliberately **no blast-radius preview** the way a definition edit gets — binding a
  conversion moves no population and restates nothing, so it doesn't need one. A redefinition that
  drops the bound exit condition leaves the conversion unavailable, naming the dangling key —
  success is never silently re-pointed at a different exit.

### GET /lifecycle/stages/{stageKey}/definition

- **Purpose:** A stage's current definition (if any), full version history, and candidate entry events.
- **Auth:** Bearer token.
- **Request:** path `stageKey`.
- **Response `data`:** `{ stageKey, stageName, canEdit, isDefined, fallbackInUse, fallbackNote, current: {version, entryEventKey, exitRules: [{kind, eventKey, days, movesToStageKey}] | null, exclusions: [{kind, mergeKey}] | null, effectiveFromUtc, createdByUserId, createdBy, createdAtUtc} | null, history: [{version, createdAtUtc, createdByUserId, createdBy, isCurrent}], candidates: [{eventKey, description, datasourceId, estimatedRows, population}] }`. `candidates[].description`/`population` nullable per the spec's example. **Clarified 2026-09-04:** the spec's prose explicitly calls `candidates[].population` "a measured value — unavailable until counted, and never filled in from `estimatedRows`" — same wrapper as `GET /map`'s `atStake`, not a plain nullable number as the entry previously implied. `estimatedRows` counts rows, not people, and must never stand in for `population` in the UI even while it's unavailable.
- **Used by:** service + hook exist (`get-stage-definition.ts` / `use-get-stage-definition.ts`), not wired — target `stage/definition/definition-route.tsx`.
- **Status:** service/hook ready, not wired.
- **Notes:** New workspace has `isDefined: false`/`current: null` for all 10 — never seeded, since a definition is a claim about this tenant's own data. `fallbackInUse` marks activate/retain/churn using the classifier's recency thresholds until defined.

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
- **Notes:** ❓ Neither the original doc nor the real spec documents a field identifying *which* candidate event a call measures — the request is just `force`, despite the purpose line saying "each candidate entry event." Looks like a real gap, not something to guess at; ask backend before wiring this into the definition screen. **Still unresolved as of the 2026-09-04 spec re-paste** — the fresh text repeats the same "counts the distinct customers behind each candidate entry event" purpose with the same bodyless `force`-only request, so this isn't a documentation oversight that's since been fixed; flag it directly. Bounded per call with a timeout — a handful of counts per call, each with its own timeout, tables above a size cap are skipped and recorded as failures rather than retried on every visit; counts cached for a day unless `force=true`.

### GET /lifecycle/stages/{stageKey}/cohorts

- **Purpose:** Entry cohorts, age-aligned — everyone who entered the stage, grouped by arrival
  month, each month's arrivals measured at the stage's own standard ages.
- **Auth:** Bearer token.
- **Request:** path `stageKey`; query `months` (3-12, default 6).
- **Response `data`:** `{ stageKey, stageName, measurementAgeDays: number[], cohorts, undatedCustomers, valueCaveat, caveat, callouts: [...] }`. `cohorts`/`undatedCustomers`/`valueCaveat`/`caveat` nullable in the example, and **the per-cohort row shape still isn't spelled out field-by-field even in this fresh spec paste** — only described in prose (see Notes). Don't invent a row shape; confirm against one live response before rendering a table. **Note:** the previously-documented top-level `currency` field is gone from this pass — `values` (see Notes) is per-currency instead, one figure per currency and never summed, consistent with the rest of this domain.
- **Used by:** service + hook exist (`get-stage-cohorts.ts` / `use-get-stage-cohorts.ts`), not wired — target `stage/{acquire,...}/cohorts-tab.tsx`. Service file predates this entire prose description and needs a real response before it can be trusted.
- **Status:** service/hook ready (stale, shape underspecified), not wired.
- **Notes:** `measurementAgeDays` is `[30, 60, 90]` for most stages, `[180]`-inclusive for expand/advocate/churn (per the prose — exact per-stage array not yet seen live). Each cohort row carries one cell per age with `stillInStageShare` (0-1): a cell is available once the cohort's **last** arrival has lived the whole window, else unavailable naming the date it matures — measured then, never projected/interpolated. `entered` (arrivals count) is itself a measured value: an available zero means the pass ran and genuinely found nobody, while a month newer than the matrix's own compute date reads unavailable naming that date — an uncounted month must not read the same as an empty one. A **defined** stage cohorts from its own warehouse (six-hourly refresh); a lifecycle-**bridged** stage without a definition carries `entered`+observed value with every age cell unavailable, because the bridge's stand-in records where a customer is *now*, not where they stood at day 30. `values` (observed money to date, **never at-stake, never a forecast**) is lifetime revenue in billing currency on bridged stages, or the entry event's per-currency amounts on defined stages — one entry per currency, never summed, unavailable naming the missing column/currency when nothing could be totalled. `undatedCustomers` (bridged stages only) counts members whose entry was never dated — excluded from the matrix itself, with `caveat` saying so. `callouts` includes a dated-break reading when adjacent same-age cohorts fall sharply enough to name.

### GET /lifecycle/stages/{stageKey}/markets

- **Purpose:** The stage's measures broken out per declared market, side by side and never
  summed — LC-tab-matrix's Markets screen (one of the 9 shared per-stage tabs).
- **Auth:** Bearer token.
- **Request:** path `stageKey`.
- **Response `data`:** `{ stageKey, stageName, markets: [{countryCode, currencyCode, isPrimary, population, atStake, primaryConversion}], callouts: [...] }`. `population`/`atStake`/`primaryConversion` all nullable per the spec's example.
- **Used by:** not wired — no service/hook file exists yet (new endpoint as of the 2026-09-04 spec paste). Target: the shared "Markets" tab (`/lifecycle/{stage}/markets`).
- **Status:** documented, not scaffolded.
- **Notes:** Each row's money is in that market's own currency — **no total row exists by
  construction**, don't add a client-side sum. `atStake` is available for the leakage-reachable
  stages (activate/retain/churn — same restriction as `GET /map`'s `atStake`) once a refresh has
  run, an honest zero when the pass found nothing in that currency, unavailable naming the missing
  source otherwise. **Two markets declared in the same currency both read unavailable** — one
  figure can't be split between two countries without inventing the split, a sharper rule than the
  usual "never blend currencies" one. `population`/`primaryConversion` are **unavailable
  throughout, for every stage** — money is the only market-sliced fact this product holds; don't
  render the workspace total per market as a substitute. Primary market first, then alphabetical.

### GET /lifecycle/stages/{stageKey}/compare

- **Purpose:** Last N months vs the N before, population (and now conversion) only.
- **Auth:** Bearer token.
- **Request:** path `stageKey`; query `months` (1-12, default 3).
- **Response `data`:** `{ stageKey, stageName, windowMonths, before: {fromUtc, toUtc, monthsInWindow, monthsMeasured, endPopulation, averagePopulation, endConversion, restatedMonths}, after: {...}, change, changePercent, conversionChange, definitionChangedInside, callouts: [...] }`. `endPopulation`/`averagePopulation`/`endConversion`/`change`/`changePercent`/`conversionChange` all nullable per the spec's example. **Added 2026-09-04:** `before.endConversion`/`after.endConversion` and top-level `conversionChange` are new — not in the original 18-endpoint pass, presumably reads the same `primaryConversion` binding `PUT /conversion` sets, unconfirmed live.
- **Used by:** service + hook exist (`get-stage-compare.ts` / `use-get-stage-compare.ts`), not wired — target `stage/compare/compare-route.tsx`. Service file predates `endConversion`/`conversionChange`, needs updating.
- **Status:** service/hook ready (stale — missing `endConversion`/`conversionChange`), not wired.
- **Notes:** Windows are adjacent and never overlap. Only population (and now conversion) compare today — the kit's fuller table (CAC, repeat rates, value per customer) needs sources nothing models, and the response says so rather than faking a row. Each window carries how many of its months were actually measured vs restated. `change`/`changePercent` unavailable rather than zero when either window's end is unmeasured. `definitionChangedInside: true` means the measured months span more than one definition version — part of any movement is the meaning moving, and the accompanying callout says where to read the delta from instead.

## Per-stage tab-specific endpoints (batch 3, 2026-09-04)

24 endpoints from §3 of [`lifecycle-reference.md`](lifecycle-reference.md)'s tab matrix — the
stage-specific tabs beyond the 9 every stage shares. None have a service/hook file yet (per the
user's 2026-09-04 call, code waits until all batches are in). Entries below are first-pass from the
real spec text only, not live-verified — the spec's own prose is unusually dense with load-bearing
invariants (marked ALL-CAPS in the source), so those are preserved in each Notes line rather than
paraphrased away. Every response follows the same envelope/shape conventions as the rest of this
file: `Result<T>`, money never blended across currencies, a `computedAtUtc`, and a `callouts[]`.

### GET /lifecycle/retain/repeat-curve

- **Purpose:** Retain's Repeat Curve tab — second-order purchase timing among mature first-time buyers, plus the return-probability curve and the daily rate of loss across the slipping boundary.
- **Response `data`:** `{ stageKey, stageName, basis, basisCaveat, boundaryDays, matureFirstTimeBuyers, tooYoungFirstTimeBuyers, buckets: [{fromDay, toDay, customers, share}], repeatShareWithinBoundary, neverReturned, points: [{daysSince, reached, returnProbability}], dailyBoundaryCrossings, computedAtUtc, callouts }`.
- **Status:** documented, not scaffolded.
- **Notes:** Only counts buyers whose first order is at least `boundaryDays` old (the workspace's own slipping threshold) — younger ones sit in `tooYoungFirstTimeBuyers`, excluded from every rate, never projected. The return-probability curve counts gaps that *reached* N days quiet — an open gap counts as not-yet-returned, so the reading is conservative near today by construction. `basis`/`basisCaveat` flag these figures as coming from imported order history, not the warehouse a defined Retain counts in — a different basis than the stage's own Overview population. Every share is unavailable below a readable sample, naming it.

### GET /lifecycle/retain/segments

- **Purpose:** Retain's Segments tab — every active segment intersected with Retain's population, overlaps resolved.
- **Response `data`:** `{ stageKey, stageName, basis, basisCaveat, retainPopulation, segments: [{segmentId, name, matched, reachable, repeating, decaying, pastBoundary, repeatShare, reachableShare, values: [{currency, amount}], claim: {statement, grade, type, confidence}, roomOpen}], distinctAcrossSegments, sumOfMatched, distinctValues: [{currency, amount}], overlaps: [{segmentA, nameA, segmentB, nameB, shared}], valueWindowDays, computedAtUtc, callouts }`.
- **Status:** documented, not scaffolded.
- **Notes:** `matched` and `reachable` are always both shown per segment — `reachable` means active, with an address, not suppressed. `pastBoundary` members (crossed the boundary and left the stage) are counted and marked, never silently dropped. `distinctAcrossSegments` vs `sumOfMatched` is the dedup: a person in two segments is one person; `distinctValues` is each person's money counted once, never per-segment-double-counted. `values`/`distinctValues` never summed across currencies.

### GET /lifecycle/retain/reactivation

- **Purpose:** Retain's Reactivation tab — campaigns whose enrolled audience was mostly dormant at signup, recognised by who they reached rather than by campaign name.
- **Response `data`:** `{ stageKey, stageName, basis, basisCaveat, dormancyDays, waves: [{campaignId, name, state, startedAtUtc, audience, holdout, dormantAtEnrolment, treatmentReactivationShare, holdoutReactivationShare, liftPoints, attribution, unattributableBecause, medianDaysSinceLastOrderAtEnrolment}], campaignsConsidered, computedAtUtc, callouts }`.
- **Status:** documented, not scaffolded.
- **Notes:** `liftPoints` is only available when `attribution === "holdout"` — an `"unattributable"` wave shows its raw share, no lift, and names why (`unattributableBecause`). `medianDaysSinceLastOrderAtEnrolment` feeds a timing-mismatch callout comparing when the wave reached people against where `repeat-curve` says second orders actually concentrate — worth cross-referencing both tabs' `callouts[]` if both get wired.

### GET /lifecycle/adopt/features

- **Purpose:** Adopt's Features tab — which features people use, return to, and abandon.
- **Response `data`:** `{ features: [{feature, customers, returned, abandonedCustomers, kept, abandoned}], customersSeen, windowDays, abandonedAfterDays, computedAtUtc, callouts }`.
- **Status:** documented, not scaffolded.
- **Notes:** Counted in **customers, never events** — one person firing an event 900 times is one adopter. `returned` (used more than once) and `abandonedCustomers` (not touched since the cutoff) are **not complements** — someone can return to a feature twice and still later abandon it, both can be true of the same person. A feature nobody touched has no retention share at all, not a zero one. Read over a fixed 90-day window from a mapped product-events table, refreshed daily.

### GET /lifecycle/adopt/depth

- **Purpose:** Adopt's Depth tab — how many features each customer used, and what share at each depth stayed active.
- **Response `data`:** `{ bands: [{features, customers, stillActive, stillActiveShare}], medianFeatures, lift, windowDays, activeWithinDays, computedAtUtc, callouts }`.
- **Status:** documented, not scaffolded.
- **Notes:** **Correlation, not causation, and the payload says so in a callout** — in most products the people who were going to stay anyway use more of the product, so this can't distinguish "using more features causes retention" from "people who'd stay anyway explore more." What it's actually good for: finding which features stayers reach and leavers never do. Bands under 20 customers report no share (not a noisy one). `medianFeatures` is a median deliberately, not a mean — one power user would drag a mean somewhere no real customer sits.

### GET /lifecycle/advocate/referrers

- **Purpose:** Advocate's Referrers tab — who refers, how concentrated it is, who's stopped.
- **Response `data`:** `{ bands: [{referrals, referrers, lapsed, lapsedShare}], referrers, referred, lapsed, concentration, windowDays, lapsedAfterDays, computedAtUtc, callouts }`.
- **Status:** documented, not scaffolded.
- **Notes:** Counted in **advocates, not referrals** — one person who brought 9 referrals is one advocate; the shape of that distribution (a programme carried by 4 people vs 400) is the whole point of the tab. `concentration` (share of referrals from the busiest decile) is an approximation taken at a band boundary — good enough to distinguish "a programme" from "a set of relationships," not precise. Silent 90 days = counted as lapsed (still customers — that's what makes them worth messaging). Bands under 20 report no share.

### GET /lifecycle/advocate/referral-quality

- **Purpose:** Advocate's Referral quality tab — whether referred customers behave differently from everybody else who bought.
- **Response `data`:** `{ cohorts: [{cohort, customers, ordersPerCustomer}], byCurrency: [{currency, referredPerCustomer, otherPerCustomer, lift}], orderLift, windowDays, computedAtUtc, callouts }`.
- **Status:** documented, not scaffolded.
- **Notes:** **The comparison group is "everybody else who bought," not "acquired customers"** — without an acquisition source mapped, Flolyt can't tell a paid arrival from an organic one, so naming the other side "non-referred acquisitions" would be an attribution claim nothing here supports. Order behaviour (`orderLift`) is one figure; money (`byCurrency`) is **one per currency, never blended** — a 4-currency workspace gets 4 separate comparisons, not one blended lift. Groups under 20 customers report no figure. A programme can plausibly bring customers who order more often *and* spend less each time — both figures exist because either alone would mislead.

### GET /lifecycle/advocate/viral-compounding

- **Purpose:** Advocate's Viral compounding tab — how much referring is done by people who were themselves referred.
- **Response `data`:** `{ generations: [{generation, referrers, referred, referredPerReferrer}], secondGenerationShare, windowDays, computedAtUtc, callouts }`.
- **Status:** documented, not scaffolded.
- **Notes:** **Measured, not projected** — the natural next question ("what does losing a referrer cost in referrals they'd have made") is a forecast needing an experiment nobody has run; this returns the observed chain only and leaves the conclusion to the reader. `secondGenerationShare` is taken **over advocates, not over referrals** — one prolific second-generation referrer can't imply a compounding programme on its own. This is Advocate's permanently-gated Rewards tab's sibling, not a substitute for it — see [`lifecycle-reference.md`](lifecycle-reference.md) §3 for why Rewards can't close the same way.

### GET /lifecycle/price/plans

- **Purpose:** Price's Plans tab — which tiers people are actually on, and what each is worth, from a mapped subscription book.
- **Response `data`:** `{ plans: [{plan, currency, customers, value, valuePerCustomer, shareOfCustomers}], customers, computedAtUtc, callouts }`.
- **Status:** documented, not scaffolded.
- **Notes:** **Live subscriptions only** — counting every subscription that ever existed would make a retired tier look permanently popular. One row per plan **per currency**, nothing sums across them. A book with no amount mapped reports `value` unavailable, never zero — unpriced plans are not free ones.

### GET /lifecycle/renew/renewal-book

- **Purpose:** Renew's Renewal book tab — what's coming up for renewal in the next 90 days, banded 0-30/31-60/61-90, split by whether it's already cancelled.
- **Response `data`:** `{ slices: [{band, state, currency, customers, value}], comingUp, alreadyCancelled, horizonDays, computedAtUtc, callouts }`.
- **Status:** documented, not scaffolded.
- **Notes:** **The cancelled split is the whole point** — a subscription cancelled last week is still on the book with a real renewal date and is certain not to renew; a "book" that counts it is a pipeline wearing a forecast's name. `alreadyCancelled` is the gap between the two readings. Value per currency, never blended.

### GET /lifecycle/renew/dunning

- **Purpose:** Renew's Dunning tab — whether a failed payment ever clears, and how long it took.
- **Response `data`:** `{ bands: [{band, customers, share}], failed, recovered, computedAtUtc, callouts }` — bands: within-a-day / within-a-week / later / **never**.
- **Status:** documented, not scaffolded.
- **Notes:** **"Never" is a band, not an exclusion** — dropping never-recovered customers would compute a clearing time over exactly the payments that DID clear, then call it a recovery rate. Failure statuses matched narrowly (`failed`/`declined`/`unpaid`/`past due`/`insufficient`) and **deliberately exclude refunds/returns** — those are orders that went wrong *after* being paid, a different concept. Reads the order stream, not the subscription book.

### GET /lifecycle/expand/upgrade-paths

- **Purpose:** Expand's Upgrade paths tab — who moved between plans, and which way, over a year.
- **Response `data`:** `{ moves: [{fromPlan, toPlan, customers, share}], movers, windowDays, computedAtUtc, callouts }`.
- **Status:** documented, not scaffolded.
- **Notes:** A "move" = one subscription starting after another for the same customer on a different plan (previous plan found by start date, not row order). **Cannot tell an upgrade from a downgrade** — a well-worn path to a cheaper tier looks identical to one going the other way; separating them needs a price on every plan the book may not carry. The payload says so via a callout rather than implying a direction it can't actually see — don't add an up/down arrow client-side without that price data.

### GET /lifecycle/activate/time-to-value

- **Purpose:** Activate's Time to value tab — how long people take to reach value, banded, and how that's moved vs the prior quarter.
- **Response `data`:** `{ bands: [{band, customers, share}], entered, reached, medianBand, drift, maturityDays, conversionConditionKey, computedAtUtc, callouts }` — bands: same-day / 1-7 / 8-30 / 31+ / **never**.
- **Used by:** service + hook exist (`get-activate-time-to-value.ts` / `use-get-activate-time-to-value.ts`) — **wired 2026-09-05**, `stage/activate/time-to-value-tab.tsx`. Bands render as bar rows (customers + share, unavailable per-band never assumed zero); `entered`/`reached` as a header line; `medianBand`/`drift` as a small note line, both only when present. **The old mock's per-cohort-by-month table (activated/rate/median days/same-day/vs Feb) is gone entirely** — this endpoint has no cohort dimension, only the 5 fixed bands, so there was no field to map it onto. `conversionConditionKey === null` now renders a dedicated "no conversion bound" callout instead of the band breakdown, per the endpoint's own "whole screen unavailable until bound" rule. Not yet checked against a real response.
- **Status:** wired, not yet live-verified.
- **Notes:** "Reaching value" = whichever exit is bound as Activate's conversion via `PUT /stages/activate/conversion` — **this whole screen is unavailable until one is bound** (`conversionConditionKey: null`), the question has no answer until it's defined. "Never" is a band, not a drop — never-activated customers are most of what this screen exists to show. Both comparison windows end 30 days back so every cohort had equal chance to activate, else the current quarter looks artificially worse (full of people who are new, not late). `medianBand` is a **band, not a day count** — "11.4 days" would be false precision this doesn't have. `drift`'s exact scale (a 0-1 fraction vs. already-in-points) isn't confirmed by any live response — the UI renders it rounded to 1dp with no ×100 conversion rather than risk the wrong order of magnitude; revisit once a real response is seen.

### GET /lifecycle/activate/paths

- **Purpose:** Activate's Paths tab — which acquisition routes bring customers who reach value and come back.
- **Response `data`:** `{ routes: [{route, customers, activated, activationRate, repeated, repeatRate}], customers, conversionConditionKey, computedAtUtc, callouts }`.
- **Used by:** service + hook exist (`get-activate-paths.ts` / `use-get-activate-paths.ts`) — **wired 2026-09-05**, `stage/activate/paths-tab.tsx`. Table columns: route/customers/activated(+rate)/repeated(+rate, `InfoTooltip` when null rather than a fabricated zero). **Not covered by this endpoint:** the original design's "Median days", "At stake" and "Verdict" columns have no backing field — dropped, same treatment as Acquire Channels' dropped "Reach 2nd order"/"Verdict" columns. The per-route link to `path-detail-route.tsx` (AC05) is also dropped — no endpoint carries a per-route narrative, same gap as Acquire's `channel-detail-route.tsx`; **that route (`/lifecycle/activate/paths/:id`) is now unreachable from the UI**, same accepted state as Acquire's channel detail. Not yet checked against a real response.
- **Status:** wired, not yet live-verified.
- **Notes:** Activation and repeat are **separate columns on purpose** — a channel can activate everybody it brings and keep none of them, and either figure alone hides that finding. "Repeated" = a genuine **second purchase** the customer made, not a recency threshold Flolyt picked. With no order stream connected, repeat columns read unavailable, never zero — nothing to count is not the same as nobody returning.

### GET /lifecycle/expand/basket

- **Purpose:** Expand's Basket tab — whether revenue-per-customer moved because baskets got bigger or people ordered more often.
- **Response `data`:** `{ months: [{period, currency, customers, orders, revenue, averageOrderValue, ordersPerCustomer, revenuePerCustomer}], movement: [{currency, from, to, revenuePerCustomerChange, averageOrderValueChange, ordersPerCustomerChange, driver}], lines: [{item, lines, units, share}], grain, currencies, caveat, computedAtUtc, callouts }`.
- **Status:** documented, not scaffolded.
- **Notes:** **The decomposition is exact** — revenue/customer = average order value × orders/customer, no residual, movement attributed in full. Read over 13 **complete** months (13 so both window ends land on the same calendar month a year apart — 12 wouldn't; complete because an in-progress month has partial revenue against a valid average and would show a fake cliff every month). Size half (`months`/`movement`) needs only amount+date; composition half (`lines`) needs order lines and **refuses separately** rather than gating the whole screen on the rarer source. `lines`/`units` are counted, **never priced** — an item price is a unit price on some schemas, a line total on others, multiplying by quantity would silently inflate half of all workspaces.

### GET /lifecycle/acquire/funnel

- **Purpose:** Acquire's Funnel tab — how far a registration cohort got down the canonical acquisition ladder: registered → verified → intent → transacted → settled.
- **Response `data`:** `{ rungs: [{rung, customers, shareOfRegistered, shareOfPrevious}], registered, matched: [{event, rung, occurrences}], unevidenced: string[], maturityDays, computedAtUtc, callouts }`.
- **Used by:** service + hook exist (`get-acquire-funnel.ts` / `use-get-acquire-funnel.ts`) — **wired 2026-09-04**, `stage/acquire/funnel-tab.tsx`. The rungs section (labels/customers/shareOfRegistered/shareOfPrevious), `matched[]`, `unevidenced[]`, and `callouts[]` are all live. Not yet checked against a real response — built from the spec's documented shape only.
- **Status:** wired, not yet live-verified.
- **Notes:** The 5 rungs are **fixed by Flolyt**, mapped onto whatever events a workspace has — not named per-tenant, so a bare customer table + order stream gets a real funnel day one. **`settled` is its own rung** — a placed order that never clears isn't an acquisition; it's the rung that quietly changes the number most other reporting quotes. **A rung with no source is unavailable, never zero.** Every rung is counted **from registration**, never chained off the rung above — chaining would collapse everything below one patchy middle rung into garbage; a later rung reading higher than an earlier one is a real finding (people skip that step), not a bug. `matched[]` lists which of *your* event names were read as which rung — render it, since keyword matching is inference and a wrong match would otherwise silently reshape the funnel. **Not covered by this endpoint:** the tab's "two drops worth acting on" action cards (agent tag, title, body, footnote per drop) have no backing field anywhere in this response — left on mock data in `funnel-tab.tsx`, flagged inline with a `❌ Backend does NOT provide` comment.

### GET /lifecycle/acquire/channels

- **Purpose:** Acquire's Channels tab — what each channel cost, and what its customers went on to pay, over 365 days.
- **Response `data`:** `{ channels: [{channel, currency, customers, acquisitionCost, costPerCustomer, buyers, revenue, revenuePerCustomer, return}], costCurrency, computedAtUtc, callouts }`.
- **Used by:** service + hook exist (`get-acquire-channels.ts` / `use-get-acquire-channels.ts`) — **wired 2026-09-04**, `stage/acquire/channels-tab.tsx`. Table (channel/acquired/spend/CAC/value-per-customer) and the spend-breakdown bars are live, each amount formatted with its own row's `currency` rather than assumed ₦ (new `formatCompactMoney` helper). Not yet checked against a real response.
- **Status:** wired, not yet live-verified.
- **Notes:** **The two halves refuse separately** — cost is rarely mapped, revenue almost always is, so gating revenue on cost would withhold the more commonly answerable half. Revenue counts only money taken **at or after** the customer arrived, so someone re-tagged to a new channel doesn't carry their whole lifetime history to it. **`return` is unavailable unless cost and revenue share a currency** — acquisition cost has no currency of its own on the customer row, so it's read as the workspace's single declared currency; a ratio against revenue in anything else would be numerically meaningless. Cost is per **customer**, not per row, so a duplicated identity table doesn't inflate the channels it duplicates into. **Not covered by this endpoint:** the original design's "Reach 2nd order" and "Verdict" columns have no backing field (no per-channel repeat-conversion rate, no verdict/label) — dropped rather than shown against a fabricated value. The A05 one-channel drilldown (`channel-detail-route.tsx`, `ACQUIRE_CHANNEL_DETAILS`) is untouched and stays mock — this list endpoint has no per-channel narrative (checked-rows, cause, action cards) to back it, and no other documented endpoint does either.

### GET /lifecycle/support/deflection

- **Purpose:** Support's Deflection tab — which help content is followed by a ticket anyway, per topic, over 90 days.
- **Response `data`:** `{ topics: [{topic, readers, contacted, contactedAnyway}], grain, readings, contactedAnyway, contactWindowDays, computedAtUtc, callouts }`.
- **Status:** documented, not scaffolded.
- **Notes:** **This counts help that FAILED, not help that worked** — someone who read an article and never came back may have been helped, given up, or gone to a competitor; all three leave an identical record, so counting them "deflected" would invent a difference this data can't see. What's directly observable is the reverse: who read help and raised a ticket anyway, within 7 days. Needs **both** product events (help reading) and a helpdesk (tickets) — refuses entirely with either missing, since the whole question is about the relationship between the two, not either alone.

### GET /lifecycle/renew/pauses

- **Purpose:** Renew's Pauses tab — who lapsed, how long for, and whether they came back.
- **Response `data`:** `{ bands: [{band, lapses, share}], lapses, returned, renewalGraceDays, maturityDays, computedAtUtc, callouts }` — bands include **never**.
- **Status:** documented, not scaffolded.
- **Notes:** **A pause is not something a subscription book records — a gap is.** Nothing in the schema carries a pause status or reason, so "who paused and why" is not read or guessed at, only the gap length. **A gap under 7 days is a renewal, not a lapse** — without that grace threshold, every monthly subscriber would appear to lapse-and-return 12 times a year. Lapses newer than 90 days are excluded — a subscription that ended last week hasn't failed to return, it hasn't had the chance yet. Counted as **lapse events, not customers** — one person can lapse twice and return once, and both facts matter here.

### GET /lifecycle/acquire/unit-economics

- **Purpose:** Acquire's Unit economics tab — cost to acquire against what a customer returns, as a curve per cohort, not a single payback number.
- **Response `data`:** `{ cohorts: [{cohort, customers, monthsObserved, currency, acquisitionCost, revenuePaybackMonth, marginPaybackMonth, points: [{month, cumulativeRevenue, cumulativeMargin}]}], costCurrency, costComponents: string[], hasMargin, monthsObserved, computedAtUtc, callouts }`.
- **Status:** documented, not scaffolded.
- **Notes:** **The shape is the point** — revenue payback is optimistic by exactly the gross margin (at 80% margin, "4 months" is roughly true; at 20%, the real answer is 20 months). Collapsing a cohort to one number destroys the information that makes it safe to read, hence the full `points[]` curve. **Margin is computed only where cost roles are mapped and refused otherwise — never assumed or substituted with a declared percentage**; `costComponents` names exactly which cost-of-sale parts are included, so a margin missing shipping is labelled, not silently generous. **Cohorts of different ages are never averaged** — a month-old cohort has no curve yet, blending it with a year-old one would drag every figure toward zero. A cohort that hasn't crossed its cost line yet reports unavailable, not a payback month — not-yet is not never.

### GET /lifecycle/price/margin

- **Purpose:** Price's Margin tab — revenue net of delivery cost, per complete month per currency, over 13 months.
- **Response `data`:** `{ months: [{period, currency, orders, revenue, cost, margin, marginRate, marginPerOrder}], trend: [{currency, from, to, fromRate, toRate, change}], components: string[], excludesReturns, currencies: string[], computedAtUtc, callouts }`.
- **Status:** documented, not scaffolded.
- **Notes:** **Measured at the order, never the line** — an order's total is unambiguous revenue; an item price is a unit price on some schemas and a line total on others, so there's deliberately no per-product breakdown rather than a plausibly-wrong one. `components` names which cost-of-sale parts are netted off — cost of goods required, shipping/fees optional; a margin missing the largest component would otherwise read as a healthier business than it is. `excludesReturns: false` means failed/cancelled/refunded orders are counted at **full revenue while keeping their cost** (no status mapped to exclude them) — margin is overstated by roughly the return rate, and the response says so. Movement is reported in **percentage points** (40%→30% is "ten points," never "25% down"). Payback is deliberately absent here — that's Unit economics' figure; quoting it from two different windows on two screens would be worse than quoting it on one.

### GET /lifecycle/expand/accounts

- **Purpose:** Expand's Accounts tab — subscriptions renewing in 90 days that carry a visible risk signal.
- **Response `data`:** `{ atRisk: [{customer, plan, endsAtUtc, daysToRenewal, value, currency, signals: string[], paymentsFailed, tickets}], owner, checked: string[], atRiskCount, horizonDays, computedAtUtc, callouts }`.
- **Status:** documented, not scaffolded.
- **Notes:** **Signals, never a score** — weighing 2 support tickets against 1 failed payment is a judgement call Flolyt has no basis for, so nothing is blended into one number; each row lists which signals fired. `checked` names which signals this workspace *could* be evaluated for at all — a renewal absent from `atRisk` has been cleared on only those, a weaker statement than it looks. **Narrowed from the design's original "account" concept** — nothing in the semantic layer groups customers into a corporate account, so the subscription's customer stands in for the account, and contract size is the subscription's own money (no seat/headcount concept exists). **Quiet product usage is deliberately NOT a signal** — it would be the strongest predictor, but a customer with zero events and one who was never instrumented look identical, so flagging silence would falsely flag every un-instrumented account.

### GET /lifecycle/price/discounting

- **Purpose:** Price's Discounting tab — customers banded by how much of their buying was discounted over 365 days (always/mostly/occasionally/never).
- **Response `data`:** `{ bands: [{band, currency, customers, orders, shareOfCustomers, discountedOrders, revenue, discount, depth, contribution, contributionPerCustomer, paidFullPriceFirst}], components: string[], hasCost, minimumOrders, currencies: string[], computedAtUtc, callouts }`.
- **Status:** documented, not scaffolded.
- **Notes:** **Says who buys on discount, never who needed one** — whether someone would've bought at full price is a counterfactual needing a holdout, not a column, and this has no holdout. Two things it CAN say instead: a band with negative `contribution` loses money on every order regardless of whether the discount was "needed" (the one reading of "undeserved" that needs no counterfactual), and `paidFullPriceFirst` counts customers whose own history shows full-price orders before their first discount — evidence, not proof. **"Too few orders" is its own band, not an exclusion** — one discounted order is trivially "100% discounted," and scattering those into the extremes would fill both ends of a habit screen with people who've shown no habit; they're held apart and excluded from the share denominator. Depth (how deep) and frequency (how often) are reported separately on purpose. Per currency, never blended.

### GET /lifecycle/churn/chain

- **Purpose:** Churn's Chain tab — one dated cause traced across all 10 stages, the product's core thesis made checkable. **Also confirmed 2026-09-04 as the real target for the map page's "Where the same root cause shows up" table and "One change. Five teams." callout** — see the coverage tracker above; `GET /lifecycle/changes/{changeId}/impact` was the wrong candidate for both.
- **Request:** query `changeId` (uuid, optional).
- **Response `data`:** `{ changeId, title, occurredOnUtc, team, kind, affectedStageKeys, stages: [{stageKey, stageName, owningTeam, symptom, effect: {status, delta, percentChange, caveat}, calledIt: {kind, words, atUtc, reference}, daysToDetect, valueAtStake: [{currency, amount}], owner}], stagesThatMoved, stagesThatNoticed, slowestDetectionDays, callouts }`. 404 if `changeId` doesn't resolve; refuses (separately) when nothing has moved at least 2 stages, since that isn't a chain.
- **Used by:** service + hook exist (`get-churn-chain.ts` / `use-get-churn-chain.ts`), not wired — target `stage/chain/chain-route.tsx` (Churn's own Chain tab) and, per the correction above, the map page's root-cause spotlight section.
- **Status:** service/hook ready, not wired.
- **Notes:** **`changeId` is optional** — omit it and the product picks the change worth showing: the one whose effects reached the **most stages**, not the one that moved any single stage furthest (a change one desk already owns isn't what this screen is for). Per stage, `calledIt` is **what that desk called it at the time, verbatim** — the earliest claim/room/condition firing after the change, deliberately never normalised, because "five desks naming one thing five ways" IS the finding this screen exists to surface. `daysToDetect` measures from the change date. **Nothing is summed and there is no lifecycle-wide total** — populations overlap across stages (one customer can appear in 3 stages' departures), so a sum would triple-count them. Callouts name stages that moved with nobody writing anything down, the spread between fastest/slowest desk to notice, and stages that moved with no owner.

## Churn routing, churn/support analytics, agents & governance (batch 4, 2026-09-04)

23 endpoints — **the final batch**, closing out every endpoint in the original 74-route sidebar
list first pasted 2026-09-04 (the 5 app-shell routes in [`app-shell.md`](app-shell.md) plus these
69 lifecycle-scoped ones). No service/hook files yet, same standing "code waits until all batches
are in" call.

### POST /lifecycle/churn/route-upstream

- **Purpose:** Sends a churn cause to the stage that actually owns it, with evidence attached.
- **Request:** body `{ causeKey, targetStageKey, evidence: [{kind, reference (uuid), note}] | null, note }`.
- **Response:** `{ data: routingId (uuid), messages, succeeded }`.
- **Status:** documented, not scaffolded.
- **Notes:** `causeKey` comes from `GET /churn/reasons`. `targetStageKey` **cannot be `churn`** — Churn records the loss, it doesn't cause it. Each evidence item (a change, claim, or room) **must exist in this workspace or the whole routing is refused** — a reference the destination can't follow is worse than none. **If the target stage has no owner, the routing is still recorded pointing at that stage with an empty destination** — never silently redirected to whoever's nearest, since that would replace a finding about the organisation with a staffing accident; a separate triage flow then asks an admin to appoint an owner.

### GET /lifecycle/churn/routings

- **Purpose:** Causes sent upstream, unanswered first then newest.
- **Request:** query `stage` (string, optional) — filters to one destination stage.
- **Response `data`:** `{ routings: [{id, causeKey, causeLabel, targetStageKey, targetStageName, targetUserId, isUndeliverable, evidence: [{kind, reference, note}], note, routedByUserId, routedAtUtc, acknowledgedAtUtc, acknowledgedByUserId, acknowledgementNote}], unanswered, undeliverable, callouts }`.
- **Status:** documented, not scaffolded.
- **Notes:** `undeliverable` counts routings pointing at stages nobody owns — **the dead ends, left visible on purpose**, not hidden or auto-resolved.

### POST /lifecycle/churn/routings/{routingId}/acknowledge

- **Purpose:** Says "I have it" on a routed cause.
- **Request:** path `routingId`; body `{ note } | null`.
- **Response:** `{ data: routingId, messages, succeeded }`.
- **Status:** documented, not scaffolded.
- **Notes:** **Anybody in the workspace may acknowledge, including on a stage nobody owns** — requiring the recorded recipient would make every undeliverable routing permanently unanswerable; someone picking up an orphaned cause is exactly the outcome the empty destination is designed to provoke. Who took it is recorded either way. **A second acknowledgement is refused**, not silently overwritten — the first responder's answer stands.

### GET /lifecycle/churn/reasons

- **Purpose:** Why customers left, as far as imported order history can say, recomputed daily.
- **Response `data`:** `{ stageKey, stageName, basis, basisCaveat, lapsedCustomers, reasons: [{key, label, customers, share, attribution, upstreamStage}], unexplainedCustomers, computedAtUtc, callouts }`.
- **Status:** documented, not scaffolded.
- **Notes:** Two shapes are **inferred and counted**: "never activated" (lapsed with ≤1 order — an Activate failure surfacing late) and "stopped after repeating" (lapsed with 2+ — a Retain failure); each names `upstreamStage`, since Churn records the loss and another stage causes it. Stated reasons (price, product fit, competitor) plus service failure and involuntary payment failure are **listed with an unavailable count and the source that would count them, rather than omitted** — so a reader can tell "this didn't happen" from "we can't see this." `unexplainedCustomers` is the residual and is **never distributed across the counted rows**.

### GET /lifecycle/churn/prediction

- **Purpose:** Leading churn signals — named individually, never fused into a score.
- **Response `data`:** `{ stageKey, stageName, basis, basisCaveat, lapsedCustomers, signals: [{key, name, precededShare, leadTimeDays, customersTripping}], computedAtUtc, callouts }`.
- **Status:** documented, not scaffolded.
- **Notes:** **There is no risk score, deliberately** — one number can't say which input moved it, and half the candidate signals are unreadable here anyway. 3 signals are measured from order history against each customer's **own habit**, not a global threshold: quiet longer than their usual gap, cadence slowing across 3 gaps, last order well below their usual size. `precededShare` is **prevalence among departures, not a fitted weight** — don't render it like a model coefficient. `leadTimeDays` is the measured median warning, so a signal too late to act on reads as visibly too late. Support contact, delivery failure, and feature-usage decline are listed as unreadable, naming the source that would read them.

### GET /lifecycle/churn/win-back

- **Purpose:** What's being aimed at customers already gone.
- **Response `data`:** `{ stageKey, stageName, basis, basisCaveat, lapsedCustomers, reachableNeverContacted, unreachable, waves: [{campaignId, name, state, startedAtUtc, audience, holdout, targetedPastBoundary, treatmentRecoveryShare, holdoutRecoveryShare, liftPoints, attribution, unattributableBecause}], computedAtUtc, callouts }`.
- **Status:** documented, not scaffolded.
- **Notes:** A wave is recognised by **who it reached** (participants mostly past the lapse boundary at enrolment), not by campaign name — the same recognition rule `retain/reactivation` uses, measured at the lapse boundary instead of the dormancy window. `liftPoints` only available when `attribution === "holdout"`, same pattern as `retain/reactivation`. `reachableNeverContacted` (lapsed nobody's tried) vs `unreachable` (lapsed nobody *can* try) are a useful pair to render together — one's an opportunity, the other names a data gap.

### GET /lifecycle/support/contact-drivers

- **Purpose:** Support's Contact drivers tab — what customers contact you about, over 90 days.
- **Response `data`:** `{ drivers: [{driver, tickets, customers, shareOfTickets, ticketsPerCustomer, refunded}], tickets, windowDays, computedAtUtc, callouts }`.
- **Status:** documented, not scaffolded.
- **Notes:** Every driver carries **both** a ticket count and a customer count — 10 tickets from one furious person is a retention problem, 10 units of queue work from 10 people is an operations problem, and a volume-only view sends attention after the loudest driver rather than the widest; `ticketsPerCustomer` is what tells them apart. Reads a warehouse ticket table or a synced Zendesk/Freshdesk identically. `refunded` is summed where the helpdesk records it, unavailable where it doesn't, never zero.

### GET /lifecycle/support/resolution

- **Purpose:** Support's Resolution tab — how long answering takes, and how much of the queue is still open.
- **Response `data`:** `{ bands: [{driver, tickets, resolved, open, averageHours, resolvedShare}], averageHours, resolvedShare, windowDays, computedAtUtc, callouts }`.
- **Status:** documented, not scaffolded.
- **Notes:** **Read the two figures together, always** — `averageHours` is computed over resolved tickets only, so the more of a queue that stays open, the better its average looks (a team that clears the easy half in an hour and abandons the rest reports "an excellent hour"). Every row carries `resolvedShare` for exactly that reason — a callout fires when a fifth of the window is still open. Resolution time is read from a mapped column or computed from raised/resolved timestamps, **never inferred from status** — treating "closed" as instantly resolved would fabricate the figure being measured.

### GET /lifecycle/support/silent-failures

- **Purpose:** Support's Silent failures tab — customers whose orders went wrong who may never have said anything.
- **Response `data`:** `{ stageKey, stageName, couldBeSilent, customersInWindow, share, confirmedSilent, windowDays, computedAtUtc, callouts }`.
- **Status:** documented, not scaffolded.
- **Notes:** **Every figure here is an upper bound.** `couldBeSilent` counts distinct customers with a failed/cancelled/refunded/undelivered order in the trailing window — which includes everyone who DID complain. `confirmedSilent` is therefore **always unavailable**, and says why (no helpdesk means no contact record for a complaint to be absent from) — returned rather than omitted, so the gap between "asked" and "known" stays visible rather than silently dropped. Order statuses matched by case-insensitive substring; an unrecognised status reads as fine — the safe direction, never assume a failure.

### GET /lifecycle/stages/{stageKey}/agents

- **Purpose:** The stage's Agents tab — which agents watch it, on what thresholds, routed where.
- **Response `data`:** `{ stageKey, stageName, agents: [{key, initials, name, role, readiness, reads: string[], needs, wouldUnlock, conditions: [{id, label, metricKey, metricQuestion, unit, segment, comparison, threshold, sustainReadings, status, ...}]}], recentFirings: [{id, conditionId, label, reading, threshold, outcome, routedVia, isTriage, roomId, note, firedAtUtc}], disagreements: [{conflictId, roomId, raisedByAgent, summary, raisedAtUtc, readings: string[]}], autoOpenRoomCap, autoOpenedRoomsOpen, callouts }`. Each condition object has additional properties beyond what's listed (spec marks it truncated), same pattern as `leakage-map`'s cells.
- **Status:** documented, not scaffolded.
- **Notes:** `role` is `lead` for the stage's own agent, `supporting` for any other agent carrying a condition on it. `readiness` (`ready`/`reading`/`not-ready`) is how an agent with nothing to read still appears at all, rather than silently showing zero findings — same 3-state vocabulary as `GET /workspace/agents` (see [workspace.md](workspace.md)). Each condition's routing resolves **through the live chain** — stage owner → owning team's lead → an admin marked `isTriage` — which is a hand-off waiting to be re-pointed, not permanent ownership. **`unroutedFireCount` is the number that matters most**: firings that reached nobody. `disagreements` keeps **both** conflicting agents' readings, never adjudicated by the API itself.

### GET /lifecycle/teams

- **Purpose:** The teams the 10 stages name, which stages each owns, and who leads each — the routing chain's second link.
- **Response `data`:** `[{team, stages: string[], leadUserId, leadName}]` — a bare array, not wrapped in an object under `data`.
- **Status:** documented, not scaffolded.
- **Notes:** A `null` `leadUserId`/`leadName` is a **real, valid answer** — alerts on that team's stages fall through to an admin for triage, not an error state to special-case.

### PUT /lifecycle/instrumentation-requests/{obligationId}/owner

- **Purpose:** Names the person on the hook for an instrumentation request.
- **Request:** path `obligationId`; body `{ ownerUserId (uuid) }`.
- **Response:** `{ data: obligationId, messages, succeeded }`.
- **Status:** documented, not scaffolded.
- **Notes:** Deliberately **separate from raising the request** — who does the work is usually settled after the ask, and an unowned request is still worth having since the gap stays visible either way. Owner is **always a person, never a team**.

### GET /lifecycle/watchable-metrics

- **Purpose:** What a stage condition may legally be written against.
- **Response `data`:** `[{key, question, unit, needsSegmentation, hasHistory, readsFrom}]` — bare array.
- **Status:** documented, not scaffolded.
- **Notes:** **Deliberately a small fixed catalog, not a formula language** — a named metric can be refused at authoring time if it can't be read, which is the difference between "a condition that never fires" and "a condition nobody knew had silently stopped working." `needsSegmentation` means the metric is meaningless unsliced (e.g. needs a departure or a currency named); `hasHistory` means a stored series exists to backtest against (see `.../conditions/backtest` below — a metric without history can't be backtested).

### POST /lifecycle/stages/{stageKey}/conditions

- **Purpose:** Writes a new watched threshold on a stage — the "set a threshold" modal.
- **Auth:** Bearer token; stage owner or workspace administrator.
- **Request:** path `stageKey`; body `{ label, metricKey, comparison: "AtOrBelow"|"AtOrAbove", threshold (number), sustainReadings (int), agentKey?, routesToUserId? (uuid), segment? }`.
- **Response:** `{ data: conditionId (uuid), messages, succeeded }`.
- **Status:** documented, not scaffolded.
- **Notes:** Watches from the moment it's saved. `routesToUserId: null` uses the stage's own routing chain (owner → team lead → triage admin, see `GET .../agents` above) — **routing to a team or to a log is not offered at all**, since both are places an alert goes to become nobody's. `sustainReadings` is counted in daily evaluator passes — a pass that didn't run *delays* a firing, it never manufactures one early.

### PUT /lifecycle/conditions/{conditionId}

- **Purpose:** Moves an existing condition's threshold, sustain window, or routing.
- **Auth:** Bearer token; owner-or-admin, like a definition edit — a person only.
- **Request:** path `conditionId`; body `{ threshold, sustainReadings, routesToUserId }`.
- **Response:** `{ data: conditionId, messages, succeeded }`.
- **Status:** documented, not scaffolded.
- **Notes:** **The only edit anybody may make** to a condition (create/mute/decide are separate endpoints). The breach count is **reset** on edit — what a condition counted against the old threshold says nothing about the new one, carrying it forward would let a rule fire on a sustain it never actually met under the new terms. **Refused on a still-proposed condition** — accept it via `.../decide` with the threshold you actually want instead of editing a proposal.

### POST /lifecycle/conditions/{conditionId}/decide

- **Purpose:** Accepts or declines a condition an **agent** proposed.
- **Request:** path `conditionId`; body `{ accept (bool), routesToUserId?, sustainReadings?, threshold? }`.
- **Response:** `{ data: conditionId, messages, succeeded }`.
- **Status:** documented, not scaffolded.
- **Notes:** Agents may **propose** thresholds but may **never set them** — a proposed condition isn't evaluated at all until a person accepts it, optionally adjusting threshold/sustain/routing in the same call. A **declined** proposal is kept, not deleted, so the same suggestion doesn't get re-proposed forever.

### POST /lifecycle/conditions/{conditionId}/mute

- **Purpose:** Stops (or resumes) a condition being read.
- **Request:** path `conditionId`; body `{ muted (bool) }`.
- **Response:** `{ data: conditionId, messages, succeeded }`.
- **Status:** documented, not scaffolded.
- **Notes:** Muting **keeps everything already found** and resets the breach run — the tool a person reaches for instead of deleting a rule that turned out to be noise, preserving history rather than discarding it.

### POST /lifecycle/stages/{stageKey}/conditions/backtest

- **Purpose:** How often a proposed threshold would have fired against real kept history.
- **Request:** path `stageKey`; body `{ metricKey, comparison, threshold, sustainReadings, segment? }`.
- **Response `data`:** `{ stageKey, stageName, metricKey, metricQuestion, threshold, sustainReadings, firings, grain, points: [{periodStartUtc, reading, breaching, wouldHaveFired}], caveat }`.
- **Status:** documented, not scaffolded.
- **Notes:** Only available for metrics with a **stored monthly series** (see `watchable-metrics`' `hasHistory`) — a current-state metric like money-at-risk returns `firings` unavailable, naming that, rather than fake-simulating over a single reading. `grain` is `"month"`, and `caveat` says plainly that the *live* sustain window is counted in **daily** readings — a month-grain backtest is a structurally coarser test than the rule it's previewing, don't present the backtest result as an exact prediction of live behavior.

### PUT /lifecycle/teams/{team}/lead

- **Purpose:** Names who leads one of the stage-spine teams — routing chain's 2nd link.
- **Auth:** Bearer token; **administrator only** — it decides where other people's alerts land.
- **Request:** path `team`; body `{ leadUserId (uuid) }`.
- **Response:** `{ data: null, messages, succeeded }`.
- **Status:** documented, not scaffolded.
- **Notes:** `team` must be one a stage actually names (from `GET /teams`'s `team` field) — not a free string.

### PUT /lifecycle/governance/room-cap

- **Purpose:** How many rooms this workspace's agents may auto-open without asking.
- **Auth:** Bearer token; administrator only.
- **Request:** body `{ cap (int) }`.
- **Response:** `{ data: cap (int), messages, succeeded }`.
- **Status:** documented, not scaffolded.
- **Notes:** A stage can only ever hold **one** auto-opened room, so this is effectively a cap on how many of the 10 stages may be worked unrequested simultaneously. Default 5; **0 means nothing opens on its own, every firing becomes a proposal instead.** Counts **auto-opened rooms only** — a person manually opening 5 rooms doesn't stop their agents. At the cap, nothing found is lost: firings are still recorded and proposed, and closing a room frees the next slot.

### GET /lifecycle/instrumentation

- **Purpose:** What this workspace can't measure at all, and who owes fixing it.
- **Response `data`:** `{ gaps: [{gapKey, name, gap, wouldUnlock, blockedStages: string[], state, obligationId, requiredEventSchemas: string[], blocks: string[], requestedAtUtc, neededByUtc, daysOverdue, ownerUserId, ownerName}], overdueCount, unrequestedCount, callouts }`.
- **Status:** documented, not scaffolded.
- **Notes:** Gaps are **derived from the agent roster's readiness, never stored** — a stored copy would disagree with reality the moment a source got connected. Each gap's `state` includes `"no-request"` (nobody has asked about this gap yet) alongside whatever request-lifecycle states an actual `instrumentation-requests` entry carries. `daysOverdue` is likewise **derived, not stored** — a stored overdue flag would be wrong every day after the one it was written. `blockedStages` names which of the 10 stages go without because an agent can't read this gap.

### POST /lifecycle/instrumentation-requests

- **Purpose:** Asks engineering for telemetry that doesn't exist yet, with a deadline.
- **Auth:** Bearer token; open to any member.
- **Request:** body `{ gap, gapKey, neededByUtc (RFC 3339), blocks?: string[], ownerUserId? (uuid), requiredEventSchemas?: string[] }`.
- **Response:** `{ data: obligationId (uuid), messages, succeeded }`.
- **Status:** documented, not scaffolded.
- **Notes:** **`requiredEventSchemas` is the point, and required** — "please instrument loyalty" is a conversation; `loyalty.tier_shown` / `loyalty.tier_changed` / `loyalty.reward_redeemed` is a contract an engineer can actually satisfy. A `neededByUtc` already in the past is refused. **One live request per gap** — a second `POST` for the same `gapKey` presumably conflicts (exact behavior unconfirmed, worth testing before wiring a "raise again" button). Raising is open to anyone; closing (below) is gated.

### POST /lifecycle/instrumentation-requests/{obligationId}/close

- **Purpose:** Closes an instrumentation request — delivered, or withdrawn.
- **Request:** path `obligationId`; body `{ resolved (bool), note }`.
- **Response:** `{ data: obligationId, messages, succeeded }`.
- **Status:** documented, not scaffolded.
- **Notes:** **A withdrawal (`resolved: false`) needs a reason** (`note`) or the next person just raises the same request again — enforce a non-empty note client-side on the withdraw path even though the type marks it nullable. Closeable by whoever raised it, its assigned owner (`PUT .../owner` above), or an administrator.
