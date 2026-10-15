import test from 'node:test';
import assert from 'node:assert/strict';
import { createRoomState, applyRoomEvent } from './room-live-state.ts';
import { buildTimeline, agentActivity } from './room-timeline.ts';

const conversation = '01234567-89ab-cdef-0123-456789abcdef';
const prefix = conversation.replaceAll('-', '');
const apply = (state, sequence, type, runId, data, extra = {}) =>
  applyRoomEvent(state, type, { eventId: `${prefix}:${sequence}`, conversationId: conversation, eventType: type, runId, data, ...extra });

test('a working run shows a plain phrase, its draft, and disappears once the committed answer lands', () => {
  let state = createRoomState(conversation, [{ messageId: 'q', role: 'user', content: 'ask', authorUserId: 'u1', authorName: 'Chad', timestamp: 't0' }]);
  state = apply(state, 1, 'run_started', 'r1', { message: 'RIA is working.' }, { agentKey: 'a.ria', agentLabel: 'RIA' });
  state = apply(state, 2, 'progress', 'r1', { payload: { stage: 'reading', message: 'conversation_id:secret' } });
  let items = buildTimeline(state);
  const live = items.find(i => i.kind === 'live-run');
  assert.equal(live.run.working, 'Reading your data');
  assert.equal(live.run.agentLabel, 'RIA');
  assert.deepEqual(agentActivity(state), { 'a.ria': 'running' });
  state = apply(state, 3, 'response_chunk', 'r1', { message: 'Draft so far' });
  assert.equal(buildTimeline(state).find(i => i.kind === 'live-run').run.markdown, 'Draft so far');
  state = apply(state, 4, 'message_committed', 'r1', { messageId: 'ans', role: 'assistant', content: 'Final', runId: 'r1', timestamp: 't1' });
  state = apply(state, 5, 'run_state', 'r1', { status: 'Done' });
  items = buildTimeline(state);
  assert.equal(items.filter(i => i.kind === 'live-run').length, 0);
  const answer = items.find(i => i.key === 'm:ans');
  assert.equal(answer.row.agentLabel, 'RIA'); // taken from the run, the event omits it
  assert.deepEqual(agentActivity(state), {});
});

test('a name-less live message gets its author name from the resolver; a null name stays null', () => {
  let state = createRoomState(conversation);
  state = apply(state, 1, 'message_committed', null, { messageId: 'm', role: 'user', content: 'hi', authorUserId: 'u2', timestamp: 't' });
  assert.equal(buildTimeline(state, id => (id === 'u2' ? 'Hitsugaya' : null))[0].row.authorName, 'Hitsugaya');
  assert.equal(buildTimeline(state, () => null)[0].row.authorName, null);
});

test('handoff cards get one status spelling and safe labels; internal roles are not shown', () => {
  let state = createRoomState(conversation, [
    { messageId: 'ctx', role: 'context', content: '[Tools called]' },
    { messageId: 'u', role: 'user', runId: 'src', content: 'x' }
  ]);
  state = apply(state, 1, 'agent_handoff', 'src', { payload: { targetRunId: 't1', sourceRunId: 'src', status: 'queued' } });
  state = apply(state, 2, 'run_state', 't1', { status: 'AwaitingApproval' });
  const items = buildTimeline(state);
  assert.deepEqual(items.map(i => i.key).slice(0, 2), ['m:u', 'h:t1']);
  const card = items.find(i => i.kind === 'handoff').row.handoff;
  assert.equal(card.status, 'awaiting_approval');
  assert.equal(card.fromAgentLabel, 'An agent');
  assert.equal(items.some(i => i.key === 'm:ctx'), false);
  assert.deepEqual(agentActivity(state), {});
});

test('a failed run shows the backend error; a delivery gap with no draft still shows a notice row', () => {
  let state = apply(createRoomState(conversation), 1, 'error', 'r', { errorMessage: 'Provider unavailable' });
  assert.equal(buildTimeline(state)[0].run.failed, 'Provider unavailable');
  state = apply(createRoomState(conversation), 1, 'stream_delivery_gap', 'r2', {});
  assert.equal(buildTimeline(state)[0].run.deliveryGap, true);
});
