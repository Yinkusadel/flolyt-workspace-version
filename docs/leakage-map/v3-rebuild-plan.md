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

## 2. First Figma set (flolyt-figma-designs/New-pages-pattern/new-leakagemap-design-check/Revenue Leakage Map-png/, moved there 2026-10-04)

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
- Next step proposed by me, not yet approved (design now received, see section 6): audit of the (archived) code against the new contract, then
  build starting with the overview, from the user's design when it arrives.
- Reminder for when building: archive/mock-data branch rule (ask to cherry-pick a newly built page onto
  `archive/mock-data` before each API connection), endpoint docs go in `docs/endpoints/{domain}.md`,
  no frontend business math, no hardcoded fallbacks once wired, skeleton loading states, flat URLs.

## 6. New design set (received 2026-10-04, after the contract update)

Location (both sets now live together):
`flolyt-figma-designs/New-pages-pattern/new-leakagemap-design-check/`
- `Revenue Leakage Map-png/` = the FIRST set (pre-contract, 13 PNGs, section 2 above)
- `Revenue Leakage Map-png-new-set/` = the NEW set (16 PNGs, redrawn against the Phase 1-4 contract and
  the 3 Oct live payload)

New-set files: 30 markets + Unassigned matrix; All markets live payload (3 Oct); Calculation policy
overview; Case dialogs; Cell detail drawer; Cell/attribution/case/action states; Coverage explanation and
issues; Diagnostics drawer (limitations); Exact calculation drawer; Legacy renderer (report payload);
Loading/empty/error states; Market selector scaling tiers; Missed opportunities explanation and signals;
One market Kenya (live, nothing attributed); One market Nigeria (illustrative, attributed); Revenue leak
case; Rollout and cutover readiness.

**Reviewed so far (4 of 16):** All markets live payload, 30 markets + Unassigned matrix, Exact calculation
drawer, Market selector. **Not yet reviewed:** the other 12. Same rule as before: the API contract wins,
the design is a source of ideas; correct sections freely and say what changed.

### What the new set fixes versus the first set

- No combined total: a "No combined total, no approved FX rates" notice, and one expected-loss card PER
  currency (NGN marked "Reporting", then USD/EUR/CAD/GBP), each with gross/expected/net and
  "100% of expected loss is low-confidence" (from `executive.confidence[]`). KES with no amount shows
  "No amount published. Not the same as zero".
- By-market strip with a dashed **Unassigned market** card holding all current exposure; Nigeria and Kenya
  show "No attributed exposure yet". Matches the live data where everything is `UNASSIGNED`.
- Key findings grouped per market/currency/lifecycle, never ranked across currencies.
- "Where revenue leaks" keeps currency tabs; cells carry an Unassigned chip, "Severity not rated",
  Low confidence, Compound; unmeasured cells say what they need and offer "Review source mappings".
- Readiness list (Action/Waiting/Platform rows) beside a Measurement panel (priced findings 240,
  can't-be-priced 915, etc., "counts are separate, never added together"), link "All 1,108 diagnostics".
- 30-market page: "Each market's own" currency, key findings by market, market x leak-type matrix,
  Unassigned pinned last with a "currency proven, market not, never assigned from currency" label.
- Exact calculation drawer: selected amount, reconciled badge with delta/tolerance, four included totals,
  candidate table (impact x ramp = gross x prob = expected x (1-rec) = net, contribution; excluded
  candidates struck through with "Correlated with Attrition", contribution 0), correlation / range /
  baseline / assumptions cards, copyable reference, and a "calculation detail unavailable" failure state
  that does not substitute the newest calculation.
- Market selector: Unassigned added as its own dashed entry in all three densities, always last.

### Remaining conflicts to correct while building (still the contract's call, not the design's)

1. **Multi-select market with Apply** is still drawn, but the contract takes one `market` value. Build
   single-select (plus the Unassigned entry) unless backend confirms multi-select.
2. **Region grouping / "Sort: Region" / region chips** have no field in the contract. Needs a hardcoded
   country-to-region map or is dropped. The whole 30-market page is illustrative data except Unassigned.
3. **Per-market "Low-conf. share" column and "Markets needing action 30"**: the contract gives the
   low-confidence share per currency+lifecycle (`executive.confidence[]`), not per market, and readiness is
   workspace-wide, not per market. Derive neither per market; per-market confidence is only available on
   each market's `largestMechanisms[]`.
4. **Calculation drawer candidate columns** (impact, ramp, probability, recovery) are illustrative; the
   `calculation/detail` component field names are still unseen live. Build the table from the real
   response once it is captured; do not assume those four columns exist.
5. **Cross-market totals on the 30-market page** ("Expected" per market in one column, Mix bars) are fine
   only when each row stays in its own currency; the "Currency: Each market's own" default is correct. Any
   cross-currency sort/rank needs the currency picked first.
6. A `Needs action` filter chip in the selector has no backing field.

### Test data reality (unchanged)

The only live payload has all money in the Unassigned market, KE/NG empty. The "One market Nigeria
(illustrative, attributed)" and 30-market screens are mock data; build and verify against the live
Unassigned-only shape first.
