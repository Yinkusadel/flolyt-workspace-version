import type { AgentStreamEvent } from "./ai-conversation-types";

// `/hubs/presence`'s `run_activity` client method payload. Captured from the real wire traffic
// 2026-09-29 (two simultaneous logged-in sessions, one sender + one viewer) — this does NOT match
// the v3 handoff doc's documented `ConversationRunEvent` shape (which nests every field under a
// single `streamEvent: PromptStateEvent`). In reality `kind` fans out across the same event names
// SSE uses (`run_started`, `run_event`, `run_message`, `run_ended`), and only `run_event` actually
// carries a populated `streamEvent` — the other three carry their own payload flattened directly
// onto this envelope instead. Confirmed field-for-field: `run_event.streamEvent` genuinely matches
// `AgentStreamEvent`, so that half of the doc's design holds; the rest is corrected here from the
// real payload rather than the doc's prose.
export interface ConversationRunEvent {
  kind: "run_started" | "run_event" | "run_message" | "run_ended" | string;
  runId: string;
  conversationId: string;
  turn: number;
  actorName?: string | null;
  // Populated only on `run_message` — the whole committed response in one shot (the older
  // compatibility/recovery signal from the doc), not nested under `streamEvent`.
  text?: string | null;
  // Populated only on `run_ended` — its terminal state (observed as `"Done"`; treat case-
  // insensitively since nothing documents the full value set).
  state?: string | null;
  atUtc: string;
  agentKey?: string | null;
  agentLabel?: string | null;
  // Populated only on `run_event`, starting at 1 and incrementing per run.
  sequence?: number | null;
  // Populated only on `run_event` — the exact same shape SSE's `data:` payload carries.
  streamEvent?: AgentStreamEvent | null;
}
