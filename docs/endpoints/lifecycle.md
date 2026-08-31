# Lifecycle domain endpoints

Everything under `/api/flolyt/lifecycle/*`, pasted 2026-08-31. Five sibling endpoints
(`/search`, `/home`, `/inbox`, `/command-bar`, `/sources`) were pasted alongside these in the
same doc page but are cross-cutting (workspace home / inbox / command palette / search), not
lifecycle-specific — not recorded here; file them under their own domain doc when we get to
those surfaces.

Status: 17/17 documented, 0/17 wired.

## Screen-section coverage tracker

Working method: go section by section (the on-screen header, not the whole page) — see
[[feedback_incremental_endpoint_coverage]]. Update this table as we confirm or wire each row.
Legend: ✅ covered · ⚠️ partial (see note) · ❌ not covered · ❓ open question for backend.

### `/lifecycle` — the map page (LC02)

| On-screen section (header text) | Needs | Endpoint | Status |
| --- | --- | --- | --- |
| "The customer lifecycle" stage cards — name/department/owner/open rooms | `StageRail`, `data.ts` `Stage.name`/`department`/`owner` | `GET /lifecycle/map` → `stages[].name`/`owningTeam`/`owner`/`openRoomCount` | ✅ |
| Stage cards — ₦ at-stake figure | `Stage.amount`/`amountLabel` | `GET /lifecycle/map` → `stages[].atStake` | ⚠️ doc says measured for only 3/10 stages (activate/retain/churn) — the other 7 render "unavailable" per spec, but the mock shows all 10 with a figure. ❓ Ask backend: is `leakage-map`'s per-row cells the intended source for the other 7, or should the UI just show "unavailable" for them? |
| Stage cards — second metric line ("894k/yr", "6 plans", "1.4× ARPU"...) | `Stage.metric` | none | ❌ no field anywhere returns a stage-specific unit ratio like this. `population` is a raw count, not this. ❓ Ask backend directly — may need a new field or may just not exist yet. |
| "Where the same root cause shows up · [event]" table | `RootCauseSpotlight`, `ROOT_CAUSE_ROWS` (stage/department/free-text symptom) | `GET /lifecycle/changes/{changeId}/impact` → `stages[].effect` | ⚠️ gives numeric `delta`/`percentChange`/`status`, not the narrative sentence ("abandonment at the fee step rose 3.1×") — that phrasing needs client-side templating from a per-stage vocabulary the endpoint doesn't supply. **Also:** no discovery path for *which* `changeId` the map page should spotlight — no `GET /lifecycle/changes` list endpoint, and `/map`'s own `callouts[]` carries no `changeId` reference. ❓ Ask backend how the map page is meant to know which change to feature. |
| "One change. Five teams." callout card | `RootCauseSpotlight`'s static copy | `GET /lifecycle/changes/{changeId}/impact` → `callouts[]` (key/tone/headline/body) | ✅ shape matches, blocked on the same changeId-discovery question above |
| Teal "Advocacy feeds acquisition…" banner | `ADVOCACY_LOOP_NOTE` | `GET /lifecycle/map` → `callouts[]` | ✅ shape now exists (added in the 2026-08-31 update) |
| "Owner, lead agent and review cadence… on stage ownership" footer link | link only, no data | n/a | ✅ (just a `<Link>`, settings page is its own screen) |

### Per-stage screens (Overview, What changed, Cohorts, Compare, Chain, etc.)

Not started — pick up here once the map page's open questions above are resolved, working one
stage-screen header at a time the same way. `GET /lifecycle/stages/{stageKey}` covers part of
Overview's KPI/departures data (see prior conversation) but not the bespoke `OverviewData`
per-row narrative copy — same "numbers yes, narrative sentences no" gap as above, expect it to
recur on every stage.

## Per-endpoint entries

### GET /lifecycle/map

