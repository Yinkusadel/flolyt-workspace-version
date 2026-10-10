import type { AgentResponseV2 } from "./agent-response-types";

export interface AiConversationMessage {
  // "context" also comes back from history (GET_BY_ID) — a tool-call/data-context summary line
  // the backend logs into the message array, not part of the actual conversation. Confirmed live
  // 2026-09-10: rendering it as if it were "assistant" put "[Tools called: ...] [Data context: ...]"
  // in the chat as though Flolyt said it. Never emitted by the live SSE stream itself, only history.
  // "error" is a local role — pushed by the hook itself when the stream fails or errors out, not
  // something the backend ever sends. Lets the UI style it as an error instead of a normal reply.
  // "steering" is a mid-run note sent through the same composer while a run is active — per the
  // v3 handoff it's a first-class timeline entry (chronological, alongside user/assistant turns),
  // rendered identically to a "user" bubble (see detail-route) rather than as its own widget.
  // "handoff" is conversation activity, not something either party wrote — a compact lifecycle
  // card ("Maestro handed this to Sentinel"), never a chat bubble. Its `content`/`handoff.brief`
  // must never render as if a user or Flolyt said them directly.
  role: "user" | "assistant" | "context" | "error" | "steering" | "handoff";
  content: string;
  timestamp: string;
  // Per the v3 handoff: history reads (and synchronous JSON message responses) also expose the
  // structured payload directly on the message. Prefer this over `content` when present — `content`
  // stays as the plain-markdown fallback during migration.
  structuredResponse?: AgentResponseV2 | null;
  responseContractVersion?: string | null;
  runId?: string | null;
  // Present on a specialist's own assistant answer (an async handoff's target message, or a
  // synchronous in-line consultation) — render as attribution, e.g. "Sentinel". Absent on
  // Maestro's own direct answers and on messages written before this contract existed.
  agentKey?: string | null;
  agentLabel?: string | null;
  // Present on newly saved human messages only (Room threads). Old messages stay unattributed.
  authorUserId?: string | null;
  authorName?: string | null;
  handoff?: {
    runId: string;
    sourceRunId?: string | null;
    fromAgentKey: string;
    fromAgentLabel: string;
    toAgentKey: string;
    toAgentLabel: string;
    reason: string;
    brief: string;
    status: "queued" | "running" | "awaiting_approval" | "done" | "failed" | "cancelled";
  } | null;
}

// A mutating action the agent wants to take, surfaced for human review instead of executed
// outright. `argumentsJson` is a JSON-encoded string, not a nested object — parse it to get the
// actual tool arguments (which themselves nest further JSON-string fields depending on toolName,
// e.g. open_room_on_cohort's rulesJson/peopleJson/agentsJson). Same record GET
// /api/v3/proposals reads back later, so this is a live nudge, not the source of truth.
/** `auto` routes to a responder (the default); `none` saves a human-only message with no run. */
export type ConversationReplyMode = "auto" | "none";

export interface SendConversationMessageRequest {
  conversationId: string | null;
  message: string;
  replyMode?: ConversationReplyMode;
  agentKey?: string | null;
}

/** JSON body of the 202 returned when a run starts. `replyMode: "none"` returns 200 with no
 * `runId`. Follow `GET /api/v3/runs/{runId}/stream`; never resend the prompt to reconnect. */
export interface SendConversationMessageAcceptedData {
  runId: string;
  conversationId: string;
  agentKey: string | null;
  routingReason: string | null;
}

export interface StreamProposal {
  proposalId: string;
  toolName: string;
  argumentsJson: string;
  conversationId: string;
  runId: string | null;
  createdAtUtc: string;
}

export interface AgentProgressEvent {
  stage: string;
  message: string;
  atUtc: string;
  percent?: number | null;
}

// SSE event during streaming.
// Nulls are omitted from SSE payloads (WhenWritingNull) — treat every optional field as possibly
// absent, not just possibly null.
//
// `reasoningSteps` still arrives on `tool_call`/`reasoning_step` events for compatibility with
// other application surfaces, but the v3 handoff explicitly says not to render those for agent
// runs here — the hook no longer has a case for either event type, so this field is read by
// nothing. Kept on the type only because the field can still be present on the wire payload.
export interface AgentStreamEvent {
  eventType: string;
  state: string;
  message: string | null;
  errorMessage: string | null;
  reasoningSteps: unknown[] | null;
  /** Set on `run_queued`. Unlocks stop/steer/reconnect. */
  runId?: string | null;
  /** Set on `proposal`. */
  proposal?: StreamProposal | null;
  /** Set on `progress` — the replacement for the reasoning/tool-call trace. Status text only. */
  progress?: AgentProgressEvent | null;
  /** Set on `final_response` — the validated terminal payload. */
  structuredResponse?: AgentResponseV2 | null;
  responseContractVersion?: string | null;
  // input_request's own shape isn't defined in the handoff doc beyond "render the choices/
  // free-text control" — captured loosely until a real payload is seen. No UI consumes this yet.
  inputRequest?: Record<string, unknown> | null;
  // Present on every event now (not just final_response) — identifies which agent the event
  // belongs to. Needed once a handoff keeps the same connection open for the specialist's own
  // run_started/progress/response_chunk/final_response, since those now arrive interleaved with
  // whatever the originating run itself sent.
  agentKey?: string | null;
  agentLabel?: string | null;
  /** Set on `agent_handoff` — fires on the *originating* run's own stream the moment a specialist
   * run is durably queued, so the handoff card can appear live instead of waiting for the next
   * history refetch. Note the field is `targetRunId` here, not `runId` like the history/message
   * shape (`AiConversationMessage.handoff.runId`) — same specialist run, different field name
   * depending on which contract you're reading it from; normalize at the point of consumption. */
  handoff?: {
    targetRunId: string;
    sourceRunId: string;
    fromAgentKey: string;
    fromAgentLabel: string;
    toAgentKey: string;
    toAgentLabel: string;
    reason: string;
    brief: string;
    status: "queued";
  } | null;
}
