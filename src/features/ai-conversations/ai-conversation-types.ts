import type { AgentResponseV2 } from "./agent-response-types";

export interface AiConversationMessage {
  // "context" also comes back from history (GET_BY_ID) — a tool-call/data-context summary line
  // the backend logs into the message array, not part of the actual conversation. Confirmed live
  // 2026-09-10: rendering it as if it were "assistant" put "[Tools called: ...] [Data context: ...]"
  // in the chat as though Flolyt said it. Never emitted by the live SSE stream itself, only history.
  // "error" is a local role — pushed by the hook itself when the stream fails or errors out, not
  // something the backend ever sends. Lets the UI style it as an error instead of a normal reply.
  role: "user" | "assistant" | "context" | "error";
  content: string;
  timestamp: string;
  // Per the v3 handoff: history reads (and synchronous JSON message responses) also expose the
  // structured payload directly on the message. Prefer this over `content` when present — `content`
  // stays as the plain-markdown fallback during migration.
  structuredResponse?: AgentResponseV2 | null;
  responseContractVersion?: string | null;
}

// A mutating action the agent wants to take, surfaced for human review instead of executed
// outright. `argumentsJson` is a JSON-encoded string, not a nested object — parse it to get the
// actual tool arguments (which themselves nest further JSON-string fields depending on toolName,
// e.g. open_room_on_cohort's rulesJson/peopleJson/agentsJson). Same record GET
// /api/v3/proposals reads back later, so this is a live nudge, not the source of truth.
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
}
