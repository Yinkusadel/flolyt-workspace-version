# Leakage Map: session handover (4 to 10 Oct 2026)

One place that records what was built, decided and found in the long build session that took `/leakage-map`
from a stub to the current page, so the chat can be deleted without losing anything. The running logs stay where
they are: [v3-build-tracker.md](v3-build-tracker.md) (per-section notes), [v3-reminders.md](v3-reminders.md)
(frontend-computed values, omitted fields, backend questions), [v3-rebuild-plan.md](v3-rebuild-plan.md) (the
original plan and Q&A), [../endpoints/leakage.md](../endpoints/leakage.md) and
[../endpoints/opportunities.md](../endpoints/opportunities.md) (endpoint docs).

## 1. Where things stand

- **Everything is pushed and merged.** PR #41 (`update-leakagemap-page-3`, merge `bc51eef`) and PR #42
  (`update-leakagemap-page-4`, merge `bf562dc`) are both in `main`. The last leakage commit is `45ce441`.
- The working tree was then moved to the branch `revenue-threat-room` (unrelated work; an untracked
  `docs/rooms/revenue-threat-room-frontend-handoff.md` sits there).
- Source of truth for data is the backend contract: [leakage-map-v2-frontend-handoff.md](leakage-map-v2-frontend-handoff.md),
  now the **registry 1.6.0** version (it replaced the earlier one, same filename). Figma is only a design idea source.

## 2. What exists on `/leakage-map` now (top to bottom)

| Piece | File(s) in `src/pages/leakage-map/` | Notes |
|---|---|---|
| Header + "Missed opportunities" link | `index.tsx` (`Header`) | The only in-app way into `/missed-opportunities`. |
| Filter bar | `filter-bar.tsx`, `market-select.tsx`, `filter-menu.tsx`, `more-filters.tsx`, `filters.ts` | Market and currency live in the URL. Info icon beside "Up to date" shows or hides the notices. |
| Notices strip (hidden by default) | `notices.tsx` (`buildNotices`, `NoticeStrip`) | "Partially measured" and "No combined total". |
| Expected loss | `expected-loss-section.tsx` | One card per currency and lifecycle class, reporting currency first, "No amount published" cards. |
| By market | `by-market-section.tsx`, `add-market-dialog.tsx` | Badges on their own top row; "Found in data" chip opens a dialog. |
| Key findings (collapsible) | `key-findings-section.tsx` | Headline sentence + per-market largest mechanism. |
| Where revenue leaks | `leak-cards-section.tsx` | See section 4. |
| Readiness + Measurement | `readiness-section.tsx`, `measurement-section.tsx` | Collapse together from either header. |
| Footer line | `publication-footer.tsx` | snapshot, run, registry, sector profile, contract, published (UTC); ids cut to 8 chars with the full id in the hover. |
| Single-market view | `market-view.tsx` | Market header, "nothing measured" view, leak-type comparison from `executive.matrix`. |
| Drawers | `drawer/*` | Cell drawer (Amounts / Why this number / Summary / Components / Signals / Sources / History), case drawer, calculation, coverage, diagnostics. |
| Missed opportunities | `src/pages/missed-opportunities/` | Route `/missed-opportunities`. |

Shared pieces: `collapse.tsx` (`Collapse`, `ToggleHeader`; closed content is `inert`), `busy-region.tsx`,
`format.ts`, `src/lib/format-measured-value.ts`, `src/components/ui/date-picker.tsx`.

## 3. Decisions the user made (do not re-litigate)

- **Start over against the contract**, not extend the first V2 build (archived at
  `src/oldpages/revenue/leakage-map-v2-first-build/`, do not edit).
- **Figma is a look, not a spec.** The boss's rebuilt design (dark banner with a big reporting-currency figure,
  5 fixed stage columns) was **discarded**. When a design element cannot work with the contract: flag it in plain
  words first, then build the closest honest version.
- **Never add money across currencies** (no approved FX: `fxState: NOT_CONSOLIDATED_NO_APPROVED_FX`). A reporting
  currency is display context only. Unknown or unmeasured is never shown as zero.
