# Data Platform endpoints

See [docs/endpoints/README.md](README.md) for the entry format and workflow. Only the endpoint
wired so far is recorded in full below; the rest of the domain's operations (pasted by the user
2026-09-16) are listed under Missing until they're needed.

Base path: `/api/v3/data-platform` → `DATA_PLATFORM_BASE_URL` / `API_ENDPOINTS.DATA_PLATFORM` in
[`src/config/apiConfig.ts`](../../src/config/apiConfig.ts). Envelope is the standard
`{ data, messages, succeeded }` shape.

## Endpoints

### GET /api/v3/data-platform/schema-explorer

- **Purpose:** Aggregated schema across all of the tenant's connected datasources — the tables
  Flolyt has classified, and per-column type/role inference with a confidence score.
- **Request:** none.
- **Response:** `data`: `{ tables, totalDatasources, totalColumns }`. Each `tables[]` entry:
  `{ tableName, classifiedType, confidence, columns, datasourceType, clientDatasourceId,
  rowCount, lastSyncedAt }`. Each `columns[]` entry: `{ columnName, nativeDataType, mappedRole,
  confidence, sampleData, flags }`. `sampleData`'s shape is undocumented beyond the example
  (`null`) — typed `unknown`, not rendered in the UI until a real non-null example is seen.
- **Used by:** `services/api/dataplatform/get-schema-explorer.ts`,
  `features/dataplatform/use-get-schema-explorer.ts`. Wired to `/schema`
  (`src/pages/schema/`), linked from the user menu's Data section.
- **Status:** wired, not yet verified against a real call.

## Missing

The rest of this domain's surface was pasted 2026-09-16 but not yet documented in detail or
scaffolded — ask the user for full request/response shapes before building each one:

- `GET /events`, `POST /events/sync/{datasourceId}`
- `GET /profile-attributes`, `POST /profile-attributes/sync/{datasourceId}`
- `POST /customers/sync/{datasourceId}`
- `GET /identity-resolution/config`, `PUT /identity-resolution/source-priority`,
  `PUT /identity-resolution/merge-rules`, `PUT /identity-resolution/conflict-resolution`
- `GET /identity-resolution/dashboard`, `POST /identity-resolution/run`
- `GET /identity-resolution/conflicts`, `PUT /identity-resolution/conflicts/{conflictId}/resolve`
- `POST /query`
