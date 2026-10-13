/**
 * Incremental parser for a `text/event-stream` body (WHATWG SSE rules). It takes arbitrary text chunks, so a frame split across
 * network reads, CRLF / LF / lone CR line endings, multi-line `data:` fields and `:` comment lines all work, and it hands over
 * only COMPLETE frames (a blank line ends one). Native `EventSource` cannot send an Authorization header, which is why the Room
 * feed is read with fetch and parsed here.
 */
export interface SseFrame {
  /** The `id:` of the frame, or "" (control frames such as the heartbeat carry none). */
  id: string;
  /** The `event:` name; "message" when absent. */
  event: string;
  /** All `data:` lines joined with "\n". */
  data: string;
}

export function createSseParser(onFrame: (frame: SseFrame) => void) {
  let buffer = "";
  let id = "";
  let event = "";
  let dataLines: string[] = [];
  let hasField = false;

  const dispatch = () => {
    if (hasField && dataLines.length > 0) onFrame({ id, event: event || "message", data: dataLines.join("\n") });
    // `id` belongs to one frame here: a control frame without its own id must not inherit the previous cursor.
    id = "";
    event = "";
    dataLines = [];
    hasField = false;
  };

  const handleLine = (line: string) => {
    if (line === "") return dispatch();
    if (line.startsWith(":")) return; // comment
    const colon = line.indexOf(":");
    const field = colon === -1 ? line : line.slice(0, colon);
    let value = colon === -1 ? "" : line.slice(colon + 1);
    if (value.startsWith(" ")) value = value.slice(1);
    if (field === "data") {
      dataLines.push(value);
      hasField = true;
    } else if (field === "event") {
      event = value;
      hasField = true;
    } else if (field === "id") {
      if (!value.includes("\0")) id = value;
      hasField = true;
    } // `retry` and unknown fields are ignored
  };

  return {
    push(text: string) {
      buffer += text;
      for (;;) {
        const match = /\r\n|\n|\r/.exec(buffer);
        if (!match) return;
        // A "\r" at the very end may be the first half of a "\r\n" split across two chunks: wait for more.
        if (match[0] === "\r" && match.index === buffer.length - 1) return;
        const line = buffer.slice(0, match.index);
        buffer = buffer.slice(match.index + match[0].length);
        handleLine(line);
      }
    },
  };
}
