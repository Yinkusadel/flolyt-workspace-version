# Datasource relationships: V3 API and frontend handoff

Phase 2 provides configuration, read-only previews and administrator approval. Phase 3 will wire
approved definitions into runtime readers and migrate the acceptance fixture. Approval alone does
not change Opportunity/Leakage results yet. No relationship environment variables are required.

## Permissions and routes

All routes require authentication and use the caller's workspace. Catalog/list/detail are readable
by workspace members. Creating, editing, previewing, approving and disabling require the existing
workspace administrator role. Other workspaces' mapping/preview IDs return 404.

Prefix: `/api/v3/datasource-relationships`.

| Method and suffix | Purpose |
|---|---|
| `GET /catalog` | Human-readable source labels, scoped datasets, columns, key types, identity candidates and physical foreign-key suggestions |
| `GET ?offset=0&limit=25` | Paginated mappings; limit 1–100 |
| `GET /{id}` | Definition, effective state, limitations, approval and latest 50 audit revisions, newest first |
| `GET /{id}/history?offset=0&limit=25` | Page every retained audit revision, newest first; limit 1–100 |
| `POST /` | Create a draft |
| `PUT /{id}` | Revise with `expectedRevision` |
| `POST /{id}/preview` | Read at most 10,001 rows per selected dataset, retain/count at most 10,000; 30-second read budget |
| `POST /{id}/approve` | Approve a current server-issued receipt |
| `POST /{id}/disable` | Disable with revision and reason |

Responses use `{ data, succeeded, code, messages, validationIssues }`. Validation issues have
`code`, `field` and `message`; composite columns retain indexed paths, such as `from.keyColumns[1]`.
403 means administrator access is required; 404 hides foreign/missing IDs; 409 means revision/source
evidence changed; 422 means a safe scoped preview could not be completed. Other invalid inputs use
400. Preserve the editor on 409, reload, and request another preview. Do not silently replay approval.

The list uses `data.mappings`, `offset`, `limit`, `total`. Mapping details have `id`, `revision`,
`state`, `storedState`, `definition`, `limitations`, `approval`, `history`, `historyTotal` and
`historyTruncated`. List/write responses do not include full history; GET detail includes the last
50 revisions. Use `/{id}/history` for earlier revisions; its data has `offset`, `limit`, `total`,
`revisions` and `hasMore`. The detail's `historyTotal` is the head revision. History is workspace-scoped
and available to readers without administrator permission; foreign IDs return 404.

## Postman acceptance sequence

Connect/profile two sources first. Use the catalog's exact dataset scopes and column names.
The UUIDs below are placeholders selected from catalog entries; never add UUID fields to tenant
warehouse rows to configure a relationship.

1. `GET /catalog`. Select two datasets with compatible key types. Source names and column metadata
   are safe to display; no credentials or record values are returned. `readPermission` is `ALLOWED`,
   `UNVERIFIED`, or `DENIED_OR_DEGRADED`; `ALLOWED` describes recorded profile permission, not a live
   guarantee. Preview executes the actual read. `identityCandidate` guides selection of independent
   identifiers and does not prove uniqueness. Composite primary/unique keys are exposed in
   `identityKeys` as complete ordered `columns`, with `name` and `kind`; selecting one component alone
   does not qualify it as an identity. Unknown tables without an established subject/grain are omitted
   until profiled. Check `previewSupported` and display `previewLimitations`: multi-grain physical
   datasets require a grain-aware projection and are explicitly refused with `grain_projection_required`.
   They are not flattened or deduplicated into misleading match/uniqueness counts.
2. `POST /` with a declaration:

```json
{
  "definition": {
    "name": "Invoice to ledger account",
    "meaning": "Reference",
    "from": {
      "dataset": { "datasourceId": "<accounting-source-uuid>", "datasetId": "invoices", "subjectType": "invoice", "grain": "invoice" },
      "keyColumns": ["account_id"]
    },
    "to": {
      "dataset": { "datasourceId": "<commercial-source-uuid>", "datasetId": "accounts", "subjectType": "account", "grain": "account" },
      "keyColumns": ["id"]
    },
    "cardinality": "ManyToOne",
    "evidence": ["reviewed:invoice account identifier matches the commercial account identifier"]
  }
}
```

