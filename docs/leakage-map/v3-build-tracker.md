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
| 4 | Key findings | `executive.keyFindings`, `cells` (stage chip) | DONE, live-verified |
| 5a | Where revenue leaks: cards (currency tabs, stage groups) | `cells`, `executive.showSectorBreakdown` | DONE, live-verified |
| 5b | Cell drawer: header, case strip, per-currency table, Summary/Components/Signals/Sources/History tabs, case view, Learn Why button | `/cells/{id}`, `/history`, `workState`, case routes | DONE (reads live-verified; mutations NOT yet submitted live, see notes) |
| 5c | Evidence view / "Why this number" tab, "How calculated" exact-calculation drawer | `/cells/{id}/evidence`, `/calculation/detail` | TODO |
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

## Section 4 notes (2026-10-04)

- Rows come straight from `executive.keyFindings[]`, grouped by market + lifecycle (primary market first,
  Unassigned last, dashed header), ordered inside a group by currency code with the reporting currency first.
  Never ordered by amount or ranked across currencies.
- Amount = the server's `selectedAmount`, so it follows the mode toggle. Live: switching Expected -> Net changed
  the same findings' figures (CA$845.32 -> CA$507.19). The API also re-picks the largest mechanism per mode
  (Gross had Attrition leading CAD, Expected has Dormant Accounts), so nothing here is fixed text.
- **Deliberately left out:** the design's "57% of CAD exposure" bar. The API sends no share, and computing one
  would mean combining two fields client-side (the no-frontend-math rule).
- Stage chip (ENGAGE) is looked up from the finding's `cellIds[0]` in `cells[]`; omitted when not found.
- Mechanism dot colour is a stable hash of the mechanism key (`mechanismDotClass`), purely visual, reusable by
  the leak cards in section 5.
- Confidence shows three bars + the server's `confidenceLevel` word ("Not rated" when absent).
- Footnote "Kenya and Nigeria have no findings: no amount is attributed to them yet" is built from
  `executive.markets[]` rows that have no amounts. In a single-market view with no findings the section shows an
  explicit "No findings yet ... unknown, not zero" card instead of vanishing.
