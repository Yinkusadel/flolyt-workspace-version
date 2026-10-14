import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";

import { API_ENDPOINTS } from "@/config/apiConfig";
import { useGetRoomThread } from "@/features/rooms/use-get-room-thread";
import { openRoomFeed, type RoomFeedStatus } from "@/features/rooms/live/room-feed-client";
import { applyRoomEvent, createRoomState, type RoomMessageRow, type RoomState } from "@/features/rooms/live/room-live-state";
import { roomLog, roomWarn } from "@/features/rooms/live/room-thread-log";
import { agentActivity, buildTimeline, settlePending, withPendingMessages, type PendingMessage } from "@/features/rooms/live/room-timeline";
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
    roomLog("History loaded, state created", { conversationId: action.conversationId, rows: action.history.length });
    return { conversationId: action.conversationId, history: action.history, state: createRoomState(action.conversationId, action.history) };
  }
  if (!held.state || !held.conversationId) return held;
  if (action.type === "rewind") {
    roomLog("State rebuilt from the history (cursor was rejected)");
    return { ...held, state: createRoomState(held.conversationId, held.history) };
  }
  try {
    const next = applyRoomEvent(held.state, action.eventName, action.data as Record<string, unknown>);
    const eventId = (action.data as { eventId?: string } | null)?.eventId ?? null;
    roomLog(next === held.state ? "Event skipped (replay, heartbeat or revoked)" : "Event applied", {
      eventName: action.eventName,
      eventId,
      cursorBefore: held.state.cursor,
      cursorAfter: next.cursor,
      messages: next.messages.size,
      runs: next.runs.size,
      transport: next.transport,
    });
    return { ...held, state: next };
  } catch (error) {
    // A malformed or foreign frame: leave the state and the cursor exactly as they were.
    roomWarn("Frame not applied (state and cursor unchanged)", { eventName: action.eventName, reason: error instanceof Error ? error.message : String(error) });
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
export function useRoomLiveThread(
  roomId: string,
  conversationId: string | null,
  resolveAuthorName?: (userId: string) => string | null,
  me?: { id: string; name: string | null } | null
) {
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
      roomLog("Run event seen: refreshing the Agents & runs data");
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
      onStatus: (status) => {
        roomLog("Feed status", { status });
        setFeed(status);
      },
      onCursorRejected: () => dispatch({ type: "rewind" }),
      // A 401 goes through the app's own authenticated client, whose interceptor refreshes the session (with its lock).
      refreshSession: () => getRoom(roomId).then(() => true, () => false),
    });
  }, [ready, revoked, conversationId, roomId, feedKey, scheduleRunsRefresh]);

  // Messages just sent, shown at once: the backend commits a prompt AFTER its run has started streaming, so without this the person's own
  // message would appear below the answer. Each is replaced by its committed copy when that arrives.
  const [pending, setPending] = React.useState<PendingMessage[]>([]);
  React.useEffect(() => {
    if (!state) return;
    setPending((current) => {
      const left = settlePending(current, state, me?.id ?? null, Date.now());
      if (left.length !== current.length) roomLog("Pending message settled (its committed copy arrived)", { before: current.length, after: left.length });
      return left;
    });
  }, [state, me?.id]);
  const addPending = React.useCallback((content: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    roomLog("Pending message added (shown at once)", { id, content });
    setPending((current) => [...current, { id, content, sentAtMs: Date.now() }]);
    // A lost event must not leave the placeholder for ever.
    window.setTimeout(() => setPending((current) => current.filter((item) => item.id !== id)), 95_000);
    return id;
  }, []);
  const removePending = React.useCallback((id: string) => {
    roomLog("Pending message removed (the send failed)", { id });
    setPending((current) => current.filter((item) => item.id !== id));
  }, []);

  const committed = React.useMemo(() => (state ? buildTimeline(state, resolveAuthorName) : []), [state, resolveAuthorName]);
  const timeline = React.useMemo(
    () => withPendingMessages(committed, pending, me?.id ?? null, me?.name ?? null),
    [committed, pending, me?.id, me?.name]
  );
  const activity = React.useMemo(() => (state ? agentActivity(state) : {}), [state]);

  const connection: RoomLiveConnection = revoked ? "revoked" : feed;

  return {
    /** The conversation history is still loading (before anything can be drawn). */
    isPending: !state && history.isPending,
    isError: !state && history.isError,
    error: history.error,
    refetchHistory: () => history.refetch(),
    timeline,
    /** Draw a message the person just sent, before the feed delivers its committed copy; returns an id for `removePending`. */
    addPending,
    /** Drop a pending message whose send failed. */
    removePending,
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
