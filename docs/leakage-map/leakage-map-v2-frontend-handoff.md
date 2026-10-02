# Leakage Map V2 frontend handoff

Status: Phase 7 backend contract. The React/Vite repository is separate, so this document is the implementation and acceptance handoff.

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
| GET | `/api/v3/leakage/calculation` | Versioned formula, ramp, baseline, recovery and severity policy |

The main and cell routes accept `mode=gross|expected|net`, `horizon=30|60|90|quarter|365|custom`, and `horizonDays=1..365` when the horizon is `custom`. The page also accepts `market`, `sector`, `severity=s1..s5`, `confidence=low|medium|high|0..1`, and `lifecycleClass=realized|in_flight|latent`. Cell history accepts `mode` and `lifecycleClass`.

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
  dimension: "mechanism" | "stage" | "state" | "market" | "severity" | "sector" | "total";
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

type LeakagePageV2 = {
  contractVersion: "2.0";
  controls: {
    mode: string;
    horizonDays: number;
    horizon: string;
    market: string | null;
    sector: string | null;
    severity: string | null;
    confidence: string | null;
    lifecycleClass: string | null;
    modes: { value: string; label: string }[];
    horizons: { value: string; label: string }[];
    markets: string[];
    sectors: string[];
    severities: string[];
    confidenceLevels: string[];
    lifecycleClasses: string[];
  };
  publication: Publication;
  cells: Cell[];
  rollups: Rollup[];
  coverage: CoverageSummary;
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

`Publication` contains `runId`, `snapshotId`, `asOfUtc`, `builtAtUtc`, `publishedAtUtc`, `registryVersion`, and `sectorProfileVersions`. A `Rollup` contains `dimension`, `value`, `currency`, `market`, `lifecycleClass`, `amount`, `mode`, and `cellCount`. Never add rollups with different currencies or lifecycle classes in the client.

## Rendering rules

Render axes from the supplied labels. The state dimension can describe invoices, payments, subscriptions, merchants, contracts, SKUs, branches, or customers; do not hard-code “customer stage.”

- `POPULATED`: show each amount by currency, market, and lifecycle class. Show a range only when its status is not `UNAVAILABLE`.
- `UNKNOWN`: show the availability reason and limitations. Do not render zero or include it in monetary totals.
- `NO_EXPOSURE`: render a measured-zero state. This means the detector ran and found no exposure.
- `HIDDEN_BY_FILTER`: remove it from the active grid while retaining the loaded record so clearing a filter restores it without inventing state.
- `COMPOUND`: show that several independently supported candidates contribute.

`WINDOW_CLOSING` is reserved for a later contract revision once detectors persist an explicit action deadline. Phase 4 never infers urgency from severity, lifecycle, or observation age.

Use text and icons as well as color for every state. Each cell must expose an accessible name containing mechanism, revenue stage, state value, display state, amount/currency when present, severity, and confidence.

Filter changes should replace query parameters, request a fresh server projection, and announce loading without clearing the old grid. The server returns stable cells and marks excluded cells `HIDDEN_BY_FILTER`; rollups already contain only admitted amounts.

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

## Phase 7 opportunity and cutover surfaces

`GET /api/v3/opportunities` is a separate positive-polarity read. Do not place its values in the
Leakage Map grid, subtract them from leakage, or present candidate revenue as missed opportunity.
Render `candidateCount` when a cell is `POPULATED`. Render money only from `amounts`; an empty
`amounts` list with candidates means the opportunity is evidence-backed but deliberately unpriced.

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

Acceptance additions:

- a growing account can appear as an unpriced opportunity candidate without any money badge;
- leakage and opportunity are never combined into one number or netted against each other;
- multi-currency priced opportunities remain separate;
- cutover readiness displays read and retirement blockers separately and cannot trigger retirement.
