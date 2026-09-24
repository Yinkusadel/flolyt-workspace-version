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
**Still open before the matrix can be fully live-verified:** a real measured cell (this workspace
has stayed at 0% coverage all session) and an `expected`/`movement` that's actually `"available"`
(every example so far was `"unavailable"`) — neither blocks *building* Step 4 against the
documented shape, just verifying it end-to-end. `GET /leakage/report` was confirmed live
2026-09-23 — top-level shape only (its `markets[]` came back empty), see
[docs/endpoints/leakage.md](../endpoints/leakage.md); that endpoint feeds Step 5 (Market
breakdown), not Step 4 (the matrix pulls from `GET /leakage`'s own `grids[]`, already documented).

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

### Step 2 — Page shell: loading/error/empty, status line, stage rail values — ✅ done (2026-09-23)
- Dropped `LEAKAGE_MAP_STATE`; `PageStateBanner` is now driven by `useGetLeakage`'s real
  `isFetching`/`isError`/`error` state. `useGetLeakage` gained `placeholderData: (prev) => prev` so
  a filter change shows the "Recomputing exposure…" banner while the *previous* filter's figures
  stay on screen (confirmed live — see below), instead of flashing back to a skeleton on every
  change. Error banner shows the real `error.message`; its Retry button calls `refetch()`. Empty
  state's "Connect a source" button now navigates to `/data-sources`.
- **"Empty" trigger is an unconfirmed inference**, flagged rather than guessed silently: no real
  response pulled so far has ever had `customerCount === 0`, so `isEmpty` is defined as
  `leakage.customerCount === 0` on a resolved, non-error response — a structurally reasonable
  proxy, but not live-verified. Re-check if/when a genuinely fresh signup workspace is available.
- `stage-rail.tsx` now takes `stages`/`callouts` straight from `GET /leakage`'s response
  (`undefined` ⇒ 10-tile skeleton, matching the "no data fetched yet" case). Per card: real
  `position`/`name`, `headline` (via `formatHeadlineValue`, `InfoTooltip` on the gapped case using
  the real `missingSource`/`wouldUnlock` sentence — same convention the archived
  `src/oldpages/everyday/lifecycle/stage-rail.tsx` used for the same `*MeasuredValueDto` wrapper),
  `atStake` (via `formatAtStakeAmounts`, `InfoTooltip` when gapped). Dropped `metricLines` (no API
  equivalent — `headline` is the real per-stage KPI instead) and `coveragePercent` (no per-stage
  coverage field exists) per the ground rule. The dot color is now a purely decorative fixed
  palette cycled by `position` (the API carries no per-stage color).
- **Extra cleanup beyond this step's original scope:** deleted `coverage-gap-note.tsx` and its
  render in `index.tsx` — it was Retain's invented rollup example (mismatch #2), not something a
  later step could ever wire for real. The mock's authored "Advocacy feeds acquisition" callout is
  replaced by real ones from the response's own `callouts[]` (dismissible individually, tone
  mapped to the shared `Callout` component's amber/teal/rose, defaulting to amber for any other
  string). `data.ts`'s now-fully-orphaned `STAGES`/`ADVOCACY_NOTE_TITLE`/`ADVOCACY_NOTE_BODY` are
  deleted; `Stage`/`ADOPT_STAGE_DETAIL`/`RETAIN_STAGE_ROLLUP` stay (still used by `detail-panel.tsx`'s
  still-mock `StageDetailCard`, orphaned-but-present pending Step 3, same precedent as
  `actions-panel.tsx`). Status line now also shows real `customerCount`/`refreshedAtUtc`/
  `coverage.percent` (all single-field, no computed math) instead of mock text; added
  `formatRelativeTime` to `src/lib/format-measured-value.ts` for the "6 min ago" style timestamp.
- Stage cards have **no click-through modal for now** — the old mock's FloatingCard→StageDetailCard
  interaction was removed rather than pointed at fake data. Step 3 restores it, backed by a lazy
  `useGetLeakageStage` fetch on open.
- **Verified live 2026-09-23** (same `ichigo@yopmail.com` workspace) — real headline/atStake
  figures and gap tooltips rendered correctly (e.g. Acquire's `atStake` was a real ₦0, the other 9
  stages correctly showed the gapped `InfoTooltip` with real missing-source/would-unlock copy); the
  real page-level callout "9 of the 10 stages cannot be measured yet…" rendered from `callouts[]`;
  a Window filter change showed the loading banner while the previous filter's cards/status line
  stayed visible, then updated correctly. No console errors.

