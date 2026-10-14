// Framework-neutral reference reducer for the React/Vite handoff, not a shipped UI or SSE parser.
const terminal = status => ['done', 'failed', 'cancelled'].includes(status?.toLowerCase());
const compact = id => id.replaceAll('-', '').toLowerCase();

export function createRoomState(conversationId, history = []) {
  const state = {
    conversationId, cursor: null, messages: new Map(), handoffs: new Map(),
    runs: new Map(), otherHistory: [], transport: 'connecting'
  };
  for (const row of history) {
    if (row.handoff) {
      state.handoffs.set(row.handoff.runId, row.handoff);
      state.runs.set(row.handoff.runId, { ...state.runs.get(row.handoff.runId), status: row.handoff.status });
    } else if (row.messageId) {
      state.messages.set(row.messageId, row);
      if (row.role === 'assistant' && row.runId) {
        state.runs.set(row.runId, { ...state.runs.get(row.runId), committed: true,
          markdown: row.content, structuredResponse: row.structuredResponse,
          agentKey: row.agentKey, agentLabel: row.agentLabel });
      }
    } else {
      // Investigation cards use their own progress feed. Preserve the bootstrap rows.
      state.otherHistory.push(row);
    }
  }
  return state;
}

export function applyRoomEvent(previous, type, event) {
  if (type === 'room_access_revoked') {
    return { ...createRoomState(previous.conversationId), transport: 'revoked' };
  }
  if (previous.transport === 'revoked') return previous;
  if (type === 'room_heartbeat') return previous;
  if (type === 'room_stream_ready') {
    if (compact(event.conversationId) !== compact(previous.conversationId)) throw new Error('Wrong conversation');
    // head is diagnostic only; it is not an applied event cursor.
    return { ...previous, transport: 'connected' };
  }

  const prefix = `${compact(previous.conversationId)}:`;
  if (compact(event.conversationId) !== compact(previous.conversationId)
      || !event.eventId?.startsWith(prefix) || event.eventType !== type) throw new Error('Invalid event envelope');
  const rawSequence = event.eventId.slice(prefix.length);
  if (!/^[1-9][0-9]*$/.test(rawSequence)) throw new Error('Invalid cursor');
  // Parse the ID, not a rounded JavaScript JSON number, for PostgreSQL bigint cursors.
  const sequence = BigInt(rawSequence);
  if (previous.cursor && sequence <= BigInt(previous.cursor.split(':')[1])) return previous;

  const state = { ...previous, messages: new Map(previous.messages),
    handoffs: new Map(previous.handoffs), runs: new Map(previous.runs) };
  const data = event.data;
  const runId = event.runId;
  const run = { ...(state.runs.get(runId) ?? {}),
    agentKey: event.agentKey ?? state.runs.get(runId)?.agentKey,
    agentLabel: event.agentLabel ?? state.runs.get(runId)?.agentLabel };

  if (type === 'message_committed' || type === 'steering_updated') {
    if (!data.messageId) throw new Error('Missing message identity');
    const old = state.messages.get(data.messageId) ?? {};
    const fields = Object.fromEntries(Object.entries(data).filter(([, value]) => value != null));
    const row = { ...old, ...fields };
    if (old.steeringStatus && old.steeringStatus !== 'queued' && row.steeringStatus === 'queued') {
      row.steeringStatus = old.steeringStatus;
    }
    state.messages.set(data.messageId, row);
    if (data.role === 'assistant' && runId) {
      Object.assign(run, { committed: true, markdown: data.content, structuredResponse: data.structuredResponse });
    }
  } else if (type === 'agent_handoff') {
    const handoff = data.payload ?? data;
    const old = state.handoffs.get(handoff.targetRunId);
    state.handoffs.set(handoff.targetRunId, {
      ...old, ...handoff, runId: handoff.targetRunId,
      status: terminal(old?.status) ? old.status : handoff.status
    });
  } else if (type === 'run_state') {
    if (!terminal(run.status) || terminal(data.status)) run.status = data.status;
    const card = state.handoffs.get(runId);
    if (card && (!terminal(card.status) || terminal(data.status))) {
      state.handoffs.set(runId, { ...card, status: data.status });
    }
  } else if (type === 'stream_delivery_gap') {
    run.deliveryGap = true;
  } else if (!run.committed) {
    if (type === 'response_chunk' && !run.final) run.markdown = (run.markdown ?? '') + (data.message ?? '');
    if (type === 'final_response') {
      run.final = true;
      run.structuredResponse = data.payload;
      run.markdown = data.payload.markdown; // final replaces chunks, never concatenate it.
    }
    if (type === 'run_started' && !terminal(run.status)) run.status = 'Running';
    if (type === 'error') { run.status = 'Failed'; run.error = data.errorMessage; }
    if (type === 'run_cancelled') run.status = 'Cancelled';
    if (type === 'progress') run.progress = data.payload;
  }
  if (runId) state.runs.set(runId, run);
  // Unknown additive events may be ignored after parsing. Advance only after applying the frame.
  state.cursor = event.eventId;
  return state;
}
