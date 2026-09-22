# Leakage map — wiring build plan

Started 2026-09-22, on branch `add-leakage-map-endpoints`. Endpoint reference stays at
[`docs/endpoints/leakage.md`](../endpoints/leakage.md) per [[endpoint_docs_convention]] — this file
is the working plan for wiring `src/pages/leakage-map/` (17 files, fully mock) to it, not a
duplicate of the endpoint shapes.

## Where this page currently stands

`/leakage-map` was rebuilt 2026-09-14 straight from the Figma export with **no live source at
all** — `data.ts`'s own header says so. See [[flolyt_leakage_map_rebuild]] for that build's
history (now superseded by this wiring pass). All 9 real leakage endpoints are documented and
scaffolded (service + hook per operation, 0/9 wired) — see [[flolyt_leakage_map_wiring]] for the
short version of everything below.

## Ground rule: retiring `data.ts`, not extending it

**`data.ts` was only ever useful for knowing what the Figma design looked like — it is not a
source of truth to build on top of, and the goal is to get rid of it entirely, piece by piece, not
port its constants into the wired version.** Concretely, per [[feedback_retire_mock_options_not_extend]]:

- Where the API itself already returns the option list (e.g. `GET /leakage`'s own
  `window.options`/`horizon.options`), the filter menu reads it from the live response, not from a
  hardcoded array like the mock's `HORIZON_GROUPS`.
- Where the API doesn't supply display copy (e.g. it has never returned a `label` for `s1`/`s2`/
  `s3`/`s5`, only `"Low"` for `s4` so far), use a plain, generic label (`"≥ S1"`) instead of the
  mock's invented editorial text (`"S1 — Critical"`) until a real one is observed.
- As each section of the page is wired (per step below), its corresponding mock export in `data.ts`
  gets **deleted**, not kept as a fallback or reworked in place. The file should shrink to nothing
  over the course of this build, not grow.

## Product decisions locked in before implementation started

1. **Window and Horizon become two independent controls.** The API always takes both
   (`window` looks back, `horizon` looks forward) — the mock's single back/forward toggle can't
   express that.
2. **A market switcher is being added**, sourced from the leakage response's own `markets[]` rail
   — no new endpoint needed for it.
3. **"Actions triggered" is hidden for this pass.** No leakage endpoint carries SLA/ownership-queue
   data at all; `actions-panel.tsx` stays on disk, unused.

## The 11 mismatches found comparing the mock to the real API ("funny scenarios")

Full detail lives in the plan below (also summarized in [[flolyt_leakage_map_wiring]]); short list:

1. **Stage cards secretly had three different modal layouts** (Adopt/Retain bespoke + generic
   fallback) but `GET /leakage/stages/{stageKey}` returns one uniform shape for all 10 stages —
   collapsing to one generic template, "Learn why" wired for every stage now, not just Adopt.
2. `CoverageGapNote` was Retain's hardcoded rollup example — dropped, no per-stage "unattributed %"
   figure exists in the API.
3. The matrix's 5 cell states (value/compound/zero/gap/filtered) don't map onto what the API
   distinguishes — "zero" collapses into "measured", "compound" (horizon-projection) has no API
   backing and is dropped, "filtered" cells aren't returned by the server at all (only a count),
   so the mock's "click a hidden cell anyway" interaction can't be reproduced.
4. Matrix columns/rows are hardcoded in the mock; the real `grid.conditions`/`grid.rows` are
   dynamic per business — must render from the response, not a constant.
5. Cells carry a `currency` field the mock has nowhere — scope the matrix to the active market's
   currency.
6. **`grids` is an array — confirmed live to hold 2 grids at once** (`lifecycle_stage` +
   `segment`) for a real workspace, not a hypothetical case. A grid-switcher tab is being built now
   in Step 4, not deferred.
7. Coverage panel's "Not covered"/"Not included"/"How to improve" sections carry invented
   dollar/percent figures with zero API equivalent — thinning down to what `coverage` actually
   returns (`measuredConditions`/`unmeasuredConditions`/`percent`/`sentence`).
8. "How is this calculated" dialog's bottom stat row (fake calibration dates) has no API source —
   swapping for the real top-level `calculation` block.
9. Market breakdown needs `GET /leakage/report`'s per-market `gross`/`expected`/`net`, not
   `GET /leakage`'s own `markets[]` rail (which is per-condition, no single blended figure —
   inventing one client-side would violate [[feedback_no_frontend_business_math]]).
10. Severity/confidence value formats differ — mock's numeric `1–5` needs an adapter to the API's
    `"s1".."s5"` strings; confidence is already 1:1.
11. The "Custom range" calendar has no API equivalent (API only takes a day-count or a keyword) —
    kept as a UX affordance, converted to a day-count before sending.

## Implementation sequence

### Step 0 — Confirm real shapes before building on them — ✅ partially done (2026-09-22)
A real `GET /leakage` and `GET /leakage/stages/{stageKey}` response (workspace with no completed
refresh, `coverage.measured: 0`) corrected several guessed shapes in
`src/services/api/leakage/*.ts` — see [[flolyt_leakage_map_wiring]] for the specifics
(`LeakageMeasuredValueDto<T>` wrapper, `amountAtRisk` field name, nullable `marketLens`).
`GET /leakage/cells/{...}` was called too but only returned a refusal (invalid coordinate) —
confirmed it throws an HTTP error the existing try/catch already handles correctly.
**Still open, get before Step 4:** a real measured cell, a real `GET /leakage/report` response
(100% unconfirmed), and an `expected`/`movement` that's actually `"available"` (every example so
far was `"unavailable"`).

