import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";

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

/** Feed events that change what the Agents & runs tab shows (a run started, moved or ended). */
const RUN_EVENTS = new Set(["run_started", "run_state", "run_cancelled", "error"]);

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

  // A run event means the Agents & runs tab (runs, roster states, investigation) is out of date: refetch it, once, shortly after the
  // burst ends (the replay on connect sends many events at once).
  const queryClient = useQueryClient();
  const refreshTimer = React.useRef<number | null>(null);
  const scheduleRunsRefresh = React.useCallback(() => {
    if (refreshTimer.current !== null) window.clearTimeout(refreshTimer.current);
    refreshTimer.current = window.setTimeout(() => {
      refreshTimer.current = null;
      queryClient.invalidateQueries({ queryKey: ["room-runs", roomId] });
      queryClient.invalidateQueries({ queryKey: ["room-investigation", roomId] });
    }, 600);
  }, [queryClient, roomId]);
  React.useEffect(() => () => {
    if (refreshTimer.current !== null) window.clearTimeout(refreshTimer.current);
  }, []);

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
        if (RUN_EVENTS.has(eventName)) scheduleRunsRefresh();
        dispatch({ type: "frame", eventName, data });
      },
      onStatus: setFeed,
      onCursorRejected: () => dispatch({ type: "rewind" }),
      // A 401 goes through the app's own authenticated client, whose interceptor refreshes the session (with its lock).
      refreshSession: () => getRoom(roomId).then(() => true, () => false),
    });
  }, [ready, revoked, conversationId, roomId, feedKey, scheduleRunsRefresh]);

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