- **Purpose:** The ten business stages in spine order — owning team, named owner, lead agent, review cadence, open room count, at-stake amount, population.
- **Auth:** Bearer token (workspace-scoped).
- **Request:** none.
- **Response:** `{ stages: [{ key, name, position, owningTeam, owner: {ownerUserId, displayName, isActive} | null, leadAgentKey, leadAgentName, reviewCadence, atStake, openRoomCount, population, populationSource, definitionVersion, populationComputedAtUtc, populationCaveat }], callouts: [{key, tone, headline, body}], marketLens: {countryCode, currencyCode, isPrimary} | null }`
- **Used by:** not wired yet — target `src/pages/everyday/lifecycle/index.tsx` (`StageRail`) and `root-cause-spotlight.tsx`'s advocacy-loop banner.
- **Status:** documented.
- **Notes:** `atStake` measured only for activate/retain/churn per the doc's own description — see coverage tracker above. `callouts[]` and `marketLens` added in the 2026-08-31 spec update (weren't in the first paste). Churn carries no `owningTeam`/`owner` by design.

### PUT /lifecycle/map/{stageKey}/owner

- **Purpose:** Assign the accountable human owner for a business stage.
- **Auth:** Bearer token; owner must be a workspace member.
- **Request:** path `stageKey`; body `{ ownerUserId: uuid }`.
- **Response:** `{ data: null, messages, succeeded }`.
- **Used by:** not wired yet — target the "Assign an owner" modal (Advocate/Churn overview CTAs).
- **Status:** documented.
- **Notes:** Refused for `churn` — no single-person accountability for a stage that aggregates every other stage's losses.

### GET /lifecycle/market/{country}

- **Purpose:** The map read through one declared market — same shape as `GET /map`, `atStake` filtered to that market's currency cells.
- **Auth:** Bearer token.
- **Request:** path `country`.
- **Response:** same as `GET /lifecycle/map`, with `marketLens` populated.
- **Used by:** not wired yet — LC05's `?market=` filter, not currently wired in the UI at all (see [[index.tsx]] comment "LC05's ?market= filter... not wired in yet").
- **Status:** documented.
- **Notes:** Unknown country fails with the declared market list rather than silently showing the whole workspace. `population` stays workspace-wide (nothing maps a customer to a market yet) — only `atStake` narrows.

### GET /lifecycle/leakage-map

- **Purpose:** Where revenue is going, by row (lifecycle stage and/or segment) × condition × market.
- **Auth:** Bearer token.
- **Request:** none.
- **Response:** `{ revenueModel, grids: [{ grid, markets, conditions: [{key,label}], cells: [{rowKey, rowLabel, conditionKey, conditionLabel, currency, amount, customerCount, missingSource, wouldUnlock, method, ...}] }], computedAtUtc }`
- **Used by:** not wired yet — candidate source for the 7 stages' `atStake` that `/map` itself can't provide (see coverage tracker, needs backend confirmation).
- **Status:** documented.
- **Notes:** No revenue-model-selected workspace gets `grids: []`/`revenueModel: null` — treat as "ask the question," not an empty state. Figures never blended across currencies.

### GET /lifecycle/distribution

- **Purpose:** Customer counts + lifetime revenue per lifecycle stage, rolled up to the 3 business stages the lifecycle axis reaches (activate/retain/churn).
- **Auth:** Bearer token.
- **Request:** none.
- **Response:** `{ totalCustomers, lifecycleStages: [{stage, customerCount, lifetimeRevenue, percentOfBase}], businessStages: [...], computedAtUtc }`
- **Used by:** not wired yet.
- **Status:** documented.
- **Notes:** Every lifecycle stage returned including zero-count ones; business stages with no source are omitted (not zeroed).

### GET /lifecycle/stages/{stageKey}

- **Purpose:** One stage's live state — population, departures (grouped by exit-rule cause), rate of change, restating flag.
- **Auth:** Bearer token.
- **Request:** path `stageKey`.
- **Response:** `{ stageKey, stageName, position, owningTeam, leadAgentKey, leadAgentName, reviewCadence, population, populationSource, definitionVersion, populationComputedAtUtc, populationCaveat, rateOfChange, primaryConversion, departures: [{cause, toStageKey, toStageName, conditionKey, size, observedValue, observedValueCaveat, reachability, reachabilityCaveat, claim: {statement, grade, confidence}, roomOpen}], restating, callouts: [...] }`
- **Used by:** not wired yet — target Overview tab's KPI numbers, but NOT its bespoke per-row leak-table narrative (see coverage tracker note on Overview).
- **Status:** documented.
- **Notes:** `primaryConversion` unavailable throughout (nothing models it yet). Departures' `observedValue`/`reachability` are unavailable and say why (no customer-record match in the warehouse).

