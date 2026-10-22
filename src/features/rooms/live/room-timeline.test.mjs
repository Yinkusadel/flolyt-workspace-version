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

// ---- Pending messages: the backend commits a prompt AFTER its run has started streaming (seen on every real run). ----
import { settlePending, withPendingMessages } from './room-timeline.ts';

test('a pending message sits after the committed messages and before the working run, then settles when its committed copy arrives', () => {
  let state = createRoomState(conversation, [{ messageId: 'old', role: 'user', content: 'earlier', authorUserId: 'me', timestamp: '2026-10-13T10:00:00Z' }]);
  const sentAt = Date.parse('2026-10-14T09:00:00Z');
  const pending = [{ id: 'p1', content: 'What should we look at first?', sentAtMs: sentAt }];
  // the run starts and streams BEFORE the prompt is committed (the real ordering)
  state = apply(state, 1, 'run_started', 'r1', { message: 'RIA is working.' }, { agentKey: 'a.ria', agentLabel: 'RIA' });
  state = apply(state, 2, 'response_chunk', 'r1', { message: 'Draft' });
  let items = withPendingMessages(buildTimeline(state), pending, 'me', 'Chad');
  assert.deepEqual(items.map(i => i.key), ['m:old', 'p:p1', 'r:r1']);
  assert.equal(items[1].row.pending, true);
  assert.equal(items[1].row.authorName, 'Chad');
  assert.equal(settlePending(pending, state, 'me', sentAt + 2000).length, 1); // not committed yet
  // the committed prompt arrives (late), the placeholder goes, the message keeps its place before the run
  state = apply(state, 3, 'message_committed', 'r1', { messageId: 'q', role: 'user', content: 'What should we look at first?', authorUserId: 'me', timestamp: '2026-10-14T09:00:03Z' });
  assert.equal(settlePending(pending, state, 'me', sentAt + 4000).length, 0);
  items = withPendingMessages(buildTimeline(state), [], 'me', 'Chad');
  assert.deepEqual(items.map(i => i.key), ['m:old', 'm:q', 'r:r1']);
});

test('pending matching needs the same person, the same text and a message at or after the send; a stale pending is dropped', () => {
  const sentAt = Date.parse('2026-10-14T09:00:00Z');
  const pending = [{ id: 'p', content: 'same text', sentAtMs: sentAt }];
  const withRow = (row) => createRoomState(conversation, [{ messageId: 'm', role: 'user', ...row }]);
  // an OLDER identical message (sent long before) must not settle it
  assert.equal(settlePending(pending, withRow({ content: 'same text', authorUserId: 'me', timestamp: '2026-10-13T09:00:00Z' }), 'me', sentAt + 1000).length, 1);
  // someone else saying the same thing does not settle it
  assert.equal(settlePending(pending, withRow({ content: 'same text', authorUserId: 'other', timestamp: '2026-10-14T09:00:02Z' }), 'me', sentAt + 3000).length, 1);
  // different text does not settle it
  assert.equal(settlePending(pending, withRow({ content: 'other text', authorUserId: 'me', timestamp: '2026-10-14T09:00:02Z' }), 'me', sentAt + 3000).length, 1);
  // 90 s later it is dropped even if nothing arrived
  assert.equal(settlePending(pending, createRoomState(conversation), 'me', sentAt + 91_000).length, 0);
});
