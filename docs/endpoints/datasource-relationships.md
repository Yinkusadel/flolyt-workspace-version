# Datasource Relationships endpoints

Admin-declared links between two connected sources (for example invoice `account_id` to commercial
account `id`): declare, preview, approve. Backend handoff, written by the backend team, with the
full rules: [../datasource-relationship-mapping-api.md](../datasource-relationship-mapping-api.md).
See [README.md](README.md) for the entry format and workflow.

Base path: `/api/v3/datasource-relationships` → `DATASOURCE_RELATIONSHIPS_BASE_URL` /
`API_ENDPOINTS.DATASOURCE_RELATIONSHIPS` in [`src/config/apiConfig.ts`](../../src/config/apiConfig.ts).

Status legend: **documented** → **wired** (service/hook built, no UI yet) → **verified working**
(tested against the real API from a screen).

Files: `src/services/api/datasource-relationships/*` (shared shapes in `types.ts`, error class in
`relationship-error.ts`), `src/features/datasource-relationships/*`. No zod validators yet: the
declare form is not built, and its schema needs the catalog.

## Conventions that differ from other domains

- Envelope is `{ data, succeeded, code, messages, validationIssues }`. Validation issues are
  `{ code, field, message }`, and composite columns keep indexed paths such as
  `from.keyColumns[1]`.
- Services throw `RelationshipApiError` (not a plain `Error`). It keeps `status`, `code` and
  `validationIssues`, because the UI has to tell the statuses apart:
  - **403** administrator access is required.
  - **404** missing or another workspace's ID (indistinguishable on purpose).
  - **409** revision or source evidence changed. Keep the editor, reload, request another
    preview. Never silently replay an approval.
  - **422** a safe scoped preview could not be completed.
  - **400** any other invalid input.
- Reads (catalog, list, detail, history) are open to workspace members. Create, edit, preview,
  approve and disable need the workspace administrator role.
- Every write carries `expectedRevision`. After any successful mutation use the returned revision.
- Hooks name their mutate functions after the action and take `{ id, payload }` as variables, so
  one hook instance can serve any row.

## Endpoints

### GET /api/v3/datasource-relationships/catalog

- **Purpose:** Source labels, scoped datasets, columns, key types, identity candidates and
  physical foreign-key suggestions. Suggestions prefill a declaration, they are not approvals.
- **Auth:** workspace member.
- **Request:** none.
- **Response:** `data`: `{ datasets: [{ dataset: { companyId, datasourceId, datasetId, subjectType,
  grain }, sourceLabel, provider, mappingFingerprint, readPermission, active, columns: [{ name,
  keyType, semanticRole, identityCandidate }], identityKeys: [{ name, kind, columns }],
  previewSupported, previewLimitations }], suggestions: [{ name, from, fromColumns, to, toColumns,
  evidence, origin }] }`.
- **Used by:** `services/api/datasource-relationships/get-relationship-catalog.ts`,
  `features/datasource-relationships/use-get-relationship-catalog.ts`. Read by the Relationships
  page to turn `datasourceId` into `sourceLabel` (`pages/relationships/relationships-list.tsx`) and to
  fill the Declare form (`pages/relationships/relationship-declare.tsx`).
- **Status:** verified working (response shape, 2026-10-20)
- **Notes:** A real response was captured 2026-10-20: one PostgreSQL source labelled "testing db",
  7 datasets, 6 same-source foreign-key suggestions. Seen values: `keyType` Integer / Text /
  Decimal / Timestamp, `kind` Primary, `provider` PostgreSQL, `origin` FOREIGN_KEY,
  `readPermission` ALLOWED, `semanticRole` open-ended PascalCase with `Unknown`. A suggestion's
  evidence looks like `postgresql:foreign-key:app_events_customer_id_fkey`. Not seen: a second
  source (no cross-source case), `previewSupported: false`, composite keys, non-ALLOWED
  permissions. `readPermission` is `ALLOWED`, `UNVERIFIED` or `DENIED_OR_DEGRADED` per the handoff.
  A suggestion's `evidence` is one string, a declaration's is an array of 1 to 20. A dataset's
  `companyId` is server-assigned and must not be sent on a declaration. Datasets with
  `previewSupported: false` must not offer preview and must show `previewLimitations`.

