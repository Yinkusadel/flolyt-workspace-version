import { createSseParser } from "./sse-parser.ts";
import { roomError, roomLog } from "./room-thread-log.ts";

/** What the feed is doing right now, for the thread's "Live" indicator. */
export type RoomFeedStatus =
  | "connecting" // first connection
  | "connected"
  | "reconnecting" // dropped, retrying with backoff; state is kept
  | "unauthorized" // 401 that a token refresh did not fix
  | "unavailable" // 403/404: the Room is missing or no longer accessible; stop, do not retry
  | "error"; // a cursor the server refused twice, or an unexpected response

export interface RoomFeedOptions {
  /** Full URL of `GET /api/v3/rooms/{roomId}/stream`. */
  url: string;
  getToken: () => string | undefined;
  /** The full `eventId` of the last event the reducer applied, or null to replay from the start. */
  getCursor: () => string | null;
  /** One complete frame: the SSE event name and its parsed JSON `data:`. */
  onFrame: (eventName: string, data: unknown) => void;
  onStatus: (status: RoomFeedStatus) => void;
  /** The server refused our cursor (400): clear it and replay from zero once. */
  onCursorRejected: () => void;
  /** Called once on a 401, to let the app's own auth layer refresh the session; resolve true when a retry makes sense. */
  refreshSession: () => Promise<boolean>;
}

const MIN_DELAY_MS = 1000;
const MAX_DELAY_MS = 15000;

/** Bounded exponential backoff, 1 to 15 s, with up to 25% jitter either way. */
export const backoffDelay = (attempt: number, random = Math.random) => {
  const base = Math.min(MAX_DELAY_MS, MIN_DELAY_MS * 2 ** attempt);
  return Math.round(base * (0.75 + random() * 0.5));
};

const sleep = (ms: number, signal: AbortSignal) =>
  new Promise<void>((resolve) => {
    const timer = setTimeout(resolve, ms);
    signal.addEventListener("abort", () => {
      clearTimeout(timer);
      resolve();
    });
  });

/**
 * Keeps ONE Room feed subscription open: fetch streaming with the bearer token (EventSource cannot send it), the SSE parser,
 * and reconnection with `Last-Event-ID`. Returns a stop function; the caller must call it on unmount (it aborts the fetch and
 * releases the reader, which also covers React/Preact Strict Mode remounts). A dropped connection never cancels agent work and
 * the POST message is never retried from here.
 */
export function openRoomFeed(options: RoomFeedOptions): () => void {
  const controller = new AbortController();
  const { signal } = controller;

  const run = async () => {
    let attempt = 0;
    let refreshed = false;
    let cursorReset = false;
    let first = true;

    while (!signal.aborted) {
      options.onStatus(first ? "connecting" : "reconnecting");
      const isFirst = first;
      first = false;
      try {
        const cursor = options.getCursor();
        roomLog(isFirst ? "Feed connecting" : "Feed reconnecting", { attempt, url: cursor ? options.url : `${options.url}?after=0`, lastEventId: cursor, at: new Date().toISOString() });
        const headers: Record<string, string> = {
          Accept: "text/event-stream",
          Authorization: `Bearer ${options.getToken() ?? ""}`,
        };
        if (cursor) headers["Last-Event-ID"] = cursor;
        const response = await fetch(cursor ? options.url : `${options.url}?after=0`, { headers, signal, credentials: "include" });

        roomLog("Feed response", { status: response.status, contentType: response.headers.get("content-type"), at: new Date().toISOString() });
        if (response.status === 401) {
          if (!refreshed && (await options.refreshSession())) {
            refreshed = true;
            roomLog("Feed got 401, session refreshed, retrying");
            continue;
          }
          roomLog("Feed got 401, giving up");
          options.onStatus("unauthorized");
          return;
        }
        if (response.status === 403 || response.status === 404) {
          roomLog("Feed refused: the Room is missing or no longer accessible", { status: response.status });
          options.onStatus("unavailable");
          return;
        }
        if (response.status === 400) {
          // An invalid or ahead-of-journal cursor: replay from zero once; if it persists, show an error instead of looping.
          if (cursor && !cursorReset) {
            cursorReset = true;
            roomLog("Feed cursor rejected (400), replaying from zero once", { cursor });
            options.onCursorRejected();
            continue;
          }
          roomLog("Feed cursor rejected again (400), giving up", { cursor });
          options.onStatus("error");
          return;
        }
        if (!response.ok || !response.body) throw new Error(`Feed answered ${response.status}`);

        const decoder = new TextDecoder();
        const parser = createSseParser((frame) => {
          let data: unknown;
          try {
            data = JSON.parse(frame.data);
          } catch {
            roomLog("Feed frame ignored (not JSON)", { event: frame.event, raw: frame.data.slice(0, 200) });
            return; // not JSON: nothing to apply, and it must not advance the cursor
          }
          attempt = 0;
          roomLog("Feed frame", { at: new Date().toISOString(), event: frame.event, id: frame.id || null, data });
          options.onFrame(frame.event, data);
        });
        const reader = response.body.getReader();
        let chunkIndex = 0;
        try {
          for (;;) {
            const { value, done } = await reader.read();
            if (done) break;
            chunkIndex += 1;
            roomLog("Feed chunk", { idx: chunkIndex, bytes: value?.length ?? 0, at: new Date().toISOString() });
            parser.push(decoder.decode(value, { stream: true }));
          }
        } finally {
          reader.releaseLock();
        }
        roomLog("Feed stream ended by the server", { chunks: chunkIndex });
        // The stream ended (server closed it, proxy timeout, network): reconnect from the last applied event.
      } catch (error) {
        if (signal.aborted) return;
        roomError("Feed connection failed", error);
      }
      if (signal.aborted) return;
      options.onStatus("reconnecting");
      const delay = backoffDelay(attempt++);
      roomLog("Feed will reconnect", { inMs: delay, attempt });
      await sleep(delay, signal);
    }
  };

  void run();
  return () => {
    roomLog("Feed stopped (thread closed or left)");
    controller.abort();
  };
}
