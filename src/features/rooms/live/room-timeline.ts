import { isTerminalStatus, type RoomHandoff, type RoomMessageRow, type RoomRun, type RoomState } from "./room-live-state.ts";

/**
 * What the thread draws, derived from the reducer state (pure, so it is tested without the UI): the messages and handoff cards
 * in display order, then the agent runs that are still working or whose answer is still a draft. A run whose committed answer
 * has arrived is never listed here: the committed message wins (it is already a `message` item).
 */
export type TimelineItem =
  | { kind: "message"; key: string; row: RoomMessageRow }
  | { kind: "handoff"; key: string; row: RoomMessageRow }
  | { kind: "live-run"; key: string; run: LiveRun };

export interface LiveRun {
  runId: string;
  agentKey: string | null;
  agentLabel: string | null;
  /** The provisional answer so far (chunks, or the final response before its committed copy). */
  markdown: string | null;
  /** A short human phrase for what the run is doing now, or null when it is not working. */
  working: string | null;
  awaitingApproval: boolean;
  deliveryGap: boolean;
  failed: string | null;
}

const HANDOFF_STATUS: Record<string, string> = {
  queued: "queued",
  running: "running",
  awaitingapproval: "awaiting_approval",
  awaiting_approval: "awaiting_approval",
  done: "done",
  failed: "failed",
  cancelled: "cancelled",
};

/** The feed sends `Done`/`AwaitingApproval`, the history `done`/`awaiting_approval`: one spelling for the card. */
const normalizeHandoffStatus = (status: string | undefined) => HANDOFF_STATUS[(status ?? "").toLowerCase()] ?? "queued";

/** Technical stage names from `progress` events as plain words. The event's own `message` is internal text, never shown. */
const STAGE_PHRASE: Record<string, string> = {
  queued: "Queued",
  thinking: "Thinking it through",
  analyzing: "Analyzing",
  reading: "Reading your data",
};

const workingPhrase = (run: RoomRun): string | null => {
  if (isTerminalStatus(run.status)) return null;
  if (run.status?.toLowerCase() === "awaitingapproval") return null;
  const stage = typeof run.progress?.stage === "string" ? run.progress.stage.toLowerCase() : "";
  if (stage === "complete") return null;
  return STAGE_PHRASE[stage] ?? "Working on it";
};

const SHOWN_ROLES = new Set(["user", "assistant", "steering"]);

export function buildTimeline(state: RoomState, resolveAuthorName?: (userId: string) => string | null): TimelineItem[] {
  const items: TimelineItem[] = [];

  for (const entry of state.order) {
    if (entry.kind === "message") {
      const row = state.messages.get(entry.id);
      if (!row || !SHOWN_ROLES.has(row.role)) continue;
      const run = row.runId ? state.runs.get(row.runId) : undefined;
      items.push({
        kind: "message",
        key: `m:${entry.id}`,
        row: {
          ...row,
          timestamp: row.timestamp ?? entry.timestamp,
          // A committed event carries the author's id but no name; the agent label sits on the envelope, i.e. on the run.
          authorName: row.authorName ?? (row.authorUserId ? resolveAuthorName?.(row.authorUserId) ?? null : null),
          agentLabel: row.agentLabel ?? run?.agentLabel ?? null,
          agentKey: row.agentKey ?? run?.agentKey ?? null,
        },
      });
    } else {
      const handoff = state.handoffs.get(entry.id) as RoomHandoff | undefined;
      if (!handoff) continue;
      items.push({
        kind: "handoff",
        key: `h:${entry.id}`,
        row: {
          role: "handoff",
          content: "",
          timestamp: entry.timestamp,
          handoff: {
            ...handoff,
            fromAgentLabel: handoff.fromAgentLabel ?? "An agent",
            toAgentLabel: handoff.toAgentLabel ?? "another agent",
            reason: handoff.reason ?? "",
            brief: handoff.brief ?? "",
            status: normalizeHandoffStatus(handoff.status),
          },
        },
      });
    }
  }

  for (const [runId, run] of state.runs) {
    if (run.committed) continue;
    const working = workingPhrase(run);
    const awaitingApproval = run.status?.toLowerCase() === "awaitingapproval";
    const failed = run.status?.toLowerCase() === "failed" ? (run.error ?? "This run didn't finish.") : null;
    if (!run.markdown && !working && !awaitingApproval && !failed && !run.deliveryGap) continue;
    items.push({
      kind: "live-run",
      key: `r:${runId}`,
      run: {
        runId,
        agentKey: run.agentKey ?? null,
        agentLabel: run.agentLabel ?? null,
        markdown: run.markdown ?? null,
        working,
        awaitingApproval,
        deliveryGap: !!run.deliveryGap,
        failed,
      },
    });
  }
  return items;
}

/** Which agent is busy, for the roster dots: `running` while a run works, `waiting` while it needs a person's approval. */
export function agentActivity(state: RoomState): Record<string, "running" | "waiting"> {
  const result: Record<string, "running" | "waiting"> = {};
  for (const run of state.runs.values()) {
    if (!run.agentKey || run.committed || isTerminalStatus(run.status) || !run.status) continue;
    result[run.agentKey] = run.status.toLowerCase() === "awaitingapproval" ? "waiting" : "running";
  }
  return result;
}

/** A message the person just sent, drawn at once while the Room feed catches up. */
export interface PendingMessage {
  id: string;
  /** Exactly the text that was sent (mentions already as stored tokens). */
  content: string;
  sentAtMs: number;
}

/** How long a sent message may wait for its committed copy before the placeholder is dropped. */
const PENDING_MAX_MS = 90_000;

/**
 * Which pending messages are still waiting. The backend commits a prompt to the transcript AFTER the run it started has begun (seen on every
 * real run: `run_started` and even the first `response_chunk` come before the prompt's `message_committed`), so the person's own message would
 * otherwise appear after the answer. A pending message is settled when a committed message by the same person with the same text, at or after
 * the send, is in the state; an old one is dropped after 90 s so a lost event never leaves a placeholder forever.
 */
export function settlePending(pending: PendingMessage[], state: RoomState, userId: string | null, nowMs: number): PendingMessage[] {
  if (pending.length === 0) return pending;
  return pending.filter((item) => {
    if (nowMs - item.sentAtMs > PENDING_MAX_MS) return false;
    for (const row of state.messages.values()) {
      if (row.role !== "user" || row.authorUserId !== userId || row.content !== item.content) continue;
      const at = Date.parse(row.timestamp ?? "");
      if (Number.isNaN(at) || at >= item.sentAtMs - 10_000) return false;
    }
    return true;
  });
}

/** Puts the pending messages after every committed message and before the agent runs that are working, in the order they were sent. */
export function withPendingMessages(items: TimelineItem[], pending: PendingMessage[], userId: string | null, userName: string | null): TimelineItem[] {
  if (pending.length === 0) return items;
  const firstRun = items.findIndex((item) => item.kind === "live-run");
  const at = firstRun === -1 ? items.length : firstRun;
  const rows: TimelineItem[] = pending.map((item) => ({
    kind: "message",
    key: `p:${item.id}`,
    row: { role: "user", content: item.content, timestamp: new Date(item.sentAtMs).toISOString(), authorUserId: userId, authorName: userName, pending: true },
  }));
  return [...items.slice(0, at), ...rows, ...items.slice(at)];
}