### GET /api/v3/datasource-relationships

- **Purpose:** Paginated list of the workspace's relationships.
- **Auth:** workspace member.
- **Request:** query `offset` (default 0), `limit` (1 to 100, default 25).
- **Response:** `data`: `{ mappings, offset, limit, total }`. Each mapping is `{ id, revision,
  state, storedState, definition, limitations, approval }` without full history.
- **Used by:** `services/api/datasource-relationships/get-relationships.ts`,
  `features/datasource-relationships/use-get-relationships.ts`. Wired to the Relationships page at
  `/relationships` (`pages/relationships/relationships-list.tsx`).
- **Status:** wired (envelope verified with an empty list 2026-10-20; row shape not seen)
- **Notes:** A real response with nothing saved was captured: `{ offset: 0, limit: 25, total: 0,
  mappings: [] }`. A mapping row's shape is taken from the handoff prose only. `state` is
  `DRAFT | APPROVED | DISABLED | NEEDS_REVIEW`. `storedState` is the audited lifecycle state, and
  `NEEDS_REVIEW` only shows in `state`.

### GET /api/v3/datasource-relationships/{id}

- **Purpose:** One relationship: definition, effective state, limitations, approval, and the
  latest 50 audit revisions newest first.
- **Auth:** workspace member.
- **Request:** path `id`.
- **Response:** `data`: the mapping plus `history`, `historyTotal` (the head revision) and
  `historyTruncated`.
- **Used by:** `services/api/datasource-relationships/get-relationship-by-id.ts`,
  `features/datasource-relationships/use-get-relationship-by-id.ts`. Not wired to a screen yet.
- **Status:** wired
- **Notes:** `approval` (receipt, actor, time) and the revision and limitation element shapes
  are untyped (`Record<string, unknown>` / `unknown[]`) until a real response is captured.

### GET /api/v3/datasource-relationships/{id}/history

- **Purpose:** Every retained audit revision, newest first. Use when the detail reports
  `historyTruncated`.
- **Auth:** workspace member.
- **Request:** path `id`; query `offset`, `limit` (1 to 100, default 25).
- **Response:** `data`: `{ offset, limit, total, revisions, hasMore }`.
- **Used by:** `services/api/datasource-relationships/get-relationship-history.ts`,
  `features/datasource-relationships/use-get-relationship-history.ts`. Not wired to a screen yet.
- **Status:** wired
- **Notes:** Revision element shape not seen.

### POST /api/v3/datasource-relationships

- **Purpose:** Create a draft.
- **Auth:** workspace administrator.
- **Request:** body `{ definition: { name, meaning, from: { dataset, keyColumns }, to: { dataset,
  keyColumns }, cardinality, evidence, crosswalk? } }`.
  - `meaning`: `Reference | Identity`. Identity needs the same subject and grain on both sides and
    a real identifier.
  - `cardinality`: `OneToOne | ManyToOne | OneToMany | ManyToMany`, directional from source to
    target rows. Identity allows only the first two.
  - `keyColumns`: ordered, 1 to 8 exact column names. No trimming, case folding or fuzzy match.
  - `dataset`: `{ datasourceId, datasetId, subjectType, grain }`.
  - `evidence`: 1 to 20 references.
  - `crosswalk` (optional): `{ dataset, fromColumns, toColumns }`, each bridge side matching its
    endpoint's ordered types and arity.
- **Response:** `data`: the new mapping, revision 1, state `DRAFT`.
- **Used by:** `services/api/datasource-relationships/create-relationship.ts`,
  `features/datasource-relationships/use-create-relationship.ts`, wrapped by
  `use-declare-relationship.ts` and the Declare form (`pages/relationships/relationship-declare.tsx`).
