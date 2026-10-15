import test from 'node:test';
import assert from 'node:assert/strict';
import { openRoomFeed, backoffDelay } from './room-feed-client.ts';

const encoder = new TextEncoder();
const streamOf = (text, { hang = false } = {}) => new ReadableStream({
  start(controller) {
    controller.enqueue(encoder.encode(text));
    if (!hang) controller.close();
  }
});
const frame = (id, type) => `id: ${id}\nevent: ${type}\ndata: {"eventId":"${id}","eventType":"${type}"}\n\n`;
const wait = (ms) => new Promise(r => setTimeout(r, ms));

function setup(responses) {
  const calls = [];
  const statuses = [];
  const frames = [];
  let cursor = null, rejected = 0, refreshes = 0;
  const realFetch = globalThis.fetch;
  globalThis.fetch = async (url, init) => {
    calls.push({ url, headers: init.headers });
    const next = responses.shift();
    if (!next) return new Promise(() => {}); // park any further call
    return typeof next === 'function' ? next() : next;
  };
  const stop = openRoomFeed({
    url: 'https://x/rooms/R/stream',
    getToken: () => 'tok',
    getCursor: () => cursor,
    onFrame: (name, data) => { frames.push(name); if (data.eventId) cursor = data.eventId; },
    onStatus: s => statuses.push(s),
    onCursorRejected: () => { rejected++; cursor = null; },
    refreshSession: async () => { refreshes++; return true; }
  });
  return { calls, statuses, frames, stop, restore: () => { stop(); globalThis.fetch = realFetch; }, get rejected() { return rejected; }, get refreshes() { return refreshes; } };
}

test('first connect replays from zero with the bearer token; a dropped stream reconnects with Last-Event-ID', async () => {
  const t = setup([
    new Response(streamOf(frame('c:1', 'progress') + frame('c:2', 'progress')), { status: 200 }),
    new Response(streamOf(frame('c:3', 'progress'), { hang: true }), { status: 200 })
  ]);
  await wait(1700); // first drop -> 1 s backoff (+/- jitter) -> second request
  assert.match(t.calls[0].url, /\?after=0$/);
  assert.equal(t.calls[0].headers.Authorization, 'Bearer tok');
  assert.equal(t.calls[1].url, 'https://x/rooms/R/stream');
  assert.equal(t.calls[1].headers['Last-Event-ID'], 'c:2');
  assert.deepEqual(t.frames, ['progress', 'progress', 'progress']);
  assert.ok(t.statuses.includes('reconnecting'));
  t.restore();
});

test('404 stops without retrying; 401 asks the app to refresh once then retries; a second 401 stops', async () => {
  let t = setup([new Response('', { status: 404 })]);
  await wait(150);
  assert.equal(t.calls.length, 1);
  assert.equal(t.statuses.at(-1), 'unavailable');
  t.restore();

  t = setup([new Response('', { status: 401 }), new Response('', { status: 401 })]);
  await wait(200);
  assert.equal(t.refreshes, 1);
  assert.equal(t.calls.length, 2);
  assert.equal(t.statuses.at(-1), 'unauthorized');
  t.restore();
});

test('a rejected cursor (400) replays from zero once, and a second 400 shows an error instead of looping', async () => {
  const t = setup([
    new Response(streamOf(frame('c:5', 'progress')), { status: 200 }),
    new Response('', { status: 400 }),
    new Response('', { status: 400 })
  ]);
  await wait(2300);
  assert.equal(t.rejected, 1);
  assert.match(t.calls[2].url, /\?after=0$/); // reset cursor -> after=0
  assert.equal(t.statuses.at(-1), 'error');
  assert.equal(t.calls.length, 3);
  t.restore();
});

test('stop aborts the subscription and no further request is made', async () => {
  const t = setup([new Response(streamOf(frame('c:1', 'progress')), { status: 200 })]);
  await wait(50);
  t.stop();
  await wait(1500);
  assert.equal(t.calls.length, 1);
  t.restore();
});

test('backoff is bounded 1-15 s with jitter', () => {
  assert.ok(backoffDelay(0, () => 0) >= 750 && backoffDelay(0, () => 1) <= 1250);
  assert.ok(backoffDelay(10, () => 1) <= 15000 * 1.25);
  assert.ok(backoffDelay(10, () => 0) >= 15000 * 0.75);
});