- **Rows are not clickable yet** (the design's chevron is omitted): there is no cell detail drawer to open until
  section 5. Wire them to it then.
- Live on the financial-services workspace: 5 rows (NGN, CAD, EUR, GBP, USD) under "Unassigned market · In flight",
  all Dormant Accounts / ENGAGE / Low. 390px: no overflow, no page errors.

## Section 5a notes (2026-10-04)

- **Stages are whatever the data has**: one block per distinct `revenueStage`, titled with `revenueStageLabel`, in
  the order the API sends them (user decision: no ordering of our own; live order is Engage, Renew, Retain). With
  `executive.showSectorBreakdown` true and 2+ sectors, stages group under their sector first. No fixed 3 columns:
  each stage is a wrapping grid.
- **Currency tabs** (underline style, ordered reporting-currency first) come from the currencies found in the cells'
  amounts; hidden with a single currency. A cell with no amount in the picked currency says "No amount in X"
  (not zero); `UNKNOWN` cells show "Not measured · <availability phrase>" + the cell's first limitation; `NO_EXPOSURE`
  shows "Measured: no exposure found"; `HIDDEN_BY_FILTER` cells are not drawn.
- **Amount** is the response's `value` (follows the mode toggle; verified live Expected/Net/Gross).
  Meta line = lifecycle + `candidateCount` ("28 candidates", the response's own count, not accounts). Range shown
  only when `range.status` is not UNAVAILABLE. Chips: severity ("not rated" when NOT_AVAILABLE), confidence level,
  Compound facet. "Unassigned" chip when the lead amount's market is UNASSIGNED.
- **Left out on purpose:** the design's "74% of NGN exposure" share (needs client math); the "Review source mappings"
  button on unmeasured cards (the action only exists in cell detail `lineage` / `readiness`, user chose to keep the
  page simple: it lives in Readiness and the drawer); "Start a case" / CASE badge on cards (needs `workState` from
  cell detail, so it moves into the drawer).
- **Footer buttons are wired but not rendered yet**: the card has a "How calculated" link (blue text) and a "Details"
  button (the app's `ultra` blue instead of the design's black), aligned in one row. They only render when
  `onOpenCalculation` / `onOpenDetails` are passed, which happens in step 5b, so no dead buttons ship.
- Live on the financial-services workspace: ENGAGE (Dormant Accounts), RENEW (Overdue Invoice, hatched), RETAIN
  (Attrition + Chargebacks / Failed Payment / Refunds hatched), tabs NGN/CAD/EUR/GBP/USD, 390px no overflow,
  no page errors.

## Section 5b notes (2026-10-04)

- **Drawer** (`src/pages/leakage-map/drawer/`): a right-hand Sheet. Open state is in the URL (`?cell=<id>`, and
  `&panel=case` for the case view), so refresh/share reopens it and Back closes it. Opening pushes history;
  switching panel and closing replace. "Details" and the unmeasured card's "+N more" both open it.
- **Detail, history and Learn Why use only the calculation controls** (mode, horizon, horizonDays, lifecycleClass),
  never the market/currency filters, so the drawer shows the same cell whatever the page is narrowed to.
- **Header and per-currency table render from the card's own data** (no waiting); the case strip and tabs wait for
  `GET /cells/{id}` with their own placeholders. Table = one row per currency with the server's gross, expected,
  net, range, confidence, severity and candidate count; nothing is summed.
- **Case strip** reads `workState`: existing case shows status chip, owner (resolved to a name), due date, "Room
  linked", "Open Room" and "Open case"; READY + populated shows "Start a case"; otherwise the server's explanation
  with the button disabled. Start a case / Open case / Start a room buttons use the app blue (`ultra`).
- **Case view** is the first build's lifecycle panel carried over (owner reassign, due date, status move, decisions,
  Room), restyled, with two changes: the Room is opened against an amount the person picks when the cell has
  several (a Room covers exactly one), and the status picker is plain buttons instead of a Radix Select (stay clear
  of the Select + Popover aria-hidden bug). No transition graph is enforced client-side; the server's message shows.
- **Tabs:** Summary (every limitation in full), Components, Signals (both reveal 20 at a time), Sources (lineage with
  the server's actions; only `sources.*` actions get a button, linking to /data-sources since there is no
  per-capability deep link), History (published snapshots, newest first).
- **Live-verified (reads, chad@yopmail.com):** drawer content for Dormant Accounts (5 currencies; 128 components,
  1043 signals, 1 lineage entry, 3 history points) and for an unmeasured card (2 limitations); existing WORKED case
  (owner Chad Sado, due 9 Oct, Room linked) in the strip and the case view; URL reopen after reload; Back/Esc; 390px
  no overflow; no page errors.
- **NOT submitted live:** Start a case, Start a room, Update owner, Update due date, Move case, Add decision,
  Learn why. Per the mutation rule these are unverified until a real submit; the logic is the first build's, which
  was live-tested for create case / due date / room.
- Left for 5c: the design's "Why this number" evidence tab, "Review/Open full evidence", the "How calculated" link and
  clickable currency rows (exact calculation drawer), previous/next arrows between cells.
- **Amounts tab (2026-10-04):** the per-currency table moved out of the top of the drawer into its own first tab ("Amounts", the default for measured cells) so many currencies never push the other tabs down. Unmeasured cells have no amounts, so they have no Amounts tab and open on Summary. Table cells no longer wrap (the table scrolls sideways instead).

## Learn Why removed from the drawer (2026-10-04)

- The drawer's "Learn why" button (which started a conversation run and navigated to /conversations) is removed
  entirely: the user and their boss decided "why" will come back with the cell response instead. Checked live: the
  current `GET /cells/{id}` response has only `contractVersion, cell, components, signals, lineage, workState,
  publication`, with no explanation/why/narrative text anywhere in it, so nothing replaces the button yet.
- The `learn-why` service and hook (`learn-why-leakage-cell-v2`) are left in the data layer, unused, in case the
  backend adds it back to the response or the pattern returns. Also dropped from 5c scope: the "Why this number"
  evidence tab stays TODO until it is clear what the backend will send.
- **Resolved:** the live cell detail confirms `workState.revenueLeakCaseId` (not `caseId`); the handoff prose is wrong.

## Case sheet rebuild (2026-10-04)

- Replaced the first-build case panel with one built from the "Revenue leak case" and "Case dialogs" designs,
  inside the existing drawer (`panel=case`). Tabs: **Case** and **Audit trail (N)**.
- **Case tab:** seven-step bar with the time each step was reached (from the audit trail), action bar (Record
  decision, Invalidate, and one forward step per status), Collaboration Room card (linked time, short id, Open
  Room, or "Open a Room"), Owner card (name, email, Admin, Reassign), Due date card (days left, "Due soon" /
  "Overdue", filling bar, escalation level, Change due date), Decisions, Evidence (list only), Verified value,
  Escalations, Finding (snapshot, stale-snapshot note, last updated).
- **Forms** (`drawer/case-forms.tsx`) replace the tab area instead of opening over the sheet: Mark resolved
  (reason + required evidence references), Start work, Invalidate, Assign/Reassign (searchable list of active
  human members + reason), Change due date (date + quick chips + reason, bounded to the next 365 days), Record
  decision, Open a Room (pick amount, read-only market and lifecycle, mode, title).
- **Endpoints behind the buttons:** decisions -> POST /decisions; Resolve, Start work, Invalidate -> POST
  /transitions; Assign/Reassign -> PUT /owner (this is also what moves a case through Reviewed and Assigned);
  Due date -> PUT /due-date; Room -> POST /room.
- **Dropped from the design:** Exposure behind this case, Attach evidence, "on track", "workspace owner".
- **Live-verified (reads, chad@yopmail.com):** the existing WORKED case renders fully, the Audit tab lists all 6
  entries, all five forms open and cancel, 390px no overflow, no page errors, and no write request was sent.
  **Not submitted live:** every action above.
- **Tabs moved into the header row (2026-10-04):** the Case / Audit trail tabs now sit on the same line as Record decision / Invalidate / the forward step (tabs left, actions right) to save vertical space; the tab underline sits on the header border from sm up. Verified desktop and 390px.
