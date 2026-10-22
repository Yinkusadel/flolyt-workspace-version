# Leakage Map V2 frontend handoff

Status: Phase 7 backend contract plus response-quality Phases 1â€“3. The React/Vite repository is separate, so this document is the implementation and acceptance handoff.

## Contract selection and rollout

Campaigns is the current physical backend owner; Revenue Intelligence is the intended bounded context. All routes require the normal authenticated workspace context.

`GET /api/v3/leakage` is the only dual-contract route. It returns the existing payload unless the authenticated company is selected by `RevenueIntelligence:LeakageV2:ReadRollout`. An enabled company receives `data.contractVersion: "2.0"`. If its V2 publication is missing or incomplete, the request fails explicitly; the server does not silently show legacy data.

The V2-only detail routes fail when the workspace is not enabled. Keep the current renderer until the page response itself declares `2.0`, then use this contract for the complete view.

## Routes

| Method | Route | Purpose |
|---|---|---|
| GET | `/api/v3/leakage` | Main projection, controls, cells, rollups and coverage summary |
| GET | `/api/v3/leakage/cells/{cellId}` | Cell evidence, components, lineage and work readiness |
| GET | `/api/v3/leakage/cells/{cellId}/history?limit=30` | Published history, newest first; limit 1–100 |
| GET | `/api/v3/leakage/cells/{cellId}/evidence` | Immutable public evidence used by Learn Why and its specialist response |
| POST | `/api/v3/leakage/cells/{cellId}/learn-why` | Start a Revenue Intelligence conversation run for this exact evidence bundle |
| GET | `/api/v3/leakage/coverage` | Signal and subject coverage detail |
| GET | `/api/v3/leakage/limitations?offset=0&limit=50&code={code}` | Paginated diagnostics behind the bounded page summary; limit 1–100 |
| GET | `/api/v3/leakage/calculation` | Versioned formula, ramp, baseline, recovery and severity policy |

The main and cell routes accept `mode=gross|expected|net`, `horizon=30|60|90|quarter|365|custom`, and `horizonDays=1..365` when the horizon is `custom`. The page also accepts distinct `market` and `currency` filters, plus `sector`, `severity=s1..s5`, `confidence=low|medium|high|0..1`, and `lifecycleClass=realized|in_flight|latent`. Cell history accepts `mode` and `lifecycleClass`.

Values are recalculated by the server when mode or horizon changes. Do not scale figures in the browser.

## Response envelope

Existing API middleware wraps each payload in the standard result envelope. Read the contract from `response.data.contractVersion`, not a header. A non-success response should render the returned message and keep the last successfully loaded projection visible with a retry control.

