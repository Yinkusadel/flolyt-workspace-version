# Agent API v3 frontend handoff

**Audience:** React/Vite frontend repository  
**Backend owner:** Agents  
**Compatibility:** existing `/api/flolyt/ai/*` routes remain aliases during migration

## Routes to consume

| Method | Route | Purpose |
| --- | --- | --- |
| `POST` | `/api/v3/conversations/messages` | Start a durable run, or steer the active run with `activeRunId` |
| `GET` | `/api/v3/conversations?pageNumber=1&pageSize=20&scope=Visible` | List visible conversations |
| `GET` | `/api/v3/conversations/{conversationId}` | Read a transcript and its `activeRunId` |
| `DELETE` | `/api/v3/conversations/{conversationId}` | Archive a conversation |
| `GET` | `/api/v3/runs/{runId}` | Read durable run state and execution metadata |
| `GET` | `/api/v3/runs/{runId}/stream` | Reconnect to a run's SSE stream |
| `POST` | `/api/v3/runs/{runId}/cancel` | Request cancellation |
| `POST` | `/api/v3/runs/{runId}/steer` | Direct steering API for non-composer clients |
| `GET` | `/api/v3/proposals?conversationId={id}&includeDecided=false` | Read proposal cards |
| `POST` | `/api/v3/proposals/{id}/accept` | Accept, optionally with edited arguments |
| `POST` | `/api/v3/proposals/{id}/defer` | Hold with a required reason |
| `POST` | `/api/v3/proposals/{id}/reject` | Reject |
| `GET` | `/api/v3/evidence/{kind}/{referenceId}` | Traverse evidence and outcome provenance |
| `GET` | `/api/v3/workspace/agents` | Read the authoritative enabled and ready agent roster |

All routes use the application's existing authorization mechanism. Do not send company/workspace IDs
in agent requests; the server binds tenant scope from the authenticated user.

Use `GET /api/v3/workspace/agents` for agent availability UI. Each agent includes `isEnabled`, the
compatibility `state` (`ready`, `reading`, or `not_ready`), and the more precise `detailedState`
(`ready`, `partially_ready`, `unavailable`, `disabled`, or `unprovisioned`). Treat an agent as live
only when `isEnabled` is true and `state` is `ready`; keep disabled and unavailable registered agents visible
with their `needs` explanation. Keep `unprovisioned` agents visible as an operator setup problem;
do not present them as a governance toggle the user deliberately switched off. Chat answers to
availability questions use this same roster, so the
screen and Maestro should report the same names and counts.

```ts
export type AgentRoster = {
  totalCount: number;
  readyCount: number;
  readingCount: number;
  notReadyCount: number;
  unprovisionedCount: number;
  agents: Array<{
    key: string;
    initials: string;
    name: string;
    description: string;
    isEnabled: boolean;
    state: 'ready' | 'reading' | 'not_ready';
    detailedState: 'ready' | 'partially_ready' | 'unavailable' | 'disabled' | 'unprovisioned';
    reads: string[];
    needs?: string | null;
    wouldUnlock?: string | null;
    moreDaysNeeded?: number | null;
    persona: string;
    sourceDecision?: string | null;
    sourceStates: string[];
    selectedSourceIds: string[];
  }>;
};

export type AgentRosterResponse = {
  succeeded: boolean;
  data: AgentRoster;
  messages: string[];
};
```

## Start or continue a durable conversation

The durable path is the SSE form of `POST /api/v3/conversations/messages`. A plain JSON request uses
the synchronous compatibility path and does not provide the same reconnect lifecycle.

