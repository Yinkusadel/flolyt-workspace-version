# Agent Hardening — Frontend Design & Integration Handoff

**Scope:** the FE work implied by agent-hardening Phases 2–6 (durable runs, steering, cancellation,
proposal review, reconnect). Track A only — shared sessions, presence, and spectating are Track B
and are **not** covered here.

**Status of the backend:** shipped and on `main` as of Phase 6. Every endpoint, event, and field in
this document was read out of the source, not the plan. Where the plan (`docs/agent-hardening-plan.md`
§3) and the shipped backend disagree, this document follows the backend and calls the difference out
explicitly — see [§9 Gaps](#9-gaps-that-block-or-bend-the-plan).

**Companion docs.** `docs/frontend-ai-conversations-integration.md` already covers the base chat
surface — SSE plumbing, `reasoning_step` / `tool_call` / `response_chunk` rendering, the conversation
list. **That document is still correct and is the prerequisite for this one.** Everything here is the
delta: what the durable-run machinery adds on top.

---

## 1. The one thing to understand first

Before Phase 2, a chat turn lived inside the HTTP request. If the socket dropped or a deploy landed,
the turn died with it.

Now the request only **enqueues a run and tails its stream**. The run is a durable document executed
on background rails. This is the entire reason the FE work exists:

| | Before | Now |
|---|---|---|
| Owner of the work | the HTTP request | an `AgentRun` document |
| Disconnect | kills the turn | kills **only the tail**; the run continues |
| Stop button | aborts a fetch (agent keeps spending) | `POST …/cancel` — stops real spend at the next turn boundary |
| Mid-flight input | impossible | steering note injected at the next turn boundary |
| High-risk tool call | executed immediately | may become a **proposal** awaiting human review |

The practical consequence for the client: **the stream is ephemeral, the run document is truth.**
Never treat "my EventSource closed" as "the turn ended". Always reconcile against the run.

---

## 2. Conventions

- **Auth:** `Authorization: Bearer {token}` on every call. All routes `RequireAuthorization()`.
- **Envelope:** non-SSE endpoints return `Result<T>` → `{ succeeded: boolean, data: T, messages: string[] }`.
  Paginated ones return `PaginatedResult<T>`. Read `succeeded` before `data`; surface `messages` on failure.
- **Casing:** SSE payloads are camelCase with **nulls omitted** (`DefaultIgnoreCondition = WhenWritingNull`).
  Do not destructure blindly — treat every optional field as possibly absent, not just possibly null.
- **Enums over SSE** serialize camelCase (`readingSource`, not `ReadingSource`).
- **Run wire statuses** are snake_case strings (`awaiting_approval`), mapped server-side — they are
  *not* the C# enum names. Full list in §5.
- **Tenant scoping** is implicit from the token. Cross-tenant ids return "not found", never 403.

---

## 3. Endpoint map

### 3.1 Chat (existing, unchanged shape)

```
POST   /api/flolyt/ai/conversations/messages
GET    /api/flolyt/ai/conversations/?pageNumber=1&pageSize=20
GET    /api/flolyt/ai/conversations/{id}           → incl. activeRunId (§7)
DELETE /api/flolyt/ai/conversations/{id}          → archive (soft delete)
GET    /api/flolyt/ai/conversations/sample-prompts
```

`POST …/messages` body:k

```jsonc
{
  "conversationId": null,        // null ⇒ create a new conversation
  "message": "Draft a win-back campaign",
  "mode": null,                  // optional surface mode passthrough
  "interactiveReply": null       // Dictionary<string,string> — answers to a prior input_request
}
```

`Accept: text/event-stream` ⇒ SSE. `Accept: application/json` ⇒ one complete `AgentMessageResult`.
**SSE mode is a POST**, so `EventSource` cannot be used — keep using `fetch` + `ReadableStream`
(the pattern already in the companion doc).

### 3.2 Runs (new to the FE)

```
GET  /api/flolyt/command-center/runs/{id}
GET  /api/flolyt/command-center/runs/{id}/stream    → SSE re-tail
POST /api/flolyt/command-center/runs/{id}/cancel
POST /api/flolyt/command-center/runs/{id}/steer     body: { "text": "..." }
```

> **Path naming trap.** These live under `command-center/` for historical reasons. They are **not**
> Command Center-specific — conversation-surface runs use exactly these routes. The run machinery is
> surface-agnostic; only the path name is legacy. Do not build a second set for chat.

### 3.3 Proposals (new to the FE)

```
GET  /api/flolyt/ai/proposals?conversationId={guid}&includeDecided=false
POST /api/flolyt/ai/proposals/{id}/accept    body: { "editedArgumentsJson": "..." } | null
POST /api/flolyt/ai/proposals/{id}/reject
```

---

## 4. SSE event contract

All events share one envelope (`PromptStateEvent`). The SSE frame's `event:` name equals `eventType`.

```typescript
interface PromptStateEvent {
  eventType: string;
  state: PromptState;                  // "idle" | "submitted" | "readingSource" | "enriching"
                                       // | "generating" | "streaming" | "complete" | "error"
  message?: string | null;
  errorMessage?: string | null;
  actionType?: string | null;
  reasoningSteps?: ReasoningStep[];
  actions?: SuggestedAction[];
  blockers?: string[];
  node?: ReactFlowNode;
  workflow?: GeneratedWorkflowDto;
  externalWorkflow?: ExternalWorkflowDto;
  inputRequest?: AgentInputRequest;
  broadcastPreview?: BroadcastPreviewDto;

  // --- added by agent hardening ---
  runId?: string;                      // Phase 2 — set on run_queued / run_state
  proposal?: AgentProposalEventDto;    // Phase 3 — set on proposal
}
```

### 4.1 Complete event catalogue

| `eventType` | Emitted by | Carries | FE action |
|---|---|---|---|
| `status` | endpoint + agent | `message`, `state` | See §4.2 — includes the conversation-id handshake and the terminal `complete` |
| `run_queued` | endpoint | **`runId`** | **Store the runId.** Enables stop / steer / reconnect |
| `tool_call` | agent | `message` (`"Plugin.function (args)"`) | "Reading segments…" — the non-spinner progress line |
| `reasoning_step` | agent | `reasoningSteps[]` | Append to the reasoning timeline |
| `response_chunk` | agent | `message` | Append token-by-token to the assistant bubble |
| `suggested_action` | agent | `actions[]` | Render action chips |
| `input_request` | agent | `inputRequest` | Render choice chips; the answer goes back as `interactiveReply` |
| `workflow_generated` | agent | `workflow` | Existing Studio rendering |
| `broadcast_preview` | agent | `broadcastPreview` | Open the broadcast review modal |
| `proposal` | agent | **`proposal`** | **Render a proposal card inline** (§6) |
| `run_state` | reconnect tail | `runId`, `message` = wire status, `errorMessage` | Reconciliation snapshot (§7) |
| `error` | endpoint + tail | `errorMessage` | Terminal failure |

There is **no** `done` / `failed` / `cancelled` event type. Terminal signals arrive as
`status` with `state: "complete"` (live path) or as a single `run_state` (reconnect path). Treat
`error` and `state === "complete"` as the only stream-terminal conditions, and confirm against the
run document.

### 4.2 The `status` event is overloaded

Three distinct meanings share one event type. Disambiguate on `message`/`state`, in this order:

1. `state: "submitted"`, `message: "conversation_id:{guid}"` — **the handshake.** Parse the guid
   after the colon and route to `/chat/{id}` without waiting for the executor. Emitted before
   `run_queued`.
2. `state: "complete"` — terminal.
3. anything else — a human-readable progress line.

```typescript
const CONVERSATION_ID_PREFIX = "conversation_id:";
if (evt.eventType === "status" && evt.message?.startsWith(CONVERSATION_ID_PREFIX)) {
  setConversationId(evt.message.slice(CONVERSATION_ID_PREFIX.length));
}
```

### 4.3 Expected ordering

```
status(submitted, "conversation_id:…")   ← navigate now
run_queued(runId)                        ← enable Stop + steering now
status(enriching, "Processing…")
tool_call / reasoning_step               ← repeats, interleaved
proposal                                 ← 0..n, does NOT pause the run (§6.1)
response_chunk                           ← repeats
status(complete)
```

Ordering is a guide, not a contract. Write handlers that tolerate missing, repeated, or reordered
events — particularly `run_queued`, which is the one you actually depend on.

---

## 5. Run lifecycle → UI

### 5.1 `GET runs/{id}` → `AgentRunDto`

```typescript
interface AgentRunDto {
  id: string;
  sessionId: string;          // ⚠️ this is the CONVERSATION id (legacy field name)
  status: AgentRunWireStatus;
  cancelRequested: boolean;
  error: string | null;
  turn: number;               // model round-trips so far — a real progress signal
  inputTokens: number;
  outputTokens: number;
  promptVersion: string;
  modelTier: string;
  steering: AgentRunSteeringDto[];
  createdAtUtc: string;
  finishedAtUtc: string | null;
}

interface AgentRunSteeringDto {
  text: string;
  addedBy: string;
  addedAtUtc: string;
  consumed: boolean;          // false = queued, true = the agent has picked it up
}

type AgentRunWireStatus =
  | "queued" | "running" | "awaiting_approval"
  | "done" | "failed" | "cancelled" | "unknown";
```

### 5.2 State mapping

| Wire status | Terminal | UI |
|---|---|---|
| `queued` | no | "Queued…" — Stop enabled, steering enabled |
| `running` | no | Live progress from `tool_call`; Stop + steering enabled |
| `awaiting_approval` | no | **Not produced in v1 — see §9.2.** Handle defensively; do not design around it |
| `done` | yes | Normal completed transcript |
| `failed` | yes | Error state + `error`; offer retry (resend the message) |
| `cancelled` | yes | "Stopped by you" — keep partial output visible, it is real work already paid for |
| `unknown` | — | Defensive fallback; treat as non-terminal and poll |

**`cancelRequested` is independent of `status`.** `cancelRequested: true` with `status: "running"`
is the normal "stopping…" window. Drive the button off `cancelRequested`, not off status:

```typescript
const stopState =
  run.cancelRequested && !isTerminal(run.status) ? "stopping"
  : isTerminal(run.status)                       ? "hidden"
  : "stoppable";
```

### 5.3 Stop

`POST …/cancel` sets a flag. **Cancellation lands at the next model-turn boundary, not instantly** —
an in-flight round-trip finishes first. Budget for several seconds of "Stopping…". Never optimistically
render "Stopped"; wait for a terminal status. Disable the button after the first click.

### 5.4 Steering

`POST …/steer` with `{ text }` appends a note consumed at the next turn boundary. Same latency caveat.

Render queued notes distinctly from consumed ones (`consumed` flag) so a user who types twice can see
that nothing was lost. Steering is only meaningful while the run is non-terminal — hide the input once
it is `done`/`failed`/`cancelled`.

The steering input is deliberately **not** the message composer: sending a normal message starts a
*new* run. Two different affordances, two different outcomes. Suggested treatment: the composer
switches to "Redirect the agent…" while a run is live, and posts to `/steer`.

---

## 6. Proposal cards

High-blast-radius tools (the Suggest registry) are intercepted: instead of executing, the agent
records an `AgentProposal` and emits a `proposal` event. A human accepts, edits-then-accepts, or
rejects. **Acceptance executes under the acceptor's identity** through the normal command path — the
same tenant guards and validation as the UI.

### 6.1 A proposal does not pause the run

This is the single most important correction to the plan's mental model. The run **continues and
completes** with the proposal outstanding. Proposals are decided asynchronously, potentially long
after the turn ends.

Therefore:

- Do **not** gate the composer on pending proposals.
- Do **not** derive proposal UI from run status.
- A conversation can be `done` with three pending cards in it. That is normal.

### 6.2 Payloads

On the SSE `proposal` event:

```typescript
interface AgentProposalEventDto {
  proposalId: string;
  toolName: string;          // e.g. "create_campaign_from_workflow"
  argumentsJson: string;     // ⚠️ a JSON *string*, not an object — parse it
  conversationId: string | null;
  runId: string | null;
  createdAtUtc: string;
}
```

From `GET /ai/proposals`:

```typescript
interface AgentProposalDto {
  id: string;
  conversationId: string | null;
  runId: string | null;
  toolName: string;
  argumentsJson: string;
  finalArgumentsJson: string | null;   // non-null ⇒ accepted with edits
  status: ProposalWireStatus;
  decidedBy: string | null;
  decidedAtUtc: string | null;
  executionResultJson: string | null;  // the tool's result — audit trail
  createdAtUtc: string;
}

type ProposalWireStatus =
  | "pending" | "accepted" | "rejected" | "edited" | "stale" | "unknown";
```

Lowercase, mapped server-side by `AgentProposalWire.ToWireStatus` — **not** the C# enum names.
`edited` means accepted with modified arguments; `stale` is reserved and not produced in v1.

Decision responses return `AgentProposalDecisionDto { proposalId, status, executionResultJson }` with
the same status vocabulary.

### 6.3 Rendering

`argumentsJson` is raw model output. Rendering it as a JSON blob defeats the purpose of the review
step — the reviewer must understand what they are approving.

- Maintain a **per-tool presenter** keyed on `toolName`: a plain-language title ("Create a campaign
  from this workflow") and a readable argument summary (campaign name, segment, channel, recipient
  count — whatever that tool's arguments actually mean).
- Fall back to a formatted key/value table for unrecognised tools. Never crash on an unknown tool
  name; the Suggest registry will grow.
- **Edit-then-accept** should edit the *presented fields* and reserialize, with a raw-JSON escape
  hatch behind a disclosure. The backend validates edited JSON and rejects malformed input — surface
  that as a field error, not a toast.
- After a decision, replace the card in place with a compact resolved state ("Approved by you ·
  14:32"). Use `finalArgumentsJson !== null` to label it "approved with edits".

### 6.4 Rationale

The plan calls for "the agent's rationale" on the card. **There is no rationale field on the event
DTO, and the domain's `Rationale` is unset in v1** — the surrounding chat narration carries the "why".

Design the card to read well without a rationale block, and place it directly beneath the assistant
message that motivated it so the narration serves as context. Do not leave an empty section.

---

## 7. Reconnect

The stream is ephemeral; the run document is truth. Two distinct recovery paths:

**A. Same node, stream still registered** — `GET runs/{id}/stream` replays buffered events and
continues live. Indistinguishable from the original stream.

**B. After a restart, or on another node** — the tail emits **exactly one** `run_state` event and
closes:

```jsonc
{ "eventType": "run_state", "state": "generating", "message": "running", "runId": "…" }
```

`message` is the wire status; `state` is a coarse mapping (`failed`→`error`, `done`/`cancelled`→
`complete`, else `generating`).

**Path B is not a live stream.** If `run_state` reports a non-terminal status, the FE must fall back
to polling `GET runs/{id}` (2–3s, with backoff) until terminal. A client that assumes the stream keeps
delivering will hang forever on a completed run.

```
open conversation
  └─ GET /ai/conversations/{id} → activeRunId
       ├─ null → render transcript, done
       └─ set  → GET runs/{id}
            ├─ terminal → render transcript, done
            └─ non-terminal → GET runs/{id}/stream
                 ├─ multiple events arrive → live (path A)
                 └─ single run_state then close → poll GET runs/{id} (path B)
```

`activeRunId` is the entry point — resolve it from the conversation, never from client-side state.

```typescript
interface ConversationDto {
  id: string;
  title: string;
  messages: ConversationMessageDto[];
  createdAt: string;
  lastMessageAt: string;
  activeRunId: string | null;   // newest non-terminal run, or null
}
```

### 7.1 Rehydrating a transcript

`GET /ai/conversations/{id}` returns messages as `{ role, content, timestamp }` only. **Proposals are
not in the transcript.** To restore a conversation faithfully:

1. `GET /ai/conversations/{id}` → messages
2. `GET /ai/proposals?conversationId={id}&includeDecided=true` → all cards, pending and decided
3. Merge by timestamp (`timestamp` vs `createdAtUtc`) into one ordered render list

Skipping step 2 silently loses every proposal card on reload — including undecided ones the user still
needs to act on.

---

## 8. Component inventory

| Component | Responsibility | Key inputs |
|---|---|---|
| `useAgentRun(runId)` | Poll/reconcile run state; expose `cancel()`, `steer(text)` | `AgentRunDto` |
| `useConversation(id)` | Load conversation; hand `activeRunId` to `useAgentRun` | `ConversationDto` |
| `useAgentStream(...)` | Existing SSE hook + `run_queued` / `run_state` / `proposal` handling | events |
| `RunStatusBar` | Status chip, turn counter, Stop, steering input | run + `cancelRequested` |
| `ProposalCard` | Present / edit / accept / reject; resolved state | `AgentProposalDto` |
| `proposalPresenters` | `toolName` → title + argument summary + edit schema | registry |
| `ReasoningTimeline` | Existing | `reasoningSteps` |
| `useConversationTranscript` | Merge messages + proposals on load (§7.1) | both |

**State model.** Keep one reducer per conversation holding `{ conversationId, runId, runStatus,
cancelRequested, messages[], proposals: Map<id, …>, reasoningSteps[] }`. Key proposals by id and make
every write idempotent — reconnect legitimately replays events you have already seen, and duplicate
cards are the most likely visible bug.

---

## 9. Gaps that block or bend the plan

Found by reading the shipped code. §9.1 was blocking and has since been fixed in the backend; the
rest are behavioural differences the FE must design around, not defects.

### 9.1 Finding a conversation's active run — RESOLVED

*Originally filed as blocking: `GET runs/{id}` is keyed by run id, `ConversationDto` exposed none, and
no query returned "the active run for conversation X" — so a reopened conversation could not reconnect.*

**Fixed.** `ConversationDto` now carries `activeRunId`. `GET /ai/conversations/{id}` returns the
newest **non-terminal** run (`queued` / `running` / `awaiting_approval`) for that conversation and
tenant, or `null`.

No client-side run-id caching is needed. Reconnect now works on a second tab, a different device, and
after cleared storage — cases the `localStorage` workaround could never cover.

Pinned by `ConversationActiveRunTests` (Testcontainers): terminal runs are never returned (handing
back a finished run id would make the client tail a closed stream and hang), runs from another
conversation or another tenant never leak, and the newest run wins when a conversation has several.

### 9.2 `awaiting_approval` is never produced

`AgentRun.MarkAwaitingApproval()` has **no non-test callers**. The plan's "awaiting review" run state
does not exist at runtime — consistent with §6.1 (proposals don't park the run).

Keep the string in the type union for forward-compatibility; do not build a UI state around it, and
do not tell users a run is "waiting for approval".

### 9.3 Proposal rationale has no data source

Covered in §6.4. The plan's card spec assumes a field that isn't populated.

### 9.4 Reconnect after restart degrades to polling

Covered in §7 path B. The plan's "resume the stream" is only literally true on the same node.

### 9.5 `sessionId` means conversation id

`AgentRunDto.sessionId` is `run.ConversationId`. A legacy name — do not introduce a "session" concept
in the FE because of it.

---

## 10. Gotchas

1. **`argumentsJson` / `executionResultJson` are strings**, not objects. Parse defensively; never
   `JSON.parse` model output without a try/catch.
2. **Nulls are omitted from SSE payloads.** Absent ≠ null in your type guards.
3. **Stop and steer are eventually-consistent** (next turn boundary). Optimistic UI lies here.
4. **A new message starts a new run.** Only `/steer` redirects the current one.
5. **Long tool calls are normal.** Individual model round-trips have been observed near 90s under
   load; a client-side stream timeout below ~2 minutes will sever healthy runs. Prefer no timeout on
   the stream plus run-state reconciliation.
6. **Cancelled runs keep partial output.** Work already done was paid for — show it.
7. **Credits are estimated then reconciled.** The final cost of a turn legitimately exceeds the
   pre-reservation (by design, AI-credits workstream). Do not surface the estimate as a final charge.
8. **Duplicate events on reconnect are expected.** Idempotent reducers, always.

---

## 11. Acceptance checklist

**Runs**
- [ ] `runId` captured from `run_queued` and persisted per conversation
- [ ] Status chip reflects all wire statuses incl. `unknown`
- [ ] Stop shows "Stopping…" until terminal; disabled after first click
- [ ] Steering posts to `/steer`; queued vs consumed notes visually distinct
- [ ] Steering and Stop hidden on terminal runs
- [ ] Progress uses `tool_call` / `reasoning_step` text — no bare spinner

**Proposals**
- [ ] Card renders from the SSE `proposal` event
- [ ] Per-tool presenter for every tool in the Suggest registry; graceful unknown-tool fallback
- [ ] Accept / reject / edit-then-accept all wired; edit validation errors shown inline
- [ ] Decided cards render resolved state and distinguish "approved with edits"
- [ ] Composer is **not** blocked by pending proposals

**Reconnect**
- [ ] Reload mid-run resumes (path A) or polls to terminal (path B)
- [ ] Single `run_state` + close does not hang the UI
- [ ] Transcript reload merges `GET /ai/proposals?includeDecided=true`
- [ ] No duplicated messages or cards after reconnect

**Resilience**
- [ ] Killing the API mid-run: UI recovers on reconnect, does not show a stuck spinner
- [ ] A second tab on a live conversation picks the run up from `activeRunId` and can stop it
- [ ] Unknown `eventType` values are ignored, not fatal
