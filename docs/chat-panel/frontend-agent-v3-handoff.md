# Agent API v3 frontend handoff

**Audience:** React/Vite frontend repository  
**Backend owner:** Agents  
**Compatibility:** existing `/api/flolyt/ai/*` routes remain aliases during migration

## Routes to consume

| Method | Route | Purpose |
| --- | --- | --- |
| `POST` | `/api/v3/conversations/messages` | Send a message; request SSE for a durable run |
| `GET` | `/api/v3/conversations?pageNumber=1&pageSize=20&scope=Visible` | List visible conversations |
| `GET` | `/api/v3/conversations/{conversationId}` | Read a transcript and its `activeRunId` |
| `DELETE` | `/api/v3/conversations/{conversationId}` | Archive a conversation |
| `GET` | `/api/v3/runs/{runId}` | Read durable run state and execution metadata |
| `GET` | `/api/v3/runs/{runId}/stream` | Reconnect to a run's SSE stream |
| `POST` | `/api/v3/runs/{runId}/cancel` | Request cancellation |
| `POST` | `/api/v3/runs/{runId}/steer` | Add a note for the next turn boundary |
| `GET` | `/api/v3/proposals?conversationId={id}&includeDecided=false` | Read proposal cards |
| `POST` | `/api/v3/proposals/{id}/accept` | Accept, optionally with edited arguments |
| `POST` | `/api/v3/proposals/{id}/defer` | Hold with a required reason |
| `POST` | `/api/v3/proposals/{id}/reject` | Reject |
| `GET` | `/api/v3/evidence/{kind}/{referenceId}` | Traverse evidence and outcome provenance |

All routes use the application's existing authorization mechanism. Do not send company/workspace IDs
in agent requests; the server binds tenant scope from the authenticated user.

## Start or continue a durable conversation

The durable path is the SSE form of `POST /api/v3/conversations/messages`. A plain JSON request uses
the synchronous compatibility path and does not provide the same reconnect lifecycle.

```ts
export type SendAgentMessage = {
  conversationId?: string | null;
  message: string;
  mode?: string | null;
  interactiveReply?: Record<string, string> | null;
};

const response = await fetch('/api/v3/conversations/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'text/event-stream',
    // Include the same credentials/auth header used by the rest of the app.
  },
  body: JSON.stringify({ conversationId, message } satisfies SendAgentMessage),
  signal,
});

if (!response.ok || !response.body) throw new Error(`Agent request failed: ${response.status}`);
```

