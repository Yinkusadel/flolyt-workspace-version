/**
 * TypeScript port of the backend's reference reducer for the Room-wide live feed
 * (`docs/rooms/examples/room-live-state.mjs`, with its 9 tests ported in `room-live-state.test.mjs`).
 * Pure and framework-neutral: immutable updates, no I/O. The rules, from the backend handoff:
 *  - messages are upserted by `messageId`; a committed assistant message beats a run's chunks and final response;
 *  - each run keeps its own buffer, so concurrent agents never mix; `final_response` replaces chunks, never appends;
 *  - handoff cards are keyed by the TARGET run id; steering and handoff status never regress from a terminal one;
 *  - the cursor is the full `eventId`; an event at or below it is a replay and is skipped (BigInt compare on the numeric
 *    suffix); `room_stream_ready.head` is never a cursor; a bad or foreign frame throws and must not advance it;
 *  - `room_access_revoked` clears everything and later frames are ignored.
 * ADDED here (not in the reference): `order`, the display order of messages and handoff cards (history order first, then
 * arrival order; a live handoff is anchored right under the message that started its source run), so the timeline can be
 * drawn without re-sorting by timestamp, which the handoff warns against. It is additive: no reference rule depends on it.
 */

export type RoomTransport = "connecting" | "connected" | "revoked";

/* eslint-disable @typescript-eslint/no-explicit-any */
export type RoomMessageRow = Record<string, any>;
export interface RoomHandoff {
  runId: string;
  status?: string;
  [key: string]: any;
}
export interface RoomRun {
  status?: string;
  committed?: boolean;
  final?: boolean;
  markdown?: string;
  structuredResponse?: any;
  agentKey?: string | null;
  agentLabel?: string | null;
  deliveryGap?: boolean;
  error?: string | null;
  progress?: any;
}

/** One slot of the timeline: a message or a handoff card, with the time to show it under (its own timestamp, never the envelope's). */
export interface RoomOrderEntry {
  kind: "message" | "handoff";
  id: string;
  timestamp: string | null;
}

export interface RoomState {
  conversationId: string;
  /** The full `eventId` of the last applied event, or null. */
  cursor: string | null;
  messages: Map<string, RoomMessageRow>;
  handoffs: Map<string, RoomHandoff>;
  runs: Map<string, RoomRun>;
  /** Rows without a message id (investigation cards): kept as bootstrapped, they use their own progress feed. */
  otherHistory: RoomMessageRow[];
  order: RoomOrderEntry[];
  transport: RoomTransport;
}

/** The durable envelope of one feed event (`data:` of an SSE frame). */
export interface RoomEvent {
  sequence?: number;
  eventId: string;
  eventType: string;
  conversationId: string;
  runId?: string | null;
  agentKey?: string | null;
  agentLabel?: string | null;
  atUtc?: string;
  data: any;
}

const terminal = (status: string | undefined | null) => ["done", "failed", "cancelled"].includes(status?.toLowerCase() ?? "");
const compact = (id: string) => id.replaceAll("-", "").toLowerCase();

export function createRoomState(conversationId: string, history: RoomMessageRow[] = []): RoomState {
  const state: RoomState = {
    conversationId,
    cursor: null,
    messages: new Map(),
    handoffs: new Map(),
    runs: new Map(),
    otherHistory: [],
    order: [],
    transport: "connecting",
  };
  for (const row of history) {
    if (row.handoff) {
      state.handoffs.set(row.handoff.runId, row.handoff);
      state.runs.set(row.handoff.runId, { ...state.runs.get(row.handoff.runId), status: row.handoff.status });
      state.order.push({ kind: "handoff", id: row.handoff.runId, timestamp: row.timestamp ?? null });
    } else if (row.messageId) {
      if (!state.messages.has(row.messageId)) state.order.push({ kind: "message", id: row.messageId, timestamp: row.timestamp ?? null });
      state.messages.set(row.messageId, row);
      if (row.role === "assistant" && row.runId) {
        state.runs.set(row.runId, {
          ...state.runs.get(row.runId),
          committed: true,
          markdown: row.content,
          structuredResponse: row.structuredResponse,
          agentKey: row.agentKey,
          agentLabel: row.agentLabel,
        });
      }
    } else {
      // Investigation cards use their own progress feed. Preserve the bootstrap rows.
      state.otherHistory.push(row);
    }
  }
  return state;
}

/** Index to insert a live handoff card at: right under the message of its source run, after any cards already anchored there. */
function anchorIndex(state: RoomState, sourceRunId: string | undefined): number {
  if (!sourceRunId) return state.order.length;
  const at = state.order.findIndex((entry) => entry.kind === "message" && state.messages.get(entry.id)?.runId === sourceRunId);
  if (at === -1) return state.order.length;
  let index = at + 1;
  while (index < state.order.length && state.order[index].kind === "handoff") index++;
  return index;
}

