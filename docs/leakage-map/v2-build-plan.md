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

**Update 2026-10-01:** the user asked directly whether cell detail/Learn Why/case-Room were
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

## Verification

Same as V1: run the dev server on `localhost:3000` (CORS-approved origin), load `/leakage-map`
against the real backend, and check the network tab's actual response against what the code
assumes — **this time for both a legacy company and a flagged-in one**, since the whole point of the
dual-contract design is that both must keep working side by side. Kill the dev server when done, per
[[always_kill_dev_servers]].
