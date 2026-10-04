# Leakage Map V3: things to remind the owner about

A running list of things that are decided but provisional, computed on the frontend, or waiting on the
backend. Look here before asking the backend a question or removing something. Add to it, don't delete:
mark an item DONE or DROPPED with the date instead.

## Computed on the frontend (could be moved to, or removed in favour of, the backend)

- **Case due-date "days left", "Due soon" and the progress bar** (built, case sheet). Not in the API. Days left =
  `dueAtUtc` minus now; the bar fills with the share of the window from `detectedAtUtc` to `dueAtUtc` that has
  passed. Labels: **Overdue** (the server's own `isOverdue`), **Due soon** (two days or fewer left, my threshold,
  `DUE_SOON_DAYS` in `case-view.tsx`), otherwise just "N days left". "On track" was dropped (user decision).
  Ask the backend for a status field, or drop the bar and label, if the numbers ever disagree with escalation.
- **Which case buttons show per status** (built): Detected/Reviewed -> Assign owner; Assigned -> Start work;
  Worked -> Mark resolved; Invalidate for Detected..Resolved; Record decision unless Closed/Invalidated. This is a
  reading of the live audit trail, not a published rule (see the backend question on allowed moves).
- **Step timestamps** on the case stepper come from the audit trail (first entry whose `to` is that step).
- **Quick due-date chips** (+3 days, +1 week, +2 weeks, +30 days): plain date arithmetic on the client; the
  server still enforces "future, within 365 days".
- **Market names** ("NG" -> "Nigeria") come from the browser's `Intl.DisplayNames`, not from the API.
- **Mechanism dot colours** are a hash of the mechanism key, purely visual.
- **Currency symbols** come from the browser's locale data (en-NG), with the ISO code as the fallback.

## Left out because the API can't support it (ask the backend if you want it)

- **Share of exposure** ("57% of CAD exposure" bar on key findings and leak cards): the API sends no share.
  Computing one on the client would break the no-frontend-math rule. Ask backend for a share field.
- **Per-market low-confidence share and "markets needing action"** on the 30-market page: the API gives
  low-confidence share only per currency and lifecycle, and readiness only workspace-wide.
- **Region grouping / sort by region** on the market page and selector: no region field.
- **Multi-select markets**: the contract takes one `market`.
- **A converted or combined total across currencies**: no approved FX; `fxState: NOT_CONSOLIDATED_NO_APPROVED_FX`.
- **Attach evidence on its own** (case sheet): no endpoint. Evidence is plain text strings sent only with the
  move to Resolved. No upload and no list of existing evidence to pick from. The Evidence card only lists
  what is already on the case.
- **"Exposure behind this case" card and the "workspace owner" role label**: dropped (the case response has no
  amounts; the members list has only an email and a can-administer flag, so the owner card shows email + "Admin").
- **"Review source mappings" and "Start a case" buttons on the leak cards**: their data is only in the cell's
  detail response, so they live in the drawer (and, for source mappings, the Readiness section) to avoid one
  extra request per card.
- **A list of all cases**: only "get one case by id" exists, so a case is reached from its cell.

## Questions to put to the backend

1. The allowed case-status moves (which target statuses are legal from each status). Only one refusal has been
   seen live (Worked -> Reviewed). Without it the case page can only guess which buttons to show.
2. Whether the owner-assignment rule (assignable at or before Assigned) is real, so the Reassign action can be
   gated up front instead of failing.
3. Whether multi-select markets, a region field, or per-market amounts in a reporting currency are coming.
4. Where "Learn why" will live in the cell response (the cell detail has no such field today, so the button was
   removed from the drawer).
5. Whether `workState` and the case could include their amounts or a share, to save the extra cell request.
6. Confirm the `limitations[]` array's later entries (detector notes) are meant to be shown to users.

## Provisional choices

- Stages on the leak cards render in the API's order; no ordering of our own.
- The reporting currency's card leads the expected-loss row; everything else is in code order.
- Notice row (measurement and no-combined-total) is collapsed by default and expands in place.
- The case panel is being rebuilt from the Case dialogs and Revenue leak case designs; see the section below.

## Case panel rebuild (DONE 2026-10-04)

- Rebuilt in the sheet (user chose the sheet over a full page): two tabs, Case and Audit trail. Actions open as a
  form that replaces the tab area (no popup stacked on the sheet). Room form: pick an amount (currency, market,
  lifecycle follow it, read-only), choose mode, edit the title (default "<leak type> — <currency>"; whether the
  backend requires unique titles is unconfirmed).
- Not yet submitted live: Record decision, Invalidate, Mark resolved, Start work, Assign/Reassign, Change due
  date, Open a Room (they change real data).
