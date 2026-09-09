export interface AiConversationMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface ReasoningStep {
  phase: string;
  description: string;
  dataSource: string | null;
  querySummary: string | null;
  timestamp: string;
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
