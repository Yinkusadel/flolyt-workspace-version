# Leakage Map: V3 rebuild plan (2026-10-04)

Branch: `update-leakagemap-page-3` (pushed once for the handoff doc; later commits local until asked).

This records the decisions and Q&A from the session where the updated backend handoff arrived and the
user decided to restart the Leakage Map page from scratch. Read it before resuming. The contract itself
is `leakage-map-v2-frontend-handoff.md` (now the Phase 1-4 version, replacing the older Phase 7 one).

## 1. What changed in the contract (old handoff vs new)

Nothing was removed. Additions:

**Changed endpoints**

- `GET /api/v3/leakage`
  - new `currency` query param, separate from `market`; `market=UNASSIGNED` filters unattributed exposure
  - `controls` adds `currency`, `marketOptions[]` (market, currency, isPrimary), `reportingCurrency`
  - `rollups` can have `dimension: currency`; market rollup keeps the `UNASSIGNED` bucket
  - new blocks: `summary` (measurementState, actionableExposure, materialLeaks, measurement counts),
    `readiness`, `limitationSummary` (replaces the `limitations` strings; never render both),
    `executive` (marketInventory, totals, markets, keyFindings, confidence, matrix, publicationCoverage,
    recommendedBreakdown, showSectorBreakdown), `coverageExplanation` (headline, effectiveCoverage,
    explanation, issues[] in 5 categories)
- `GET /api/v3/opportunities`: cell `explanation` ("Transaction growth readiness"), optional
  `signalCount` + `signalPreview[]` (max 20), all unpriced for now (definition v1.2.0)

**New endpoints**

- `GET /api/v3/leakage/limitations?offset&limit&code` (paginated diagnostics drawer)
- `GET /api/v3/leakage/calculation/detail?calculationReference=` (exact calculation drawer; reference is
  opaque; old pre-Phase-3 references do not resolve)

**Small**

- cell-detail observations carry an `attribution` object
- doc inconsistency: `workState` type says `revenueLeakCaseId`, prose says `workState.caseId`. Unconfirmed.
  Check a live response before relying on either.

**Unchanged**: history, evidence, learn-why, `/coverage`, `/calculation`, the whole case/Room route set,
cutover-readiness.

## 2. Figma designs (flolyt-figma-designs/New-pages-pattern/Revenue Leakage Map-png/)

13 PNGs, made BEFORE the new contract. Viewed: All markets, 30 markets matrix, Market selector, Coverage
detail. Not viewed: the other nine (cell drawer, case, case dialogs, calculation, states, opportunities,
rollout).

**Decision: do not redo the Figma. It is a source of design ideas only; the API contract is the source of
truth.** Pick sections that work and freely correct them to fit the API. No designer brief is needed.
Mention any section dropped or reworked.

Ideas worth taking: currency tabs on the leak cards, by-market strip, market x leak-type matrix,
readiness panel ("Unlock more of the map"), "why some leakage isn't counted" bars, partial-measurement
banner, three-density market selector.

Conflicts with the contract (fix or drop, do not copy):

1. **No cross-market ranking or totals.** The 30-market page uses "N eq." totals, top-10 ranking and
   "Top 3 share". The contract has no FX (`fxState: NOT_CONSOLIDATED_NO_APPROVED_FX`), so no converted
   total and no cross-currency ranking. Allowed: all markets together in one table/matrix, each in its own
   currency; ranking and totals within ONE selected currency (currency tabs); non-money counts. Not
   allowed: summing or ranking across currencies, unless product and backend approve an FX source.
2. **Region grouping** (East Africa etc.) has no field in the contract. Needs a hardcoded country-to-region
   map or must be dropped.
3. **Market selector** is multi-select with Apply, but the contract takes a single `market`. Confirm with
   backend or build single-select. Options come from `marketOptions` (pairs); `currency` is its own filter;
   include an Unassigned market entry; per-market money in the menu must be per currency; the
   "Needs action" chip has no backing field.
4. **"Lowest confidence 0.35 / Low"** (in the design and the current page) is forbidden. Use
   `executive.confidence[]`: "30% of USD expected loss is associated with low-confidence findings".
5. Needs a separate currency control beside the market selector.

Missing from the design (build anyway): Unassigned market bucket, `executive.keyFindings[]`, exact
calculation drawer, coverage `issues[]` categories, opportunity `explanation` + `signalPreview`.

## 3. Why the rebuild

The current page "went from poor to terrible" once multiple markets appeared: each cell stacks one amount
per currency per market (see the two screenshots: Dormant Accounts card with CAD/EUR/GBP/NGN/USD stacked,
cards unequal heights, dashed Unknown cards stretched in the Retain row). Markets can reach 30, so the new
page must stay clean at that scale.

## 4. Archive decision (DONE, 2026-10-04)

- `git mv src/pages/leakage-map -> src/oldpages/revenue/leakage-map-v2-first-build/` (30 files).
  `src/oldpages/revenue/leakage-map/` already existed (the mock-era page), hence the distinct name.
- The 20 archived files' `@/pages/leakage-map/...` imports rewritten to the new archive path; one
  comment in `features/ai-conversations/map-suggested-action-target.ts` repointed.
- New stub `src/pages/leakage-map/index.tsx` (heading only) keeps the `/leakage-map` route, sidebar entry
  and chat/Room deep links working. Route and sidebar untouched.
- `src/features/leakage/*` (23 hooks) deliberately left in place: the live data layer; extend for the new
  fields (`currency`, `executive`, `readiness`, `limitations`, `calculation/detail`).
- `npx tsc -b` clean after the move.
- Rejected alternatives: new route (breaks flat-URL rule, leaves two live entries, breaks deep links),
  delete (convention is archive), edit in place (nothing worth keeping).

## 5. Open items / questions for the user and backend

- Reuse the wired case sheet, history sheet and evidence sheet logic in the new page (restyle) or rebuild?
  Recommended: keep the logic, restyle. Unanswered.
- Ask backend: multi-select markets? a region field? per-market reporting-currency amounts / approved FX?
- Confirm `workState.caseId` vs `revenueLeakCaseId` against a live response.
- Next step proposed by me, not yet approved: audit of the (archived) code against the new contract, then
  build starting with the overview, from the user's design when it arrives.
- Reminder for when building: archive/mock-data branch rule (ask to cherry-pick a newly built page onto
  `archive/mock-data` before each API connection), endpoint docs go in `docs/endpoints/{domain}.md`,
  no frontend business math, no hardcoded fallbacks once wired, skeleton loading states, flat URLs.