### GET /lifecycle/stages/{stageKey}/changes

- **Purpose:** Month-by-month population history for one stage, flagging definition-change/restated months.
- **Auth:** Bearer token.
- **Request:** path `stageKey`; query `from`/`to` (RFC 3339, default 12-month restatement window).
- **Response:** `{ stageKey, stageName, restating, periods: [{periodStartUtc, population, delta, isDefinitionChange, isRestated, definitionVersion, restatedFromVersion, asOfUtc}] }`
- **Used by:** not wired yet — target `stage/history/history-tab.tsx`.
- **Status:** documented.
- **Notes:** Distinct from `change-registry` below — this is the population trend, not dated causes.

### GET /lifecycle/stages/{stageKey}/change-registry

- **Purpose:** The stage's "What changed" tab — every dated registry change, measured against this stage's own history.
- **Auth:** Bearer token.
- **Request:** path `stageKey`.
- **Response:** `{ stageKey, stageName, entries: [{id, occurredOnUtc, title, team, source, affectedStageKeys, effect: {status, delta, percentChange, caveat}, sourceRoomId}], callouts: [...] }`
- **Used by:** not wired yet — target `stage/changes/changes-tab.tsx`. Row's `id` is the `changeId` for the impact drilldown below.
- **Status:** documented.
- **Notes:** `effect.status` ∈ measured/no_effect/too_recent/outside_history/not_instrumented — each a distinct, real state, not a fallback chain.

### POST /lifecycle/changes

- **Purpose:** Record a dated business change a person knows about but Flolyt can't see (a partner's price change, a policy shift).
- **Auth:** Bearer token; open to any member.
- **Request:** `{ occurredOnUtc, title, team?, description?, affectedStageKeys? }`.
- **Response:** `{ data: changeId (uuid), messages, succeeded }`.
- **Used by:** not wired yet — target the "Add a change" header button on `changes-tab.tsx`.
- **Status:** documented.
- **Notes:** Future `occurredOnUtc` refused. `affectedStageKeys` never filters measurement, only records intent — the impact view flags stages that moved which weren't listed.

### POST /lifecycle/changes/from-room

- **Purpose:** Promote a room's decision onto the change registry.
- **Auth:** Bearer token; requires room membership/ownership/administration.
- **Request:** `{ roomId, occurredOnUtc, title?, affectedStageKeys? }`.
- **Response:** `{ data: changeId (uuid), messages, succeeded }`.
- **Used by:** not wired yet.
- **Status:** documented.
- **Notes:** One promotion per room opening; a reopened room's new decision is a new change.

### DELETE /lifecycle/changes/{changeId}

- **Purpose:** Remove a registry entry.
- **Auth:** Bearer token; recorder can remove their own, administrator can remove any.
- **Request:** path `changeId`.
- **Response:** `{ data: changeId, messages, succeeded }`.
- **Used by:** not wired yet.
- **Status:** documented.

### GET /lifecycle/changes/{changeId}/impact

- **Purpose:** One change measured against every stage — the release-impact drilldown and "the skeleton of the whole-chain view."
- **Auth:** Bearer token.
- **Request:** path `changeId`.
- **Response:** `{ changeId, title, occurredOnUtc, team, source, affectedStageKeys, sourceRoomId, stages: [{stageKey, stageName, effect: {status, delta, percentChange, caveat}}], callouts: [...] }` (all 10 stages always returned, in spine order).
- **Used by:** not wired yet — target `activate/release-impact-route.tsx` (`/lifecycle/:stage/changes/:id`, already has a live `:id` param) and, pending the routing fix noted in the coverage tracker, `stage/chain/chain-route.tsx`.
- **Status:** documented.
- **Notes:** 404 if the change isn't in this workspace's registry. "Moved-where-nobody-expected" callout names stages that moved but weren't in `affectedStageKeys`.