### Step 3 — Stage detail card (the modal consolidation) — ✅ done (2026-09-23, blocker fixed 2026-09-24)
`StageDetailCard` rewritten as one generic template from `LeakageStageDetailDto` — `atStake`
(headline stat), `population`/`departedThisMonth`/`openRoomCount` (a 3-up stat row), `movement`,
`expected` (per-currency, with range + confidence), `severity` chips, `refreshedAtUtc` — replacing
the old mock's three bespoke Adopt/Retain/generic layouts, lazy-fetched via `useGetLeakageStage`
only once a card is clicked (not for all 10 upfront). `data.ts`'s now-fully-orphaned `Stage`/
`ADOPT_STAGE_DETAIL`/`RETAIN_STAGE_ROLLUP` deleted. `stage-rail.tsx`'s `StageCard` restores the
`FloatingCard` click-through, threading `window`/`horizon`/`market` down from the page's active
filters (not `calculate`/severity/confidence — those aren't part of `GetLeakageStageParams`).

"Learn why" is wired via `useLearnWhyLeakageStage`, navigating to `/conversations/{conversationId}`
on success — no client-built prompt text, since the server seeds the conversation's first turn
itself (`title`/`question` on the mutation's own response), unlike the old mock's client-assembled
`prefillPrompt`. The button is gated to only render when `atStake.value !== null ||
headline.value !== null` (catches the doc's documented refusal, "a gap is not a question" — no
measured figure at all), per [[feedback_hold_mostly_gated_feature]] — first shipped without this
gate, showing the button unconditionally on all 10 stages regardless of coverage.

**✅ Blocker fixed 2026-09-24, live-confirmed 2026-09-23:** the refusal-gating above was incomplete.
The endpoint has a **second, undocumented refusal case** distinct from "a gap is not a question":
clicking "Learn why" on Acquire — whose `atStake.value` was a real, non-null
`[{ currency: "NGN", amountAtRisk: 0 }]`, so it passed the old gate — was refused with `"There is
nothing to explain at Acquire: nothing is leaking there over this window — the refresh ran and
found nought, which is a result rather than a gap."` So the server treats *measured-zero* as
equally unanswerable as *unmeasured*, just for a different reason (a real "no leak" result vs. an
unknown one). Fixed alongside the `AtStakeAmounts` zero-render fix: the gate is now
`hasLeakToExplain = stage.atStake.value?.some((amount) => amount.amountAtRisk > 0)` — `> 0`, not
just non-`null` — so an all-zero stage no longer shows a button guaranteed to hit this refusal.
Full detail recorded in [docs/endpoints/leakage.md](../endpoints/leakage.md)'s learn-why section.
**The cell-level "Learn why" in Step 4 was not updated to match** — it still gates on
`cell.amount !== null` only, so it likely has the same latent gap. Flagged, not yet fixed.

### Step 4 — The matrix itself — ✅ done (2026-09-23)
`matrix.tsx` rewritten to render `GET /leakage`'s own `grids[]` dynamically — columns from
`grid.conditions.filter(applicability !== "NotApplicable")`, rows from `grid.rows`, cells looked up
from a `${row}:${condition}` map built from `grid.cells` (scoped to the active currency). Only 2
real render states survive (measured — `amount` present, heat-shaded by the real `intensity` field
— or gap — dashed "Unknown"); the mock's "compound"/"zero"/"filtered" states are gone, per
mismatch #3 (severity/confidence filtering is already server-side — `filter.cellsHidden` is
rendered as a bare count banner, no client-side hiding logic left at all).

**Grid switcher confirmed live** — this workspace really does carry both `lifecycle_stage` and
`segment` grids at once (mismatch #6), each with its **own distinct 5 conditions** (lifecycle_stage:
Repeat decay/Involuntary churn/Abandonment/Refunds/Discount dependency; segment: Spoilage/Leakage/
Churn risk/Activation/Expansion gap) — together the real 10 conditions `GET /leakage/report`
confirmed. `segment`'s `rows: []` came back empty live, so a "No rows defined for this grid yet."
empty state was added (the DataTable-empty-state convention, applied here too).

Cell click lazy-fetches `GET /leakage/cells/{...}` via a new `CellDetailCard` in `detail-panel.tsx`,
replacing the mock's five authored cell-card variants (`ValueCellCard`/`CompoundCellCard`/
`ZeroCellCard`/`GapCellCard`/`FilteredCellCard`, plus `RiskChips`/`ordinal` — all deleted). "Start a
room" sends the cell's own server-provided `draft` object as-is (no client-side edit form — out of
this step's scope) via `useOpenRoomOnLeakageCell`, navigating to the new room on success; "Learn
why" wired via `useLearnWhyLeakageCell`, gated the same way as the stage version (`amount !== null`)
— the same "measured-zero still gets refused" ambiguity flagged on the stage endpoint likely
applies here too ("or one with no figure behind it" in this endpoint's own prose), unconfirmed.

**Real bug caught and fixed during live verification:** the active currency (needed as a path
segment for the cell-detail fetch) has no source at all when `markets`, `bySeverity`, and `ladders`
are *all* empty. The first pass fell back to an empty string, which silently disabled the query and
then misreported as "Couldn't load this cell." Fixed: `index.tsx` now falls through
primary-market → any-market → `bySeverity[0]` → `ladders[0]`, and when every source comes up empty,
`matrix.tsx` renders that cell as a plain disabled button instead of firing a request with an
invented currency.

**✅ Cell-click flow fully live-verified 2026-09-24** after the user connected a real data source to
the test workspace. Clicking a real `₦4.3M` cell (`active × repeat_decay × NGN`) fired
`GET .../cells/lifecycle_stage/active/repeat_decay/NGN?window=90&horizon=90` and rendered the real
amount/severity/customer count correctly, with `movement`/`expected` honestly gapped and a
correctly-gated "Start a room" button present. This also surfaced that the grid-inline
`LeakageCellDto` was missing 6 real fields (`reason`/`missingSource`/`wouldUnlock`/
`neverEstimated`/`calculation`/`realized`) the original truncated paste never showed — fixed in
`get-leakage.ts`, and `matrix.tsx`'s gap cells now show an `InfoTooltip` with the real
`missingSource`/`wouldUnlock` inline (no click needed). "Start a room" and "Learn why" buttons were
confirmed present and correctly gated; **"Start a room" was live-clicked and confirmed working
2026-09-24** — the real POST created a room and navigated to it. The cell "Learn why" mutation is
still unclicked (creates a real conversation) — see [[feedback_mutation_flows_need_live_submit]].
Its gate initially lagged the stage version's `> 0` fix — **confirmed live 2026-09-24** on a
`lapsed · Repeat decay` cell measured at a real ₦0 that showed the button anyway — now fixed to
`hasLeakToExplain = cell.amount !== null && cell.amount > 0`, same two-refusal reasoning as the
stage gate. Also fixed: `formatAtStakeAmounts` joined multi-currency amounts with `" + "`, which
visually implies summation — backwards for a value explicitly never summed across currencies; now
`" · "`.

`data.ts`'s `SeverityLevel`/`SEVERITY_LABEL`/`CONFIDENCE_RANK`/`MatrixColumnKey`/`MATRIX_COLUMNS`/
`MatrixCell`/`MatrixRow`/`MATRIX_ROWS`/`isCellHiddenByFilter`/`filteredOutPercent` are all deleted
— fully retired now that severity/confidence filtering happens server-side and the grid is real.
`index.tsx`'s `legacySeverityRank`/`legacyConfidenceLevel` adapters (Step 1's bridge for the
still-mock matrix) are gone too. `HEAT_SCALE`/`HEAT_TEXT_CLASS` survive (reused, now driven by real
`intensity`); `FEATURED_CELL` survives in trimmed form (only `.room.id`, still referenced by the
still-mock, still-hidden `ActionsPanel` — Step 5's job to remove). `StatusLine`'s Severity/
Confidence amber line now shows the real `filter.cellsHidden` count instead of a fabricated
percentage (there's no single "total cells" to divide by across two differently-sized grids).

### Step 5 — Coverage panel, "How is this calculated", Market breakdown — ✅ done (2026-09-24)
- `coverage-panel.tsx` rewritten to `LeakageCoverageDto` — `percent` as a header chip, the server's
  own `sentence` as the description (not client-authored copy), and two condition-name lists
  (`measuredConditions`/`unmeasuredConditions`) rendered as-is. These are already display-ready
  labels ("Repeat decay", "Involuntary churn", …), confirmed live 2026-09-23 in
  `coverage.unmeasuredConditions` — no key-to-label lookup needed. Dropped entirely (mismatch #7,
  no API equivalent): customer %, per-line dollar "not covered" detail, "How to improve" boost %s,
  "Last updated" stamp.
- `how-calculated-dialog.tsx` rewritten to the page's own top-level `calculation`
  (`LeakageCalculationDto`) — `method` in the server's own prose, the window it ran over, connected
  `sources`, concrete `inputs`, and `caveats`. Dropped (mismatch #8, no API equivalent): the
  formulas block, the five authored terms (Probability/Impact/Ramp factor/Recovery rate/
  Confidence), "What is not included", and the calibration-date stat row. Threaded through
  `controls-bar.tsx` as a new `calculation` prop.
- `market-breakdown.tsx` switched to `useGetLeakageReport`'s per-market `gross`
  (`LeakageReportMarketDto`), fetched independently in `index.tsx` (that endpoint only takes
  `window`/`horizon`, not the page's severity/confidence/calculate filters — mismatch #9, avoids
  [[feedback_no_frontend_business_math]]). Row label reuses `marketOptionLabel` from `filters.ts`
  (the same country-code convention the market switcher already uses) rather than inventing a
  second one. Bar width is the only derived number — a purely visual proportion against this list's
  own max `gross`, never shown as data. Per-market `customers` has no field on this DTO, so it's
  dropped rather than invented. Renders nothing (not a skeleton) when `markets` is empty or
  undefined.
- `ActionsPanel`/`actions-panel.tsx` and `PageFooter`/`page-footer.tsx` deleted outright, along with
  their `data.ts` exports (`ACTIONS_PANEL`, `ActionRow`, `PAGE_FOOTER`) and `FEATURED_CELL` — no
  leakage endpoint carries SLA/ownership-queue data at all (locked in at Step 1), and `PageFooter`'s
  own figures (`totalLine`/`expectedSaveLine`) were derived entirely from `ACTIONS_PANEL`'s invented
  numbers, so once that's gone there was nothing left for the footer to show that wasn't already
  fabricated. `data.ts`'s now-fully-orphaned `Tone`/`COVERAGE_PANEL`/`HOW_CALCULATED`/`Market`/
  `MARKETS`/`NO_SINGLE_TOTAL` deleted too; `ConfidenceLevel`/`CONFIDENCE_LABEL`/`HEAT_SCALE`/
  `HEAT_TEXT_CLASS`/`PAGE_STATES` survive (still used elsewhere on the page).
- **Coverage panel confirmed live 2026-09-24** — `coverage.percent` (20%) and `coverage.sentence`
  rendered exactly as the response gave them, no fixes needed.
- **Market breakdown live-verified 2026-09-24 and three real bugs caught and fixed.** First
  populated `markets[]` this endpoint has ever produced (5 currencies). (1) `gross`/`realized`/
  `expected`/`net` are `LeakageMeasuredValueDto`-wrapped, not the plain nullable number the
  endpoint's prose had implied — the first pass's `market.gross` was actually an object, and
  `formatCompactMoney(market.gross, …)` rendered it as a literal `[object Object]` next to every
  currency. Fixed in `get-leakage-report.ts` (types) and `market-breakdown.tsx` (reads
  `market.gross.value`). (2) Every non-primary market had `countryCode: null` — the shared
  `marketOptionLabel` (filters.ts) correctly falls back to "Unlabeled market" for the filter
  dropdown, but reused here it repeated across 4 of 5 rows with nothing to tell them apart (the
  currency was already shown on the row, but not as the label). Fixed with a local
  `marketRowLabel` in `market-breakdown.tsx` that falls back to the currency itself instead.
  (3) **The bar's relative width was itself a mistake, caught live once real cross-currency data
  existed to expose it** — each row's width was `gross.value / (max gross.value across the list)`,
  which compares raw magnitudes across different currencies with no FX rate (₦9.4M read as 100%
  "dominant" purely because the Naira has more digits per unit of value than CAD/EUR/GBP/USD, not
  because it necessarily carries more real exposure) — visually contradicting this same panel's own
  "money is never summed across currencies" message, and itself a form of
  [[feedback_no_frontend_business_math]] since it's a comparison the backend never made. The
  endpoint has no share/percent field to wire instead, so the bar is removed outright rather than
  replaced with another derived number. Also corrected `LeakageTopLeakDto`'s three
  previously-truncated fields (`severity`/`owner`/`roomId`) — not yet rendered anywhere on the
  page, but fixed while the real shape was in hand rather than left for a future step to guess
  again. See docs/endpoints/leakage.md's `GET /leakage/report` section for the full before/after.
- **"How is this calculated" dialog not yet live-clicked** — built against the documented
  `calculation` shape (same wrapper structure confirmed live elsewhere on this page), but the
  dialog itself hasn't been opened against a real response yet.

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
