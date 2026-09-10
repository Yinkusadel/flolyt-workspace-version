export interface AiConversationMessage {
  // "context" also comes back from history (GET_BY_ID) — a tool-call/data-context summary line
  // the backend logs into the message array, not part of the actual conversation. Confirmed live
  // 2026-09-10: rendering it as if it were "assistant" put "[Tools called: ...] [Data context: ...]"
  // in the chat as though Flolyt said it. Never emitted by the live SSE stream itself, only history.
  role: "user" | "assistant" | "context";
  content: string;
  timestamp: string;
}

export interface ReasoningStep {
  phase: string;
  description: string;
  dataSource: string | null;
  querySummary: string | null;
  timestamp: string;
  /** Which SSE event produced this step — set locally by the hook, not part of the wire payload.
   *  Lets the UI pick a tool-call icon vs. a plain reasoning-step marker. */
  kind?: "tool_call" | "reasoning_step";
}

// SSE event during streaming.
// Nulls are omitted from SSE payloads (WhenWritingNull) — treat every optional field as possibly
// absent, not just possibly null.
export interface AgentStreamEvent {
  eventType: string;
  state: string;
  message: string | null;
  errorMessage: string | null;
  reasoningSteps: ReasoningStep[] | null;
  /** Set on `run_queued`. Unlocks stop/steer/reconnect in a future stage — captured now, unused. */
  runId?: string | null;
}
