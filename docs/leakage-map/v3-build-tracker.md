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
| 2 | Expected loss over the next N days (one card per currency, "no combined total", partial banner) | `executive.totals`, `executive.confidence`, `summary.measurementState`, `executive.fxState` | DONE, live-verified on the real financial-services workspace |
| 3 | By market (market row, Unassigned card) | `executive.markets`, `executive.marketInventory`, `controls.marketOptions` | DONE, live-verified |
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

## Section 2 notes (2026-10-04)

- **Cards:** one per currency + lifecycle class from `executive.totals`, with the reporting currency first and the rest in code order
  (decided with the user 2026-10-04; position only, never ordered by amount). Big number = the server's `selectedAmount`; gross, expected
  and net come from the same bucket with the selected mode emphasised. Low-confidence line = the server's
  `lowConfidenceExpectedLossShare` for that bucket. "Reporting" tag goes on whichever currency equals
  `executive.reportingCurrency` (falls back to `controls.reportingCurrency`); it is display context only.
- **Skeleton** reserves the two notice banners and 5 card placeholders so nothing jumps when data arrives.
- **Title** follows the server's selected mode and `controls.horizonDays` ("Expected loss over the next 90 days").
- **Banner** (`PARTIALLY_MEASURED` / `UNAVAILABLE`) uses the server's `executive.coverageMessage`; the design's
  "What's missing" link is not added until the readiness section exists to scroll to.
- **"No combined total" notice** shows only when `executive.fxState` is `NOT_CONSOLIDATED_NO_APPROVED_FX`.
- **"No amount published" cards** (design's KES card) are derived from `controls.currencies` minus the currencies
  in `totals`, and only when NO market or currency filter is active (under a filter a missing currency was
  filtered out, not unpublished).
- **More than 6 cards** collapse behind "Show N more currencies".
- **Missing `executive`** (old publication) shows a plain "not available for this publication" card, no fallback figures.
- **Currency symbols:** `currencySymbol` / `currencyPrefix` added to `src/lib/format-measured-value.ts` and used by
  `formatCompactMoney` / `formatMoney`, so every page that uses them now shows ₦, US$, €, £, CA$ ... and falls
  back to the ISO code for currencies with no symbol (KES, GHS, ZAR, UGX ...). Affected: rooms list and
  subscriptions, inbox approval view and row text, chat data charts.
- **Live-verified 2026-10-04** with `chad@yopmail.com` (the user's financial-services workspace, saved to its own
  `flolyt-session-storage-state-chad.json`): the real response renders 5 currency cards (NGN first with the Reporting
  tag, then CAD, EUR, GBP, USD), the KES "No amount published" card, the partial banner and the no-combined-total
  notice, with correct symbols. Filter bar also confirmed on this workspace: the market control shows All / NG / KE /
  dashed Unassigned, Currency shows "All 6". At 390px width: no horizontal overflow, the filter bar wraps, cards stack.
  No page errors. Not exercised: the skeleton-to-content jump (fixed by reserving banner and 5-card space), the
  searchable (6+ markets) market form, the custom-days input.
- **Notices row (2026-10-04):** the measurement and no-combined-total notices are two slim toggles that slide open/closed (`Collapse`, a measured-height inline-style animation, same in every browser and in reduced-motion mode; the first CSS grid-row version was dropped because it did not animate for the user).

## Section 3 notes (2026-10-04)

- One box per `executive.markets[]` row, primary market first, rest in API order, Unassigned last and dashed.
  First 4 real markets show, the rest sit behind "Show N more markets"; the Unassigned box always shows.
- Summary line is the four `marketInventory` counts/flag; "Unassigned exposure present" only when
  `hasUnassignedExposure` is true. Box text ("No attributed exposure yet", "Configured, no market-scoped
  measurement") is chosen from `hasMeasurementEvidence` / `isConfigured`, never shown as a zero.
- Amounts are the server's `selectedAmount` per currency, compact, with symbol; affected entities come from
  `affectedEntities[]` ("128 accounts affected"), each unit kept separate.
- Clicking a box sets `market` in the URL (same as the filter bar): verified live for `UNASSIGNED` and `NG`
  (request carries `market=UNASSIGNED` / `market=NG`, H1 and breadcrumb switch). The section is hidden once a
  market is selected, since the single-market view replaces it.
- "Open market matrix" link from the design is not rendered: the matrix page does not exist yet (tracker "later").
- Live on the financial-services workspace: KE and NG show "No attributed exposure yet", Unassigned holds
  CA$1.5k, €1.5k, £1.1k, ₦2.4M, US$2k and 128 accounts. 390px width: boxes stack, no overflow, no page errors.
- Not exercised live: more than 4 markets (the "Show more" collapse), a market with attributed amounts.
