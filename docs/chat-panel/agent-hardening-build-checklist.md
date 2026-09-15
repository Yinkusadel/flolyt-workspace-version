# Agent Hardening — Build Checklist

Working tracker for implementing [agent-hardening-frontend-design.md](./agent-hardening-frontend-design.md).
Tick items as they land. Section refs (§) point back to the design doc.

**Prerequisite:** the base chat surface from `frontend-ai-conversations-integration.md` (SSE plumbing,
`reasoning_step` / `tool_call` / `response_chunk` rendering, conversation list) must already work.

---

## The one rule

> **The stream is ephemeral, the run document is truth.**
> "My stream closed" never means "the turn ended". Always reconcile against `GET runs/{id}`.

---

## Stage 0 — Foundations (types, client, state shape)

Nothing renders yet. Everything below depends on this.

- [x] `AgentRunDto`, `AgentRunSteeringDto`, `AgentRunWireStatus` types (§5.1) — `services/api/agent-runs/get-agent-run.ts`
- [ ] `AgentProposalEventDto`, `AgentProposalDto`, `ProposalWireStatus`, `AgentProposalDecisionDto` types (§6.2)
- [ ] `PromptStateEvent` extended with `runId?` and `proposal?` (§4)
- [ ] `ConversationDto` extended with `activeRunId: string | null` (§7)
- [x] `isTerminalRunStatus(status)` helper — `done` / `failed` / `cancelled` only
- Service calls, one per feature slice:
  - [x] `getAgentRun` — `GET runs/{id}` **(new endpoint)**
  - [x] `cancelAgentRun` — `POST runs/{id}/cancel` **(new endpoint)**
  - [x] `steerAgentRun` — `POST runs/{id}/steer` **(new endpoint)**
  - [ ] `streamRun` — `GET runs/{id}/stream` **(new endpoint, SSE)**
  - [ ] `getProposals` — `GET /ai/proposals` **(new endpoint)**
  - [ ] `acceptProposal` — `POST /ai/proposals/{id}/accept` **(new endpoint)**
  - [ ] `rejectProposal` — `POST /ai/proposals/{id}/reject` **(new endpoint)**
- [ ] Per-conversation reducer: `{ conversationId, runId, runStatus, cancelRequested, messages[], proposals: Map<id, …>, reasoningSteps[] }` (§8)
- [ ] **Every reducer write is idempotent** — reconnect replays events you've already seen (§10.8)
- [ ] Unknown `eventType` values are ignored, never fatal (§11)

> Traps: nulls are **omitted** from SSE payloads — absent ≠ null (§10.2). Wire statuses are
> snake_case strings, not C# enum names (§2). `AgentRunDto.sessionId` is the **conversation id** —
> do not introduce a "session" concept (§9.5). Run routes live under `command-center/` for legacy
> reasons but are surface-agnostic — do **not** build a second set for chat (§3.2).

---

## Stage 1 — Capture the run

The gateway feature. Stop, steering and reconnect are all dead without this.

- [x] Handle `run_queued` → store `runId` (§4.1) — `use-ai-conversation-message.ts`
- [x] `runId` cleared on new send and on conversation change so Stop/steer can never target a
      finished run *(server-backed persistence lands with `activeRunId` in Stage 4)*
- [ ] Handle the overloaded `status` event in priority order (§4.2):
  - [ ] `state: "submitted"` + `message: "conversation_id:{guid}"` → parse guid, navigate to `/chat/{id}` immediately
  - [ ] `state: "complete"` → terminal
  - [ ] anything else → human-readable progress line
- [ ] Treat only `error` and `state === "complete"` as stream-terminal — there is no `done`/`failed`/`cancelled` event type (§4.1)
- [ ] Handlers tolerate missing / repeated / reordered events (§4.3)
- [ ] Remove any client-side stream timeout under ~2 minutes (round-trips near 90s are normal) (§10.5)

---

## Stage 2 — `RunStatusBar`: status, Stop, steering

- [x] `useAgentRun(runId)` hook — reconcile run state, expose `cancel()` and `steer(text)` (§8)
- [x] Status chip covers every wire status **including `unknown`** (treat `unknown` as non-terminal, poll) (§5.2)
- [x] Turn counter from `run.turn` (a real progress signal)
- [ ] Progress line uses `tool_call` / `reasoning_step` text — **no bare spinner** (§11)

**Stop** (§5.3)

- [x] `POST …/cancel` wired — `use-cancel-agent-run.ts`
- [x] Button state driven off `cancelRequested`, **not** `status` — `getRunStopState()`:
      `cancelRequested && !isTerminal` → "stopping" · `isTerminal` → hidden · else "stoppable"
- [x] "Stopping…" persists until a terminal status arrives — **never optimistically render "Stopped"**
- [x] Button disabled after first click — `RunStatusBar`
- [ ] Cancelled runs keep partial output visible (§10.6)

