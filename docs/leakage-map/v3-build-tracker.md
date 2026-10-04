# Leakage Map V3: section build tracker

Page: `/leakage-map` (`src/pages/leakage-map/`). Built one section at a time, each checked against the live
`GET /api/v3/leakage` before the next starts. Design reference (ideas only, the contract wins):
`flolyt-figma-designs/New-pages-pattern/new-leakagemap-design-check/Revenue Leakage Map-png-new-set/All markets — live payload (3 Oct).png`.
Context, decisions and contract conflicts: [v3-rebuild-plan.md](v3-rebuild-plan.md).

Every section reads the one `useGetLeakage(params)` result; none fetches separately. Money is always
shown per currency, never combined (no FX). Unassigned market is a bucket, not a country.

| # | Section | Reads | Status |
|---|---|---|---|
| 0 | Shell: header, URL state, skeleton, full-page error, stale-while-loading, legacy notice | `publication`, `controls` | DONE, live-verified |
| 1 | Filter bar: market, currency, mode, horizon (+custom days), more filters | `controls`, `executive.recommendedMode` | DONE, live-verified (see notes) |
| 2 | Expected loss over the next N days (one card per currency, "no combined total", partial banner) | `executive.totals`, `executive.confidence`, `summary.measurementState`, `executive.fxState` | TODO |
| 3 | By market (market row, Unassigned card) | `executive.markets`, `executive.marketInventory` | TODO |
| 4 | Key findings | `executive.keyFindings` | TODO |
| 5 | Where revenue leaks (currency tabs, cells, case/Room/detail entry points) | `cells`, `summary.materialLeaks` | TODO |
| 6 | Readiness | `readiness` | TODO |
| 7 | Measurement (+ link to diagnostics drawer) | `summary.measurement`, `coverageExplanation`, `limitationSummary` | TODO |
| 8 | Footer line (snapshot, run, registry, contract) | `publication` | TODO |
| later | Single-market view polish, market matrix, limitations drawer, exact calculation drawer, missed opportunities (no entry point yet since the old tab was archived) | | TODO |

## Section 0 and 1 notes (2026-10-04)

- **URL vs state:** `market` and `currency` are URL search params (they decide which view you are on);
  mode, horizon, custom days and the four "more filters" are plain state.
- **Default mode** is `expected` (the handoff says `recommendedMode` is always EXPECTED); the mode toggle
  tags the server's recommended mode with REC.
- **Market control** is single-select (the contract takes one `market`). Up to 5 real markets it is a
  segmented control with Unassigned as a dashed last option; above that, a searchable list. The design's
  middle "top five plus overflow" tier needs a per-market ranking the contract does not give across
  currencies, so it is not built. Market names come from `Intl.DisplayNames` (cosmetic).
- **Currency control** only shows with 2+ currencies.
- **No Radix Select** anywhere in the bar: every control is Popover-based with plain buttons, to avoid the
  Select+Popover aria-hidden bug.
- **Live check:** run against the saved `ichigo` session, a different workspace from the financial-services one
  in the pasted payload: marketplace sector, a single market (NG), one currency, no Unassigned. Confirmed:
  request params follow the controls (`mode=net&horizon=30&market=NG`), breadcrumb and H1 switch to
  "Nigeria", the previous figures stay mounted while refetching. **Not yet seen live:** multiple currencies,
  the Unassigned option, the searchable (6+ markets) form, the custom-days input.
- A single 401 console line appeared on load (an unrelated resource, not the leakage calls); not investigated.