### Step 1 — Filters: Window, Horizon, Severity, Confidence, Market — ✅ done (2026-09-23)
- New module `filters.ts` (not `data.ts`) holds filter state/derivation — `LeakageFilterState`
  (`window`/`horizon`: `{ kind: "preset", value } | { kind: "custom", days }`, `market`,
  `calculate`, `minSeverity`, `minConfidence`), `toGetLeakageParams`, and label helpers. Presets
  render from the live response's `window.options`/`horizon.options`/`markets[]` once loaded
  (`FALLBACK_WINDOW_OPTIONS`/`FALLBACK_HORIZON_OPTIONS` cover the gap before the first response
  lands). Severity/confidence/calc-mode option *values* are the API's own fixed enums (`s1`–`s5`,
  `low`/`medium`/`high`, `gross`/`expected`/`net`) with plain labels, no invented editorial copy.
- `filters-menu.tsx`: rewritten with six sibling top-level cascades (Calc, Window, Horizon, Market,
  Severity, Confidence) — Window and Horizon are now fully independent, each ending in its own
  "Custom…" entry. Custom range is a single-date calendar (not a from/to pair — the API only takes
  a day count) that converts the picked date to a day count via `daysBetween` before applying.
  `horizon-picker.tsx` is deleted; its date helpers moved into `filters.ts`.
- `index.tsx`: state is `LeakageFilterState`, fed into `useGetLeakage(toGetLeakageParams(filters))`.
  The (still-mock, Step 4) matrix/status-line hidden-percent calculation keeps running on the old
  numeric `SeverityLevel`/`ConfidenceLevel` convention via two small local adapter functions
  (`legacySeverityRank`/`legacyConfidenceLevel`) — removed once Step 4 wires the real grid.
- Deleted from `data.ts`: `CalcMode`/`CalcModeOption`/`CALC_MODE_OPTIONS`/`DEFAULT_CALC_MODE`,
  `HorizonValue`/`HorizonOption`/`HORIZON_GROUPS`/`DEFAULT_HORIZON`/`DEFAULT_HORIZON_DIRECTION`/
  `HORIZON_FOOTNOTE`, `SeverityFilterOption`/`SEVERITY_FILTER_OPTIONS`/`DEFAULT_SEVERITY_FILTER`,
  `ConfidenceFilterOption`/`CONFIDENCE_FILTER_OPTIONS`/`DEFAULT_CONFIDENCE_FILTER`. Kept (still used
  by the mock matrix/detail-panel until Step 4): `SeverityLevel`/`SEVERITY_LABEL`,
  `ConfidenceLevel`/`CONFIDENCE_RANK`/`CONFIDENCE_LABEL`.
- **Verified live 2026-09-23** against the real backend (`ichigo@yopmail.com`, finished-onboarding
  workspace) — every filter change's resulting `GET /leakage` request matched exactly: Window→30
  sent `window=30`, Horizon→60 sent `horizon=60`, Calc→Expected sent `calculate=expected`,
  Severity→≥S2 sent `minSeverity=s2`, Confidence→≥High sent `minConfidence=high`, and picking a
  custom window date converted correctly to `window=17`. Status line showed the response's own
  `window.label`/`horizon.label` ("the last 90 days" / "the next 90 days"). This workspace's
  `markets[]` was empty, so only "All markets" was exercised live — a workspace with real market
  entries hasn't been used to confirm `marketOptionLabel`/the market-select-and-refetch path yet.
  No console errors.

### Step 2 — Page shell: loading/error/empty, status line, stage rail values — not started
Drop `LEAKAGE_MAP_STATE`, drive `PageStateBanner` from `useGetLeakage`'s real query state.
`stage-rail.tsx` reads `data.stages` instead of `STAGES`; drop per-card `coveragePercent` (no
per-stage coverage field exists).

### Step 3 — Stage detail card (the modal consolidation) — not started
One generic `StageDetailCard` from `headline`/`population`/`departedThisMonth`/`movement`/
`spansStates`/`owner`/`openRoomCount`, lazy-fetched via `useGetLeakageStage` on open. "Learn why"
wired via `useLearnWhyLeakageStage` for all 10 stages.

### Step 4 — The matrix itself — not started
Biggest structural change: dynamic rows/conditions/cells from `grids[]` (now handling 2 grids via
a tab, per finding #6), currency-scoped, 2 render states instead of 5, cell click lazy-fetches
`useGetLeakageCell`, "start a room" wired to `useOpenRoomOnLeakageCell`.

### Step 5 — Coverage panel, "How is this calculated", Market breakdown — not started
Thin coverage panel to real `coverage` fields; real `calculation` block in the dialog; market
breakdown switches to `useGetLeakageReport`; remove `ActionsPanel` usage from `index.tsx`.

### Step 6 — This doc + `docs/endpoints/leakage.md` status — ongoing
Update both as each step lands (Status/Used by per endpoint, step checkboxes above).

## Branches involved

- `add-leakage-map-endpoints` — this work (endpoint docs/scaffolding done, wiring in progress).
- `pre-leakage-map-baseline` — a frozen, unpushed-upstream marker at `add-onboarding`'s tip
  (`7185bb9`, 2026-09-22) for comparing "before" vs "after" once this merges. See
  [[flolyt_add_onboarding_vercel_cors]] for why a frozen branch is needed (the CORS-approved
  Vercel URL auto-repoints to `add-onboarding`'s latest deployment on every push, so it stops
  showing the pre-merge page the moment this work merges).

## Verification

No live source has ever been confirmed for most of this domain — after each step, run the dev
server, load `/leakage-map` against the real backend on `localhost:3000` (the only CORS-approved
origin besides the `add-onboarding` Vercel alias — see [[flolyt_dev_server_port_3000]]), and check
the network tab's actual response against what the code assumes. Kill the dev server when done,
per [[always_kill_dev_servers]].
