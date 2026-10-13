import * as React from "react";

import { API_ENDPOINTS } from "@/config/apiConfig";
import { useGetRoomThread } from "@/features/rooms/use-get-room-thread";
import { openRoomFeed, type RoomFeedStatus } from "@/features/rooms/live/room-feed-client";
import { applyRoomEvent, createRoomState, type RoomMessageRow, type RoomState } from "@/features/rooms/live/room-live-state";
import { agentActivity, buildTimeline } from "@/features/rooms/live/room-timeline";
import { getRoom } from "@/services/api/rooms/get-room";
import { COOKIE_KEYS, getCookie } from "@/utils/cookies";

interface Held {
  conversationId: string | null;
  /** The history rows the state was built from, kept to rebuild after a rejected cursor. */
  history: RoomMessageRow[];
  state: RoomState | null;
}

type Action =
  | { type: "init"; conversationId: string; history: RoomMessageRow[] }
  | { type: "frame"; eventName: string; data: unknown }
  | { type: "rewind" };

function reduce(held: Held, action: Action): Held {
  if (action.type === "init") {
    return { conversationId: action.conversationId, history: action.history, state: createRoomState(action.conversationId, action.history) };
  }
  if (!held.state || !held.conversationId) return held;
  if (action.type === "rewind") return { ...held, state: createRoomState(held.conversationId, held.history) };
  try {
    return { ...held, state: applyRoomEvent(held.state, action.eventName, action.data as Record<string, unknown>) };
  } catch (error) {
    // A malformed or foreign frame: leave the state and the cursor exactly as they were.
    console.warn("Room feed: a frame was not applied", action.eventName, error);
    return held;
  }
}

export type RoomLiveConnection = RoomFeedStatus | "revoked";

/**
 * The Room thread, live. The conversation history is read ONCE as the bootstrap, then ONE Room-wide feed (`GET /rooms/{roomId}/stream`)
 * keeps the state current through the reducer in `live/room-live-state.ts`; there is no polling. The feed replays from the start
 * (`after=0`): the deliberate overlap with the history is deduplicated by `messageId`, so nothing committed in between is lost. A
 * dropped connection reconnects from the last applied event. Only this hook opens the feed, once per mounted thread, and it is
 * aborted on unmount; a send never retries from here.
 */
export function useRoomLiveThread(roomId: string, conversationId: string | null, resolveAuthorName?: (userId: string) => string | null) {
  const history = useGetRoomThread(conversationId);
  const [held, dispatch] = React.useReducer(reduce, { conversationId: null, history: [], state: null } as Held);
  const [feed, setFeed] = React.useState<RoomFeedStatus>("connecting");
  const [feedKey, setFeedKey] = React.useState(0);

  // Build the state from the FIRST history that arrives for this conversation; later history refetches must never rewind it.
  const initializedFor = React.useRef<string | null>(null);
  React.useEffect(() => {
    if (!conversationId || !history.data || initializedFor.current === conversationId) return;
    initializedFor.current = conversationId;
    dispatch({ type: "init", conversationId, history: history.data.data.messages as unknown as RoomMessageRow[] });
  }, [conversationId, history.data]);

  const state = held.state && held.conversationId === conversationId ? held.state : null;
  const cursorRef = React.useRef<string | null>(null);
  cursorRef.current = state?.cursor ?? null;
  const ready = !!state;
  const revoked = state?.transport === "revoked";

  React.useEffect(() => {
    if (!ready || revoked || !conversationId) return;
    return openRoomFeed({
      url: API_ENDPOINTS.ROOMS.STREAM_ROOM.replace("{roomId}", roomId),
      getToken: () => getCookie(COOKIE_KEYS.AUTH_TOKEN),
      getCursor: () => cursorRef.current,
      onFrame: (eventName, data) => {
        if (eventName === "room_stream_ready") setFeed("connected");
        dispatch({ type: "frame", eventName, data });
      },
      onStatus: setFeed,
      onCursorRejected: () => dispatch({ type: "rewind" }),
      // A 401 goes through the app's own authenticated client, whose interceptor refreshes the session (with its lock).
      refreshSession: () => getRoom(roomId).then(() => true, () => false),
    });
  }, [ready, revoked, conversationId, roomId, feedKey]);

  const timeline = React.useMemo(() => (state ? buildTimeline(state, resolveAuthorName) : []), [state, resolveAuthorName]);
  const activity = React.useMemo(() => (state ? agentActivity(state) : {}), [state]);

  const connection: RoomLiveConnection = revoked ? "revoked" : feed;

  return {
    /** The conversation history is still loading (before anything can be drawn). */
    isPending: !state && history.isPending,
    isError: !state && history.isError,
    error: history.error,
    refetchHistory: () => history.refetch(),
    timeline,
    /** Agent key -> `running` or `waiting` (for the roster dots). */
    activity,
    connection,
    /** Open the feed again after it gave up (unauthorized, unavailable or error). */
    reconnect: () => {
      setFeed("connecting");
      setFeedKey((key) => key + 1);
    },
  };
}
