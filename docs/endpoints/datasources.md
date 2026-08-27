# Datasource Management endpoints

Part of the onboarding flow (step 3, "Your data" — connect a first source). See
[docs/endpoints/README.md](README.md) for the entry format and workflow.

Base path: `/api/flolyt/datasources` → `DATASOURCES_BASE_URL` / `API_ENDPOINTS.DATASOURCES` in
[`src/config/apiConfig.ts`](../../src/config/apiConfig.ts).

Status legend: **documented** (recorded here, not wired) → **wired** (service/hook built, no UI
yet) → **verified working** (tested against real API from a screen).

All endpoints require `Authorization: Bearer` unless noted. Envelope is the standard
`{ data, messages, succeeded }` shape **except `GET /connected` — see its entry**.

Zod validators for the endpoints with a fixed body live in
[`src/validators/datasources.ts`](../../src/validators/datasources.ts). `test-connection` and
`connect`'s `configuration` field has no fixed shape here — it's driven per-datasource by
`GET /{name}/connection-schema`'s `requiredFields`/`optionalFields`, so a dynamic connect-form
should validate against that instead.

**Note:** `apiConfig.ts` previously had a `DATASOURCES` block built ahead of any real spec
(`GET_DATASOURCE_SCHEMA`, `ANALYZE_DATASOURCE`, `GET_DATASOURCE_CAPABILITIES`,
`COMPUTE_DATASOURCE_SIGNALS`, `GET_DATASOURCE_SIGNALS_SUMMARY`) — nothing in the codebase
referenced it, so it's been replaced outright with the endpoints below to match this doc. If
those five come back as real endpoints later, re-add them then.

## Endpoints

### GET /api/flolyt/datasources

- **Purpose:** The catalog of datasource types Flolyt supports connecting to.
- **Request:** none.
- **Response:** `data`: array of `{ id, name, displayName, description, category, supportsBulkSync }`.
- **Used by:** `services/api/datasources/get-datasources.ts`, `features/datasources/use-get-datasources.ts`. Not wired to a screen yet.
- **Status:** wired

### GET /api/flolyt/datasources/connected

- **Purpose:** The datasources this tenant currently has connected.
- **Request:** none.
- **Response:** **Confirmed 2026-08-27 — no `{data, messages, succeeded}` envelope**, a raw
  array of `{ id, datasourceId, datasourceName, datasourceDisplayName, category,
  connectionName, isActive, connectionStatus, connectedOn, disconnectedOn, lastSyncedOn,
  lastSyncRecordCount, lastSyncError, metadata, architecture, targetSchemaName }`. Matches the
  currency domain's pattern of a one-off unwrapped response — see
  [[flolyt_onboarding_build]] lesson 3.
- **Used by:** `services/api/datasources/get-connected-datasources.ts`, `features/datasources/use-get-connected-datasources.ts`. Not wired to a screen yet.
- **Status:** wired
- **Notes:** If a real call turns out to return the standard envelope after all, fix both files
  together — don't patch just one.

### POST /api/flolyt/datasources/test-connection

- **Purpose:** Validates a connection's credentials before they're encrypted and persisted.
- **Request:** body `{ datasourceName, configuration }` — `configuration` shape is per-datasource, see note above.
- **Response:** `data`: `{ isSuccessful, errorMessage, serverVersion }`.
- **Used by:** `services/api/datasources/test-datasource-connection.ts`, `features/datasources/use-test-datasource-connection.ts`. Not wired to a screen yet.
- **Status:** wired

### GET /api/flolyt/datasources/{id}/sync-status

- **Purpose:** Sync status for a managed SaaS datasource.
- **Request:** path param `id` (uuid).
- **Response:** `data`: `{ datasourceId, datasourceName, architecture, targetSchemaName, lastSyncedOn, lastSyncRecordCount, lastSyncError, isActive }`.
- **Used by:** `services/api/datasources/get-datasource-sync-status.ts`, `features/datasources/use-get-datasource-sync-status.ts`. Not wired to a screen yet.
- **Status:** wired

### POST /api/flolyt/datasources/{id}/sync/trigger

- **Purpose:** Manually triggers a sidecar sync for a managed SaaS datasource.
- **Request:** path param `id` (uuid).
- **Response:** `data`: `null`.
- **Used by:** `services/api/datasources/trigger-datasource-sync.ts`, `features/datasources/use-trigger-datasource-sync.ts` (invalidates sync-status and connected-datasources on success). Not wired to a screen yet.
- **Status:** wired

### GET /api/flolyt/datasources/{id}/schema/mcp

- **Purpose:** The MCP-inferred schema JSON for a connected datasource.
- **Request:** path param `id` (uuid).
- **Response:** `data`: shape undocumented beyond the description — example shows `null`. Typed `unknown` until a real connected datasource shows the real shape.
- **Used by:** `services/api/datasources/get-datasource-mcp-schema.ts`, `features/datasources/use-get-datasource-mcp-schema.ts`. Not wired to a screen yet.
- **Status:** wired