`meaning`: `Reference` or `Identity`. Identity asserts the same subject/grain on both sides and
requires an identifier, not names/contact details alone. `cardinality`: `OneToOne`, `ManyToOne`,
`OneToMany`, `ManyToMany`; Identity permits only the first two. Cardinality is directional, from
source rows to target rows. Keys are ordered arrays of 1–8 exact column names. There is no implicit
trimming, case folding, fuzzy matching or text-to-number conversion. Direct key component types
must agree. Evidence is required (1–20 references). Actor, company and origin are assigned by the
server; API declarations have `AdministratorDeclared` origin. Physical FK suggestions stay suggestions
until an administrator chooses to declare and approve a relationship.

An optional `definition.crosswalk` handles different identifiers:

```json
{
  "dataset": { "datasourceId": "<bridge-source-uuid>", "datasetId": "account_links", "subjectType": "identity_link", "grain": "link" },
  "fromColumns": ["commercial_account_id"],
  "toColumns": ["ledger_account_id"]
}
```

Each bridge side must match its respective endpoint's ordered types/arity. The endpoints themselves
may differ in type/arity when bridged. A bridge is read once with both sides together. No cross-database
SQL join, physical FK creation, warehouse mutation, or raw-record disclosure occurs.

3. Save `data.id` and `data.revision` (initially 1). `POST /{id}/preview`:

```json
{ "expectedRevision": 1 }
```

Inspect `data.summary`: `sourceRowsExamined`, `targetRowsExamined`, `bridgeRowsExamined`, `matched`,
`unmatched`, `unresolved`, `ambiguous`, `sourceMissingKeys`, `targetMissingKeys`, `bridgeMissingKeys`,
`malformedKeys`, `cardinalityViolations`, `partial`, `canApprove`. Matched/unmatched/ambiguous counts
describe examined source rows. Bridge missing/malformed counts include failing key sides (one bridge
row may fail both sides). Cardinality violations count duplicate key groups and invalid bridge fan-out,
including observed violations not referenced by a source row. They are not population or money counts.

`scope` is `COMPLETE_FOR_SELECTED_DATASETS` or `PARTIAL`. Partial absence is `unresolved`, never a
claim that the target does not exist. Null/blank components are missing, not identities. Incompatible
driver values are malformed. Approval requires at least one supported match and no observed ambiguity,
malformed key or cardinality violation. Missing keys and genuine unmatched records remain gaps.
Previews do not attest freshness, complete business history, monetary impact, or verified outcomes.

4. `POST /{id}/approve` using the server's preview ID:

```json
{ "expectedRevision": 1, "previewId": "<preview-uuid>", "acceptPartial": false }
```

Receipt lifetime is 15 minutes. It is bound to workspace, mapping revision, exact definition,
configuration/schema fingerprints (including column nullability) and import revision where available. A managed Salesforce import
must have a current completed extraction receipt; missing/changed receipts block approval. Unknown
import IDs on BYOW sources do not become invented completeness evidence. Clients never supply match
statistics. Partial checks require explicit `acceptPartial: true`; show the limit and obtain a deliberate
administrator choice. Even approved partial checks require fresh scoped cardinality checks at runtime.

Approval increments revision (1 → 2). `GET /{id}` should show `APPROVED`, its receipt/actor/time, and
both audit revisions. Reusing the old receipt after another mutation fails. Server-issued preview
receipts are immutable and not a substitute for business evidence or permission to execute actions.

5. `PUT /{id}` sends the entire write body plus `expectedRevision: 2`. A revision clears approval and
   returns to `DRAFT`, unless already `DISABLED`. Preview and approval are needed again. Editing a
   disabled mapping preserves its disabled state; a new current preview plus approval re-enables it.
6. `POST /{id}/disable` with `{ "expectedRevision": 3, "reason": "Identifier replaced" }`.
   The state is `DISABLED`, approval is cleared, and the actor/reason are audited.
7. Verify safety: use a foreign workspace, a non-administrator, stale revision, expired preview,
   duplicate identity target, unavailable source and a missing/changed column. These must refuse
   access/approval or expose `NEEDS_REVIEW`, never silently infer matches.

## Frontend experience

