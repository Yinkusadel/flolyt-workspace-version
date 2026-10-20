# Datasource relationships: build plan

Settings screen on `/data-sources`, tab "Relationships" (`?tab=relationships`). Built before any
onboarding step; onboarding may later link to it or reuse its pieces.

Backend handoff: [../datasource-relationship-mapping-api.md](../datasource-relationship-mapping-api.md).
Endpoints: [../endpoints/datasource-relationships.md](../endpoints/datasource-relationships.md).
Clickable mockup (example data only): https://claude.ai/artifact/B7124jR9c9iVP3ckZoWJPs

Build one step at a time, each on an explicit "build".

| Step | What | Status |
| --- | --- | --- |
| 1 | Endpoint docs, services, hooks for all 9 routes | Done, pushed (`ff39066`) |
| 2 | List tab | Built 2026-10-20, typechecks clean, not run against a live account |
| 3 | Declare form (prefill from catalog suggestions, zod schema, Declare button) | Not started |
| 4 | Preview (counts shown separately, partial warning, 422/409 handling) | Not started |
| 5 | Approve (15-minute receipt, `acceptPartial`, no optimistic update) | Not started |
| 6 | Detail view: audit trail with "load earlier revisions", edit, disable | Not started |
| 7 | Onboarding: optional step or link after the data mapping state | Not started, decision open |

## Evidence so far

- `GET /catalog`: real response seen (one PostgreSQL source, 7 datasets, 6 same-source foreign-key
  suggestions). Matches the types. No cross-source case, no `previewSupported: false`, no
  composite keys seen.
- `GET /` (list): real response seen, empty (`total: 0`). **No real mapping row seen yet.**
  `state`, `storedState`, `revision`, `definition`, `approval`, `limitations` are typed from the
  handoff prose only.

## Step 2 notes

- `src/pages/data-sources/relationships-list.tsx`, tab added in `src/pages/data-sources/index.tsx`.
- Rows show name, source label / dataset (key columns in order), meaning, cardinality, state chip,
  revision. Source labels come from the catalog matched on `datasourceId`; a dataset is shown alone
  if the catalog does not know its source (never a UUID).
- No Declare button yet: it would do nothing until step 3. The empty state explains the feature
  instead.
- No admin/non-admin gating yet: no client-side workspace role was found in the app. Reads are open
  to members. Write actions will rely on the 403 from the backend, then decide in step 3.
- Re-verify against the first real mapping row: field names, `state` values, `crosswalk` presence.

## Open

- Whether relationships inside a single source are allowed (all suggestions seen are).
- Where `scope` and the preview ID sit in the preview response, and the PUT body nesting.