- **Blue (`ultra`) for primary actions**, not black. No left or top accent strands on cards.
- **Case panel:** Case/Audit tabs, no "Invalidate" (only Move status), forms replace the tab area. The user will
  test the form submits themselves.
- **Measurement labels** ("Priced findings" and the rest) stay as they are. Known caveat: "Priced findings" counts
  candidates while "findings" elsewhere counts amounts per currency.
- **Unassigned callout** was reworded to the contract and the "Review source mappings" button removed (no app
  support for mapping from there).
- **"Found in data"** (not "not in settings") is the label for a market seen in the data but absent from the
  workspace's market list. The server sends only the state codes (`OBSERVED_NOT_CONFIGURED`...), never display text.
- **Add-a-market flow:** chip or the market header button opens a dialog, whose button links to
  `/markets?add=GB&currency=GBP`. The Markets page adds the country to its form as an unsaved draft (currency only
  if supported, editable), shows a blue note, clears the params, and has a **Back to leakage map** button beside
  Save (only when arrived that way). Nothing saves without Save changes plus the emailed code (step-up,
  administrator only). Admin gating was not possible: `GET /members/me/roles` returns functional roles
  (ProductManager, ComplianceOfficer...), not Member/Lead/Administrator, so the dialog just says so.
- **Leak cards (option 3):** every currency is shown, the top currency filter narrows the cards to that currency
  (the server leaves a cell's other currencies in place, confirmed live 2026-10-05, so the page narrows them).
- **Collapsing:** Key findings, and Readiness + Measurement together, collapse from anywhere on their headers;
  not remembered across reloads. Notices are hidden behind the info icon by default.
- **30-market matrix:** deferred. Wanted later; design is "30 markets + Unassigned - matrix" in the new-set folder.

## 4. Leak cards: the layout rules (`leak-cards-section.tsx`)

Per stage (groups come from the backend, in the backend's order; stages and cards are not capped):

1. A leak with **one currency** keeps the single card (big number, range, chips, "How calculated", Details).
2. A leak with **2+ currencies** is **split into one tile per currency inside one card with one Details button**
   (each tile keeps its own "How calculated") when every card in the stage fits on one line: units = currency
   tiles + one per unmeasured / no-exposure / single-currency card; each unit needs 215 to 300px; measured with a
   ResizeObserver on the stage. 5 currencies alone fit at about 1130px stage width; 5 + 1 unmeasured do not.
3. Otherwise the stage wraps as before and the leak keeps a **compact card**: 2 one-line rows (currency code link,
   figure, "N cand. · Low"), then "+N more currencies" opening a popover with every currency in full (lifecycle,
   candidates, range). Picking a currency closes it and opens that calculation.
4. The currency filter narrows all of the above; a card with no amount in it says "No amount in CAD".
5. Severity per currency is not shown on multi-currency cards (it is in the cell drawer's Amounts table).

## 5. Contract and live findings worth remembering

- **Registry 1.6.0 (published 4 Oct 22:00)** was already live when the new handoff arrived. New and changed fields:
  `controls.marketOptions[]` (`state`, `isConfigured`, `isObserved`, `hasExposure`, `preferredCurrency`,
  `currencies[]`; `currency` is nullable and a preference only, never a filter), `executive.marketReconciliation`,
  `executive.headlineFindings[]` (server sentence, kind `DOMINANT_MECHANISM_ACROSS_MARKETS`),
  `executive.keyFindings` **now empty** (deprecated), per-market `hasObservationEvidence`, `hasCandidateEvidence`,
  `hasMeasuredExposure`, `hasAffectedEntities`, `affectedEntitiesState`, `evidenceExplanation`, entity `count`
  nullable with `state` EXACT or UNAVAILABLE, `largestMechanisms[].isTied`.
- **Market attribution** now resolves through relationships (for the Lemfi demo: transaction to customer to country,
  the sender market). That is why NG, CA, GB, IE, US hold attributed amounts and KE (configured) has none.
  `UNASSIGNED` now has observations but no priced exposure (`hasUnassignedExposure` false).
- **Evidence endpoint** (`GET /cells/{id}/evidence`, about 857 KB): types needed no changes. `question` is one
  server string with raw figures ("NGN 644982") and an enum stage ("RETAIN"), so it is not shown; the heading is
  built from structured fields. `limitations` are plain strings (1,108 in the sample), shown 25 at a time.
- **Opportunities** (`GET /opportunities`): live data is a legacy publication (definition 1.0.0), one UNKNOWN
  `product_deepening` cell with `NOT_RECORDED` explanation, null `eligibleUnits` / `usableUnits`. Types corrected.
- **Server vs page:** the top currency filter narrows `executive.totals` but not `cells[].amounts`.
- **Same currency, different markets, several lifecycle classes** are all separate amounts; nothing is netted.
- `executive.matrix` holds 6 rows by 7 market entries on the test workspace (enough to try the matrix page).

## 6. Not verified live (unverified, do not claim otherwise)

- **All case mutations** (Record decision, Move status, Mark resolved, Start work, Assign/Reassign, Change due
  date, Open a Room, Start a case): built, never submitted live. The user will test.
- A **real save** from the Markets page (needs an emailed code), and how soon the leakage page shows a market as
  configured after saving.
- **Priced opportunity amounts, the opportunity signal preview, `missingRequirements` contents.**
- The **null affected-entity count path** (every count in the test workspace is EXACT).
- The **split per-currency cards at 1100px and 820px, with the currency filter, and the mixed case**
  (5 currencies + an unmeasured card) and the **2-row compact card height**: the saved test session expired on
  6 Oct, so only the 1440px split group (5 tiles, one Details, calculation opens from a tile) was checked.
- Screenshots were not looked at for several of the later changes (collapsed cards, back button, By market header).

## 7. Still to build

1. **30-market matrix page** (market by leak type, `executive.matrix`). Link from the Leakage Map header beside
   Missed opportunities, each cell in its own currency, layout to be checked with a local-only 30-market intercept
   that never ships. Real attributed data now exists for 5 markets.
2. Optional extras the user may ask for: remembering collapse state across reloads; `currencies[]` per market;
   showing `hasMeasuredExposure` and the other evidence flags; per-currency severity on multi-currency cards.
3. Open question left with the user: the **"No amount published" currency card** (e.g. KES) in Expected loss:
   keep, or fold unpriced currencies into one line.
4. Card-layout ideas offered but not asked for: align cards to their own height, group same-reason unmeasured
   cards into one compact line, cap cards per stage, collapse stages.

## 8. Backend questions still open (see v3-reminders.md)

Allowed case-status moves; the owner-assignment rule; multi-select market / region / per-market FX; where Learn Why
will live; `inclusionReason` and `reconciliationState` values; readiness-to-limitation code pairing; whether the
top currency filter should narrow `cells[].amounts` server-side; a per-market role signal (Member/Lead/Administrator)
so the Add-a-market button could be hidden for non-admins.

## 9. How to work on this page (practical)

- **Verify with the real build:** `npx tsc -b` (not `tsc --noEmit -p .`). It can take over two minutes on this machine.
- **Port 3000 is sacred.** Never start, stop or kill anything on it. The user's own `npm run dev` runs there and
  their open browser tab reconnects to whatever is on it; the real backend's CORS only allows `localhost:3000`.
  If it is down, ask the user to start it. (I disconnected their session more than once before learning this.)
- **Live checks** use Playwright (`NODE_PATH=.../_npx/6bcb61ec6d5aea22/node_modules`) with a saved session file
  `~/.claude/projects/c--Users-HP-Documents-repo-Flolyts-space-flolyt-workspace-version/memory/flolyt-session-storage-state-chad.json`
  for chad@yopmail.com (the user's real workspace). It **expired on 6 Oct**; a new sign-in needs an emailed code the
  user relays. Always write `context.storageState` back at the end. Reads only unless the user says otherwise.
- **Shell quirk:** bash heredocs with `%` or mixed quotes fail often; write helper scripts to files and run them.
- **Preact, not React:** primitives with refs need `forwardRef`; Radix Dialog must be always mounted with `open`
  starting false; Radix Select plus a Popover on one page can stick `aria-hidden`.
- **Commit style:** single-line conventional commit subject, no AI attribution lines, no body. Push only when the
  user says "push" in that turn.
- **Reply style:** the user asked for short replies; explain plainly, say what was and was not verified.
