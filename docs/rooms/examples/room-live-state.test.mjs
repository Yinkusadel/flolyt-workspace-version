import test from 'node:test';
import assert from 'node:assert/strict';
import { createRoomState, applyRoomEvent } from './room-live-state.mjs';

const conversation = '01234567-89ab-cdef-0123-456789abcdef';
const prefix = conversation.replaceAll('-', '');
function frame(sequence, type, runId, data) {
  return { eventId: `${prefix}:${sequence}`, conversationId: conversation, eventType: type, runId, data };
}
function apply(state, sequence, type, runId, data) {
  return applyRoomEvent(state, type, frame(sequence, type, runId, data));
}

test('bootstrap replay cannot replace an authoritative history answer with old chunks', () => {
  let state = createRoomState(conversation, [
    { messageId: 'answer', role: 'assistant', runId: 'ria', content: 'Measured answer', authorName: 'RIA' }
  ]);
  state = apply(state, 1, 'response_chunk', 'ria', { message: 'Old draft' });
  state = apply(state, 2, 'final_response', 'ria', { payload: { markdown: 'Old final' } });
  state = apply(state, 3, 'message_committed', 'ria',
    { messageId: 'answer', role: 'assistant', content: 'Measured answer' });
  assert.equal(state.runs.get('ria').markdown, 'Measured answer');
  assert.equal(state.messages.size, 1);
  assert.equal(state.messages.get('answer').authorName, 'RIA');
});

test('two viewers independently multiplex concurrent specialists and later teammate messages', () => {
  const events = [
    frame(1, 'response_chunk', 'sentinel', { message: 'Churn ' }),
    frame(2, 'response_chunk', 'ria', { message: 'Revenue ' }),
    frame(3, 'response_chunk', 'sentinel', { message: 'drivers' }),
    frame(4, 'final_response', 'sentinel', { payload: { markdown: 'Churn drivers' } }),
    frame(5, 'run_state', 'sentinel', { status: 'Done' }),
    frame(6, 'response_chunk', 'ria', { message: 'drivers' }),
    frame(7, 'message_committed', null, { messageId: 'teammate', role: 'user', content: 'Check NGN' })
  ];
  const reduce = () => events.reduce((s, e) => applyRoomEvent(s, e.eventType, e), createRoomState(conversation));
  const a = reduce(), b = reduce();
  assert.deepEqual(a, b);
  assert.equal(a.runs.get('sentinel').markdown, 'Churn drivers');
  assert.equal(a.runs.get('ria').markdown, 'Revenue drivers');
  assert.equal(a.transport, 'connecting'); // run completion never closes the transport.
  assert.equal(a.messages.get('teammate').content, 'Check NGN');
});

test('reconnect deduplicates applied events and ignores diagnostic head', () => {
  let state = apply(createRoomState(conversation), 1, 'response_chunk', 'ria', { message: 'A' });
  const before = state;
  state = applyRoomEvent(state, 'room_stream_ready', { conversationId: conversation, head: 500 });
  assert.equal(state.cursor, before.cursor);
  state = apply(state, 1, 'response_chunk', 'ria', { message: 'A' });
  state = apply(state, 2, 'response_chunk', 'ria', { message: 'B' });
  assert.equal(state.runs.get('ria').markdown, 'AB');
  assert.equal(before.runs.get('ria').markdown, 'A'); // immutable React state.
});

test('recovery replaces a provisional answer even if its final event arrives later', () => {
  let state = apply(createRoomState(conversation), 1, 'response_chunk', 'ria', { message: 'Draft' });
  state = apply(state, 2, 'stream_delivery_gap', 'ria', {});
  state = apply(state, 3, 'message_committed', 'ria',
    { messageId: 'answer', role: 'assistant', content: 'Committed answer' });
  state = apply(state, 4, 'final_response', 'ria', { payload: { markdown: 'Late provisional final' } });
  assert.equal(state.runs.get('ria').markdown, 'Committed answer');
  assert.equal(state.runs.get('ria').deliveryGap, true);
});

test('history, runtime and reconciled handoffs share target run identity', () => {
  let state = createRoomState(conversation, [
    { handoff: { runId: 'sentinel', status: 'done', reason: 'Investigate' } }
  ]);
  state = apply(state, 1, 'agent_handoff', 'maestro',
    { payload: { targetRunId: 'sentinel', sourceRunId: 'maestro', status: 'queued' } });
  state = apply(state, 2, 'agent_handoff', 'sentinel',
    { targetRunId: 'sentinel', sourceRunId: 'maestro', status: 'done' });
  state = apply(state, 3, 'run_state', 'sentinel', { status: 'Queued' });
  assert.equal(state.handoffs.size, 1);
  assert.equal(state.handoffs.get('sentinel').status, 'done');
  assert.equal(state.runs.get('sentinel').status, 'done');
});

test('steering terminal receipts cannot regress during overlapping history replay', () => {
  let state = createRoomState(conversation, [{ messageId: 'steer', role: 'steering', steeringStatus: 'delivered' }]);
  state = apply(state, 1, 'steering_updated', 'ria', { messageId: 'steer', steeringStatus: 'queued' });
  assert.equal(state.messages.get('steer').steeringStatus, 'delivered');
});

test('revocation clears protected state and ignores later buffered frames', () => {
  let state = apply(createRoomState(conversation), 1, 'response_chunk', 'ria', { message: 'Private' });
  state = applyRoomEvent(state, 'room_access_revoked', {});
  state = apply(state, 2, 'response_chunk', 'ria', { message: 'Late' });
  assert.equal(state.transport, 'revoked');
  assert.equal(state.runs.size, 0);
  assert.equal(state.messages.size, 0);
  assert.equal(state.cursor, null);
});

test('malformed or foreign frames do not advance the cursor', () => {
  const state = createRoomState(conversation);
  assert.throws(() => applyRoomEvent(state, 'progress',
    { ...frame(1, 'progress', 'ria', {}), conversationId: 'foreign' }));
  assert.throws(() => applyRoomEvent(state, 'progress',
    { ...frame(1, 'progress', 'ria', {}), eventId: `${prefix}:bad` }));
  assert.equal(state.cursor, null);
});

test('cursor comparisons remain exact above JavaScript safe integer range', () => {
  let state = apply(createRoomState(conversation), '9007199254740992', 'progress', 'ria', {});
  state = apply(state, '9007199254740993', 'progress', 'ria', {});
  assert.equal(state.cursor, `${prefix}:9007199254740993`);
});