### GET /api/flolyt/datasources/{name}/connection-schema

- **Purpose:** The required/optional connection fields for a given datasource type — drives a dynamic connect-form.
- **Request:** path param `name` (the datasource's `name`, not its numeric `id`).
- **Response:** `data`: `{ datasourceName, displayName, authenticationType, requiredFields: [{fieldName, displayName, fieldType, placeholder, helpText}], optionalFields: [...] }`.
- **Used by:** `services/api/datasources/get-datasource-connection-schema.ts`, `features/datasources/use-get-datasource-connection-schema.ts`. Not wired to a screen yet.
- **Status:** wired

### POST /api/flolyt/datasources/connect

- **Purpose:** Connects a new datasource with validated configuration.
- **Request:** body `{ datasourceName, connectionName, configuration }`.
- **Response:** `data`: the new connection's id (uuid string).
- **Used by:** `services/api/datasources/connect-datasource.ts`, `features/datasources/use-connect-datasource.ts` (invalidates connected-datasources on success). Not wired to a screen yet.
- **Status:** wired

### POST /api/flolyt/datasources/{id}/disconnect

- **Purpose:** Disconnects a datasource and cleans up derived artifacts (events, attributes, tokens).
- **Request:** path param `id` (uuid); query params `deleteCustomers` (boolean, default false) and `confirm` (string — must equal the datasource's display name to also hard-delete customers exclusively imported from it; multi-source customers are preserved).
- **Response:** `data`: boolean.
- **Used by:** `services/api/datasources/disconnect-datasource.ts`, `features/datasources/use-disconnect-datasource.ts` (invalidates connected-datasources on success). Not wired to a screen yet.
- **Status:** wired
- **Notes:** A UI wiring this in must get an explicit typed-confirmation step before ever sending `deleteCustomers=true` — it's a hard delete of customer data.

### POST /api/flolyt/datasources/{id}/reconnect

- **Purpose:** Reconnects a previously disconnected datasource and re-triggers schema analysis.
- **Request:** path param `id` (uuid).
- **Response:** `data`: boolean.
- **Used by:** `services/api/datasources/reconnect-datasource.ts`, `features/datasources/use-reconnect-datasource.ts` (invalidates connected-datasources on success). Not wired to a screen yet.
- **Status:** wired

### GET /api/flolyt/datasources/disconnections

- **Purpose:** The disconnect-with-delete audit history for the current tenant.
- **Request:** optional query params `datasourceId` (uuid), `from`, `to` (RFC 3339 date-times). Newest first, capped at 200.
- **Response:** `data`: array of `{ id, datasourceId, datasourceDisplayName, requestedAt, completedAt, candidateCustomerCount, actuallyDeletedCount, multiSourceCustomersPreservedCount, softCeilingExceeded, error }`.
- **Used by:** `services/api/datasources/get-datasource-disconnections.ts`, `features/datasources/use-get-datasource-disconnections.ts`. Not wired to a screen yet.
- **Status:** wired

### GET /api/flolyt/datasources/deletion-config

- **Purpose:** Reads the current tenant's delete-on-disconnect override settings.
- **Request:** none.
- **Response:** `data`: `{ companyId, warnCustomersDeletableThreshold, deletionBatchSize, effectiveWarnCustomersDeletableThreshold, effectiveDeletionBatchSize, lastUpdatedAt }` — always returns both the override values (nullable) and the effective values (global defaults filled in for any unset field).
- **Used by:** `services/api/datasources/get-datasource-deletion-config.ts`, `features/datasources/use-get-datasource-deletion-config.ts`. Not wired to a screen yet.
- **Status:** wired

### PUT /api/flolyt/datasources/deletion-config

- **Purpose:** Sets or updates the tenant's delete-on-disconnect override.
- **Request:** body `{ deletionBatchSize, warnCustomersDeletableThreshold }`, each `null | integer | string` (a numeric string matching `^-?(?:0|[1-9]\d*)$`). `null` clears that field back to the global default. Negative or zero `warnCustomersDeletableThreshold` disables the warning.
- **Response:** `data`: boolean.
- **Used by:** `services/api/datasources/update-datasource-deletion-config.ts`, `features/datasources/use-update-datasource-deletion-config.ts` (form-backed, `validators/datasources.ts`'s `updateDatasourceDeletionConfigSchema`, invalidates deletion-config on success). Not wired to a screen yet.
- **Status:** wired

### DELETE /api/flolyt/datasources/deletion-config

- **Purpose:** Removes the tenant override entirely; reverts to global defaults.
- **Request:** none.
- **Response:** `data`: boolean.
- **Used by:** `services/api/datasources/delete-datasource-deletion-config.ts`, `features/datasources/use-delete-datasource-deletion-config.ts` (invalidates deletion-config on success). Not wired to a screen yet.
- **Status:** wired

## Missing

_None flagged yet — this is the full set the user shared 2026-08-27._