```ts
type Result<T> = {
  succeeded: boolean;
  data: T | null;
  messages: string[];
};

type DisplayState = "POPULATED" | "UNKNOWN" | "NO_EXPOSURE" | "HIDDEN_BY_FILTER";
type DisplayFacet = "COMPOUND";
type Availability =
  | "AVAILABLE"
  | "PARTIALLY_AVAILABLE"
  | "AVAILABLE_BUT_STALE"
  | "AVAILABLE_BUT_UNMAPPED"
  | "AVAILABLE_BUT_LOW_QUALITY"
  | "PERMISSION_BLOCKED"
  | "SOURCE_DEGRADED"
  | "NOT_AVAILABLE";

type Amount = {
  value: number;
  gross: number;
  expected: number;
  net: number;
  currency: string;
  market: string | null;
  mode: "GROSS" | "EXPECTED" | "NET";
  horizonDays: number;
  lifecycleClass: "REALIZED" | "IN_FLIGHT" | "LATENT";
  range: {
    status: "UNAVAILABLE" | "EMPIRICAL" | "CALIBRATED" | "ASSUMPTION";
    lower: number | null;
    upper: number | null;
    basis: string | null;
    version: string | null;
    probabilityMass: number | null;
  };
  confidence: number;
  confidenceLevel: "LOW" | "MEDIUM" | "HIGH" | "NOT_AVAILABLE";
  severity: "s1" | "s2" | "s3" | "s4" | "s5";
  candidateCount: number;
  asOfUtc: string;
  calculationReference: string;
};

type Cell = {
  id: string;
  sector: string;
  sectorLabel: string;
  coordinate: {
    mechanism: string;
    mechanismLabel: string;
    revenueStage: string;
    revenueStageLabel: string;
    stateDimension: string;
    stateDimensionLabel: string;
    stateValue: string;
    stateValueLabel: string;
    subject: { type: string; grain: string; unit: string };
    businessUnitScope: string | null;
  };
  state: {
    display: DisplayState;
    sourceAvailability: Availability;
    facets: DisplayFacet[];
    hiddenBy: string[];
  };
  amounts: Amount[];
  signalIds: string[];
  limitations: string[];
};

type Publication = {
  runId: string;
  snapshotId: string;
  asOfUtc: string;
  builtAtUtc: string;
  publishedAtUtc: string;
  registryVersion: string;
  sectorProfileVersions: string[];
};

type Rollup = {
  dimension: "mechanism" | "stage" | "state" | "market" | "currency" | "severity" | "sector" | "total";
  value: string;
  currency: string;
  market: string | null;
  lifecycleClass: string;
  amount: number;
  mode: string;
  cellCount: number;
};

type CoverageSummary = {
  effective: number | null;
  capability: number | null;
  scope: number | null;
  freshness: number | null;
  quality: number | null;
  applicableSignals: number;
  measuredSignals: number;
  declaredOnlySignals: number;
  residualUnknownUnits: number;
};

type LimitationSummaryItem = {
  code:
    | "CAPABILITY_GAP"
    | "SECTOR_ASSIGNMENT_MISSING"
    | "PRICING_INPUT_MISSING"
    | "BASELINE_HISTORY_MISSING"
    | "CURRENCY_POLICY_MISSING"
    | "NORMALIZED_FACTS_UNAVAILABLE"
    | "OTHER";
  origin: "WORKSPACE_DATA" | "WORKSPACE_HISTORY" | "WORKSPACE_CONFIGURATION" | "SECTOR_POLICY" | "PLATFORM_CAPABILITY" | "OTHER";
  message: string;
  affectedCount: number;
  recommendedAction: string;
  currencies: string[];
};

type LimitationSummary = {
  detailCount: number;
  items: LimitationSummaryItem[];
  detailsPath: "/api/v3/leakage/limitations";
};

type ReadinessState = "READY" | "ACTION_REQUIRED" | "WAITING_FOR_DATA" | "UNAVAILABLE";

type ReadinessAction = {
  // sources.connect and sources.review_capability are executable against the existing
  // datasources surface. Other values describe an unavailable future action.
  kind: string;
  label: string;
  eligible: boolean;
  target: "datasources" | null;
  capabilityId: string | null;
  sourceId: string | null;
  missingRequirements: string[];
  unavailableReason: string | null;
};

type Readiness = {
  state: "READY" | "ACTION_REQUIRED" | "LIMITED";
  actionRequiredCount: number;
  waitingCount: number;
  unavailableCount: number;
  items: Array<{
    category:
      | "SECTOR_CONFIRMATION"
      | "SOURCE_CAPABILITY"
      | "HISTORY"
      | "PRICING"
      | "POLICY_CONFIGURATION"
      | "PLATFORM_CAPABILITY";
    state: ReadinessState;
    origin:
      | "WORKSPACE_DATA"
      | "WORKSPACE_HISTORY"
      | "WORKSPACE_CONFIGURATION"
      | "SECTOR_POLICY"
      | "PLATFORM_CAPABILITY";
    message: string;
    affectedCount: number;
    currencies: string[];
    action: ReadinessAction | null;
  }>;
};

type LimitationDetailPage = {
  contractVersion: "2.0";
  total: number;
  offset: number;
  limit: number;
  code: LimitationSummaryItem["code"] | null;
  items: Array<{
    code: LimitationSummaryItem["code"];
    origin: LimitationSummaryItem["origin"];
    message: string;
    referenceType: string | null;
    referenceId: string | null;
    currency: string | null;
  }>;
  publication: Publication;
};

type LeakagePageV2 = {
  contractVersion: "2.0";
  controls: {
    mode: string;
    horizonDays: number;
    horizon: string;
    market: string | null;
    currency: string | null;
    sector: string | null;
    severity: string | null;
    confidence: string | null;
    lifecycleClass: string | null;
    modes: { value: string; label: string }[];
    horizons: { value: string; label: string }[];
    markets: string[];
    currencies: string[];
    marketOptions: Array<{
      market: string;
      currency: string | null; // deprecated preference alias; NOT a currency restriction
      preferredCurrency: string | null;
      currencies: string[];
      isPrimary: boolean;
      isConfigured: boolean;
      isObserved: boolean;
      hasExposure: boolean;
      state: "CONFIGURED_AND_OBSERVED" | "CONFIGURED_NOT_OBSERVED" | "OBSERVED_NOT_CONFIGURED" | "UNASSIGNED";
    }>;
    reportingCurrency: string | null;
    sectors: string[];
    severities: string[];
    confidenceLevels: string[];
    lifecycleClasses: string[];
  };
  publication: Publication;
  summary: {
    measurementState: "MEASURED" | "PARTIALLY_MEASURED" | "UNAVAILABLE";
    actionableExposure: Array<{
      currency: string;
      market: string | null;
      lifecycleClass: string;
      value: number;
      gross: number;
      expected: number;
      net: number;
      mode: string;
      cellCount: number;
    }>;
    materialLeaks: Array<{
      currency: string;
      market: string | null;
      lifecycleClass: string;
      items: Array<{
        rankWithinScope: number;
        cellId: string;
        mechanism: string;
        mechanismLabel: string;
        revenueStage: string;
        revenueStageLabel: string;
        amount: Amount;
      }>;
    }>;
    measurement: {
      pricedCandidateCount: number;
      unpricedCandidateCount: number;
      unpriceableObservationCount: number;
      populatedCellCount: number;
      measuredZeroCellCount: number;
      unavailableCellCount: number;
    };
  };
  readiness: Readiness;
  cells: Cell[];
  rollups: Rollup[];
  coverage: CoverageSummary;
  limitationSummary: LimitationSummary;
  // Compatibility field. It contains the same bounded category messages, never every diagnostic.
  limitations: string[];
};

type CellDetailV2 = {
  contractVersion: "2.0";
  cell: Cell;
  components: Array<{
    candidateId: string;
    signalId: string;
    mechanism: string;
    revenueStage: string;
    lifecycleClass: string;
    amount: Amount;
  }>;
  signals: Array<{
    id: string;
    signalId: string;
    observationFromUtc: string;
    observationToUtc: string;
    signalValue: number;
    confidence: number;
    currency: string | null;
    market: string | null;
    lifecycleClass: string;
    lineageReferences: string[];
    detectorVersion: string;
    baselineReference: string;
  }>;
  lineage: Array<{
    signalId: string;
    capabilityResolutionId: string;
    capabilityId: string;
    sourceAvailability: Availability;
    selectedSourceIds: string[];
    evaluatedAtUtc: string;
    resolverVersion: string;
    actions: Array<{ kind: string; label: string; sourceId: string | null; missingRequirements: string[] }>;
  }>;
  workState: {
    state: "UNREADY" | "READY";
    revenueLeakCaseId: string | null;
    roomId: string | null;
    explanation: string;
  };
  publication: Publication;
};

type CellHistoryV2 = {
  contractVersion: "2.0";
  cellId: string;
  limit: number;
  points: Array<{
    snapshotId: string;
    runId: string;
    asOfUtc: string;
    publishedAtUtc: string;
    state: Cell["state"];
    amounts: Amount[];
  }>;
};

type CoverageV2 = {
  contractVersion: "2.0";
  summary: CoverageSummary;
  signals: Array<{
    signalId: string;
    subject: Cell["coordinate"]["subject"];
    maturity: string;
    sourceAvailability: Availability;
    runOutcome: string;
    weight: number;
    capability: number;
    scope: number;
    freshness: number;
    quality: number;
    eligibleUnits: number;
    usableUnits: number;
    residualUnknownUnits: number;
    missingJoinUnits: number;
    missingValueUnits: number;
  }>;
  subjects: Array<{
    subject: Cell["coordinate"]["subject"];
    signalPopulationPairs: number;
    measurableSignalPopulationPairs: number;
    components: Array<{
      name: string;
      signalId: string;
      maturity: string;
      runOutcome: string;
      numerator: number;
      denominator: number;
      ratio: number;
    }>;
  }>;
  asOfUtc: string;
  policyVersion: string;
};

type CalculationV2 = {
  contractVersion: "2.0";
  calculationVersion: string;
  correlationPolicy: string;
  rangePolicy: string;
  modes: string[];
  horizonDays: number[];
  formulas: string[];
  policies: Array<{
    sector: string;
    sectorVersion: string;
    mechanism: string;
    baselineId: string;
    probability: number;
    baselineBasis: string;
    rampId: string;
    rampVersion: string;
    rampFactors: Record<string, number>;
    recoveryId: string;
    recoveryVersion: string;
    recoveryRate: number;
    recoveryBasis: string;
    severityPolicyId: string;
    severityPolicyVersion: string;
    severityCurrency: string;
  }>;
  assumptions: string[];
  limitations: string[];
  publication: Publication;
};
```

`Publication` contains `runId`, `snapshotId`, `asOfUtc`, `builtAtUtc`, `publishedAtUtc`, `registryVersion`, and `sectorProfileVersions`. A `Rollup` contains `dimension`, `value`, `currency`, `market`, `lifecycleClass`, `amount`, `mode`, and `cellCount`. Never add rollups with different currencies, markets, or lifecycle classes in the client.