**Steering** (§5.4)

- [x] `POST …/steer` with `{ text }` wired — `use-steer-agent-run.ts`
- [x] Queued (`consumed: false`) vs consumed notes visually distinct — `RunStatusBar`
- [x] Steering input + Stop hidden once the run is `done` / `failed` / `cancelled` —
      `canSteerRun()` / `getRunStopState()`
- [ ] Composer switches to "Redirect the agent…" while a run is live and posts to `/steer`
- [ ] Clear that a **new message starts a new run**; only `/steer` redirects the current one (§10.4)

> Both stop and steer land at the **next model-turn boundary** — several seconds. Optimistic UI lies here (§10.3).

---

## Stage 3 — Proposal cards

- [ ] Handle the SSE `proposal` event → render a card inline, beneath the assistant message that motivated it (§6.4)
- [ ] Card **does not** gate the composer, and proposal UI is **not** derived from run status (§6.1)
- [ ] A `done` conversation with pending cards renders correctly (that is normal)
- [ ] `argumentsJson` parsed with try/catch — it is a JSON **string**, and it is raw model output (§10.1)

**`proposalPresenters` registry** (§6.3)

- [ ] Keyed on `toolName` → plain-language title + readable argument summary
- [ ] A presenter for every tool currently in the Suggest registry
- [ ] Formatted key/value table fallback for unknown tools — **never crash on an unknown tool name**

**Decisions**

- [ ] Accept wired (`POST …/accept`, body `null`)
- [ ] Reject wired
- [ ] Edit-then-accept: edits the *presented fields* and reserializes; raw-JSON escape hatch behind a disclosure
- [ ] Backend validation errors on edited JSON surface as **inline field errors**, not a toast
- [ ] Decided card replaced in place with a compact resolved state ("Approved by you · 14:32")
- [ ] `finalArgumentsJson !== null` → label "approved with edits"
- [ ] Card reads well **without** a rationale block — there is no rationale field; leave no empty section (§6.4, §9.3)

---

## Stage 4 — Reconnect

The fiddliest stage. Two distinct recovery paths.

- [ ] `useConversation(id)` resolves `activeRunId` from the server — **never** from client-side state (§7)
- [ ] Flow implemented:
  - [ ] `activeRunId === null` → render transcript, done
  - [ ] set → `GET runs/{id}` → terminal → render transcript, done
  - [ ] non-terminal → `GET runs/{id}/stream`
  - [ ] **Path A** — multiple events arrive → live, indistinguishable from the original stream
  - [ ] **Path B** — a single `run_state` then close → fall back to polling `GET runs/{id}` every 2–3s with backoff until terminal
- [ ] Handle `run_state` (`message` = wire status, `state` = coarse mapping) as a reconciliation snapshot (§4.1, §7)
- [ ] **Single `run_state` + close does not hang the UI** — the classic failure mode (§7)

**Transcript rehydration** (§7.1)

- [ ] `GET /ai/conversations/{id}` → messages
- [ ] `GET /ai/proposals?conversationId={id}&includeDecided=true` → all cards, pending and decided
- [ ] `useConversationTranscript` merges the two by timestamp (`timestamp` vs `createdAtUtc`) into one ordered list
- [ ] No duplicated messages or cards after reconnect (proposals keyed by id — duplicate cards are the most likely visible bug)

---

## Stage 5 — Resilience pass

- [ ] Kill the API mid-run → UI recovers on reconnect, no stuck spinner
- [ ] Second tab on a live conversation picks the run up from `activeRunId` and can stop it
- [ ] Reload mid-run resumes (path A) or polls to terminal (path B)
- [ ] Unknown `eventType` values ignored, not fatal
- [ ] Credit estimates never surfaced as a final charge — final cost legitimately exceeds the pre-reservation (§10.7)

---

## Explicitly NOT building

- [ ] ~~`awaiting_approval` UI state~~ — never produced at runtime; keep the string in the type union for
      forward-compat, build no UI, and never tell users a run is "waiting for approval" (§9.2)
- [ ] ~~Proposal rationale block~~ — no data source in v1 (§9.3)
- [ ] ~~`stale` proposal status handling~~ — reserved, not produced in v1 (§6.2)
- [ ] ~~Track B~~ — shared sessions, presence, spectating are out of scope
- [ ] ~~Client-side `runId` caching / localStorage workaround~~ — obsolete, `activeRunId` replaced it (§9.1)

---

## Component inventory (§8)

| Component | Status |
|---|---|
| `useAgentRun(runId)` | [x] |
| `useConversation(id)` | [ ] |
| `useAgentStream(...)` (extend existing) | [ ] |
| `useConversationTranscript` | [ ] |
| `RunStatusBar` | [x] |
| `ProposalCard` | [ ] |
| `proposalPresenters` | [ ] |
| `ReasoningTimeline` (existing, unchanged) | n/a |