Because this is a POST stream, browser `EventSource` cannot open it. Use `fetch()` plus a small SSE
parser (for example the frontend's existing parser or `eventsource-parser`) and preserve the `event:`
name as well as the JSON in `data:`.

The server first emits a `status` event whose message contains
`conversation_id:{conversationId}`, then a `run_queued` event with `runId`. Store both immediately.
The run ID enables stop, steer, polling, and reconnect.

## SSE envelope

Each `data:` value is camel-case JSON:

```ts
export type PromptStateEvent = {
  eventType: string;
  state: string;
  message?: string | null;
  errorMessage?: string | null;
  actionType?: string | null;
  reasoningSteps?: ReasoningStep[] | null;
  actions?: SuggestedAction[] | null;
  blockers?: string[] | null;
  inputRequest?: AgentInputRequest | null;
  runId?: string | null;
  proposal?: AgentProposalEvent | null;
  progress?: AgentProgressEvent | null;
  structuredResponse?: AgentResponseV2 | null;
  responseContractVersion?: string | null;
};
```

Handle these event types:

- `run_queued`: persist `runId` and show queued state.
- `progress`: show `progress.message`. Treat it as status only; it never contains tool names,
  arguments, SQL, credentials, prompts, or model reasoning.
- `final_response`: atomically replace the assistant response with `structuredResponse`. This is the
  validated terminal payload and is emitted after compatibility events.
- `response_chunk`: temporary v1 projection containing the same Markdown as the final response.
- `suggested_action`: temporary v1 projection of catalogued and authorized actions.
- `input_request`: render the choices/free-text control and return the answer in
  `interactiveReply` on the next message.
- `proposal`: render an approval card and use the proposal endpoints for decisions.
- `run_state`: reconcile after reconnect using `message` as the durable status.
- `error`: show `errorMessage` and stop the local streaming state.
- `run_cancelled`: mark the run cancelled.

Do not render `reasoningSteps`, `reasoning_step`, or `tool_call` for agent runs. The v3 agent path
uses `progress`; those legacy fields remain only for compatibility with other application surfaces.

## Structured response and actions

```ts
export type AgentResponseV2 = {
  contractVersion: '2.0';
  markdown: string;
  findings: Array<{
    id: string;
    title: string;
    summary: string;
    evidenceStatus: EvidenceStatus;
    metrics: Array<{
      id: string;
      label: string;
      value: string;
      unit?: string | null;
      basis?: string | null;
      impact?: ImpactStatement | null;
    }>;
    evidence: Array<{
      referenceType: string;
      referenceId: string;
      label: string;
      mappingVersion?: string | null;
      observedAtUtc?: string | null;
      coverage?: number | null;
      lineage?: number | null;
    }>;
  }>;
  caveats: Array<{ code: string; message: string }>;
  actions: SuggestedActionV2[];
  provenance?: ResponseProvenanceBundle | null;
};

export type EvidenceStatus = 'UNVERIFIED' | 'INDICATIVE' | 'CORROBORATED' | 'MEASURED';

export type IntelligenceReference = {
  kind:
    | 'Investigation' | 'Finding' | 'Evidence' | 'Hypothesis' | 'Impact'
    | 'Recommendation' | 'Decision' | 'Action' | 'Outcome'
    | 'SourceResolution' | 'Source';
  id: string;
};

export type ImpactStatement = {
  value?: string | null;
  unit?: string | null;
  basis: 'measured' | 'estimated' | 'unavailable';
  method?: string | null;
  confidence?: number | null;
  scope?: string | null;
  period?: { fromUtc: string; toUtc: string } | null;
  coverage?: number | null;
  lineage: IntelligenceReference[];
  assumptions: string[];
  unavailableReason?: string | null;
};

export type EvidenceStatusAssessment = {
  status: EvidenceStatus;
  reason: string;
  sourceGrade?: string | null;
  sourceBasis?: string | null;
};

export type ResponseProvenanceBundle = {
  contractVersion: '1.0';
  findings: Array<{
    findingId: string;
    evidenceStatus: EvidenceStatusAssessment;
    evidence: IntelligenceReference[];
    sourceResolution?: {
      capabilityId: string;
      decision: string;
      evaluatedAtUtc: string;
      selectedSources: IntelligenceReference[];
    } | null;
    traceRoots?: IntelligenceReference[] | null;
  }>;
};

export type SuggestedActionV2 = {
  id: string;
  kind: 'OpenRecord' | 'OpenWorkspaceSurface' | 'OpenRoom' | 'ConnectSource' | 'AskAgent';
  label: string;
  target: { resource: string; resourceId?: string | null };
  parameters?: Record<string, string> | null;
  eligibility?: {
    eligible: boolean;
    reason?: string | null;
    requiredCapabilities?: string[] | null;
  } | null;
};

export type AgentProgressEvent = {
  stage: string;
  message: string;
  atUtc: string;
  percent?: number | null;
};
```

Render `markdown` with a safe Markdown renderer whose raw-HTML mode is disabled. Structured fields
are the source for findings, metrics, evidence, caveats, and action controls; do not parse those
objects back out of Markdown.

Resolve action targets through a frontend-owned map. The initial server catalog emits these stable
resource names: `segment`, `campaign`, `datasources`, `channels`, and `room`. Combine a resource with
its optional `resourceId` through the app router. Ignore unknown resource names and never treat a
label, parameter, or model-authored text as a URL. Hide actions with `eligibility.eligible === false`.

## Evidence traversal

Render a response finding's evidence and source-resolution details directly from its provenance.
When `provenance.findings[].traceRoots` is present, or the UI already has an action/outcome
reference, load `GET /api/v3/evidence/{kind}/{referenceId}` for the wider business-record graph.
Route kinds are case-insensitive; use the canonical names from `IntelligenceReference.kind`. The
standard result envelope contains this data shape:

```ts
export type CanonicalIntelligenceProjection = {
  contractVersion: '1.0';
  root: IntelligenceReference;
  nodes: Array<{
    reference: IntelligenceReference;
    label: string;
    summary?: string | null;
    evidenceStatus: EvidenceStatusAssessment;
    impact?: ImpactStatement | null;
    observedAtUtc?: string | null;
    attributes?: Record<string, string> | null;
  }>;
  links: Array<{
    from: IntelligenceReference;
    to: IntelligenceReference;
    relation:
      | 'Investigates' | 'Establishes' | 'SupportedBy' | 'Tests' | 'Quantifies'
      | 'Recommends' | 'DecidedAs' | 'Executes' | 'Produced' | 'ResolvedFrom';
  }>;
  generatedAtUtc: string;
};
```

Render the evidence status from the structured field and show its `reason` as the explanation. Do
not promote statuses on the client. Display impact only from `ImpactStatement`; for
`basis === 'unavailable'`, show `unavailableReason` and no numeric value. Treat 404 as unavailable or
inaccessible without revealing which case applied.

## Reconnect and refresh

1. Load `/api/v3/conversations/{id}`.
2. If `activeRunId` is present, fetch `/api/v3/runs/{activeRunId}`.
3. For `queued`, `running`, or `awaiting_approval`, open
   `/api/v3/runs/{activeRunId}/stream` with a GET stream.
4. After a restart or on another node, a completed run emits its persisted `final_response` before
   `run_state`. Use that payload directly. If an older run has no final response, refresh the
   conversation for the persisted assistant message.
5. Clear local active-run state on `done`, `failed`, or `cancelled`.

Run state is returned inside the standard result envelope. The data object includes:

```ts
export type SourceCandidateState =
  | 'AVAILABLE'
  | 'PARTIAL'
  | 'STALE'
  | 'UNMAPPED'
  | 'LOW_QUALITY'
  | 'PERMISSION_BLOCKED'
  | 'SOURCE_DEGRADED'
  | 'NOT_AVAILABLE';

export type SourceResolution = {
  capabilityId: string;
  requiredEntities: string[];
  requiredRoleGroups: string[][];
  unmodelledSource?: string | null;
  decision:
    | 'no_source_required'
    | 'use_single_source'
    | 'combine_sources'
    | 'ask_for_mapping'
    | 'unavailable';
  evaluatedAtUtc: string;
  selectedSourceIds: string[];
  clarification?: string | null;
  unavailableReason?: string | null;
  candidates: Array<{
    sourceId: string;
    sourceName: string;
    state: SourceCandidateState;
    score: {
      relevance: number;
      authority: number;
      completeness: number;
      freshness: number;
      quality: number;
      lineage: number;
      timeCoverage: number;
      permission: number;
      total: number;
    };
    matchedEntities: string[];
    matchedRoles: string[];
    missingEntities: string[];
    missingRoleGroups: string[][];
    observedAtUtc?: string | null;
    mappingVersion?: string | null;
    lineage?: number | null;
    coverageFromUtc?: string | null;
    coverageToUtc?: string | null;
  }>;
};

export type AgentRun = {
  id: string;
  sessionId: string;
  status: 'queued' | 'running' | 'awaiting_approval' | 'done' | 'failed' | 'cancelled';
  cancelRequested: boolean;
  error?: string | null;
  turn: number;
  inputTokens: number;
  outputTokens: number;
  promptVersion: string;
  modelTier: string;
  execution?: {
    agentId: string;
    routingKind: 'explicit' | 'single_match' | 'multi_match' | 'unmatched' | 'unready';
    candidateAgentIds: string[];
    packVersion: string;
    outputContractVersion: string;
    effectiveVersion: string;
    boundToolNames: string[];
    methodIds: string[];
    sourceResolution?: SourceResolution | null;
    knowledgeRetrieval?: {
      mode: 'undeclared' | 'exact' | 'lexical' | 'hybrid_shadow' | 'shadow_error';
      collectionIds: string[];
      documentVersions: string[];
      chunkIds: string[];
      citations: Array<{
        collectionId: string;
        documentId: string;
        documentVersion: string;
        chunkId: string;
        title: string;
        sourceUri: string;
        section?: string | null;
      }>;
      filters: Record<string, string>;
      indexGenerationIds: string[];
      augmentedPrompt: boolean;
      status?: 'not_requested' | 'no_match' | 'matched' | 'failed' | null;
    } | null;
    executionPlan?: {
      schemaVersion: 'flolyt.agent-execution-plan.v1';
      planId: string;
      planVersion: string;
      orchestratorAgentId: 'flolyt.maestro';
      specialistSteps: Array<{
        stepId: string;
        agentId: string;
        requiredCapabilities: string[];
        expectedEvidence: string[];
        brief: string;
      }>;
      synthesis: { stepId: string; agentId: 'flolyt.maestro'; brief: string };
    } | null;
  } | null;
  executionRationaleId?: string | null;
  finalResponse?: AgentResponseV2 | null;
  responseContractVersion?: string | null;
  steering: Array<{ text: string; addedBy: string; addedAtUtc: string; consumed: boolean }>;
  createdAtUtc: string;
  finishedAtUtc?: string | null;
};
```

The execution object and `executionRationaleId` are useful for support and diagnostics. They should
not be presented as model reasoning or as user-editable controls. Source resolution is initially a shadow-mode field: display
it only on diagnostic or data-readiness surfaces and continue using the existing roster readiness
projection until backend enforcement is announced. Older runs return it as null or omit it.
`knowledgeRetrieval` follows the same rule. During Phase 5 it is diagnostic provenance only;
`augmentedPrompt` remains false. Do not render retrieved passages or citations in the conversation
until the backend announces that the retrieval quality gate has passed. Older runs omit the field.
`executionPlan` appears on multi-domain turns. It is a read-only audit view of Maestro's bounded
specialist assignments and synthesis step. Use it for an optional progress/details panel; the
conversation still renders one final Maestro answer. Older and single-specialist runs omit it.

Conversation message reads and synchronous JSON message responses also expose
`structuredResponse` and `responseContractVersion`. Prefer them when present. During migration,
`response` and legacy `suggestedActions` remain consistent projections of the v2 payload.

## Compatibility mapping

| v3 | Temporary legacy alias |
| --- | --- |
| `/api/v3/conversations/*` | `/api/flolyt/ai/conversations/*` |
| `/api/v3/proposals/*` | `/api/flolyt/ai/proposals/*` |
| `/api/v3/runs/*` | `/api/flolyt/ai/runs/*` |
| `/api/v3/evidence/*` | `/api/flolyt/ai/evidence/*` |

New frontend code should use v3. Remove legacy calls after production telemetry confirms the React
deployment has migrated and the backend removal threshold is approved.

Send `X-Flolyt-Agent-Contract: v3` on agent API requests so adoption telemetry distinguishes the
new React/Vite client from unknown callers. The backend counts v3 and legacy requests in
`flolyt.agent_api.requests`, split by `contract`, `surface`, and bounded `client_contract` labels.
Legacy responses carry `Deprecation: true`. Routes with an exact v3 equivalent also carry a
`successor-version` link to that resource. Legacy-only suggestion, sample-prompt, and visibility
routes omit the link rather than advertising an endpoint that does not exist.

The removal recommendation is zero production legacy requests for 30 consecutive days, then a
14-day rollback window. Alias deletion remains a separately approved release after that gate.