## Rendering rules

Render axes from the supplied labels. The state dimension can describe invoices, payments, subscriptions, merchants, contracts, SKUs, branches, or customers; do not hard-code “customer stage.”

Use `summary.actionableExposure` for the headline money cards and
`summary.materialLeaks` for the material-leak cards. Each item is already bounded to one exact
currency, optional explicitly attributed market, and lifecycle class. A null market means the
source proved the currency but did not prove market attribution; label it “Market un-attributed”
instead of assigning it to the primary market. Rank is meaningful only inside its material-leak
group. Use `summary.measurementState` and the separately named measurement counts to explain
partial coverage; never add candidate, observation, and cell counts together.

Render market controls from `marketOptions`, keyed by `market`. They cover the same inventory as the
matrix, including observed markets absent from workspace configuration. Show the configured/observed
state. `preferredCurrency` (legacy alias `currency`) is nullable and is only a preference;
`currencies` lists known currencies for that market, not a claim that other currencies are invalid.
Do not automatically apply the preference as a currency filter. The top-level `markets` and
`currencies` arrays remain independent filter vocabularies. `reportingCurrency` is display context,
not permission to convert or merge local-currency values. Send `market=NG` and `currency=NGN` as
separate query parameters when both are selected.

- `POPULATED`: show each amount by currency, market, and lifecycle class. Show a range only when its status is not `UNAVAILABLE`.
- `UNKNOWN`: show the availability reason and limitations. Do not render zero or include it in monetary totals.
- `NO_EXPOSURE`: render a measured-zero state. This means the detector ran and found no exposure.
- `HIDDEN_BY_FILTER`: remove it from the active grid while retaining the loaded record so clearing a filter restores it without inventing state.
- `COMPOUND`: show that several independently supported candidates contribute.

`WINDOW_CLOSING` is reserved for a later contract revision once detectors persist an explicit action deadline. Phase 4 never infers urgency from severity, lifecycle, or observation age.

Use text and icons as well as color for every state. Each cell must expose an accessible name containing mechanism, revenue stage, state value, display state, amount/currency when present, severity, and confidence.

Filter changes should replace query parameters, request a fresh server projection, and announce loading without clearing the old grid. The server returns stable cells and marks excluded cells `HIDDEN_BY_FILTER`; rollups already contain only admitted amounts.

Render page-level limitations from `limitationSummary.items`, including `affectedCount`, currencies, and the recommended action. Use `detailsPath` only when the user opens diagnostics, then request `/limitations` in pages and optionally filter by `code`. Do not render both `limitationSummary` and the compatibility `limitations` array. The main page response remains bounded even when a calculation produces thousands of subject-level diagnostics.

## Detail, history, coverage and calculation panels

Cell detail returns the selected `cell`, independently calculated `components`, detector `signals`, source-capability `lineage`, `workState`, and `publication`. `workState.state` is `UNREADY` when case rollout is disabled, `READY` when the finding can create a case, and the current case status after creation. Keep the action visible but disabled only for `UNREADY`; use `workState.caseId` and `workState.roomId` to reopen existing work.

## Phase 5 case and Room workflow

The case owns accountability and business lifecycle. The Room is its collaboration surface. Do not infer case status from Room status or render the case as a generic task.

```ts
type RevenueLeakCaseStatus =
  | "DETECTED" | "REVIEWED" | "ASSIGNED" | "WORKED"
  | "RESOLVED" | "VERIFIED" | "CLOSED" | "INVALIDATED";

type RevenueLeakCase = {
  id: string;
  stableFindingId: string;
  cellId: string;
  sourceSnapshotId: string;
  status: RevenueLeakCaseStatus;
  ownerUserId: string | null;
  roomId: string | null;
  detectedAtUtc: string;
  updatedAtUtc: string;
  dueAtUtc: string;
  isOverdue: boolean;
  escalationLevel: number;
  evidenceReferences: string[];
  decisions: Array<{
    id: string; actorUserId: string; decision: string; reason: string; occurredAtUtc: string;
  }>;
  escalations: Array<{
    level: number; escalatedToUserId: string | null; reason: string; occurredAtUtc: string;
  }>;
  auditTrail: Array<{
    sequence: number; from: RevenueLeakCaseStatus; to: RevenueLeakCaseStatus;
    actorUserId: string | null; action: string; reason: string; occurredAtUtc: string;
  }>;
  valueAttributions: Array<{
    sourceVerificationId: string; roomOpeningNumber: number;
    kind: "PRESERVED" | "RECOVERED" | "CAPTURED";
    amount: number; currency: string; verifiedBy: string; verifiedAtUtc: string;
  }>;
};
```

Routes:

- `POST /api/v3/leakage/cells/{cellId}/case` with `{ "dueAtUtc": null }` creates or returns the deterministic case.
- `GET /api/v3/leakage/cases/{caseId}` refreshes lifecycle, audit, escalations, and verified value.
- `PUT /api/v3/leakage/cases/{caseId}/owner` with `{ "ownerUserId", "reason" }` assigns an active workspace member. A non-admin can assign only themselves.
- `POST /api/v3/leakage/cases/{caseId}/transitions` with `{ "target", "reason", "evidenceReferences" }` advances the lifecycle. Resolving requires evidence. The client must never submit `VERIFIED`.
- `PUT /api/v3/leakage/cases/{caseId}/due-date` with `{ "dueAtUtc", "reason" }` sets a future date within 365 days and resets escalation.
- `POST /api/v3/leakage/cases/{caseId}/decisions` with `{ "decision", "reason" }` appends a decision.
- `POST /api/v3/leakage/cases/{caseId}/room` with `{ "currency", "market", "lifecycleClass", "mode", "title" }` opens or returns the linked Room. Supply enough dimensions to select exactly one amount; currencies are never converted or combined.

Render the owner, due date, overdue/escalation state, current lifecycle step, most recent decision, evidence, and verified value on the case panel. Link to the normal Room route when `roomId` exists. A Room close may move a worked case to `RESOLVED` or `INVALIDATED`; the existing outcome-verification job later moves a supported resolution to `VERIFIED`, so refresh the case after either event.

History contains published snapshots only and is newest first. An empty `points` array is a valid “no earlier publication” state. Historical records can have unavailable confidence/range detail when the compact projection did not persist it; do not infer it from the current cell.

Coverage ratios are already normalized. Show eligible, usable, residual-unknown, missing-join, and missing-value counts per business subject. Never sum counts across different subject types or units.

Calculation is an explanation surface. Display the calculation version, formulas, correlation/range policies, and the exact baseline/ramp/recovery/severity policy rows. Treat assumptions and limitations as first-class content.

## Phase 6 evidence and Learn Why