### GET /lifecycle/stages/{stageKey}/definition

- **Purpose:** A stage's current definition (if any), full version history, and candidate entry events.
- **Auth:** Bearer token.
- **Request:** path `stageKey`.
- **Response:** `{ stageKey, stageName, canEdit, isDefined, fallbackInUse, fallbackNote, current: {version, entryEventKey, exitRules, exclusions, effectiveFromUtc, createdByUserId, createdBy, createdAtUtc} | null, history: [{version, createdAtUtc, createdByUserId, createdBy, isCurrent}], candidates: [{eventKey, description, datasourceId, estimatedRows, population}] }`
- **Used by:** not wired yet — target `stage/definition/definition-route.tsx`.
- **Status:** documented.
- **Notes:** New workspace has `isDefined: false`/`current: null` for all 10 — never seeded. `fallbackInUse` marks activate/retain/churn using the classifier's recency thresholds until defined.

### PUT /lifecycle/stages/{stageKey}/definition

- **Purpose:** Save a stage definition. Requires a preview token, unconditionally.
- **Auth:** Bearer token.
- **Request:** path `stageKey`; body `{ previewToken (uuid), entryEventKey, exitRules, exclusions }`.
- **Response:** `{ data: {stageKey, version, supersededVersion, effectiveFromUtc}, messages, succeeded }`; `409` if the body doesn't match what the token was issued for.
- **Used by:** not wired yet.
- **Status:** documented.
- **Notes:** Token single-use, expires 30 min.

### POST /lifecycle/stages/{stageKey}/definition/preview

- **Purpose:** What a proposed definition would break — customers moved, figures restated, cohorts/goals invalidated — plus the save token.
- **Auth:** Bearer token; only the stage's owner or a workspace administrator.
- **Request:** path `stageKey`; body `{ entryEventKey, exitRules, exclusions }`.
- **Response:** `{ previewToken, expiresAtUtc, stageKey, wouldBeVersion, customersAdded, customersRemoved, figuresAffected: {measured, items, unmeasuredReason}, cohortsBroken: {...}, goalsInvalidated: {...}, learningsScoped: {...} }`
- **Used by:** not wired yet.
- **Status:** documented.

### POST /lifecycle/entry-events/measure

- **Purpose:** Count distinct customers behind each candidate entry event, for the definition screen.
- **Auth:** Bearer token.
- **Request:** query `force` (bool, default false).
- **Response:** `{ data: number, messages, succeeded }`.
- **Used by:** not wired yet.
- **Status:** documented.
- **Notes:** Bounded per call with a timeout; counts cached for a day unless `force=true`.

### GET /lifecycle/stages/{stageKey}/cohorts

- **Purpose:** Entry cohorts by arrival month, with observed lifetime value per cohort.
- **Auth:** Bearer token.
- **Request:** path `stageKey`; query `months` (3-12, default 6).
- **Response:** `{ stageKey, stageName, cohorts, undatedCustomers, currency, valueCaveat, callouts: [...] }`
- **Used by:** not wired yet — target `stage/{acquire,...}/cohorts-tab.tsx`.
- **Status:** documented.
- **Notes:** Only lifecycle-bridged stages can cohort; a definition-backed stage returns "cohorts unavailable" (per-customer rows deliberately not kept).

### GET /lifecycle/stages/{stageKey}/compare

- **Purpose:** Last N months vs the N before, population only (for now).
- **Auth:** Bearer token.
- **Request:** path `stageKey`; query `months` (1-12, default 3).
- **Response:** `{ stageKey, stageName, windowMonths, before: {fromUtc, toUtc, monthsInWindow, monthsMeasured, endPopulation, averagePopulation, restatedMonths}, after: {...}, change, changePercent, definitionChangedInside, callouts: [...] }`
- **Used by:** not wired yet — target `stage/compare/compare-route.tsx`.
- **Status:** documented.
- **Notes:** Only population compares today — CAC/repeat-rate/value-per-customer need sources nothing models yet, response says so rather than faking a row.
