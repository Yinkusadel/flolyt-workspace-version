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
| 5b | Cell drawer: header, case strip, per-currency table, Amounts/Summary/Components/Signals/Sources/History tabs, case view (Learn Why was removed) | `/cells/{id}`, `/history`, `workState`, case routes | DONE (reads live-verified; mutations NOT yet submitted live, see notes) |
| 5c | Exact calculation drawer ("How calculated") | `/calculation/detail` | DONE, live-verified |
| 5d | Evidence view / "Why this number" tab | `/cells/{id}/evidence` | TODO (waiting on what the backend will send) |
| 6 | Readiness | `readiness` | DONE, live-verified |
| 7 | Measurement (+ diagnostics drawer, + what's holding coverage back) | `summary.measurement`, `coverage`, `coverageExplanation`, `limitationSummary`, `/limitations` | DONE, live-verified |
| 8 | Footer line (snapshot, run, registry, contract) | `publication` | DONE 2026-10-04 |
| later | Single-market view polish; 30-market matrix; Missed opportunities (no entry point yet since the old tab was archived) | | TODO |

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

## Invalidate replaced by Move status (2026-10-04)

- The separate **Invalidate** button is removed. The case header row is now: tabs, **Record decision**, **Move status**, and the one forward step per status. **Move status** opens a form listing every status except the current one and Verified (Detected, Reviewed, Assigned, Worked, Resolved, Closed, Invalidated), with a reason; picking Resolved asks for evidence references. Invalidating a case is done through it.
- It is deliberately unfiltered because the backend does not publish which moves are allowed; the server accepts or refuses and its message shows. **When you learn the allowed moves forward and back, tell me and the forward step and Move status can be made dynamic from that table** (also listed in v3-reminders.md).
- Verified live (reads): action row shows the three buttons; the Move status form lists the six statuses; Move case is disabled until one is picked; Resolved shows the evidence field and Invalidated hides it; Cancel returns; no write request sent.
- **Stepper detail line (2026-10-04):** the text under each step is now one short, non-wrapping line (e.g. "2 Oct 11:22", "since 2 Oct 11:22", "needs evidence", "by verification") so the seven columns stay level; the full wording shows on hover (the app TextTooltip, 0.7 s delay). Verified: all seven steps are the same height at desktop and 390px, and the three tooltips read correctly.

## Sections 6 and 7, and the diagnostics drawer (2026-10-04)

- **Readiness** (`readiness-section.tsx`): one row per API category (icon, name, state tag Action / Waiting /
  Unavailable, the server's message and affected count). Rows that are `READY` stay quiet as a tick line. The action
  button shows only when `action.eligible` is true (goes to /data-sources, with its missing fields); a not-eligible
  action shows the server's `unavailableReason` as plain text. On the live workspace the only button is "Review
  source mappings or add the required data" (chargeback.exposure).
- **Measurement** (`measurement-section.tsx`): ring = `coverageExplanation.effectiveCoverage` (publication-wide),
  headline = the server's sentence, "N units remain unknown" from `coverage.residualUnknownUnits`, then the response's
  separate counts (priced findings, observations that can't be priced, leak types with exposure, measured zero,
  not measurable yet; "Unpriced candidates" only when above zero), never added together.
- **What's holding coverage back (8)**: an expandable list of `coverageExplanation.issues[]` grouped by the server's
  five categories, each with its capability, missing fields and an eligible action. This is where the real
  per-capability "Review source mappings" buttons live (four capabilities on the live workspace).
- **Diagnostics drawer** (`drawer/diagnostics-drawer.tsx`, URL `?diagnostics=all` or `?diagnostics=<code>`): chips are
  the summary's own groups with the counts it reported; the list comes from `/leakage/limitations` 50 at a time with
  Previous / Next and "51-100 of 915". Opened from "All N diagnostics" or by clicking a readiness row. Opening it closes
  the cell drawer.
- **Inferred, not an API field:** which diagnostics group a readiness row opens (Sector confirmation ->
  SECTOR_ASSIGNMENT_MISSING, Source capability -> CAPABILITY_GAP, History -> BASELINE_HISTORY_MISSING, Pricing ->
  PRICING_INPUT_MISSING, Platform capability -> NORMALIZED_FACTS_UNAVAILABLE, Policy configuration ->
  CURRENCY_POLICY_MISSING). The handoff says "filtered by the corresponding limitation code when one exists".
- `Collapse` (the measured-height slide) moved to `collapse.tsx` and is shared by the notices row and the issue list.
- **Live-verified (chad@yopmail.com):** all six readiness rows, the one eligible button linking to /data-sources, the
  measurement figures (24.9%, 240, 915, 2, 0, 4, 190 unknown), 8 issues expanded, the drawer from a Pricing row
  (filtered to code, 1-50 then 51-100 of 915), All (1-50 of 1,108), Esc closes and clears the URL, 390px no overflow, no
  page errors.
- **Not shown on purpose:** the design's "Signals by subject" table (that is the coverage endpoint's data and a separate
  page in the design) and the four-ratios disclosure; both are later work.
- **Readiness row links fixed (2026-10-04):** a row now opens diagnostics only when the server reported a group of that kind (`limitationSummary.items[].code`). Live, Source capability, History, Pricing and Platform capability open their group; Sector confirmation (no diagnostics of its kind exist) is a plain row with no arrow. Found when the Sector row opened an empty drawer with no chip selected.

## Coverage issues sheet and page lock while loading (2026-10-04)

- **"What's holding coverage back (N)"** no longer expands inside the Measurement card; it opens in a sheet (`drawer/coverage-issues-drawer.tsx`, URL `?issues=1`) with the server's issues grouped by its five categories, each with its capability, missing fields and (when eligible) a button to Data sources. Opening it closes the cell and diagnostics sheets, and opening either of those closes it. Verified: 8 issues, 4 buttons to /data-sources, Esc clears the URL, 390px no overflow.
- **Page lock:** when a filter change is loading (new figures requested while the previous ones stay on screen), the filter bar and every section are `inert` (no click, no tab, no screen-reader interaction) and the sections dim; it unlocks when the figures land. A quiet background refresh of the same figures (tab regaining focus) does not lock the page. Verified with a 3 s delayed response: forced clicks on Details and Gross during the load did nothing, and the lock cleared after.

## Date picker (2026-10-04)

- New shared component `src/components/ui/date-picker.tsx`: a field that opens a month grid in the app's look (selected day in the app blue, today ringed, out-of-range days disabled, Today and optional Clear). Plain buttons on the Popover primitive: no native date input and no Radix Select (a Select inside a Popover closes it, which is why an earlier styled calendar was reverted). Keyboard: arrows move by day or week, Home/End by week, PageUp/PageDown by month, Enter or Space picks, Esc closes only the picker. Values are "YYYY-MM-DD" in local time (no timezone shift).
- Replaces the native date input in the case "Change due date" form (min tomorrow, max 365 days); the quick chips set the same value. The form's own day helper now uses local dates too, not UTC.
- Verified live (no submit): opens inside the sheet without closing it, 4 past days disabled, keyboard pick, chip sync, selected day marked, Esc closes only the picker, popover fits a 390px screen, no page errors. Only a month/year jump is not built (not needed for a 365-day window).
- **Month and year jump (2026-10-04):** click the month title to see the twelve months, then the year to see twelve years at a time; the arrows step by month, year or page of years to match, and months or years wholly outside min/max are disabled. Found and fixed a closing bug on the way: removing the clicked cell from the page mid-click made the surrounding sheet treat the click as outside it and close the whole drawer, so the three grids now stay mounted and are only hidden, and a mouse press on a month or year cell does not take focus. Verified (no submit): days, months, years (2016-2027 with only 2026 and 2027 enabled), picking 15 Mar 2027 through year then month then day, the keyboard flow, chip sync and Esc, no page errors.

## Coverage sheet with three tabs (2026-10-04)

- The coverage sheet is now one sheet, `drawer/coverage-drawer.tsx` (URL `?coverage=holding-back|signals|ratios`), opened by a single "Coverage detail (N issues)" link in the Measurement card. Tabs: **Holding back (N)** (the server issues by category, with eligible buttons to Data sources), **Signals** and **Ratios**. It replaces the earlier issues-only sheet.
- **Signals** reads `GET /leakage/coverage` only when the tab is opened (confirmed live: no coverage request until then). Subject cards ("3 of 3 measurable", signal-population pairs) and a table grouped by what each signal counts (accounts, transactions, payments, invoices): maturity, source, run outcome, eligible, usable, unknown, no join, no value. Signals that did not run (NOT_RUN) are hatched with dashes, not zeros. Counts are never added across subjects. Signal names are the signal id made readable ("Financial account inactivity"). The design's "usable share" bar is left out: it would be eligible divided by usable on the client.
- **Ratios** shows effective coverage plus the four normalized ratios from the page's own `coverage` (capability 42.9
## Coverage sheet with three tabs (2026-10-04)

- The coverage sheet is now one sheet, `drawer/coverage-drawer.tsx` (URL `?coverage=holding-back|signals|ratios`), opened by a single "Coverage detail (N issues)" link in the Measurement card. Tabs: **Holding back (N)** (the server's issues by category, with eligible buttons to Data sources), **Signals** and **Ratios**. It replaces the earlier issues-only sheet.
- **Signals** reads `GET /leakage/coverage` only when the tab is opened (confirmed live: no coverage request until then). Subject cards ("3 of 3 measurable", signal-population pairs) and a table grouped by what each signal counts (accounts, transactions, payments, invoices): maturity, source, run outcome, eligible, usable, unknown, no join, no value. Signals that did not run (NOT_RUN) are hatched with dashes, not zeros. Counts are never added across subjects. Signal names are the signal id made readable ("Financial account inactivity"). The design's "usable share" bar is left out: it would be usable divided by eligible on the client.
- **Ratios** shows effective coverage plus the four normalized ratios from the page's own `coverage` (capability 42.9 percent, scope, freshness and quality 24.9 percent) as bars, the applicable / measured / declared-only counts, and the server's explanation sentence.
- Verified live: tabs, URL changes, the lazy fetch, all seven signals with the right counts (for example repeat-purchase decay 151 eligible, 56 usable, 95 unknown), Esc, 390px no overflow, no page errors.

- **Signals tab redone as grouped cards (2026-10-04):** the table needed sideways scrolling and its group rows (ACCOUNTS, TRANSACTIONS, PAYMENTS, INVOICES) were easy to miss. Each group is now a titled section (what the signals count, the grain, "N of M measurable" from `subjects[]`) holding one card per signal: name, status chips (run outcome, source availability, maturity) and a wrapping grid of the five unit counts. A signal that did not run says so instead of showing zeros. No horizontal scroll at desktop or 390px. The separate subject cards at the top were folded into the group headers.

- **Signals tab back to a table, without the scrolling (2026-10-04):** the user preferred the table to the cards. It is one table again, now sized to fit the sheet: Signal (name and maturity), Status (run outcome over source availability, merged into one cell) and the five count columns. Below the sm width the Status column hides and its text moves under the signal name, so it still fits a phone. Each group (Accounts, Transactions, Payments, Invoices) gets a clearer band with a blue dot, its grain and "N of M measurable", and a small gap above it so the first group no longer sits flush under the column headings. Measured: the table wrapper does not scroll sideways at 1440, 1024, 768 or 390px.

- **New groups and unfamiliar outcomes (2026-10-04):** nothing in the Signals tab is a fixed list. Groups come from each signal's own subject, now keyed by type, grain and unit together (so two subjects that share a unit word stay separate); a group with no matching entry in `subjects[]` simply omits "N of M measurable". Only a `SUCCEEDED` run reads green; any other outcome that did run (for example `FAILED`) shows amber with its counts, and only `NOT_RUN` is hatched with dashes. Checked with a deliberately odd mocked response (a new "subscriptions" subject, a second subject sharing that unit, a failed signal, a very long signal id and unit name): all rendered as extra groups and rows with no sideways scroll.

- **Amounts tab no longer scrolls on desktop (2026-10-04):** the per-currency table in the cell drawer had a fixed minimum width with no wrapping, so it scrolled sideways at ordinary drawer widths. It is now sized to fit: severity sits under confidence instead of taking a column, "Candidates" is "Cand.", and the range wraps onto two lines (under Expected on a phone). Measured: no sideways scroll at 1440, 1100, 915 or 768px. **On a 390px phone it still scrolls by about 40px** (the user said that is acceptable and to leave it).

## Exact calculation drawer, "How calculated" (2026-10-04)

- **Built:** `drawer/calculation-drawer.tsx` reads `GET /leakage/calculation/detail` for one amount's opaque `calculationReference` (URL `?calc=<reference>`, plus `calcFrom=<cellId>` when it was opened from a cell). It shows: the selected amount; a Reconciled badge (or an amber "does not reconcile" state) with the delta and tolerance; the four included totals to four decimals; the candidate-by-candidate table (impact x ramp = gross, x probability = expected, x (1 - recovery) = net, contribution; first 10 rows, "Show all N"); the server's own formula and aggregation note; Correlation, Range and confidence, Baseline and source, and Assumptions and caveats cards; the copyable reference with its publication and run.
- **Entry points:** the blue "How calculated" link on every measured leak card (uses the lead amount of the currency tab shown), and each currency in the cell drawer's Amounts tab (tap a currency; "Back to <cell>" returns to the cell). One sheet at a time: opening the calculation closes the others, and every other sheet's opener clears it.
- **Failure state:** if the server refuses the reference, the sheet says "Calculation detail unavailable. We won't substitute the newest calculation.", shows the server's message and the common causes, and offers "Reload the map for a fresh reference". Verified with a mocked 400 response.
- **Real data confirmed (chad@yopmail.com, NGN Dormant Accounts):** 28 candidates, all included, probability 0.60, ramp 0.25, recovery 0.40, reconciled with a delta of 0; the earlier worry that the impact, ramp, probability and recovery columns might not exist is closed. Types in `get-leakage-calculation-detail.ts` are now the real shape (no catch-all keys).
- **Not seen live:** an excluded candidate (its `inclusionReason` is shown humanized, struck through, contribution 0; no wording is invented for it), a history-amount reference, a candidate-level reference.
- **Limits:** the card link covers only the first amount of the selected currency; a cell with several amounts in one currency (different market or lifecycle) would need a picker. On a 390px phone the candidate table scrolls sideways (nine columns); at 768px and up it does not.
- **Verified live:** both entry points, the Back link, Esc, the reload reopens it (the page then waits on two requests, so it takes a moment), the 28-row expansion, no write requests, no page errors.

## Where things stand (2026-10-04, end of the first build pass)

**Built and live-verified for reads:** shell and filter bar, expected loss cards, by market, key findings, leak cards, cell drawer (with Amounts, case view, history), exact calculation drawer, readiness, measurement, diagnostics drawer, coverage sheet (holding back, signals, ratios), date picker.

**Decisions made:**
- The Measurement labels ("Priced findings", "Leak types with exposure" and the rest) stay as they are (user decision). Known caveat: "Priced findings" counts candidates, while "findings" elsewhere on the page counts amounts per currency.
- Testing the case form submits is left to the user to do later.

**Built but NOT submitted live (the user will test):** Record decision, Move status, Mark resolved, Start work, Assign / Reassign, Change due date, Open a Room, Start a case. Their wiring is the first build's logic (create case, due date and Room were live-tested then); the forms, validation and the new Room/amount picker are new. Remember the mutation rule: a mocked-response pass cannot catch a real backend validation rule, so treat these as unverified until a real submit.

**Not built yet:**
1. Evidence view ("Why this number"): waiting on what the backend will send; the cell response has no explanation text and Learn Why is moving into it.
2. Single-market view polish (the market page in the design: breadcrumb with market switcher arrows, "Leak types in <market>" list, cases card, "Unlock more" card).
3. The 30-market matrix page.
4. Footer line (snapshot, run, registry and contract versions).
5. Missed opportunities (separate read, `GET /opportunities`: explanation and signal preview types exist; no page and no entry point since the old tab was archived).

## Single-market view (2026-10-04)

- **Header card** (`market-view.tsx`, `MarketHeader`): replaces the plain heading when a market is selected. Code badge (a pin for Unassigned), name, one line of facts from the market's executive row ("Primary market · Configured · nothing attributed yet", or "Not attributed to a market · currency proven, market not"), an "All markets" button, "Affected accounts 128" from `affectedEntities` (de-duplicated, units never mixed), and a note that coverage is workspace-wide with a link to the Coverage sheet (there is no per-market coverage ratio).
- **A market nothing is attributed to** (Kenya and Nigeria on the live workspace) gets `NothingMeasured` in place of the empty expected-loss, findings and leak-card sections: "Nothing is measured for Kenya yet ... unknown, not zero", a facts box (Configured, Measurement evidence, Attributed amounts, Coverage "Not available per market"), a **See unassigned exposure** button (only when the workspace has Unassigned exposure), the "Leak types in Kenya" comparison table and an Unassigned callout with a link to Data sources.
- **The comparison table** reads `executive.matrix`: each leak type's workspace-wide state (`publicationDisplay`) beside this market's own cell. A leak type the whole workspace cannot measure reads "Not measurable anywhere yet" (hatched); one the workspace measures but this market has no data for reads "No market-scoped measurement" (dotted). Never a zero.
- **A market with data** (Unassigned on the live workspace) keeps the existing sections (expected loss, key findings, leak cards) under the new header.
- **Readiness and Measurement** stay on every market view (they are workspace-wide).
- **Left out of the design:** the "Cases in Nigeria" card (case state is only in each cell's detail, so listing cases would need one request per leak type) and the previous/next market arrows (the market switcher already moves between markets). "How to measure Kenya" button is not built (no API action behind it).
- Verified live (chad@yopmail.com): `?market=KE` (nothing-measured view, table, callout, the See unassigned button), `?market=UNASSIGNED` (header plus the existing sections), All markets back, `?market=NG` header, 390px no overflow, no page errors. A market with attributed amounts has not been seen (none exist on this workspace); its view is the same sections under the new header.

- **No layout shift between markets (2026-10-04):** the "Nothing is measured for X yet" sentence wraps to two lines for a longer name (Nigeria) and one for a shorter (Kenya), so the card and the button under it changed height when switching. The sentence now always reserves two lines. Measured: Nigeria and Kenya cards are the same height (180px at 1440 and 1100px, 328px stacked at 800px) with the button at the same position.

- **Unassigned callout reworded (2026-10-04):** it said "Mapping a market field on your sources lets the next run attribute them" with a "Review source mappings" button, copied from the design. Nothing in the contract or this app supports field mapping from here (the Data sources page has no mapping), so the button is gone and the text now says only what the handoff says: Unassigned amounts stay there until a new calculation reads market evidence for them.

## Evidence tab built (2026-10-04)

"Why this number" tab in the cell drawer (`drawer/evidence-tab.tsx`), live-verified for reads against a real `GET /cells/{id}/evidence` (about 857 KB, so fetched only when the tab opens). Shows the server's `question`, `calculationFormulas`, policy values (probability, recovery rate, ramp factor at the selected horizon, the two basis texts), lineage with source candidates, usable vs eligible units from `coverage`, every limitation (1,108 in the sample, revealed 25 at a time) and the eligible Room link from `suggestedActions`. Components and signals stay on their own tabs; the `revenue_leaks.review` action is not shown because the person is already there. The types needed no changes.

## Missed opportunities built (2026-10-04)

`/missed-opportunities`, entered from a link in the Leakage Map header (not shown inside a single-market header; use the breadcrumb back to All markets). Live-verified for the legacy UNKNOWN cell only; priced amounts and the signal preview are contract-only until a workspace with a 1.2.0 publication is available. See docs/endpoints/opportunities.md.

## Footer line built (2026-10-04)

`publication-footer.tsx`, as the design's last line (snapshot, run, registry, sector profile, contract, published in UTC), ids cut to 8 characters with the full id in the hover title. Shown on every view, including a single market, since it describes the whole publication. Live-verified; no overflow at 390px.

## Still to build (2026-10-04, after the footer line)

1. **30-market matrix page** (market x leak-type table from `executive.matrix`; design: "30 markets + Unassigned - matrix" in the new-set folder). Deferred by the user until a workspace with many attributed markets exists. When built: link from the Leakage Map header next to Missed opportunities, each cell in its own currency, layout checked with a local-only 30-market intercept (never shipped). Real attributed-market amounts stay unverified until a workspace has them; then open the page once and compare against the Leakage Map.

## Registry 1.6.0 update (2026-10-05, branch update-leakagemap-page-4)

The new handoff replaced the old one (same filename). Live capture confirmed every new field is already served (registry 1.6.0, published 4 Oct 22:00).

- **Types:** `marketOptions` (state, isConfigured, isObserved, hasExposure, preferredCurrency, currencies; `currency` now nullable and a preference only), `marketReconciliation`, `headlineFindings`, per-market evidence flags and `evidenceExplanation`, entity `state`/nullable `count`, `isTied`.
- **Key findings rebuilt:** all-markets view leads with the server's `headlineFindings` sentence (confidence + markets), then the per-market rows from `markets[].largestMechanisms`. `keyFindings` (now empty) is read only from a server without `headlineFindings`. A single market's empty state uses the server's `evidenceExplanation`. The "no findings" footnote is all-markets only.
- **Market filter:** Unassigned is no longer duplicated from `marketOptions`; currency preference no longer shown; markets not in settings / with no data yet are tagged. By market boxes: "Not in settings" chip, a setup-review line from `marketReconciliation` (wording is frontend copy over the server's two lists), server explanation for empty boxes. Unassigned view reworded: it now has observations but no priced exposure.
- **Now verifiable live:** real attributed markets exist on the test workspace (NG, CA, GB, IE, US). The attributed-amount gap is closed for reads; the matrix can be tried with 6 real markets.
- **Not changed:** the market filter still shows no currency choice per market (the preference is not applied); `currencies[]` is typed but unused.

**Wording change (2026-10-05):** "not in settings" read like an error, so the observed-but-not-configured state is now "found in data" (dropdown note) and "Found in data" (By market chip), with the hover "Seen in your data, but not in your workspace's market list". The line under the By market cards now says "market list" instead of "market settings". The server sends only the state codes (`OBSERVED_NOT_CONFIGURED` and so on), never display text, so all of this is frontend wording.