Both Phase 6 routes use the same query controls as cell detail: `mode`, `horizon`, `horizonDays`, and
`lifecycleClass`. They require the company to be selected by both
`RevenueIntelligence:LeakageV2:ReadRollout` and
`RevenueIntelligence:LeakageV2:AgentContextRollout`. A disabled workspace receives an explicit
failure; the server never falls back to legacy evidence.

`GET /cells/{cellId}/evidence` returns `contractVersion:
"flolyt.revenue-leakage-evidence.v1"`, a content-derived `evidenceId`, the public question, explicit
`selection` (`mode`, `horizon`, `horizonDays`, and `lifecycleClass`), selected cell, components,
signal observations, extended capability lineage and candidates, relevant coverage,
calculation policies/formulas, limitations, case/Room state, permitted actions, and publication.
Render this data when an evidence drawer is useful, but never recalculate it or send a modified
bundle back to the agent.

When Learn Why starts, the backend persists that exact tenant-scoped bundle before it queues the
agent run. The specialist tool must present the same `evidenceId` and matching controls; changed
arguments or a missing snapshot fail closed. A cited bundle can also be reopened through the normal
canonical evidence route with kind `Evidence` and the URL-encoded `evidenceId`, so later publication
or case/Room changes do not rewrite the answer's provenance.

`POST /cells/{cellId}/learn-why` has no request body. Put the same calculation controls in its query
string. Its result contains `conversationId`, `runId`, `agentKey`, `agentLabel`, `title`, `question`,
and `horizonDays`. Immediately open `GET /api/v3/runs/{runId}/stream` as an SSE stream and feed those
events through the normal conversation reducer described in
`docs/frontend-agent-v3-handoff.md`. Keep the stream open until its terminal event. The specialist
answer is persisted in that returned conversation and uses the existing response contract, evidence
cards, actions, follow-up prompts, reconnect, and error behavior.

Render server actions by their typed identity:

- `revenue_leaks.review`: focus the named `cellId` and retain its `evidenceId` for the evidence drawer.
- `revenue_leaks.open_room`: create/open work for the supplied Revenue Leak Case using its supplied
  `currency`, optional `market`, `lifecycleClass`, and `mode`. The action is omitted when several
  amounts make the Room selection ambiguous; take the user through `revenue_leaks.review` first.
- `rooms.view`: navigate to the existing linked Room.
- `sources.review_capability`: open datasource mapping for its single required capability.
- `sources.connect`: show capability-specific source setup only when the backend proves the
  capability is `NOT_AVAILABLE`; do not infer a connector or vendor.

The agent may explain an estimate but cannot change its value, currency, market, lifecycle class,
or evidence grade. It cannot claim a verified outcome. Keep limitations visible beside the answer,
and treat the structured findings/actions as authoritative when prose and structure differ.

## Readiness and remediation sequence

Render `readiness` as a compact status strip beside the page summary. The five standard rows are
sector confirmation, source capability, history, pricing, and policy configuration. A sixth
platform-capability row appears only when a published detector cannot run because its normalized
reader has not been implemented. Do not turn that platform gap into a datasource request.

Use this sequence:

1. The overview shows the measurement state, scoped exposure, material leaks, and the readiness
   strip. Keep `READY` rows quiet; emphasize `ACTION_REQUIRED`, `WAITING_FOR_DATA`, and
   `UNAVAILABLE`.
2. Selecting a cell opens its existing detail drawer with observations and capability lineage.
   This is where the user can inspect which source and capability produced the map state.
3. Selecting a readiness gap opens the limitation drawer filtered by the corresponding limitation
   code when one exists. The drawer fetches `/api/v3/leakage/limitations` and never parses the
   compatibility `limitations` strings.
4. Enable an action only when `action.eligible` is true. `sources.connect` and
   `sources.review_capability` target the existing datasource surface and carry the exact
   `capabilityId` and optional `sourceId`. For an ineligible action, display
   `unavailableReason`; do not create a route or substitute a generic connector recommendation.

`WAITING_FOR_DATA` means normal synchronization must accumulate enough history. `UNAVAILABLE`
means the missing work belongs to sector policy or platform implementation. Neither state should
look like a failed source connection.

## Loading, errors and transport

The projection GET endpoints are deterministic reads and do not use SSE. Cache them by the full URL,
cancel superseded filter requests, and ignore a late response if its URL is no longer selected. A
cell drawer may fetch detail and history in parallel after the page has loaded. Learn Why is the
exception: its POST starts a durable run, then the client follows that run over the existing SSE route.

Use these states:

1. initial skeleton while no projection exists in memory;
2. stale-while-loading overlay for control changes;
3. empty map when cells exist but none are visible under the selected filters;
4. explicit “V2 publication unavailable/incomplete” error with retry for an enabled workspace;
5. per-panel error boundaries for detail, history, coverage, and calculation.

## Reference payloads

- [Main page](specs-leakage-v2/fixtures/page.v2.json) covers populated, unknown, measured zero, filtered, compound, and window-closing states.
- [Cell state vocabulary](specs-leakage-v2/fixtures/cell-states.v2.json) supplies compact renderer fixtures.
- [Cell detail](specs-leakage-v2/fixtures/cell-detail.v2.json), [cell history](specs-leakage-v2/fixtures/cell-history.v2.json), [coverage](specs-leakage-v2/fixtures/v2-coverage.json), and [calculation](specs-leakage-v2/fixtures/calculation.v2.json) are reference shapes for panels.

## Acceptance cases

- A legacy workspace still renders the existing response from `GET /api/v3/leakage`.
- A V2 workspace renders contract `2.0`; an incomplete V2 publication produces an error rather than legacy data.
- Changing 90 to 30 days fetches different server-calculated figures and updates `calculationReference`.
- Unknown, measured zero, and a monetary zero are visually and semantically distinct.
- Market, sector, severity, confidence, and lifecycle filters cannot leak excluded amounts into totals.
- Declared markets remain visible even when no amount is attributable to them; currencies never appear as market codes.
- `market` filters explicit market attribution and `currency` filters denomination; neither substitutes for the other.
- Currency and lifecycle classes remain separate in every rollup.
- A non-customer subject renders its own state dimension and unit.
- Keyboard users can reach cells, open detail, inspect lineage/history, and return focus to the originating cell.
- Screen-reader output identifies state and evidence without relying on color.
- The work action remains visible. It is disabled with its backend explanation for `UNREADY`, creates a case for `READY`, and opens the existing case or Room for lifecycle states.
- A non-owner cannot mutate an assigned case; an administrator can reassign it.
- A V2 Room closes and reopens against the exact amount selected at open, including market, lifecycle class, currency, and calculation mode.
- Verified value and prior Room openings remain visible after later lifecycle changes; the client never rewrites them.
- Learn Why starts Revenue Intelligence, returns a run immediately, and streams its concise answer through the normal run SSE/reconnect path.
- The final finding cites the same `evidenceId` returned by the evidence route and contains no monetary figure absent from that bundle.
- An existing but unmapped source offers `sources.review_capability`; `sources.connect` appears only after all current sources are exhausted and the capability state is `NOT_AVAILABLE`.
- The overview names each readiness category without exposing raw diagnostics, and its overall state
  becomes `ACTION_REQUIRED` when at least one workspace action is required.
