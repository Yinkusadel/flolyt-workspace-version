# Leakage map V2 — wiring build plan

Started 2026-10-01, on branch `update-leakagemap-page`. Contract reference is
[`leakage-map-v2-frontend-handoff.md`](leakage-map-v2-frontend-handoff.md) (the boss's handoff doc) —
this file is the working plan for wiring it in, not a copy of its shapes. The V1 wiring this builds
on top of is fully done — see [`build-plan.md`](build-plan.md) (all 6 steps ✅) and
[[flolyt_leakage_map_wiring]] for that history.

## Scope for this pass (per the boss, Slack 2026-10-01)

He pointed at exactly two endpoints when asked about this doc:

> "But its the endpoint for thr main leakage map page / Along side the another endpoint for
> opportunities"

So this pass is scoped to:

1. `GET /api/v3/leakage` — the existing main page endpoint, now dual-contract (same URL already in
   `apiConfig.ts`, response shape changes once a workspace is flagged in).
2. `GET /api/v3/opportunities` — new, separate, positive-polarity endpoint.

**Update 2026-10-01 (design pass):** the user flagged the V2 page's visual design as "wack" and
hard to read, and pushed back on waiting for a mockup before fixing it — correctly: the job is to
apply this app's own existing design language, not wait for a Figma file that was never going to
exist for a backend-contract handoff doc. Rebuilt using patterns already established on V1:
- **Filters**: replaced the 7 raw `<select>` elements with the exact same cascading "Filters"
  dropdown menu V1 uses (`filters-menu.tsx`). Extracted the reusable pieces (`OptionRow`,
  `SubHeading`, `useCascadeSlot`) into a new shared `cascade-menu.tsx` so both versions use
  identical code — live-verified V1's menu still opens correctly after the extraction.
- **KPI strip**: added `v2-kpi-strip.tsx` using the app's shared `KpiCards` component (the same
  stat-tile row every stage tab opens with) for Total exposure / Coverage / Residual unknown,
  instead of repeating a "Total" row inside the rollups list.
- **Status line**: added `v2-status-line.tsx`, one muted sentence with bolded key values — same
  convention as V1's `status-line.tsx` — instead of scattered chips.
- **Row hierarchy**: rewrote cell/rollup/opportunity rows so the dollar amount is the dominant
  element and everything else (lifecycle class, severity, confidence, candidates) reads as one
  small muted descriptive line underneath, not a row of equal-weight chips — this was the direct
  fix for "I can't tell what the values I'm seeing are."
- **Consolidated humanization**: `humanizeEnum()` in `v2-filters.ts` replaces 3 near-duplicate
  local functions. **Two real bugs this consolidation caught live**: (1) it only capitalized the
  first letter without lowercasing the rest, so uppercase API values like `"IN_FLIGHT"` rendered as
  "IN FLIGHT" instead of "In flight" — fixed by lowercasing before capitalizing; (2) it was being
  applied to currency codes in the rollups "By market" row, turning `"USD"` into `"Usd"` — fixed by
  never humanizing a market-dimension rollup's value, same as `AmountBlock` never humanizes
  `amount.currency` elsewhere on the page.
- **Live-verified 2026-10-01** end to end against the real V2-flagged workspace (both bugs above
  were caught and fixed from actual rendered screenshots, not guessed) — zero console errors,
  KPI strip/status line/Filters menu/rollups/cell list all confirmed rendering correctly.

**🟢 Design status: RESOLVED, 2026-10-02.** Was ON HOLD after the user called the first pass "wack
and complete trash" and flagged the Rollups panel as wasting space. The user had a reference design
from a separate claude.ai session but, when work resumed, said **"ignore the better reference,
design what we have, you can check the api response and see"** — explicitly dropped the blocker on
waiting for that reference and asked for a fresh design pass grounded in the real captured response
instead. The `frontend-design` plugin's skill was confirmed loaded in the resuming session before
any layout work started (per the gate below, now satisfied). See "Visual redesign pass
(2026-10-02)" further down for what was actually built.