```ts
export type SendAgentMessage = {
  conversationId?: string | null;
  message: string;
  mode?: string | null;
  interactiveReply?: Record<string, string> | null;
  activeRunId?: string | null;
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

## Steer through the normal composer

When the loaded conversation has a non-null `activeRunId`, keep the same composer visible and submit
its text to the same messages endpoint with both identifiers:

```ts
const result = await fetch('/api/v3/conversations/messages', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  body: JSON.stringify({
    conversationId,
    activeRunId,
    message: 'Include the failed-payment cohort and state the count explicitly.',
  } satisfies SendAgentMessage),
});
```

That request does not create another run. It validates that `activeRunId` belongs to
`conversationId`, appends the instruction to the existing run, and returns `Result<boolean>`.
Both IDs are required for this composer mode; sending `activeRunId` without `conversationId`
returns HTTP 400 so stale client state cannot redirect a different conversation.
The direct `POST /api/v3/runs/{runId}/steer` route remains available and has the same durable
semantics, but the composer should use the messages route so steering feels like part of the
conversation.

If a client requests SSE for this steering submission, the response contains one
`steering_queued` event and closes. Keep the original run stream open; this short response is only
an acknowledgement. A failed or terminal run returns the normal result failure in JSON, or an
`error` event over SSE.

Render the submitted text immediately as pending if desired, then reconcile from
`GET /api/v3/conversations/{conversationId}`. Steering entries are returned in chronological order
with `role: 'steering'`, attribution,
`steeringStatus: 'queued' | 'delivered' | 'not_delivered'`, and the exact model
turn that received them. `delivered` means the primary synthesising agent received the instruction;
internal summarizers and specialist calls cannot consume it.

## Render asynchronous specialist handoffs

An asynchronous handoff is conversation activity, not a message written by the user. The backend
returns one timeline item with `role: 'handoff'` as soon as the specialist run is queued. Never
render its `content` or `handoff.brief` in a user bubble.

Render this sequence:

1. A compact lifecycle card: `Maestro handed this to Sentinel` plus
   `queued | running | awaiting approval | completed | failed | cancelled` (the wire value for
   completed is `done`).
2. The short `handoff.reason` on the card. Put `handoff.brief` behind an expandable "View brief"
   control; it is useful context, but it is not the primary answer.
3. The subsequent assistant message as a normal answer with `agentLabel` attribution, for example
   `Sentinel`. That message's `runId` matches the handoff card's `runId`.
4. Render any catalogued action from the specialist's structured response below that answer.

Treat all handoff fields as display text. The backend strips markup and internal-only wording and
caps labels at 100 characters, reasons at 240 characters, and briefs at 2,000 characters. Keep raw
HTML disabled and do not reinterpret these fields as Markdown.

`handoff.sourceRunId` links back to Maestro's originating run. Render that source run's assistant
message as the card acknowledgement instead of a second full response bubble. The target
specialist's assistant message uses `handoff.runId` and remains a full answer.

The handoff card is the proof that asynchronous delegation occurred. `producedBy` remains the proof
for a synchronous consultation whose findings are folded into Maestro's single response. Do not
wait for a public `hand_off_to_agent` or `consult_agent` tool event.

While the originating run is streaming, the backend emits `agent_handoff` immediately after the
specialist run is durably queued. Upsert the lifecycle card by `handoff.targetRunId`; do not append
a second card when the conversation is later refetched. If the live event was missed, the
`role: 'handoff'` timeline item remains the authoritative recovery path.

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
  handoff?: {
    targetRunId: string;
    sourceRunId: string;
    fromAgentKey: string;
    fromAgentLabel: string;
    toAgentKey: string;
    toAgentLabel: string;
    reason: string;
    brief: string;
    status: 'queued';
  } | null;
};
```

Handle these event types:

- `run_queued`: persist `runId` and show queued state.
- `steering_queued`: acknowledge a composer submission that targeted an existing run; do not replace
  the run ID or open a second stream.
- `agent_handoff`: immediately upsert a specialist lifecycle card keyed by
  `handoff.targetRunId`. The envelope's `runId` is the originating run; the payload identifies the
  new specialist run.
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
Do not wait for an event named after a tool such as `consult_agent`; named tool invocation is an
internal audit detail. Confirm specialist participation from the validated final findings and
caveats, or from server logs and run diagnostics when investigating a fault.

## Structured response and actions