- **Status:** wired (form built, not yet submitted against the real API)

### PUT /api/v3/datasource-relationships/{id}

- **Purpose:** Revise a relationship.
- **Auth:** workspace administrator.
- **Request:** path `id`; body is the whole write body plus `expectedRevision`.
- **Response:** `data`: the updated mapping.
- **Used by:** `services/api/datasource-relationships/update-relationship.ts`,
  `features/datasource-relationships/use-update-relationship.ts`. Not wired to a screen yet.
- **Status:** wired
- **Notes:** A revision clears approval and returns the mapping to `DRAFT`, so preview and
  approval are needed again. A `DISABLED` mapping stays disabled; a new current preview plus
  approval re-enables it. The handoff shows `{ expectedRevision }` plus the definition; whether
  the definition is nested under `definition` on PUT (as on POST) is assumed, not confirmed.

### POST /api/v3/datasource-relationships/{id}/preview

- **Purpose:** Read-only check of the declaration against the sources. Reads at most 10,001 rows
  per selected dataset, retains and counts at most 10,000, 30-second read budget.
- **Auth:** workspace administrator.
- **Request:** path `id`; body `{ expectedRevision }`.
- **Response:** `data.summary`: `{ sourceRowsExamined, targetRowsExamined, bridgeRowsExamined,
  matched, unmatched, unresolved, ambiguous, sourceMissingKeys, targetMissingKeys,
  bridgeMissingKeys, malformedKeys, cardinalityViolations, partial, canApprove }`. Also a
  `scope` (`COMPLETE_FOR_SELECTED_DATASETS | PARTIAL`) and a server-issued preview ID.
- **Used by:** `services/api/datasource-relationships/preview-relationship.ts`,
  `features/datasource-relationships/use-preview-relationship.ts`. Not wired to a screen yet.
- **Status:** wired
- **Notes:** The handoff does not say where `scope` and the preview ID sit. The types guess
  `data.scope` and `data.previewId`. Confirm on the first real preview. Counts describe examined
  source rows only, they are not money or population counts. In a partial preview, absence is
  `unresolved`, never "does not exist". 422 means a safe scoped preview could not be completed.

### POST /api/v3/datasource-relationships/{id}/approve

- **Purpose:** Approve using a current server-issued receipt.
- **Auth:** workspace administrator.
- **Request:** path `id`; body `{ expectedRevision, previewId, acceptPartial }`.
- **Response:** `data`: the approved mapping, revision incremented (1 to 2).
- **Used by:** `services/api/datasource-relationships/approve-relationship.ts`,
  `features/datasource-relationships/use-approve-relationship.ts`. Not wired to a screen yet.
- **Status:** wired
- **Notes:** The receipt lives 15 minutes and is bound to the workspace, revision, exact
  definition, schema fingerprints and import revision. Clients never send match statistics.
  `acceptPartial: true` needs a deliberate admin choice with the scope warning shown. Approval
  needs at least one supported match and no ambiguity, malformed key or cardinality violation.
  The hook sets `retry: false` and never replays on 409.

### POST /api/v3/datasource-relationships/{id}/disable

- **Purpose:** Disable a relationship.
- **Auth:** workspace administrator.
- **Request:** path `id`; body `{ expectedRevision, reason }`.
- **Response:** `data`: the mapping, state `DISABLED`, approval cleared, actor and reason audited.
- **Used by:** `services/api/datasource-relationships/disable-relationship.ts`,
  `features/datasource-relationships/use-disable-relationship.ts`. Not wired to a screen yet.
- **Status:** wired

## Missing

- A catalog from an account with two profiled sources (cross-source case).
- A real list row, detail and history response.
- A real preview response (where `scope` and the preview ID sit) and approve response.
- Confirmation of the PUT body shape.
