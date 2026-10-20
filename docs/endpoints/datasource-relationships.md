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
- **Status:** verified working (2026-10-20, empty list and a real draft row)
- **Notes:** A real response with nothing saved was captured: `{ offset: 0, limit: 25, total: 0,
  mappings: [] }`. A real row was seen 2026-10-20 (a draft): `{ id, revision, state, storedState, definition,
  limitations, approval, history, historyTotal, historyTruncated }`. `definition` also carries
  `companyId` and `origin` (`AdministratorDeclared`), and `crosswalk` is `null` when absent. List
  rows carry `history: []` with `historyTotal: 1` and `historyTruncated: true`, so
  `historyTruncated` is not reliable on a list row. `state` is
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
- **Notes:** Seen live 2026-10-20 on an approved mapping: `approval` as described under approve, and
  `history` entries `{ id, companyId, mappingId, revision, definition, state, changedByUserId,
  changedAtUtc, changeReason, approval }` with `changeReason` CREATED then APPROVED. A history
  entry's `state` is title case ("Draft", "Approved"), the mapping's is upper case. Names were
  added 2026-10-20: `approval.approvedByName` and a history entry's `changedByName`. A history entry's
  `changeReason` is CREATED, REVISED or APPROVED, but on a disable it is the typed reason text. Seen
  on the real draft at revision 10 (create, three edits, approve, disable, approve, disable,
  approve): a disabled mapping re-enables by running a new preview and approving it again.

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
- **Status:** verified working (2026-10-20, a real draft was saved from the form and read back)
- **Notes:** The saved row came back as revision 1, `state` and `storedState` both `DRAFT`,
  `approval: null`, `limitations: []`, and the definition echoed with `companyId`,
  `origin: "AdministratorDeclared"` and `crosswalk: null`. `expectedRevision` is an optional
  nullable field on this body (`null | integer | string`), and is not sent on create.

### PUT /api/v3/datasource-relationships/{id}

- **Purpose:** Revise a relationship.
- **Auth:** workspace administrator.
- **Request:** path `id`; body is the whole write body plus `expectedRevision`.
- **Response:** `data`: the updated mapping.
- **Used by:** `services/api/datasource-relationships/update-relationship.ts`,
  `features/datasource-relationships/use-update-relationship.ts`, wrapped by
  `use-declare-relationship.ts` and the edit form (`pages/relationships/relationship-declare.tsx`
  with a `mapping`), opened by the Edit button on `/relationships/:id`.
- **Status:** verified working (2026-10-20: the history of the real draft shows three `REVISED`
  entries, so saves from the edit form completed)
- **Notes:** A revision clears approval and returns the mapping to `DRAFT`, so preview and
  approval are needed again. A `DISABLED` mapping stays disabled; a new current preview plus
  approval re-enables it. The handoff shows `{ expectedRevision }` plus the definition; whether
  the definition is nested under `definition` on PUT (as on POST) is assumed, not confirmed (the POST
  schema shows `expectedRevision` beside `definition`, so it likely matches). The edit form does not
  carry a crosswalk, so a relationship that has one is not editable from the app: sending the body
  without it would drop it.

### POST /api/v3/datasource-relationships/{id}/preview

- **Purpose:** Read-only check of the declaration against the sources. Reads at most 10,001 rows
  per selected dataset, retains and counts at most 10,000, 30-second read budget.
- **Auth:** workspace administrator.
- **Request:** path `id`; body `{ expectedRevision }`.
- **Response:** `data`: `{ id, mappingId, declarationRevision, summary, scope, canApprove,
  requiresPartialAcceptance, observedAtUtc, expiresAtUtc }`. `summary`: `{ sourceRowsExamined,
  targetRowsExamined, bridgeRowsExamined, matched, unmatched, unresolved, ambiguous,
  sourceMissingKeys, targetMissingKeys, bridgeMissingKeys, malformedKeys, cardinalityViolations,
  partial, canApprove }`. `scope` is `COMPLETE_FOR_SELECTED_DATASETS | PARTIAL`. `id` is the
  server-issued receipt that approval sends back as `previewId`.
- **Used by:** `services/api/datasource-relationships/preview-relationship.ts`,
  `features/datasource-relationships/use-preview-relationship.ts`, the Preview panel on
  `/relationships/:id` (`pages/relationships/preview-panel.tsx`).
- **Status:** verified working (2026-10-20, a real preview ran against the draft)
- **Notes:** First real response: 10,000 source rows examined, 1,500 target rows, all 10,000
  matched, no gaps or problems, `partial: true`, `scope: PARTIAL`, `canApprove: true`,
  `requiresPartialAcceptance: true`. The receipt expired 15 minutes after `observedAtUtc`. My
  earlier guess that the receipt was `data.previewId` was wrong: it is `data.id`. Counts describe
  examined source rows only, they are not money or population counts. In a partial preview,
  absence is `unresolved`, never "does not exist". 422 means a safe scoped preview could not be
  completed. Source and target are both capped at 10,000 rows, so a 10,000-row source read is
  partial by definition.

### POST /api/v3/datasource-relationships/{id}/approve

- **Purpose:** Approve using a current server-issued receipt.
- **Auth:** workspace administrator.
- **Request:** path `id`; body `{ expectedRevision, previewId, acceptPartial }`.
- **Response:** `data`: the approved mapping, revision incremented (1 to 2).
- **Used by:** `services/api/datasource-relationships/approve-relationship.ts`,
  `features/datasource-relationships/use-approve-relationship.ts`, the Approve section on
  `/relationships/:id` (`pages/relationships/approve-section.tsx`).
- **Status:** verified working, success path (2026-10-20: the user approved the draft from the
  app, with a partial preview and `acceptPartial: true`; the mapping went to `APPROVED`, revision 2)
- **Notes:** After approval the mapping's `limitations` contained one string: "Approval accepted a
  partial preview; every runtime match still requires scoped cardinality checks." The `approval`
  object (seen 2026-10-20): `{ previewId, declarationRevision, definitionFingerprint, bindings: [{
  dataset, sourceConfigurationFingerprint, mappingFingerprint, importId }], approvedByUserId,
  approvedAtUtc, partial, acceptedPartial }`. `importId` is null for a bring-your-own-warehouse
  source. `approvedByName` was added 2026-10-20. 409 and 403 responses are unseen. The receipt lives 15 minutes and is bound to the workspace, revision, exact
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
  `features/datasource-relationships/use-disable-relationship.ts`, the Disable button and modal on
  `/relationships/:id` (`pages/relationships/disable-modal.tsx`, a reason field inside the shared
  `components/confirm-modal.tsx`).
- **Status:** verified working (2026-10-20: the history of the real draft shows two disables with
  the reasons typed in the modal as `changeReason`, and a re-approval after each)

## Missing

- A catalog from an account with two profiled sources (cross-source case).
- A detail and history response, and a row with a non-null `approval` or non-empty `limitations`.
- A real approve response, and a preview with gaps or problems (non-zero counts).
- Confirmation of the PUT body shape.