- History gaps render as `WAITING_FOR_DATA`; sector-policy and normalized-reader gaps render as
  unavailable actions with their backend reason.
- The limitation drawer opens from a readiness row, keeps workspace-data and platform-capability
  origins distinct, and preserves the current overview and selected cell while loading.
- No button is enabled for an action whose `eligible` value is false.

## Phase 7 opportunity and cutover surfaces

`GET /api/v3/opportunities` is a separate positive-polarity read. Do not place its values in the
Leakage Map grid, subtract them from leakage, or present candidate revenue as missed opportunity.
Render `candidateCount` when a cell is `POPULATED`. Render money only from `amounts`; an empty
`amounts` list with candidates means preliminary opportunity signals exist but monetary upside is
not measurable. A signal is not necessarily a qualified opportunity or proven missed revenue.

```ts
type RevenueOpportunityPage = {
  contractVersion: "1.0";
  polarity: "MISSED_OPPORTUNITY";
  publication: {
    snapshotId: string;
    runId: string;
    definitionVersion: string;
    asOfUtc: string;
    builtAtUtc: string;
    publishedAtUtc: string;
  };
  candidateCount: number;
  pricedCandidateCount: number;
  cells: Array<{
    id: string;
    polarity: "MISSED_OPPORTUNITY";
    opportunityType: string;
    sectorProfileId: string;
    revenueStage: string;
    subjectType: string;
    grain: string;
    unit: string;
    state: "POPULATED" | "UNKNOWN" | "NO_OPPORTUNITY";
    candidateCount: number;
    amounts: Array<{
      currency: string;
      market?: string | null;
      grossPotential: number;
      expectedGain?: number | null;
      calibration: "ASSUMPTION" | "CALIBRATED" | "EMPIRICAL";
      candidateCount: number;
    }>;
    limitations: string[];
  }>;
  limitations: string[];
};
```

Use `GET /api/v3/leakage/cutover-readiness` only for rollout/operator diagnostics. The frontend must
not infer that legacy can be removed from `v2ReadSelected`; `readyToRetireLegacy` is the final gate
and remains false until dependency, SLO, rollback, Room, and explicit approval evidence exists.
`readBlockers` explains what prevents V2 becoming the default read. `retirementBlockers` includes
those items plus the separate human approval required to remove legacy. The
`activeRoomsWithoutV2Alias` counts only open Rooms that still depend on a legacy coordinate. Native
V2 Rooms already carry their selected coordinate and require no alias. A legacy alias counts as
mapped only when its `cellId` exists in the active published snapshot; archived historical aliases
do not hold the rollout open.

Opportunity rollout uses stable cohorts:

- `RevenueIntelligence:OpportunityV1:ShadowRollout:{Percentage,IncludedCompanyIds,ExcludedCompanyIds}`
- `RevenueIntelligence:OpportunityV1:ReadRollout:{Percentage,IncludedCompanyIds,ExcludedCompanyIds}`
- `RevenueIntelligence:LeakageV2:ShadowRollout:{Percentage,IncludedCompanyIds,ExcludedCompanyIds}`
- `RevenueIntelligence:LeakageV2:CompareRollout:{Percentage,IncludedCompanyIds,ExcludedCompanyIds}`
- `RevenueIntelligence:LeakageV2:ReadRollout:{Percentage,IncludedCompanyIds,ExcludedCompanyIds}`
- `RevenueIntelligence:LeakageV2:CaseRollout:{Percentage,IncludedCompanyIds,ExcludedCompanyIds}`
- `RevenueIntelligence:LeakageV2:AgentContextRollout:{Percentage,IncludedCompanyIds,ExcludedCompanyIds}`

The legacy `*CompanyIds` settings and `FLOLYT_LEAKAGE_V2_*_COMPANY_IDS` environment variables remain
compatible explicit include lists. Exclusions always win. In an isolated pre-launch environment,
set each required rollout percentage to `100`; this automatically includes newly created
workspaces without maintaining IDs.

```text
RevenueIntelligence__OpportunityV1__ShadowRollout__Percentage=100
RevenueIntelligence__OpportunityV1__ReadRollout__Percentage=100
RevenueIntelligence__LeakageV2__ShadowRollout__Percentage=100
RevenueIntelligence__LeakageV2__ReadRollout__Percentage=100
RevenueIntelligence__LeakageV2__AgentContextRollout__Percentage=100
RevenueIntelligence__LeakageV2__CaseRollout__Percentage=100
```

`CompareRollout` is optional during functional testing. Enable it at `100` only when validating
legacy-versus-V2 comparison diagnostics.

Rollout selection does not fabricate a read model. After first enabling shadow and read rollout,
wait for the leakage refresh (every 15 minutes at `:02`, also triggered by the normal datasource
lifecycle refresh), or in Development/Staging start `POST /api/flolyt/lifecycle/recompute?only=leakage-map`.
The refresh idempotently provisions an unconfirmed derived sector assignment for an unambiguous
SaaS & Cloud or Financial Services workspace and publishes the first snapshot. An ambiguous or
unsupported sector remains unready and requires explicit sector confirmation.

Acceptance additions:

- a growing account can appear as an unpriced opportunity candidate without any money badge;
- leakage and opportunity are never combined into one number or netted against each other;
- multi-currency priced opportunities remain separate;
- cutover readiness displays read and retirement blockers separately and cannot trigger retirement.

## Executive presentation update: market attribution

See [the phased presentation plan](specs-leakage-v2/executive-presentation-plan.md).
Phase 1 publishes `UNASSIGNED` for amounts without supported market attribution, including historical
amounts. Render it as **Unassigned market**. `controls.market: null` still means no market filter;
it does not describe an amount. Use `market=UNASSIGNED` to filter unattributed exposure.
The existing `rollups` entries with `dimension: market` now retain that bucket. Keep currency as a
separate dimension, including when several markets use USD. Never assign a market from currency or
workspace market settings. Old publications remain unassigned until a new compute reads mapped
market evidence. Posted orders without market and ambiguous account-level aggregates stay unassigned.
Do not display the first currency bucket as a workspace total. The executive summary/matrix and
exact calculation contract are subsequent phases; current coverage remains publication-wide.

## Executive presentation Phase 2

`GET /api/v3/leakage` now adds `executive`; existing fields remain compatible. Old saved payloads
can omit this object. Prefer it for the executive page. `recommendedMode` is `EXPECTED`; an explicit
mode selection is reflected by `selectedMode` and `selectedAmount`. Gross, expected and net remain
available side by side. No new frontend repository or components were created here.