Add a Relationships screen under datasource settings: list → declare → preview → approve. Display
source labels, scoped datasets, key columns, meaning/direction, state and actionable limitations.
Use catalog suggestions to prefill, not approve. Keep key ordering visible. Do not show UUIDs as labels.
Offer composite `identityKeys` as a group. Disable preview for datasets where `previewSupported` is
false and show their limitations; those datasets need an explicit grain-aware projection before use.
When detail reports `historyTruncated`, load more through the history endpoint instead of treating the
latest 50 entries as the complete audit trail.

Display `state`, which may be `DRAFT`, `APPROVED`, `DISABLED`, or `NEEDS_REVIEW`. `storedState` retains
the audited lifecycle state. Configuration/schema/import changes, disconnection and recorded permission
loss make a stored approval `NEEDS_REVIEW` without rewriting history during GET. Reanalysis timestamps,
row counts, column ordering and unrelated profile version changes alone do not invalidate the mapping.
Live source outages can still prevent previews/runtime reads; profile permission is not a health probe.

Show matched/gap/ambiguous counts separately. Never present a partial preview as global coverage or
hide invalid keys behind a match percentage. Disable approval when `canApprove` is false. Surface the
explicit partial-acceptance option only with its scope warning. After any successful mutation use the
returned revision. No optimistic approval and no browser-only mapping storage.

No changes to conversation rendering or SSE are needed. This is a datasource settings workflow.
Commercial activity/progression readers and imported identity crosswalks now consume these approved
definitions. New Meridian acceptance setup uses `prepare` → API create/preview/approve → `publish`;
it does not require `bind-sources.sh` or any source-row updates. See the
[four-source acceptance guide](../demo/multi-source/README.md#4-prepare-history-approve-relationships-then-publish).

## Runtime behavior

`IDataRelationshipResolver` is shared Revenue Intelligence infrastructure. A caller supplies exact
workspace/source/dataset/subject/grain scopes and ordered record-identity columns. The resolver
reads current approved declarations and fresh source keys, retaining mapping revision/receipt
references with each resolved link. Commercial normalization adds these references to fact and
coverage evidence. This configuration evidence does not establish a priced opportunity or complete history.

Runtime checks source availability/permissions, configuration, schema and current import receipt
before and after reading keys. Commercial readers carry the original batch's typed record keys,
relationship fields and source binding into resolution. If those fields or that binding change,
the batch is rejected rather than assigning old facts to a newly read subject. After all warehouse
and receipt reads, resolution checks the complete relevant approval set again, including newly
approved mappings and earlier mappings revoked while later mappings were read. It never copies
keys across workspaces or guesses from names/emails.
Duplicate identities, incompatible scopes, competing targets, stale/unapproved/disabled mappings,
missing keys and unmatched rows remain explicit gaps. Existing native/imported scoped links work
without an administrator declaration; conflicting configured and explicit references require review.
Draft, disabled or stale declarations do not erase independently valid native/imported scoped
references. Commercial subject resolution considers subject-key references, not unrelated owner
references. Unbound records still require a current, unambiguous approved mapping. Matching uses
an indexed link lookup and checks cancellation between rows.

The current exact-key reader uses the preview reader's 10,000-row bound and 30-second operation
budget. A partial preview can be approved, but incomplete runtime reads are refused: unseen target
duplicates cannot be treated as unique, and unseen rows cannot establish absence. Large datasets
need a future paged/snapshot-capable key reader. There are no cross-database SQL joins or distributed
snapshot claims. Managed imports are checked against completed revisions; BYOW sources without a
revision cannot promise a cross-source transactional snapshot. Mixed-grain physical datasets remain
blocked until a grain-aware projection is available.

Link resolution and history attestation are independent. Approved matches without complete history
cannot prove no contact or no progression. Disabling/revising a mapping affects subsequent reads;
existing immutable publications keep their original evidence until recomputed. Display an unavailable
or blocked result as a gap, never zero opportunity. No new conversation/SSE UI contract is introduced.

## Operational diagnostics

Unexpected warehouse/import failures emit structured warning logs with company, datasource, dataset,
provider, operation, failure code (SQLSTATE for database errors) and correlation ID. Public failures
remain sanitized. Raw SQL, key/row values, credentials and provider exception messages are excluded
from the diagnostic log; the underlying exception is retained internally on the preview exception.