```ts
export type AgentResponseV2 = {
  contractVersion: '2.0';
  responseKind: 'analysis' | 'informational' | 'conversation';
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
      method?: string | null;
      period?: { fromUtc: string; toUtc: string } | null;
    }>;
  }>;
  caveats: Array<{ code: string; message: string }>;
  actions: SuggestedActionV2[];
  suggestedFollowUpPrompts: AgentFollowUpPromptV2[];
  provenance?: ResponseProvenanceBundle | null;
};

export type AgentFollowUpPromptV2 = {
  id: string;
  prompt: string;
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
    producedBy?: {
      agentId: string;
      agentLabel: string;
    } | null;
    evidenceStatus: EvidenceStatusAssessment;
    evidence: IntelligenceReference[];
    sourceResolution?: {
      capabilityId: string;
      decision: string;
      evaluatedAtUtc: string;
      selectedSources: IntelligenceReference[];
      state?: CapabilitySourceState | null;
      candidates?: Array<{
        source: IntelligenceReference;
        state: SourceCandidateState;
        matchedEntities: string[];
        matchedRoles: string[];
        observedAtUtc?: string | null;
        mappingVersion?: string | null;
        coverageFromUtc?: string | null;
        coverageToUtc?: string | null;
      }> | null;
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

Render `markdown` as the primary answer for every response kind. For `analysis`, render
`findings` as the expandable supporting-facts cards already used by the conversation UI. For
`informational` and `conversation`, `findings` and `provenance.findings` are intentionally empty;
do not create an empty findings capsule. The provenance collection enriches the matching public
finding and is not a second findings list for display.

Pure greetings and stable product questions such as `What is Flolyt?` use a deterministic fast
path. They still arrive through the same durable run and `final_response` event, but normally have
`responseKind: 'conversation'` or `'informational'`, no findings, no actions, and no tenant-data
progress/tool activity.

Render `markdown` with a safe Markdown renderer whose raw-HTML mode is disabled. Structured fields
are the source for findings, metrics, evidence, caveats, and action controls; do not parse those
objects back out of Markdown.

Render `suggestedFollowUpPrompts` as a short list of clickable prompt chips below the completed
answer. Newly generated responses contain at least three. When a user selects one, send its
`prompt` unchanged through the normal conversation message endpoint so it appears in history as a
user message and starts the next run. Do not execute it as a governed action or send it to the
steering endpoint. Prompts are response-aware: evidence prompts appear only when evidence exists,
while data-gap and action prompts follow the actual answer. Do not add fixed client-side prompts.
Older persisted responses may omit the field, so treat it as an empty list during rollout.

Backend answers target 100 prose words with a soft allowance of 175. Markdown table cells are
excluded so every relevant currency or market can remain visible. Longer answers remain valid when
needed to preserve an accurate answer. Do not truncate Markdown or flatten tables in the client;
use horizontal scrolling for wide tables. The UI may place evidence, provenance, and the handoff
brief behind disclosure controls.

Product identity: Flolyt is a Revenue Lifecycle Intelligence platform. Customer/account health is
supporting diagnostic evidence, not a business-performance KPI. For broad business answers, preserve
revenue-first ordering and distinguish leakage, opportunity, verified outcomes and coverage. Do not
promote a customer-health finding into an overall business-health card. Explicit customer/churn
questions can still show health and lifecycle diagnostics. A dedicated BusinessOverview contract is
now produced through `get_business_overview`; it is projected into the existing response-v2 `findings`,
`caveats`, `provenance`, and Markdown fields, so the frontend needs no new wire shape. Render findings
in their server order: revenue performance, leakage, opportunity, verified outcomes, material Rooms,
then capability coverage. Keep unavailable measurements visible as gaps and never render them as zero.
Do not sum findings across currencies or combine leakage, opportunity, and outcome amounts in the client.

Resolve action targets through a frontend-owned map. The initial server catalog emits these stable
resource names: `segment`, `campaign`, `datasources`, `channels`, and `room`. Combine a resource with
its optional `resourceId` through the app router. Ignore unknown resource names and never treat a
label, parameter, or model-authored text as a URL. Hide actions with `eligibility.eligible === false`.

For `rooms.view`, open the existing Room detail surface using `target.resourceId`. The backend emits
this read-only action only when a material Room has a valid id and the overview contains one currency;
it does not pick a winner across currencies. Business-overview actions do not default to campaigns,
messaging channels, email, SMS, or win-back flows.

For `sources.connect`, open the datasource management surface and carry `missingCapability`
(for example `payment_failure_events`) as context. The current `actionMode` is `connect_or_map`:
the UI should let the user map an existing warehouse source or connect a new one. Do not treat
`missingSource` as a connector type; it is a display label. Capability source resolution now
distinguishes an unmapped existing source from an unavailable one, so readiness UI should prefer the
capability state and clarification when they are present.
For business overviews, `sources.connect` is emitted for a verified mapping requirement and carries the
exact missing capability in both `parameters.missingCapability` and
`eligibility.requiredCapabilities`. Stale, permission-blocked, or degraded source states may instead
emit `sources.review_capability`; route it to the same datasource management surface and retain its
single `eligibility.requiredCapabilities` value as the issue context. A generic canonical read failure
remains a caveat because it does not prove that datasource management is the remedy. A capability missing
from the typed provider does not by itself produce a connector action.

The server ranks typed follow-up prompts against the final public answer before filling any remaining
slots with generic prompts. Prompts returned by a consulted specialist survive the Maestro handoff.
Render the supplied order and send the selected prompt through the normal message endpoint unchanged.

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

When `producedBy` is present, the finding came back from that consulted specialist and passed the
same response validation as every other finding. The UI may show the agent label as attribution
such as `Prism`, but should not infer specialist participation from Markdown or generic progress
events. An execution-plan entry without `producedBy` means the specialist was planned; it does not
prove that the specialist returned a usable result.

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
  requireCoherentDataset: boolean;
  requiresProviderConfirmation: boolean;
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

export type CapabilitySourceState =
  | 'NO_SOURCE_REQUIRED'
  | 'AVAILABLE'
  | 'PARTIAL'
  | 'MAPPING_REQUIRED'
  | 'STALE'
  | 'LOW_QUALITY'
  | 'PERMISSION_BLOCKED'
  | 'SOURCE_DEGRADED'
  | 'UNAVAILABLE'
  | 'PROVIDER_CONFIRMATION_REQUIRED';

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
    routingKind: 'explicit' | 'single_match' | 'multi_match' | 'unmatched' | 'unready' | 'orchestrated';
    candidateAgentIds: string[];
    packVersion: string;
    outputContractVersion: string;
    effectiveVersion: string;
    boundToolNames: string[];
    methodIds: string[];
    sourceResolutionEnforced: boolean;
    responseIntegrityEnforced: boolean;
    sourceResolution?: SourceResolution | null;
    capabilitySourceResolutions: Array<{
      capabilityId: string;
      state: CapabilitySourceState;
      canMeasure: boolean;
      enforced: boolean;
      resolution: SourceResolution;
    }>;
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
    modelRouting?: {
      policyVersion: string;
      mode: 'off' | 'shadow' | 'active' | 'fallback' | string;
      cohortKey: string;
      baselineModelId: string;
      candidateModelId?: string | null;
      recommendedModelId: string;
      selectedModelId: string;
      reason: string;
      isHoldout: boolean;
      baselineSamples: number;
      candidateSamples: number;
      consecutivePasses: number;
    } | null;
  } | null;
  executionRationaleId?: string | null;
  finalResponse?: AgentResponseV2 | null;
  responseContractVersion?: string | null;
  handoff?: {
    sourceRunId?: string | null;
    fromAgentKey: string;
    fromAgentLabel: string;
    toAgentKey: string;
    toAgentLabel: string;
    reason: string;
    brief: string;
  } | null;
  steering: Array<{ id: string; text: string; addedBy: string; addedAtUtc: string; consumed: boolean }>;
  createdAtUtc: string;
  finishedAtUtc?: string | null;
};
```