| Field | Rendering and scope |
|---|---|
| `marketInventory.configuredMarkets` / `configuredMarketCount` | Markets configured by the workspace; not proof of usable data |
| `marketInventory.measurableMarkets` / `measurableMarketCount` | Markets supported by published observations; a lower bound, not exhaustive coverage |
| `marketInventory.marketsWithExposure` / `marketsWithExposureCount` | Known markets with positive published gross exposure |
| `marketInventory.hasUnassignedExposure` | Exposure exists without supported market attribution; exclude this bucket from known-market counts |
| `totals[]` | Filtered gross exposure, expected loss, net expected loss and selected amount, separated by currency and lifecycle; show every bucket |
| `markets[]` | One row per configured or evidenced market, plus Unassigned where needed; filtered amounts and affected entities, with publication-level measurement flags |
| `headlineFindings[]` | Deterministic patterns across comparable scope winners; never monetary rankings across currencies |
| `keyFindings[]` | Deprecated, now empty. Use headlines at executive level and `markets[].largestMechanisms` for detail |
| `marketReconciliation` | Configured-and-observed, configured-not-observed, observed-not-configured, unassigned exposure and review flag; publication scope |
| `confidence[]` | Filtered finding counts and expected-loss share associated with low-confidence findings, separately by currency/lifecycle |
| `matrix[]` | Rows carry sector and stage/mechanism/state coordinates; columns carry market, display, reason, facets and currency-separated amounts |
| `publicationCoverage` / `coverageMessage` | Publication-wide measurement coverage, independent of current filters |
| `recommendedBreakdown` | Market when more than one market/bucket is relevant, otherwise mechanism |
| `showSectorBreakdown` | True only when multiple sectors occur in the map |

The inventory's scope is `PUBLICATION`: market/currency/severity/confidence filters do not rewrite
workspace configuration or claim that excluded markets became unmeasurable. Monetary arrays and
affected-entity counts honor the selection. An empty amount list is not a monetary zero.

`markets[].attribution` contains `code`, `state` and `basis`. This uses shared `MarketAttribution`
semantics. Mapped evidence can be assigned; combining conflicting or partly missing evidence is
ambiguous and has code `UNASSIGNED`. Legacy persisted nulls cannot distinguish absent from ambiguous
evidence: their public state remains `UNASSIGNED`, basis `NO_SUPPORTED_ATTRIBUTION`. Do not reconstruct
that distinction from currencies or workspace settings. Typed attribution does not retrofit lost
provenance into old snapshots.

New detector observations persist attribution state and basis; cell-detail observations expose
the same `attribution` object. The executive unassigned bucket retains ambiguous observation
evidence even when it cannot be priced. `hasUnassignedExposure` still means positive monetary
exposure, not merely an unassigned observation.

Matrix entry facets describe only admitted contributors in that market. Unknown and filtered
entries do not inherit the publication's `COMPOUND` badge; publication facets remain on the
existing cell contract. Executive finding messages use “estimated exposure” to avoid presenting
assumption-based loss estimates as measured losses.

`measurabilityBasis: PUBLISHED_OBSERVATIONS_LOWER_BOUND` means measurement evidence exists for those
markets, not that all mechanisms can be measured there. Runs emitting zero observations do not prove
market coverage. Market rows therefore have `coverage: null` and
`coverageState: MARKET_DENOMINATOR_UNAVAILABLE`. Use the publication-wide coverage panel instead.

Confidence belongs to the selected findings, not to the whole company. Low means below 0.50,
medium is 0.50 to below 0.75, and high is 0.75 or above. A finding here is a cell/market/currency/
lifecycle amount; confidence is conservatively the lowest contributing estimate confidence.
The low-confidence expected-loss share measures exposure associated with those findings, not the
probability the entire map is wrong. Render, for example, "30% of USD expected loss is associated
with low-confidence findings". Do not render the global minimum as a workspace confidence score.

Affected-entity counts deduplicate subjects contributing under the published correlation policy
within each market and subject/grain. Counts exclude suppressed correlated alternatives and filtered
currency amounts. Keep units separate; do not sum accounts and invoices or add counts across markets
as a global unique-entity total. Key findings carry their own confidence and cell references.

`fxState: NOT_CONSOLIDATED_NO_APPROVED_FX` means reporting currency is metadata only. There is no
converted or globally ranked total. Order key-finding groups by market/currency/lifecycle, not by
numeric amount across currencies. Show expected, gross and net with labels that preserve whether
the exposure is realized, in flight or latent.

Matrix `publicationDisplay` retains the overall row state. A publication-wide `NO_EXPOSURE` does
not establish measured zero separately for each configured market. Market entries without scoped
evidence show `UNKNOWN / NO_MARKET_SCOPED_MEASUREMENT`. `HIDDEN_BY_FILTER` entries carry no amounts;
populated entries preserve confidence and the LOW_CONFIDENCE facet. Use labels/icons, not color alone.
Staleness is not inferred from wall-clock time in this deterministic projection; no unsupported
STALE or WINDOW_CLOSING facet is manufactured.

Frontend acceptance cases: two markets sharing USD; configured market with no observations; exposure
in an unconfigured source market; Unassigned exposure; currency filtering; a global measured-zero row
without market evidence; one low-confidence finding beside high-confidence findings; same entity
under multiple mechanisms; multiple subject units; absent FX; old payload without `executive`.
## Phase 3: exact calculation drawer

Use the selected amount's `calculationReference` as an opaque value:

`GET /api/v3/leakage/calculation/detail?calculationReference={urlEncodedReference}`

The existing `/calculation` route remains the policy overview. The detail route accepts no
company ID: authentication determines the workspace. References identify publication, cell,
market, currency, lifecycle, mode and horizon, and optionally an individual candidate or history
amount. A later compute does not redirect an old reference to the new active publication.
References are identifiers, not authorization credentials.

The result contains:

- `amount`: the referenced displayed amount and selected scope.
- `components`: impact, probability, ramp, recovery, gross/expected/net, selected amount,
  confidence, selected range and methodology, baseline, assumptions, caveats, source lineage
  and calculation/detector/mapping/policy versions.
- `included`, `inclusionReason`, `contribution`, correlation policy and deduplication key:
  excluded correlated candidates have zero contribution, even when their own estimate is positive.
- `includedGross/Expected/Net/SelectedAmount`: sums of included components.
- `reconciliationState`, `selectedAmountDelta`, `reconciliationTolerance`: reconciliation
  checks all four totals within 0.0001 currency units. Tiny decimal scaling differences in
  historical amounts are exposed, not silently rounded away.

Show the selected total first, then an expandable input table. Do not invent an aggregate
probability or confidence for heterogeneous components. Candidate references explain a candidate
before portfolio correlation; their inclusion reason says so. Correlation membership follows
the publication even if the requested mode/horizon changes. New publications persist combination
mode; old ones report `correlationModeBasis: INFERRED_FROM_LEGACY_TOTALS`.