export function applyRoomEvent(previous: RoomState, type: string, event: RoomEvent | Record<string, any>): RoomState {
  if (type === "room_access_revoked") {
    return { ...createRoomState(previous.conversationId), transport: "revoked" };
  }
  if (previous.transport === "revoked") return previous;
  if (type === "room_heartbeat") return previous;
  if (type === "room_stream_ready") {
    if (compact(event.conversationId) !== compact(previous.conversationId)) throw new Error("Wrong conversation");
    // head is diagnostic only; it is not an applied event cursor.
    return { ...previous, transport: "connected" };
  }

  const prefix = `${compact(previous.conversationId)}:`;
  if (compact(event.conversationId) !== compact(previous.conversationId) || !event.eventId?.startsWith(prefix) || event.eventType !== type) {
    throw new Error("Invalid event envelope");
  }
  const rawSequence = event.eventId.slice(prefix.length);
  if (!/^[1-9][0-9]*$/.test(rawSequence)) throw new Error("Invalid cursor");
  // Parse the ID, not a rounded JavaScript JSON number, for PostgreSQL bigint cursors.
  const sequence = BigInt(rawSequence);
  if (previous.cursor && sequence <= BigInt(previous.cursor.split(":")[1])) return previous;

  const state: RoomState = {
    ...previous,
    messages: new Map(previous.messages),
    handoffs: new Map(previous.handoffs),
    runs: new Map(previous.runs),
  };
  const data = event.data;
  const runId: string | null | undefined = event.runId;
  const run: RoomRun = {
    ...(state.runs.get(runId as string) ?? {}),
    agentKey: event.agentKey ?? state.runs.get(runId as string)?.agentKey,
    agentLabel: event.agentLabel ?? state.runs.get(runId as string)?.agentLabel,
  };

  if (type === "message_committed" || type === "steering_updated") {
    if (!data.messageId) throw new Error("Missing message identity");
    const old = state.messages.get(data.messageId) ?? {};
    const fields = Object.fromEntries(Object.entries(data).filter(([, value]) => value != null));
    const row: RoomMessageRow = { ...old, ...fields };
    if (old.steeringStatus && old.steeringStatus !== "queued" && row.steeringStatus === "queued") {
      row.steeringStatus = old.steeringStatus;
    }
    if (!state.messages.has(data.messageId)) {
      state.order = [...state.order, { kind: "message", id: data.messageId, timestamp: data.timestamp ?? event.atUtc ?? null }];
    }
    state.messages.set(data.messageId, row);
    if (data.role === "assistant" && runId) {
      Object.assign(run, { committed: true, markdown: data.content, structuredResponse: data.structuredResponse });
    }
  } else if (type === "agent_handoff") {
    const handoff = data.payload ?? data;
    const old = state.handoffs.get(handoff.targetRunId);
    if (!old) {
      const order = [...state.order];
      order.splice(anchorIndex(state, handoff.sourceRunId), 0, { kind: "handoff", id: handoff.targetRunId, timestamp: event.atUtc ?? null });
      state.order = order;
    }
    state.handoffs.set(handoff.targetRunId, {
      ...old,
      ...handoff,
      runId: handoff.targetRunId,
      status: terminal(old?.status) ? old?.status : handoff.status,
    });
  } else if (type === "run_state") {
    if (!terminal(run.status) || terminal(data.status)) run.status = data.status;
    const card = state.handoffs.get(runId as string);
    if (card && (!terminal(card.status) || terminal(data.status))) {
      state.handoffs.set(runId as string, { ...card, status: data.status });
    }
  } else if (type === "stream_delivery_gap") {
    run.deliveryGap = true;
  } else if (!run.committed) {
    if (type === "response_chunk" && !run.final) run.markdown = (run.markdown ?? "") + (data.message ?? "");
    if (type === "final_response") {
      run.final = true;
      run.structuredResponse = data.payload;
      run.markdown = data.payload.markdown; // final replaces chunks, never concatenate it.
    }
    if (type === "run_started" && !terminal(run.status)) run.status = "Running";
    if (type === "error") {
      run.status = "Failed";
      run.error = data.errorMessage;
    }
    if (type === "run_cancelled") run.status = "Cancelled";
    if (type === "progress") run.progress = data.payload;
  }
  if (runId) state.runs.set(runId, run);
  // Unknown additive events (e.g. `suggested_action`) may be ignored after parsing. Advance only after applying the frame.
  state.cursor = event.eventId;
  return state;
}

export { terminal as isTerminalStatus };