The execution object and `executionRationaleId` are useful for support and diagnostics. They should
not be presented as model reasoning or as user-editable controls. Display source resolution only on
diagnostic or data-readiness surfaces. The two execution-level enforcement booleans record the policy
frozen for that run. Older runs can return false or omit fields added after they were recorded. Treat a
missing `capabilitySourceResolutions` field as an empty array. Each entry is independent. Use
`canMeasure` as a product rendering gate only when that entry's `enforced` value is true; a false value
means the decision was recorded in shadow mode for diagnostics and must not change the customer UI.
Keep available revenue when margin or a breakdown is unavailable, and show the specific mapping,
freshness, permission, or degradation gap beside only the affected capability.
`PROVIDER_CONFIRMATION_REQUIRED` means no connected source is required, but the internal business
provider has not yet supplied the platform fact, so it is not measurable yet. Never infer a connector
requirement from the source name. `knowledgeRetrieval`
remains diagnostic provenance.
Render knowledge citations only when they appear in the final structured finding; never render raw
retrieved passages. `augmentedPrompt` says that the reviewed retrieval gate passed for that run.
`executionPlan` appears on multi-domain turns. It is a read-only audit view of Maestro's bounded
specialist assignments and synthesis step. Use it for an optional progress/details panel; the
conversation still renders one final Maestro answer. Older and single-specialist runs omit it.
`modelRouting` is also a support-only audit view. It records the frozen policy decision and does
not require a customer-facing model selector or any change to message rendering. An internal
diagnostics panel may show selected model, reason, mode, sample counts, and holdout status. Older
runs omit it.