Invalid references, foreign/unpublished publications, missing policy versions, incomplete
component evidence or totals that cannot reconcile return a failed result. Show unavailable
detail rather than substituting the newest calculation. Legacy pre-Phase-3 reference strings
are not resolvable; obtain a new reference by reading the page/history again.

Postman acceptance:

1. GET leakage with a market/currency and mode/horizon selection. Copy the exact reference
   from its populated cell amount; request calculation/detail with the same authentication.
2. Confirm included contributions equal the selected figure within the disclosed tolerance.
   Check the component formulas and inspect excluded candidates where correlation applies.
3. Repeat for gross, expected, net, and a custom horizon. Each reference preserves its scope.
4. Compute a new publication, then resolve the saved reference: publication/run and totals stay
   tied to the old publication. Try a history amount reference as well.
5. Use another workspace's authentication with the saved reference: no calculation is returned.

## Phase 4: coverage and opportunity explanations

The leakage page now exposes `coverageExplanation`. Lead with `headline` (measured/applicable
signals), then `effectiveCoverage` and `explanation`. The ratio is publication-wide and describes
the detectable leakage surface, not revenue coverage. Keep existing capability/scope/freshness/
quality ratios in an expandable detail area.

`issues[]` includes a stable code, category, business explanation, optional capability/subject/grain,
missing requirements and an optional action. Group categories as follows:

| Category | UI meaning |
| --- | --- |
| WORKSPACE_ACTION | Mapping, source connection or business-scope work |
| WAITING_FOR_DATA | Refresh or accumulate comparable history |
| QUALITY | Repair incomplete or invalid mapped fields |
| PERMISSION | Restore access to the required data |
| PLATFORM_LIMITATION | Reader or currency-policy support must be supplied by the platform |

Use action labels from the response. Only offer executable actions when `action.eligible` is true;
otherwise show the unavailable reason. Missing action metadata is not permission to invent a route.

Opportunity cells now expose `explanation`:

- `label`: render **Transaction growth readiness** for the current financial-services rule.
  Keep `opportunityType: product_deepening` as the stable identifier, not the presentation title.
- `measurementState`: MEASURED, PARTIAL_SCOPE, PARTIAL_HISTORY, WAITING_FOR_DATA, BLOCKED or
  NOT_RECORDED for older publications without structured evidence.
- `valuationState`: UNPRICED_READINESS when readiness candidates exist without monetary upside;
  NOT_ASSESSED when there is no valuation; PRICED only when actual amounts exist.
- `summary`, `reasons[]`, `missingRequirements`, `eligibleUnits`, `usableUnits`: explain what
  was assessed and what blocks it. Reason action labels are guidance, not executable API actions.

Never render unpriced readiness as zero missed revenue, guaranteed expansion, or a full opportunity
inventory. A negative result means only that this transaction-growth rule found no qualifying subjects
in its measured scope. Other opportunity detectors remain outside this phase.

The capability requirement now reads transaction-grain evidence using mapped timestamp and account
identity roles, then aggregates into account readiness. New opportunity publications use definition
version 1.1.0. Facts must belong to the selected source; an unavailable/mismatched normalized feed is
a platform limitation, not proof that source data is absent. Resolution messages describe available
source profiles rather than claiming an exhaustive audit of raw connected data.

Deployment/test checklist:

1. Read existing leakage/opportunity pages: new presentation fields appear; old opportunity snapshots
   identify structured details as NOT_RECORDED. Old generic absence messages use cautious wording.
2. Run a fresh compute to reassess the corrected capability requirement and persist structured
   readiness. Verify mapped TransactionDate (or EventTimestamp/CreatedAt) and account identity.
3. Verify missing identity mapping, denied permissions, low quality, stale data and absent history
   produce their own categories, rather than a blanket “connect another source” message.
4. Growing accounts may yield readiness candidates while amounts remain empty. No upside money
   should be shown until monetary evidence and calibration are available.

## Canonical Opportunity signals (definition version 1.2.0)

The Opportunity section represents evidence-backed paths to additional uncaptured revenue. Growth
readiness is one detector; labels, summaries and cards must not assume expansion, engagement or a
sales-platform source for every opportunity. Lead follow-up, quote progression, pricing, capacity,
cross-sell and other detectors will use this same shape. Do not require a dedicated CRM when another
connected source supplies equivalent capabilities.

Each cell has two additive optional fields. They are omitted for older publications until refresh:

```ts
type OpportunitySignalFields = {
  signalCount?: number; // Full count of detector signals, NOT unique businesses or monetary values.
  signalPreview?: OpportunitySignal[]; // At most 20; deterministic ID order, not a revenue ranking.
};
type OpportunitySignal = {
  id: string;
  detectorId: string;
  detectorVersion: string;
  opportunityType: string;
  label: string;
  revenuePath: string;
  subjectType: string;
  grain: string;
  unit: string;
  subjectReference: string;
  market: string | null;
  stage: "DETECTED" | "QUALIFIED" | "ACTIVELY_PURSUED" | "CAPTURED"
    | "MISSED_WINDOW_EXPIRED" | "INVALIDATED";
  pricingState: "UNPRICED" | "PRICED";
  valuation: {
    state: "UNPRICED" | "PRICED";
    currency: string | null;
    grossOpportunity: number | null;
    probabilityOfCapture: number | null;
    expectedGain: number | null;
    captureCost: number | null;
    captureFriction: string | null;
    netExpectedGain: number | null;
    pricingEvidence: string[];
    probabilityEvidence: string[];
    costEvidence: string[];
  };
  confidence: number; // Confidence in the signal, never probability of capture.
  availableWindow: { opensAtUtc: string | null; closesAtUtc: string | null; evidence: string[] } | null;
  evidence: string[];
  owner: { kind: string; reference: string } | null;
  outcome: {
    kind: "CAPTURED" | "MISSED_WINDOW_EXPIRED" | "INVALIDATED";
    reason: string;
    recordedAtUtc: string;
    capturedRevenue: number | null;
    currency: string | null;
    evidence: string[];
  } | null;
  asOfUtc: string;
};
```

Use `explanation.summary`, for example **3 opportunity signals detected; monetary upside is not yet
measurable.** Keep label and revenue path with each preview entry; show qualification and pricing
separately. `candidateCount` retains its older per-cell distinct-subject meaning; a subject with
several currency-specific signals can produce several signals. Do not sum signals into unique
opportunity or account counts across detectors. When preview length is below signal count, label
it as a preview. No full-signal paging endpoint is introduced in this change.

