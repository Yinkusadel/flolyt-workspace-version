import test from 'node:test';
import assert from 'node:assert/strict';
import { createSseParser } from './sse-parser.ts';

const collect = (chunks) => {
  const frames = [];
  const parser = createSseParser(frame => frames.push(frame));
  for (const chunk of chunks) parser.push(chunk);
  return frames;
};

test('a frame split at every possible byte boundary parses the same', () => {
  const text = 'id: a:1\nevent: progress\ndata: {"x":1}\n\n';
  for (let cut = 1; cut < text.length; cut++) {
    assert.deepEqual(collect([text.slice(0, cut), text.slice(cut)]), [{ id: 'a:1', event: 'progress', data: '{"x":1}' }]);
  }
});

test('CRLF, LF and lone CR endings, including a CRLF split across two chunks', () => {
  assert.equal(collect(['event: a\r\ndata: 1\r\n\r\n'])[0].data, '1');
  // a final lone CR is held back (it may be half of a CRLF) until the next bytes arrive
  assert.equal(collect(['event: a\rdata: 2\r\r', 'x'])[0].data, '2');
  assert.equal(collect(['event: a\r', '\ndata: 3\r', '\n\r', '\n'])[0].data, '3');
});

test('multi-line data is joined with a newline, comments are ignored', () => {
  const [frame] = collect([': keep-alive\ndata: line one\ndata: line two\n\n']);
  assert.equal(frame.data, 'line one\nline two');
  assert.equal(frame.event, 'message');
});

test('a frame is delivered only once complete, and the id does not leak into the next frame', () => {
  const frames = [];
  const parser = createSseParser(f => frames.push(f));
  parser.push('id: x:1\nevent: a\ndata: {}\n');
  assert.equal(frames.length, 0);
  parser.push('\nevent: room_heartbeat\ndata: {}\n\n');
  assert.deepEqual(frames.map(f => [f.id, f.event]), [['x:1', 'a'], ['', 'room_heartbeat']]);
});

test('a value keeps everything after the first colon and only one leading space is dropped', () => {
  const [frame] = collect(['data:  {"a":"b:c"}\n\n']);
  assert.equal(frame.data, ' {"a":"b:c"}');
});