Conversation message reads and synchronous JSON message responses also expose
`structuredResponse` and `responseContractVersion`. Prefer them when present. During migration,
`response` and legacy `suggestedActions` remain consistent projections of the v2 payload.

```ts
export type ConversationMessage = {
  role: 'user' | 'assistant' | 'steering' | 'handoff' | string;
  content: string;
  timestamp: string;
  structuredResponse?: AgentResponseV2 | null;
  responseContractVersion?: string | null;
  runId?: string | null;
  authorUserId?: string | null;
  authorName?: string | null;
  steeringId?: string | null;
  steeringStatus?: 'queued' | 'delivered' | 'not_delivered' | null;
  deliveredAtUtc?: string | null;
  appliedAtTurn?: number | null;
  agentKey?: string | null;
  agentLabel?: string | null;
  handoff?: {
    runId: string;
    sourceRunId?: string | null;
    fromAgentKey: string;
    fromAgentLabel: string;
    toAgentKey: string;
    toAgentLabel: string;
    reason: string;
    brief: string;
    status: 'queued' | 'running' | 'awaiting_approval' | 'done' | 'failed' | 'cancelled';
  } | null;
};
```

For messages written before this contract, `runId`, `agentKey`, `agentLabel`, and `handoff` can be
absent. Use the ordinary assistant treatment in that case; do not infer a handoff from the prose.

## API verification for specialist handoffs

1. Start a conversation with a request that Maestro should hand to a specialist and keep the
   original SSE stream open.
2. Expect an `agent_handoff` event on that stream. Its `handoff.targetRunId` must identify the
   specialist run and its status must be `queued`; render the card immediately.
3. Read `GET /api/v3/conversations/{conversationId}` after the handoff is queued. Expect a
   `role: 'handoff'` item with the source and target agents, a non-empty reason and brief, and
   `handoff.status` of `queued` or `running`. There must be no `role: 'user'` item containing that
   internal brief. Reconcile it with the existing card by target run ID.
4. Poll the conversation or `GET /api/v3/runs/{handoff.runId}`. Expect the card status to advance
   from queued/running to done, failed, or cancelled.
5. On completion, expect an assistant message with the same `runId`, the specialist's `agentKey`
   and `agentLabel`, and its validated `structuredResponse`. Render it immediately after the card.
6. Expand "View brief" and verify it shows the delegated question while preserving the original
   human-authored message unchanged.

## API verification for steering

1. Start a deliberately slow durable run with SSE `POST /api/v3/conversations/messages`; capture
   `conversationId` and `runId` from `status` and `run_queued`.
2. While the run is `queued` or `running`, send JSON `POST /api/v3/conversations/messages` with that
   `conversationId`, `activeRunId: runId`, and a unique sentence the final answer must include.
   Expect HTTP 200 and `succeeded: true`. Do not expect a new `run_queued` event.
3. Immediately read `GET /api/v3/conversations/{conversationId}`. Expect one message with
   `role: 'steering'`, the unique text, the same `runId`, and `steeringStatus: 'queued'` unless the
   next primary turn already began.
4. Wait for `final_response`, then read the conversation again. Expect the steering message to be
   `delivered`, with `deliveredAtUtc` and `appliedAtTurn`, and verify the final answer followed the
   unique instruction. If the run ended before another primary turn boundary, expect
   `not_delivered` instead and offer the text as a new message.
5. Read `GET /api/v3/runs/{runId}`. The matching steering entry must have the same `id`; after normal
   run finalization its `consumed` value is true.
6. Negative checks: use a run from another conversation and expect `Run not found`; retry after the
   run is terminal and expect `Run already finished`; omit `conversationId` while supplying
   `activeRunId` and expect HTTP 400. None of these requests may create a new run or add a timeline
   entry.

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