`UNPRICED_READINESS` remains the legacy cell explanation value for compatibility. New signal-level
pricing uses `UNPRICED` independent of detector or stage. Unknown probability, cost, window, owner
and outcome must not be rendered as zero, expired, assigned or captured. Actual captured revenue
belongs to outcome, not gross or expected upside. Render per-signal monetary values only from
valuation/outcome; use published `amounts` for aggregate money, never sum the preview. No FX-based
ranking, cross-detector overlap assumptions, or subtraction from Leakage is authorized.

This release produces only DETECTED/UNPRICED transaction-growth signals. It supplies neither new
detectors nor assignment/pursuit/outcome mutation endpoints. The window is an opportunity deadline,
not the historical measurement period. Signal IDs identify publication observations and must not
be treated as stable workflow IDs across refreshes.

API checks: recompute using the existing authenticated Leakage compute flow, then read
`GET /api/v3/opportunities`. For supported growth evidence, expect `signalCount > 0`, an unpriced
preview with evidence, and empty `amounts`. Compare an unavailable capability: it must explain the
blocker without claiming zero opportunities or demanding a particular vendor. Older publications
must still read successfully without the optional signal fields.

## Relationship-based market attribution

The warehouse reader now resolves market evidence through a shared semantic-layer resolver used by
purchase history and the Marketplace, Manufacturing, Telecom, Retail/FMCG, Logistics and Restaurant
fact queries. Existing market/currency response fields and the frontend rendering model are unchanged.

- A single confidently mapped `Market` field on the fact takes precedence. Null rows remain unassigned;
  they are not silently filled from a different geographical definition.
- Otherwise, one declared source-local foreign key can reach an explicitly mapped `Market` on a
  related account, branch, plant, merchant or other entity. The target must be readable and its full
  referenced key must be declared primary/unique. Composite keys are preserved.
- Account purchase history additionally supports `AccountCountry` on the fact or linked identity.
  Exact `country` on an Identity table has this meaning, including previously inferred Unknown
  columns. Country on arbitrary tables, destination/billing country, and currency are not substitutes.
- For Lemfi, this resolves `transactions.customer_id -> customers.customer_id -> customers.country`.
  It describes the sender/account market, not `transactions.destination_country` (the receiving corridor).
- Ambiguous fields/relationships, absent relationship evidence, denied access and missing target rows
  remain unassigned. A grouped left join preserves fact counts and money. Duplicate target records
  remain unassigned even if their market values happen to agree.

This implements a single declared relationship in the same source. It does not invent cross-source
or multi-hop joins, reinterpret historical country changes, or bypass capability/freshness gates.
Providers without relationship metadata need an explicitly mapped market on their fact view, or a
profile with the required relationship/key evidence. Source views can expose a transaction-time market
when account country changes over time. Workspace configured markets are not rewritten from data.

Deployment and Postman checks:

1. Deploy the backend. If the source profile predates physical FK/key discovery, call
   `POST /api/v3/datasources/{id}/analyze` and wait for analysis to finish. Inspect the source schema
   and capabilities through the existing datasource endpoints. Reanalysis also removes old heuristic
   mappings that treated names such as `destination_market` as generic Market; explicit overrides
   remain the workspace's responsibility.
2. In Development/Staging, trigger `POST /api/flolyt/lifecycle/recompute?only=leakage-map`, or wait for
   the scheduled lifecycle refresh. Wait for the new publication before reading `GET /api/v3/leakage`.
3. For the Lemfi fixture, eligible measured observations should now carry sender markets GB, US, CA,
   IE or NG. Which have exposure depends on the observations, window and detector. Missing/ambiguous
   evidence may still produce an UNASSIGNED bucket; do not demand zero unknowns.
4. Check configured markets separately: the example workspace declared GB/GH/KE/NG, while the demo
   has sender markets GB/US/CA/IE/NG. Correct the workspace configuration if the business intends a
   sender-market lens. Configuration alone cannot assign the observed amounts.
5. Amounts, purchase counts and currencies must reconcile before/after attribution. Two sender
   countries using USD must remain distinct; a destination of NG must not relabel a GB sender as NG.

## Executive contract corrections (October 2026)

See the [audit](specs-leakage-v2/executive-contract-audit.md) and
[illustrative response excerpt](specs-leakage-v2/fixtures/executive-market-contract.example.json).
These fields ship on existing publications after deployment; recomputation is not required.

- **Market controls:** one option per matrix market. `state`, `isConfigured`, `isObserved` and
  `hasExposure` describe publication evidence. Render observed-but-unconfigured markets normally,
  with a setup-review indicator. Configured-but-unobserved is not zero exposure. `preferredCurrency`
  can be null; legacy `currency` is the same preference. Do not treat either as a market identity
  or automatically constrain the query to it. Options remain available after applying filters.
- **Reconciliation:** use `executive.marketReconciliation.configuredAndObserved`,
  `configuredNotObserved`, `observedNotConfigured`, `hasUnassignedExposure` and `requiresReview`.
  Discovery never updates workspace settings. This contract introduces no update route or action.
- **Entities:** render `affectedEntities[]` by subject type and grain, with its unit. `count` is a
  distinct entity union for included priced findings, not summed mechanism counts. `state: EXACT`
  accompanies a number; `UNAVAILABLE` accompanies null. Market `affectedEntitiesState` is also
  UNAVAILABLE when an admitted cluster member lacks identity. Do not replace null with zero.
  Legacy `candidateCount` remains analytical contributor count and must not be labelled customers,
  accounts or affected entities. Never combine accounts with invoices into a single number.
- **Evidence:** `hasObservationEvidence` and `hasCandidateEvidence` describe publication evidence.
  `hasMeasuredExposure` means positive gross exposure in the current selection; it does not upgrade
  estimate confidence. `hasAffectedEntities` means a known positive distinct count in that selection.
  Use `affectedEntitiesState` to distinguish unknown from zero. Deprecated `hasMeasurementEvidence`
  retains exactly its old observation-exists meaning. Show `evidenceExplanation` for an unpriced or
  filtered-out market. An unassigned observation alone does not mean unassigned money.
- **Headlines:** use `executive.headlineFindings[]` for the page summary. Fields are `kind`,
  `mechanism`, `label`, `marketCount`, `markets`, `confidenceLevel`, `message`. The kind currently
  emitted is `DOMINANT_MECHANISM_ACROSS_MARKETS`. Confidence is conservative, not a global score.
  Keep `markets[].largestMechanisms[]` in market detail; `isTied` identifies equal scope leaders.
  `keyFindings[]` is deprecated and empty on new responses. When supporting older servers, use it
  only as market detail if `headlineFindings` is absent, not as repeated executive headlines.

Headlines respect current filters and never compare monetary amounts across currencies. They
require a strict winner in every currency/lifecycle scope represented in a market. Ties or conflicting
winners may legitimately produce no headline; do not fabricate one. Unassigned is excluded from
geographic market counts. Gross, Expected and Net remain distinct, and UNKNOWN still differs from
NO_EXPOSURE.