**The coverage-fields gap is real and independent of the design question** — `capability`/`scope`/
`freshness`/`quality` should get surfaced somewhere once work resumes, regardless of what the final
visual layout ends up looking like. the user asked directly whether cell detail/Learn Why/case-Room were
excluded by the doc itself (they're not — the doc fully specifies them) or just not yet asked for
(they weren't). Clarified the scoping above was my own inference from the boss's 2-endpoint Slack
answer, not an explicit instruction from him or a restriction in the doc. Per the user's direct
request, all 14 remaining `/leakage/*` V2 routes below are now **documented and scaffolded**
(service + hook, see [docs/endpoints/leakage.md](../endpoints/leakage.md)'s V2 sections) —
**still 0/14 wired into any page**, pending further direction on what to build next.

**Deliberately not in this pass** (the handoff doc covers them, but nobody has asked for them yet —
do not start on these without a separate go-ahead):

- Cell detail/history/evidence routes (`/cells/{cellId}`, `/cells/{cellId}/history`,
  `/cells/{cellId}/evidence`) — Phase 6's "Learn Why" rebuild.
- The whole Case + Room lifecycle (Phase 5: `/cells/{cellId}/case`, `/cases/{caseId}/...`).
- `/leakage/coverage` and `/leakage/calculation` as standalone routes (the main page's own embedded
  `coverage` summary covers this pass).
- `/leakage/cutover-readiness` — operator/rollout diagnostic surface, not end-user facing.

## The flag — confirmed by the boss, not our problem

`RevenueIntelligence:LeakageV2:ReadRollout` is a **backend environment variable**, set per company
for testing. His own words: *"You need not bother about it frontend wis[e]."* Our only job is to
read `data.contractVersion` off the response and branch — never assume, never configure, never
infer who's enabled.

| Flag selects company? | V2 publication complete? | What `GET /api/v3/leakage` returns |
|---|---|---|
| No | — | Legacy payload (today's shape, no `contractVersion`) |
| Yes | Yes | `data.contractVersion: "2.0"`, new shape |
| Yes | No | Explicit error — never falls back to legacy silently |

**Before Step 1 can be live-verified, ask the boss to flip the rollout percentage to 100 for our
test workspace** (he already named the env var pattern in the handoff doc, lines 529-536) — without
that we can only build against the documented shape, not a real response.

## Implementation sequence

### Step 0 — Confirm the real "2.0" shape — ✅ mostly done (2026-10-01)
- [x] Asked the boss; he enabled the rollout flag for our test workspace.
- [x] First attempt (flag on, no snapshot) returned the documented explicit-failure case —
      `400`, `succeeded: false`, `"Revenue Leakage V2 is enabled, but this workspace has no
      published V2 snapshot yet."` — matches the doc exactly, confirms that error path is real.
- [x] Once a snapshot was published, pulled one real `contractVersion: "2.0"` response and diffed
      it against `LeakagePageV2`. Top-level shape (`controls`/`publication`/`cells`/`rollups`/
      `coverage`/`limitations`) matches exactly. **Two real mismatches found, both worth building
      around rather than trusting the doc's TS types blind:**

  1. **Casing is inconsistent between option lists and record values.** `controls.modes[].value` /
     `controls.severities` / `controls.lifecycleClasses` are all lowercase (`"gross"`, `"s4"`,
     `"in_flight"`) — i.e. what you send back as a query param. But the *populated* fields on cells
     read back **uppercase**: `amounts[].mode: "GROSS"`, `amounts[].lifecycleClass: "IN_FLIGHT"`,
     `amounts[].severity: "S4"`. The doc's own `Amount` type declares `severity` as lowercase
     (`"s1".."s5"`) — live data contradicts the doc there specifically. `confidenceLevel` is the one
     exception that's consistently uppercase in both the doc's type and live data. **Any code
     matching a cell/amount's severity or lifecycleClass against the currently-selected filter value
     must compare case-insensitively** — don't assume `cell.amounts[0].severity === controls.severity`
     will ever be true as typed.
  2. **The top-level `limitations[]` array is not the short, human list the doc implies.** A real
     response had 150+ entries, one per unpriced candidate (e.g. *"Candidate '...' remains unpriced
     because sector 'financial-services' has no severity thresholds in GBP; no FX conversion was
     inferred."*), repeated per currency per candidate. The doc's "treat limitations as first-class
     content" instruction assumed a handful of lines; naively rendering this array as bullet points
     will produce an unusable wall of text. **Step 2's renderer needs to group/truncate/collapse
     this, not `.map()` it directly** — e.g. count-and-expand, or dedupe by reason template.

- [x] Confirmed a request's `value` field on `Amount` mirrors whichever `mode` was requested
      (`gross` request → `value === gross`) — a convenience echo, not a fourth independent figure.
- [ ] Still need: a response with a non-null `market`/`sector`/`severity`/`confidence`/
      `lifecycleClass` filter actually applied (everything pulled so far was the unfiltered
      default), and a legacy (unflagged) response from the same endpoint pulled back-to-back to
      prove the branch doesn't regress existing behavior.

### Step 1 — Types + response branching — ✅ done (2026-10-01)
- [x] Added V2 types (`LeakagePageV2`, `LeakageV2Cell`, `LeakageV2Amount`, `LeakageV2Rollup`,
      `LeakageV2CoverageSummary`, `LeakageV2Publication`, etc.) to
      `src/services/api/leakage/get-leakage.ts`, alongside the existing V1 types — untouched, legacy
      still works exactly as before. The casing and oversized-`limitations[]` findings from Step 0
      are documented inline on `LeakageV2Amount`/`LeakagePageV2` so they can't be silently re-broken.
- [x] `GetLeakageResponse.data` is now `LeakagePageData | LeakagePageV2`, with an `isLeakagePageV2()`
      type guard to narrow it.
- [x] `index.tsx` narrows on the guard before reading any V1 field. A `contractVersion: "2.0"`
      response now renders a holding placeholder ("a dedicated view for it is being built") instead
      of crashing or reading `undefined` off missing V1 fields; every legacy workspace is unaffected.
- [x] `npx tsc -b` clean.

### Step 2 — V2 page renderer — ✅ mostly done (2026-10-01)
- [x] New `src/pages/leakage-map/v2-cell-grid.tsx` renders `LeakageV2CellGrid` straight off
      `leakage.cells[]` from the main response — no separate cell-detail fetch (the `/cells/{cellId}`
      route stays out of scope). `index.tsx` branches on `leakageV2` (the narrowed response) instead
      of the Step 1 placeholder; legacy workspaces are completely untouched.
- [x] **V2 has no grid/row/column structure at all** — unlike V1's `grids[]`, `cells[]` is flat, and
      each cell is already one fully-resolved mechanism × state-value coordinate, not a pivot (a
      live response confirmed `dormant_accounts` uses the `account_activity` state dimension while
      `overdue_invoice` uses `collection_state` — different mechanisms don't even share an axis). So
      there's no matrix to build; `groupCellsByStage()` groups by `coordinate.revenueStageLabel`
      (the one axis every cell shares) and renders a list per stage, order following first-seen in
      the response since the API gives no explicit stage ordering.
- [x] Axes render from the response's own labels (`mechanismLabel`, `stateDimensionLabel`,
      `stateValueLabel`) — nothing hardcoded.
- [x] 3 of the 5 display states implemented and real-data-shaped: `POPULATED` (per-amount row with
      currency/lifecycle-class/range), `UNKNOWN` (reuses `InfoTooltip`, fed the cell's own
      `limitations[]` joined — not the V1 `missingSource`/`wouldUnlock` pair, which V2 doesn't have),
      `NO_EXPOSURE` (handles both an empty `amounts[]` and a populated zero-valued one, since no real
      `NO_EXPOSURE` example has been pulled live yet — flagged inline). `COMPOUND` renders as a chip
      when `state.facets` includes it (confirmed live on both populated cells in the sample pull).
- [ ] `HIDDEN_BY_FILTER` is coded (cells with that display state are excluded from the active
      groups) but **unexercised** — nothing sends a severity/sector/etc. filter yet, that's Step 3.
- [x] Accessible name built per cell (mechanism, revenue stage, state value, display state,
      amount/currency, severity, confidence) via `aria-label` on each row.
- [x] The oversized `limitations[]` array (Step 0's finding) is handled: `groupLimitations()`
      collapses near-duplicate entries by stripping UUID-shaped tokens before counting, shown in a
      collapsed `Callout` instead of a flat list.
- [ ] Filter-driven refetch-without-clearing behavior not yet applicable — no V2 filters are wired
      yet (Step 3).
- [x] `npx tsc -b` clean.
- [x] **Live-verified 2026-10-01** via Playwright against the real backend, logged into the
      V2-flagged workspace (`chad@yopmail.com`, sector `financial-services`). Real response: 6
      cells across 3 stages (Engage/Renew/Retain), 1063 raw `limitations` entries collapsed to 10
      grouped lines. Caught and fixed 2 real bugs from this one live pass:
  1. `Callout` wraps its children in a `<p>`; the first version of `LimitationsSummary` passed it a
     `<ul>`, an invalid-HTML-nesting console error. Fixed to inline `<span>`/`<br />` lines.
  2. **Shared-utility bug surfaced, not new:** `formatCompactMoney` (`src/lib/format-measured-value.ts`)
     never rounded a sub-1000 amount — a real cell showed `USD 484.3195` verbatim. Every prior
     caller (V1 leakage, lifecycle) happened to only ever pass whole numbers, so this was latent
     until V2's precise decimals hit it. Fixed to `round(value, 2)` on that branch — safe for every
     existing caller, since rounding an already-whole number is a no-op.
  Zero console errors after both fixes; screenshot confirmed the rendered page matches the JSON.

### Step 3 — Controls mapping — ✅ done (2026-10-01)
- [x] New `src/pages/leakage-map/v2-filters.ts` (separate from V1's `filters.ts`, not extending it —
      the shapes genuinely differ) holds `LeakageV2FilterState`, `toGetLeakageV2Params`, and
      `v2FilterStateFromControls` (seeds the UI from the server's own active selection rather than a
      hardcoded default).
- [x] New `src/pages/leakage-map/v2-controls-bar.tsx` — plain `<select>`s (no design spec exists for
      this page, consistent with Step 2's plain cell list), every option list sourced from the
      response's own `controls.modes`/`.horizons`/`.markets`/`.sectors`/`.severities`/
      `.confidenceLevels`/`.lifecycleClasses` — nothing invented client-side.
- [x] Resolved the chicken-and-egg problem of not knowing V1-vs-V2 before the first response:
      `index.tsx` always sends V1-shaped params (`v1Params`) for the initial request; once a V2
      response arrives, a `useEffect` seeds `v2Filters` from `leakage.controls` exactly once, and
      every request after that switches to `toGetLeakageV2Params`. V1-only auxiliary calls (report/
      stage/cell) stay on `v1Params` always, unaffected by which branch is rendering.
- [x] `mode` confirmed live to replace `calculate` as the actual query param name (not just a type
      guess) — a real request read back `mode=expected&horizon=90`, no `calculate`/`window` present.
- [x] Severity/confidence option labels render the API's own raw value, not invented "≥" threshold
      copy — unconfirmed live whether V2's filter semantics are a floor or an exact match, flagged
      inline rather than guessed.
- [x] `npx tsc -b` clean.
- [x] **Live-verified 2026-10-01** — same V2-flagged session. Confirmed 3 real requests in sequence:
      the V1-shaped probe (`window=90&horizon=90&calculate=gross`), the auto-reseed once
      `contractVersion` was learned (`mode=gross&horizon=90` — a known one-time extra refetch, same
      data, just switching param convention), then the user-driven change (`mode=expected&horizon=90`
      after selecting "Expected" in the Mode select). Old figures stayed visible with a
      "recomputing…" line while the new data loaded — no flash to blank. Zero console errors.

### Step 4 — Rollups — ✅ done (2026-10-01)
- [x] New `src/pages/leakage-map/v2-rollups.tsx` — `LeakageV2Rollups` groups `rollups[]` (one flat
      list mixing every dimension) by `dimension`, in a fixed display order (Total, Market, Sector,
      Stage, Mechanism, Severity, State). `humanizeRollupValue` is purely cosmetic formatting of the
      raw internal key (rollups carry no label field the way cells do) — never invents a fact.
- [x] Hard rule satisfied structurally, not by discipline alone: each rollup entry is already scoped
      to one currency + one lifecycle class (confirmed live), and `RollupRow` renders exactly one
      entry at a time — there's no code path that could sum two rows together, unlike V1's
      market-breakdown bar-width bug ([[feedback_no_frontend_business_math]]) which this is built to
      not repeat.
- [x] `npx tsc -b` clean.
- [x] **Live-verified 2026-10-01** — same session. Real rollups rendered correctly: Total (USD 3.1k,
      2 cells), By market (USD), By sector (Financial services), By stage (Engage/Retain), By
      mechanism (Attrition/Dormant accounts), By severity (S4), By state (Account activity ·
      Active/Dormant) — all matching the underlying cells exactly. Also used this pass to confirm
      the brief "recomputing…" seen in a screenshot was the one-time reseed refetch settling
      (~1 second), not a stuck loading state — sampled the page every 500ms for 12s and watched it
      flip true→false exactly once, matching the two real network requests seen. Zero console errors.

### Step 5 — Opportunities surface — ✅ done (2026-10-01)
- [x] New domain `src/services/api/opportunities/get-opportunities.ts` +
      `src/features/opportunities/use-get-opportunities.ts` + `OPPORTUNITIES_BASE_URL`/
      `API_ENDPOINTS.OPPORTUNITIES` in `apiConfig.ts` — a genuinely new endpoint, not an existing one
      being retyped. The hook takes an `enabled` flag (only fires once `leakageV2` is confirmed) and
      uses `retry: false` with no error surfaced to the page's main error banner — a secondary,
      independently-flagged panel shouldn't block or scare the user if its own rollout flag is off.
- [x] New `src/pages/leakage-map/opportunities-panel.tsx` — `OpportunitiesPanel` renders as its own
      bordered section below the rollups/cell grid, titled "Missed opportunities" with an explicit
      "Separate from leakage above — upside, never netted against it" line. No shared state, no
      shared totals, no code path that could combine a leakage figure with an opportunity figure.
- [x] `candidateCount` rendered for a `POPULATED` cell with no `amounts`, labelled "N candidates
      (unpriced)" rather than a dollar figure — the doc's "evidence-backed but deliberately
      unpriced" case.
- [x] Each `amounts[]` entry (currency/calibration) renders as its own row — never summed, same
      discipline as leakage rollups.
- [x] **The handoff doc gives no query parameters for this route at all** (unlike `GET /leakage`,
      which has an explicit params list) — confirmed live, called with none, and it worked.
- [x] `npx tsc -b` clean.
- [x] **Live-verified 2026-10-01** — real `200` response, `contractVersion: "1.0"`, one cell
      (`product_deepening` under the `expand` stage, `UNKNOWN` state, zero candidates — this
      workspace has no connected source for it). Rendered correctly: separate panel, own
      limitations callout, stage-grouped like the leakage grid. Zero console errors. **Not yet
      live-exercised: a `POPULATED` cell with real `amounts[]`** — this workspace's opportunities
      data is as thin as its leakage data, so the priced-candidate rendering path is built to the
      documented shape but unconfirmed against a real example.

### Step 6 — Loading/error states — ☐ not started
Per the doc's "Loading, errors and transport" section — both endpoints here are plain GETs, no SSE:
- [ ] Initial skeleton while no projection exists yet.
- [ ] Stale-while-loading overlay on control changes (grid stays visible).
- [ ] Empty-map state when cells exist but none pass the active filters.
- [ ] Explicit "V2 publication unavailable/incomplete" error + retry — this is the
      flag-on-but-publication-missing case from the table above, don't let it look like a generic
      network error.
- [ ] Cancel superseded filter requests; ignore a late response whose URL is no longer selected.

### Step 7 — Docs — ☐ not started
- [ ] Add the two new endpoints to `docs/endpoints/leakage.md` (per [[endpoint_docs_convention]]).
- [ ] Tick off steps in this file as they land, same convention as `build-plan.md`.

## Visual redesign pass (2026-10-02)

Resumed once the design hold (above) was lifted. Built section by section, each piece reviewed
live against a screenshot before moving to the next — no guess shipped without the user seeing it
first this time.

- **V2KpiStrip → 4 cards** (`v2-kpi-strip.tsx`), replacing the original 3-tile `KpiCards` strip:
  - **Total at risk** — `rollups[dimension="total"].amount` at *full* precision (`formatMoney`, a
    new non-compact formatter), not the usual `formatCompactMoney` — this is the one hero number on
    the page. Eyebrow folds in `controls.mode`/`.horizon`. Subtext: count of `POPULATED` cells over
    total cells, plus "all {lifecycleClass}" when every priced amount shares one class.
  - **Candidates flagged** — sum of `amounts[].candidateCount` across priced cells, broken down by
    mechanism label. Matched the user's own claude.ai-session reference exactly once real data was
    used (37 Dormant Accounts + 6 Attrition = 43).
  - **Effective coverage** — `coverage.effective` as a thin progress bar instead of bare text.
  - **Lowest confidence** — the *minimum* `confidence` across priced amounts, explicitly labeled
    "Lowest" (not "Confidence") so it reads as a worst-case flag, not an implied average — averaging
    across cells of different mechanisms/currencies would be exactly the client-side metric-blending
    [[feedback_no_frontend_business_math]] bars.
  - **Color saga**: hero card went black (copying the user's reference literally) → rejected as "not
    our app's color" → tried `bg-ultra` (blue) → rejected again, user wanted something "close to
    red" → landed on `bg-rose`, this app's own critical/danger token (same solid-fill pairing as
    `reject-play-modal.tsx`'s selected state) — a semantic fit for "at risk," not an invented color.
- **V2CoverageCard + V2LimitationsCard** (`v2-coverage-limitations.tsx`), side by side in a
  `grid lg:grid-cols-2`, replacing the old flat amber `Callout`:
  - Coverage: `capability`/`scope`/`freshness`/`quality` as 4 labeled thin bars (the real gap caught
    in the rejected first pass), plus "Signals measured" and "Unknown units" stats, reusing the
    nested `bg-paper-2` card pattern from V1's own `CoveragePanel`.
  - Limitations ("Why the number is partial"): the real 1,063-entry `limitations[]` array turns out
    to only ever be 4 known sentence templates (regex-matched) plus an "Other" catch-all for
    anything unrecognized — confirmed against a real captured response (`leakageresponse.json`,
    user-pasted): Measured/missing-impact 877, Unpriced-in-other-currencies 180 (CAD 32/EUR 55/GBP
    49/NGN 44, exact match to the reference), No-prior-baseline 97 (parsed out of the sentence
    itself — that template bundles its own count, it isn't 97 separate lines), Detectors-awaiting-
    data 4 (resolved to real mechanism labels, not hardcoded). "View all limitations" opens the full
    UUID-deduped list in a `Dialog`, not inline (moved there on request — was buried at the bottom
    of a tall inline list).
  - Currency-breakdown segment colors and the 4 coverage bars both got the "use our actual colors,
    multiple is fine for these" exception from the user — `ultra`/`teal`/`amber`/`rose` in a fixed
    (not count-ranked) order, so an entity keeps its color across filter changes.
- **LeakageV2Rollups redesigned** (`v2-rollups.tsx`) — the specific thing called out as wasting
  space. Was 6 full-width sections each with its own uppercase header (mostly 1-2 rows each in real
  data). Now a responsive grid of small nested `bg-paper-2` cards, one per dimension, no
  collapse/expand needed anymore since the grid itself is compact. `total` stays promoted to the
  KPI strip; `stage` now lives in each Mechanisms column instead of here.
- **Cells redesigned as severity-shaded tiles** (`v2-cell-grid.tsx`), confirmed V1's row-by-column
  grid genuinely cannot apply to V2 (handoff doc's own "do not hard-code 'customer stage'" line,
  Rendering rules section, plus live confirmation that different mechanisms don't even share a
  state dimension). Tiles reuse V1's literal `HEAT_SCALE`/`HEAT_TEXT_CLASS` tokens from `data.ts` —
  shaded by the cell's own `severity` (S1–S5) compressed into the scale's 4 steps (S4/S5 share the
  darkest step — **known limitation: they're currently visually indistinguishable by color alone**,
  only the printed "Severity S4"/"S5" text differs). `UNKNOWN` cells keep the dashed/muted
  "unmeasured" treatment, never heat-shaded. The section's own heading was dropped per request
  (just a description paragraph now, no "Mechanisms" title) and moved to sit *above* Coverage/
  Limitations in page order. No em dashes in any of this copy, including a general sweep that also
  fixed `opportunities-panel.tsx`'s description.

## Step 8 — Cell detail, Evidence, Learn Why (2026-10-02) — ✅ done, not live-verified

- **`GET /leakage/cells/{cellId}`** → `V2CellDetailDialogContent` (`v2-cell-detail-dialog.tsx`), a
  quick-glance `Dialog` opened by clicking any mechanism tile: components/signals/lineage/case info,
  footer has "Learn why" + "View full evidence."
- **`GET /leakage/cells/{cellId}/evidence`** → `V2CellEvidenceSheetContent`
  (`v2-cell-evidence-sheet.tsx`), a `Sheet` (not a `Dialog` — deliberately, see below) for the wider
  stuff Evidence adds on top of cell detail: `coverage[]`, `calculationPolicies[]`/
  `calculationFormulas[]`, `suggestedActions[]`, richer `lineage[]` (adds `explanation`/
  `missingRequirements`/`candidates[]`).
  - **Why Sheet, not Dialog**: reasoned from actual content shape, not just precedent — Evidence has
    ~8 sections vs cell detail's 3, including `calculationPolicies` rows with 16 fields each. A
    centered modal would cramp that; a slide-over has the room.
  - **Real schema corrections** (2026-10-02, from Scalar "Test Request" examples the user pasted —
    see `get-leakage-cell-evidence.ts`): the original doc-prose-only scaffold had 3 real mistakes —
    `coverage` is `LeakageCoverageSignalEntry[]` (reused from the standalone `/leakage/coverage`
    route's own `signals[]` shape), not a copy of the page-level summary; "calculation
    policies/formulas" is **two separate fields** (`calculationPolicies[]` + `calculationFormulas[]`),
    not one nested `calculation` object; the "permitted actions" field is actually named
    **`suggestedActions`**, not `actions`.
  - Same Sheet/Dialog never nest simultaneously as Evidence/Case below — one `view` state on
    `CellTile` (`"detail" | "evidence" | "case" | null`) drives all three overlays, since Sheet
    shares the same underlying Radix `Dialog.Root` family as Dialog and two stacked at once is
    exactly the [[preact_radix_dialog_crash]] scenario.
- **`POST /leakage/cells/{cellId}/learn-why`** wired into the detail dialog's footer — same
  fire-and-navigate pattern V1's own `CellDetailCard` already uses
  (`learnWhy(..., { onSuccess: (res) => navigate(\`/conversations/${res.data.conversationId}\`) } )`).
  The actual SSE streaming/reconnect/answer-rendering all happen on the existing `/conversations/
  {id}` route — nothing reimplemented here. Shown only when `hasLeakToExplain` (`POPULATED` + a
  nonzero primary amount) — mirrors V1's own two-refusal rule ("a gap isn't a question, a real zero
  is a result not a gap") by analogy; the V2 doc doesn't restate this rule explicitly for this route.
- **Main page schema cross-checked clean** (2026-10-02, against a real Scalar `GET /leakage` paste):
  every field in `LeakageV2Controls`/`LeakageV2Cell`/`LeakageV2Rollup`/`LeakageV2CoverageSummary`
  matched exactly — **no corrections needed**, unlike evidence/room/cutover-readiness below.
- **`GET /leakage/cutover-readiness`** types corrected too (`get-leakage-cutover-readiness.ts`) —
  the prose-only scaffold was missing 5 real fields (`contractVersion`, `hasActivePublication`,
  `publishedSnapshots`, `rollbackAvailable`, `retirementApproved`). Fixed for correctness; still not
  wired into any page, and the doc itself says this route is unlikely to ever need a UI.

## Step 9 — Case + Room lifecycle (2026-10-02) — ✅ done, mostly not live-verified

All 7 case/room routes now wired, via a new `V2CaseSheetContent` (`v2-case-sheet.tsx`), a `Sheet`
opened from "View case" on the detail dialog's Case card (same `view`-state architecture as Step 8).

- **`POST /cells/{cellId}/case`** (create) — wired from the detail dialog's footer, gated on
  `hasLeakToExplain` *and* `workState.state === "READY"`. **Real bug caught live**: `READY` alone
  isn't sufficient — the server refused a READY-but-unpriced cell with *"A case can only be opened
  for a populated finding with measured exposure."* Tightened the gate to require both.
- **`GET /cases/{caseId}`** (read) — drives both the compact Case card in the quick dialog and the
  full Case Sheet.
- **`workState.state` type was too narrow** — originally scaffolded as `"UNREADY" | "READY"` only;
  re-reading the doc ("the current case status after creation") shows it also becomes one of
  `RevenueLeakCaseStatus` once a case exists. Widened before building case UI on top of it
  (`get-leakage-cell-v2.ts`).
- **`PUT /cases/{caseId}/owner`** — ~~"Assign to me" only, no full member picker (the doc says "a
  non-admin can assign only themselves," and there's no workspace-members endpoint available here
  anyway)~~ **corrected 2026-10-02**: that "no workspace-members endpoint available" claim was wrong
  — never actually checked against `apiConfig.ts`, which already has `GET /workspace/members`
  (`useGetWorkspaceMembers`), already used for this exact pattern elsewhere
  (`rooms/modals/assign-owner-modal.tsx`). Reworked to a real `SearchableSelect` picker over the
  active human roster, with a typed reason (previously hardcoded `"Self-assigned"`), plus a quick
  "Assign to me" shortcut that just pre-fills the picker rather than auto-submitting. The owner stat
  on both the Sheet's hero card and the cell-detail dialog's compact `CaseInfo` now resolves the raw
  `ownerUserId` to a real name via a shared `resolveOwnerName` helper instead of showing the bare
  UUID. Still no role check — "a non-admin can assign only themselves" is left to the server to
  enforce and surface via the existing error toast, same discipline as the transition graph below.
- **Owner assignment is gated by case status — confirmed live 2026-10-02, three real attempts**:
  - `DETECTED` (first-ever assignment, no prior owner) → **succeeded**. The response's own
    `auditTrail` shows the server auto-advancing the case `DETECTED → REVIEWED → ASSIGNED` inside
    that one `PUT /owner` call — `REVIEWED` gets a server-written reason ("Reviewed while assigning
    an accountable owner"), `ASSIGNED` gets the reason actually typed into the form.
  - `ASSIGNED` (reassigning to someone else while already in that status) → **succeeded**.
  - `WORKED` → **rejected**, *"A case must be reviewed before it can be assigned."*
  
  All three used the identical request shape (`{ ownerUserId, reason }`), so the status is the only
  variable. The evidence-backed rule: **the owner can be set at or before `ASSIGNED` (the server
  auto-advances an earlier case up to it), but once the case has moved past `ASSIGNED` — into
  `WORKED` or anything further down the lifecycle — the owner is locked**, and the server reuses the
  same "must be reviewed" message for that case even though it doesn't literally apply anymore. Not
  confirmed against the doc or a schema, purely inferred from these three live responses — an
  earlier version of this note wrongly treated `DETECTED` as a rejection too (it isn't; that
  conclusion was never actually tested, just assumed from context) and wrongly framed the rule as
  blocking both "too early" and "too late" with the same message (it only blocks "too late"). Not
  fixed client-side — the "Reassign owner" card still offers the picker regardless of status;
  folding into the same backend question below rather than building a client-side status gate on an
  inferred-not-confirmed rule.
- **`POST /cases/{caseId}/transitions`** — every non-`VERIFIED` status offered (`VERIFIED` excluded
  at the type level, `LeakageCaseTransitionTarget = Exclude<RevenueLeakCaseStatus, "VERIFIED">`, per
  "the client must never submit VERIFIED"); no transition graph enforced client-side — the server is
  the source of truth for which moves are actually legal from the current status, same discipline as
  Learn Why's gating.
- **Real transition rejection caught live (2026-10-02)**: `WORKED → REVIEWED` was refused —
  *"A case in state 'Worked' cannot transition to 'Reviewed'."* Neither `leakage.md` nor the frontend
  handoff doc states the actual `RevenueLeakCaseStatus` transition graph (handoff doc only says a
  transition "advances the lifecycle"), and a Scalar schema wouldn't help either — a transition graph
  is runtime business logic, not something an OpenAPI enum normally encodes. **To ask the backend
  team**: the full allowed-transitions table for `RevenueLeakCaseStatus` (which target statuses are
  legal from each current status), so the "Move status" dropdown can eventually filter to only the
  moves that are actually legal instead of offering all 7 and letting the server reject the bad ones.
  **Now also ask**: confirm the owner-assignment rule inferred above — succeeds at or before
  `ASSIGNED` (auto-advancing an earlier case up to it), rejected once past `ASSIGNED` (e.g.
  `WORKED`) — and get the exact boundary (is `ASSIGNED` itself always reachable this way, or only up
  to `REVIEWED` with the final `ASSIGNED` step sometimes blocked too?). If confirmed, the "Reassign
  owner" card should get its own status gate (disable/explain once the case is past `ASSIGNED`) the
  same way "Move status" would benefit from the transition table — not built yet, since this is
  still inferred from three live responses, not doc-confirmed.
- **`PUT /cases/{caseId}/due-date`** — **real bug caught live**: the server refused a past date
  ("A revised due date must be in the future") that the (then-native) date input let get submitted
  with zero warning. Added `min`/`max` (tomorrow through 365 days out, per the doc's own "future
  date within 365 days" rule) plus a client-side check before the submit button even enables.
- **`POST /cases/{caseId}/decisions`** — text + reason form, decisions list shown above it.
- **`POST /cases/{caseId}/room`** — **two real bugs caught from a pasted Scalar schema**, fixed in
  `open-room-on-leakage-case.ts`: (1) the response `data` is a **bare string** (the room id itself),
  not `{ roomId: string }` as first scaffolded; (2) `lifecycleClass`/`mode` in the request body use
  **PascalCase** (`"InFlight"`, `"Gross"`) — a *third* casing convention on top of the lowercase
  filter options and UPPERCASE record fields already documented above. Added `toRoomLifecycleClass`/
  `toRoomMode` converters so the page's own lowercase filter values can never be sent here as-is by
  mistake. Room is scoped from the triggering cell's own primary amount (currency/lifecycleClass/
  mode), per the doc's "supply enough dimensions to select exactly one amount."
- **No case-list endpoint exists** — only `GET /cases/{caseId}` by known id, never `GET /cases`
  (plural). A case is only ever reachable by going back to the mechanism tile it came from; once a
  Room is opened on it, that Room *is* separately findable via the existing `/rooms` index, but the
  Case object itself has no browsable list. Flagged to the user as a real backend gap, not a UI
  choice.
- **Date-picker detour, tried and reverted**: attempted a styled `Calendar`+`Popover` replacement
  for the due-date field's native `<input type="date">` (month/year jump via Radix `Select` nested
  inside the Popover). Broke immediately — Radix `Select` is modal by default and its focus-trap
  closes a parent `Popover` even with the standard nested-dismissable-layer pointer-down guard (the
  same class of bug `searchable-select.tsx` already worked around once, see
  [[preact_radix_dialog_crash]] — that file is built on plain buttons instead of `Select` for
  exactly this reason, which the next attempt at this should reuse). Also found and fixed, while
  debugging, that `popover.tsx` itself never had the nested-layer `onPointerDownOutside` guard
  `dialog.tsx`/`sheet.tsx` already have — not a date-picker-specific fix, a real standing gap in a
  shared primitive, but it alone wasn't enough to fix the modal-Select issue, so it was reverted
  along with everything else per the user's explicit "revert everything you did to it." **Current
  state: back to the plain native `<input type="date">`** with `min`/`max` validation — still
  functionally correct, just visually unstyled. Revisit with the `searchable-select.tsx`-style
  plain-button approach (not `Select`) if this needs to look better later.
- **Case Sheet layout, iterated live**: status/owner/due-date collapsed from 3 separate
  full-width-divided sections into one compact nested-card summary (per "status taking unnecessary
  space" feedback); all action buttons (`Update due date`/`Move case`/`Add decision`/`Open a room`)
  made full-width and switched from `variant="outline"` to `variant="default"` (`bg-ultra`, this
  app's real primary-action color, same convention as the proposal-approval dialog's "Accept"
  button) — they'd been rendering pale/grey.

## Current endpoint status (2026-10-02)

10 of the handoff doc's 14 scaffolded `/leakage/*` V2 routes are wired (plus the 2 original-scope
endpoints, `GET /leakage` and `GET /opportunities`, done since 2026-10-01):

| Wired | Not wired |
|---|---|
| `GET /leakage` (dual-contract) | `GET /leakage/cells/{cellId}/history` |
| `GET /opportunities` | `GET /leakage/coverage` (standalone) |
| `GET /leakage/cells/{cellId}` | `GET /leakage/calculation` (standalone) |
| `GET /leakage/cells/{cellId}/evidence` | `GET /leakage/cutover-readiness` (doc itself says unlikely to ever need a UI) |
| `POST /leakage/cells/{cellId}/learn-why` | |
| `POST /leakage/cells/{cellId}/case` | |
| `GET /leakage/cases/{caseId}` | |
| `PUT /leakage/cases/{caseId}/owner` | |
| `POST /leakage/cases/{caseId}/transitions` | |
| `PUT /leakage/cases/{caseId}/due-date` | |
| `POST /leakage/cases/{caseId}/decisions` | |
| `POST /leakage/cases/{caseId}/room` | |

**Nothing built 2026-10-02 has been live-verified against a real response yet** — unlike the
2026-10-01 work (main page, filters, rollups, opportunities), which all were. That's the single
biggest outstanding risk: the evidence/case/room shapes are now *schema-correct* (several real bugs
already caught from pasted Scalar examples), but none of the actual interaction flows — opening a
case, transitioning it, opening a Room from it — have been clicked through against the live backend.

## Q&A log (2026-10-02)

Questions the user asked mid-build, kept here since the answers are load-bearing for how things got
built, not just incidental chat:

- **"Did the API remove `window` or did it just change pattern?"** → Genuinely gone from the V2
  contract specifically, not renamed. `GET /leakage` is one shared URL serving both contracts, so
  its Scalar schema lists the *union* of both — `window`/`calculate`/`minSeverity`/`minConfidence`
  are V1-only, still sent by legacy callers on the same route. V2's own `controls` object (real
  response + schema) has no `window` field at all; V2 collapsed V1's `window`+`horizon` pair into
  `horizon` alone.
- **"Can the V2 cells still use V1's grid/matrix design?"** → No — confirmed from the doc's own
  "Rendering rules" section ("do not hard-code 'customer stage'") and live data (different
  mechanisms use entirely different state dimensions, don't even share a second axis).
- **"Can the ten stage cards (StageRail) still be populated for V2?"** → No — `LeakagePageV2` has no
  `stages` field at all (V1's `LeakagePageData.stages: LeakageStageCardDto[]` has no V2 equivalent),
  structurally absent, same situation as `window`. The closest V2 has is the `rollups[dimension=
  "stage"]` entries (just 3 possible values: engage/renew/retain), already surfaced as each
  Mechanisms column's subtotal, not a separate card row.
- **"What is the shading measured against?"** → The cell's own `severity` field (S1–S5, "the
  workspace's own per-currency materiality ladder," per the main endpoint's own doc text) — an
  absolute per-cell scale, never a relative ranking against other cards on screen or against dollar
  amount.
- **"Is Case different from Room?"** → Yes — doc is explicit: "the case owns accountability and
  business lifecycle, the Room is its collaboration surface... do not infer case status from Room
  status." Case = tracking/accountability record (status, owner, due date, decisions, audit trail).
  Room = this app's existing, Case-agnostic collaboration feature. A case can exist with no Room;
  opening one links `case.roomId`.
- **"Once I create a case, where do I see it before the other actions?"** → Nowhere but back through
  its own cell — no `GET /cases` list endpoint exists (see Step 9 above).
- **Evidence vs cell detail vs Learn Why, and whether Evidence inherits the cell detail's query
  params** → Evidence is a strict superset of cell detail's fields. Learn Why internally snapshots
  the *same* evidence bundle server-side before queuing the agent run, and the doc requires matching
  controls between the two or the run fails closed — confirmed both routes take the identical
  `mode`/`horizon`/`horizonDays`/`lifecycleClass` params as cell detail, reinforcing why they should
  (and do) share one params object from the page's active filters, not two independently-sourced
  ones.

## Verification

Same as V1: run the dev server on `localhost:3000` (CORS-approved origin), load `/leakage-map`
against the real backend, and check the network tab's actual response against what the code
assumes — **this time for both a legacy company and a flagged-in one**, since the whole point of the
dual-contract design is that both must keep working side by side. Kill the dev server when done, per
[[always_kill_dev_servers]].
