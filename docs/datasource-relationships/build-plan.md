# Datasource relationships: build plan

Standalone page at `/relationships`, under Data in the user menu next to Data sources and Schema
(moved out of a `/data-sources` tab on 2026-10-20: the flow is multi-screen). The Connected tab on
`/data-sources` links to it. Built before any
onboarding step; onboarding may later link to it or reuse its pieces.

Backend handoff: [../datasource-relationship-mapping-api.md](../datasource-relationship-mapping-api.md).
Endpoints: [../endpoints/datasource-relationships.md](../endpoints/datasource-relationships.md).
Clickable mockup (example data only): https://claude.ai/artifact/B7124jR9c9iVP3ckZoWJPs

Build one step at a time, each on an explicit "build".

| Step | What | Status |
| --- | --- | --- |
| 1 | Endpoint docs, services, hooks for all 9 routes | Done, pushed (`ff39066`) |
| 2 | List (first a tab, now the `/relationships` page) | Built 2026-10-20, typechecks clean, not run against a live account |
| 3 | Declare form (prefill from catalog suggestions, zod schema, Declare button) | Built and pushed (`9b15918`), not yet run live. Crosswalk not included. |
| 4 | Preview (counts shown separately, partial warning, 422/409 handling) | Built on `/relationships/:id`, verified live 2026-10-20 (partial result, all matched). 409/422/403 paths and non-zero gaps unseen. |
| 5 | Approve (15-minute receipt, `acceptPartial`, no optimistic update) | Built 2026-10-20 (`pages/relationships/approve-section.tsx`). Success path verified by the user: partial preview approved, state `APPROVED`, revision 2. `approval` object, 409 and 403 paths unseen. |
| 6 | Detail view: edit, disable, audit trail with "load earlier revisions" | Edit built 2026-10-20 (Edit button on the detail page reuses the Declare form, PUT with `expectedRevision`, warns that saving clears approval, 409 keeps the form). Renders and prefills against the real draft; **no save submitted yet**. Disable and audit trail not started; audit trail names wait on the backend ticket. |
| 7 | Onboarding: optional step or link after the data mapping state | Not started, decision open |

## Evidence so far

- `GET /catalog`: real response seen (one PostgreSQL source, 7 datasets, 6 same-source foreign-key
  suggestions). Matches the types. No cross-source case, no `previewSupported: false`, no
  composite keys seen.
- `GET /` (list): real response seen, empty (`total: 0`). **No real mapping row seen yet.**
  `state`, `storedState`, `revision`, `definition`, `approval`, `limitations` are typed from the
  handoff prose only.

## Step 2 notes

- `src/pages/relationships/` (`index.tsx`, `relationships-list.tsx`, `relationship-declare.tsx`,
  `key-columns-picker.tsx`), route `relationships` in `src/route/route.tsx`, menu entry in
  `src/components/user-menu.tsx`, crumb in `src/pages/app-layout.tsx`.
- Rows show name, source label / dataset (key columns in order), meaning, cardinality, state chip,
  revision. Source labels come from the catalog matched on `datasourceId`; a dataset is shown alone
  if the catalog does not know its source (never a UUID).
- The Declare button (list header and empty card) arrived with step 3.
- No admin/non-admin gating yet: no client-side workspace role was found in the app. Reads are open
  to members. Write actions will rely on the 403 from the backend, then decide in step 3.
- Re-verify against the first real mapping row: field names, `state` values, `crosswalk` presence.

## Open

- Whether relationships inside a single source are allowed (all suggestions seen are).
- The PUT body nesting (`expectedRevision` beside `definition` is likely).
