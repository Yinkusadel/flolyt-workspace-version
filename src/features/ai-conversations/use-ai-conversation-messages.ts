import { useCallback, useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import * as signalR from "@microsoft/signalr";

import { API_ENDPOINTS, PRESENCE_HUB_URL } from "@/config/apiConfig";
import { COOKIE_KEYS, getCookie } from "@/utils/cookies";
import { AI_CONVERSATION_QUERY_KEY } from "./use-get-ai-conversation-by-id";
import type {
  AgentProgressEvent,
  AgentStreamEvent,
  AiConversationMessage,
  StreamProposal,
} from "./ai-conversation-types";
import type { AgentResponseV2 } from "./agent-response-types";
import type { ConversationRunEvent } from "./conversation-run-event-types";

interface UseAiConversationMessagesOptions {
  onConversationCreated?: (id: string) => void;
}

const TYPEWRITER_INTERVAL_MS = 8;
const TYPEWRITER_CHUNK_SIZE = 4;

type HandoffStatus = NonNullable<AiConversationMessage["handoff"]>["status"];
const HANDOFF_STATUSES: HandoffStatus[] = [
  "queued",
  "running",
  "awaiting_approval",
  "done",
  "failed",
  "cancelled",
];

export const useAiConversationMessages = (
  initialConversationId: string | undefined,
  options?: UseAiConversationMessagesOptions
) => {
  const queryClient = useQueryClient();
  const optionsRef = useRef<UseAiConversationMessagesOptions | undefined>(options);
  const [conversationId, setConversationId] = useState<string | null>(initialConversationId ?? null);
  const [messages, setMessages] = useState<AiConversationMessage[]>([]);
  const [proposals, setProposals] = useState<StreamProposal[]>([]);
  const [streamingText, setStreamingText] = useState("");
  const [animatedStreamingText, setAnimatedStreamingText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<string | null>(null);
  // The backend's own friendly text for the current phase (e.g. "Analyzing your request...",
  // "Processing...") — kept separate from currentPhase (the raw state code) so the UI can show
  // the real copy instead of a made-up label per state code.
  const [currentPhaseMessage, setCurrentPhaseMessage] = useState<string | null>(null);
  // Replaces the old tool_call/reasoning_step trace as the "what's it doing right now" signal —
  // v3 explicitly says not to render those events for agent runs; `progress` is the sanctioned
  // status-only replacement (no tool names/args/SQL/credentials/reasoning in its message).
  const [progress, setProgress] = useState<AgentProgressEvent | null>(null);
  // Captured for a future Stop/steer/reconnect UI — not consumed by anything yet, same
  // "capture now, wire later" reasoning `runId` itself was already following before this.
  const [activeRunId, setActiveRunId] = useState<string | null>(null);
  const [inputRequest, setInputRequest] = useState<Record<string, unknown> | null>(null);

  const conversationIdRef = useRef<string | null>(initialConversationId ?? null);
  const abortRef = useRef<AbortController | null>(null);
  const responseAccRef = useRef("");
  const finalResponseRef = useRef<{
    structuredResponse: AgentResponseV2 | null;
    responseContractVersion: string | null;
    agentKey: string | null;
    agentLabel: string | null;
    runId: string | null;
  } | null>(null);
  const bufferRef = useRef("");
  const pendingCharsRef = useRef("");
  const typewriterTimerRef = useRef<number | null>(null);
  const typewriterRafRef = useRef<number | null>(null);
  const completePendingRef = useRef(false);
  // True once the HTTP connection itself has actually ended (server closed it, or it errored/was
  // aborted) — per the v3 handoff, a handoff keeps the *same* connection open for the specialist's
  // own run_started/progress/response_chunk/final_response after Maestro's own turn finishes, so
  // "a turn completed" (completePendingRef) and "the whole exchange is over" are no longer the same
  // moment. Only this ref gates flipping isStreaming back to idle.
  const streamDoneRef = useRef(false);
  // Every runId this tab has directly seen on its own SSE connection (send or reconnect) — both
  // the originating run and, across a handoff, its specialist's own targetRunId. The `/hubs/
  // presence` mirror broadcasts to every viewer including the sender, so a run in this set gets
  // skipped there: this tab already has a live, authoritative first-party delivery for it, and
  // reprocessing the mirrored copy would double-append messages/re-run the completion pipeline.
  const ownRunIdsRef = useRef<Set<string>>(new Set());
  // Per-runId last applied `ConversationRunEvent.sequence` — ignore a SignalR event that isn't
  // strictly greater than what's already been applied for that run (the hub doesn't guarantee
  // delivery order across a reconnect/replay).
  const lastSequenceRef = useRef<Map<string, number>>(new Map());
  const hubConnectionRef = useRef<signalR.HubConnection | null>(null);

  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  // Switching to a different conversation (e.g. picking another thread from the sidebar list)
  // reuses this component instance rather than remounting it — drop all in-flight/streamed state
  // so the new thread doesn't inherit the previous one's messages. Guarded so the id transition
  // from "just created via bootstrap" to "confirmed by the route" doesn't wipe what we just streamed.
  useEffect(() => {
    const nextConversationId = initialConversationId ?? null;
    if (conversationIdRef.current === nextConversationId) return;

    abortRef.current?.abort();
    abortRef.current = null;
    completePendingRef.current = false;
    streamDoneRef.current = false;
    responseAccRef.current = "";
    finalResponseRef.current = null;
    bufferRef.current = "";
    pendingCharsRef.current = "";
    ownRunIdsRef.current = new Set();
    lastSequenceRef.current = new Map();
    if (typewriterTimerRef.current) window.clearTimeout(typewriterTimerRef.current);
    if (typewriterRafRef.current !== null) window.cancelAnimationFrame(typewriterRafRef.current);
    typewriterTimerRef.current = null;
    typewriterRafRef.current = null;

    conversationIdRef.current = nextConversationId;
    setConversationId(nextConversationId);
    setMessages([]);
    setProposals([]);
    setStreamingText("");
    setAnimatedStreamingText("");
    setIsStreaming(false);
    setCurrentPhase(null);
    setCurrentPhaseMessage(null);
    setProgress(null);
    setActiveRunId(null);
    setInputRequest(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialConversationId]);

  const clearTypewriter = useCallback(() => {
    if (typewriterTimerRef.current) {
      window.clearTimeout(typewriterTimerRef.current);
      typewriterTimerRef.current = null;
    }
    if (typewriterRafRef.current !== null) {
      window.cancelAnimationFrame(typewriterRafRef.current);
      typewriterRafRef.current = null;
    }
    pendingCharsRef.current = "";
    setAnimatedStreamingText("");
  }, []);

  const kickTypewriter = useCallback(() => {
    if (typewriterRafRef.current !== null) return;

    const step = () => {
      let advanced = false;

      if (pendingCharsRef.current.length) {
        const next = pendingCharsRef.current.slice(0, TYPEWRITER_CHUNK_SIZE);
        pendingCharsRef.current = pendingCharsRef.current.slice(TYPEWRITER_CHUNK_SIZE);
        setAnimatedStreamingText((prev) => prev + next);
        advanced = true;
      }

      if (!pendingCharsRef.current.length && completePendingRef.current) {
        completePendingRef.current = false;

        // `final_response` carries the validated structured payload — prefer its markdown (and
        // attach the structured fields for findings/caveats/actions) over the plain accumulated
        // response_chunk text once it's arrived. Falls back to the accumulated text if the run
        // finished without one (e.g. an older/legacy-path response).
        const final = finalResponseRef.current;
        const finalText = final?.structuredResponse?.markdown || responseAccRef.current;
        if (finalText) {
          const finishedRunId = final?.runId ?? null;
          setMessages((prev) => {
            // A run's `final_response` can arrive twice for the initiating client — once on its
            // own SSE connection, once mirrored over SignalR (the presence hub broadcasts to
            // every group member, sender included). Skip the append if this runId's answer is
            // already on the timeline rather than rendering it a second time.
            if (finishedRunId && prev.some((m) => m.role === "assistant" && m.runId === finishedRunId)) {
              return prev;
            }
            return [
              ...prev.map((m) => {
                // Fallback for a handoff card that's still showing "running" once its specialist's
                // own final_response has actually landed — `run_ended` is documented to advance it
                // to a terminal status, but isn't reliably observed on the wire yet, so this treats
                // arrival of the matching answer as its own completion signal rather than leaving
                // the card stuck on "running" until the next history refetch.
                if (
                  m.role !== "handoff" ||
                  !m.handoff ||
                  m.handoff.runId !== finishedRunId ||
                  m.handoff.status === "done" ||
                  m.handoff.status === "failed" ||
                  m.handoff.status === "cancelled"
                ) {
                  return m;
                }
                return { ...m, handoff: { ...m.handoff, status: "done" as const } };
              }),
              {
                role: "assistant",
                content: finalText,
                timestamp: new Date().toISOString(),
                structuredResponse: final?.structuredResponse ?? null,
                responseContractVersion: final?.responseContractVersion ?? null,
                agentKey: final?.agentKey ?? null,
                agentLabel: final?.agentLabel ?? null,
                runId: final?.runId ?? null,
              },
            ];
          });
          setStreamingText("");
        }
        finalResponseRef.current = null;
        // Reset per-turn accumulation so a following turn on this same connection (the
        // specialist's own answer, right after a handoff) starts its own text fresh rather than
        // inheriting whatever this turn accumulated.
        responseAccRef.current = "";
      }

      if (!pendingCharsRef.current.length && !completePendingRef.current) {
        // Only flip the whole exchange back to idle once the connection itself has actually
        // ended — a handoff means more turns (more final_responses) can still follow on this
        // same stream, and the "Working" status should stay up through all of them. Checked here
        // (rather than only right after a completion) so a `kickTypewriter()` call that finds
        // nothing left to animate — e.g. the one `consumeStream` makes once the connection closes,
        // after a turn already finished draining on its own — still flips it off.
        if (streamDoneRef.current) {
          setIsStreaming(false);
          setCurrentPhase(null);
          setProgress(null);
        }
        typewriterRafRef.current = null;
        return;
      }

      if (!advanced && typewriterTimerRef.current === null) {
        typewriterTimerRef.current = window.setTimeout(() => {
          typewriterTimerRef.current = null;
          typewriterRafRef.current = window.requestAnimationFrame(step);
        }, TYPEWRITER_INTERVAL_MS);
        return;
      }

      typewriterRafRef.current = window.requestAnimationFrame(step);
    };

    typewriterRafRef.current = window.requestAnimationFrame(step);
  }, []);

  // Dispatches one parsed SSE event to the right piece of state. Shared between a fresh send
  // (`sendMessage`) and reopening an existing run's stream (`reconnectRun`) — extracted 2026-09-25
  // when reconnect needed the exact same event handling a second time. Returns true when the event
  // is terminal for this connection (the caller's read loop should stop), false otherwise.
  const dispatchStreamEvent = useCallback(
    (parsed: AgentStreamEvent, resolvedEventType: string): boolean => {
      switch (resolvedEventType) {
        case "status": {
          setCurrentPhase(parsed.state);

          if (parsed.message?.startsWith("conversation_id:")) {
            if (!conversationIdRef.current) {
              const id = parsed.message.replace("conversation_id:", "");
              setConversationId(id);
              conversationIdRef.current = id;
              optionsRef.current?.onConversationCreated?.(id);
            }
          } else {
            // The internal "conversation_id:..." message is never user-facing copy — every
            // other status message is the backend's own friendly text for this phase (e.g.
            // "Analyzing your request...", "Processing...").
            setCurrentPhaseMessage(parsed.message ?? null);
          }
          return false;
        }

        case "run_queued": {
          if (parsed.runId) setActiveRunId(parsed.runId);
          return false;
        }

        // Fires on the originating run's own stream the moment a specialist run is durably
        // queued — pushed as a normal `role: "handoff"` timeline entry (same as history would
        // eventually return) so the card appears live instead of waiting for a refetch. Normalize
        // the live payload's `targetRunId` into our internal `handoff.runId` here — history uses
        // `runId` for the same specialist run, and keying both the same way is what lets
        // `dedupeMessages` (detail-route) treat a later history refetch as an upsert of this same
        // card instead of a duplicate, by matching on that id.
        case "agent_handoff": {
          const h = parsed.handoff;
          if (h) {
            setMessages((prev) => {
              // Unsequenced — per the v3 handoff this announcement is deduplicated by
              // `handoff.targetRunId` alone, since the initiating client can receive it from both
              // its own SSE connection and the SignalR mirror. Skip rather than append if a card
              // for this specialist run already exists.
              if (prev.some((m) => m.role === "handoff" && m.handoff?.runId === h.targetRunId)) {
                return prev;
              }
              return [
                ...prev,
                {
                  role: "handoff",
                  content: "",
                  timestamp: new Date().toISOString(),
                  handoff: {
                    runId: h.targetRunId,
                    sourceRunId: h.sourceRunId,
                    fromAgentKey: h.fromAgentKey,
                    fromAgentLabel: h.fromAgentLabel,
                    toAgentKey: h.toAgentKey,
                    toAgentLabel: h.toAgentLabel,
                    reason: h.reason,
                    brief: h.brief,
                    status: h.status,
                  },
                },
              ];
            });
          }
          return false;
        }

        // Deliberately no `tool_call`/`reasoning_step` cases — v3 says not to render those
        // for agent runs; `progress` below is the sanctioned replacement. If the backend
        // still sends them (compatibility with other surfaces), the switch just ignores them.

        case "progress": {
          // Confirmed live 2026-09-25: the very first `progress` event of a send carries the
          // same internal "conversation_id:<id>" sentinel the `status` case already filters
          // out of user-facing copy — but this arrives as `progress.message`, a different
          // field, so that filter never caught it. Without this guard it flashed the raw
          // guid in the WorkingStatus subline for one render before the next progress event
          // (the real "Preparing the analysis." text) overwrote it a moment later.
          if (parsed.progress && !parsed.progress.message?.startsWith("conversation_id:")) {
            setProgress(parsed.progress);
          }
          return false;
        }

        case "response_chunk": {
          const text = parsed.message ?? "";
          responseAccRef.current += text;
          setStreamingText(responseAccRef.current);
          pendingCharsRef.current += text;
          kickTypewriter();
          setCurrentPhase("streaming");
          return false;
        }

        case "final_response": {
          finalResponseRef.current = {
            structuredResponse: parsed.structuredResponse ?? null,
            responseContractVersion: parsed.responseContractVersion ?? null,
            agentKey: parsed.agentKey ?? null,
            agentLabel: parsed.agentLabel ?? null,
            runId: parsed.runId ?? null,
          };
          completePendingRef.current = true;
          kickTypewriter();
          return false;
        }

        // Marks a runId as actually running — fires for the originating run and, once a handoff
        // keeps the connection open, for the specialist's own run too. Used to advance the
        // handoff card past "Queued" the moment the specialist's turn actually starts, without
        // waiting on a history refetch.
        case "run_started": {
          if (parsed.runId) {
            const targetRunId = parsed.runId;
            setMessages((prev) =>
              prev.map((m) => {
                if (m.role !== "handoff" || !m.handoff || m.handoff.runId !== targetRunId) return m;
                return { ...m, handoff: { ...m.handoff, status: "running" as const } };
              })
            );
          }
          return false;
        }

        // Marks a runId's terminal state — same idea as `run_started`, for the handoff card's
        // final status. `parsed.state` is expected to already be one of the handoff status
        // values; anything else (or missing) falls back to "done" rather than leaving the card
        // stuck on a stale status.
        case "run_ended": {
          if (parsed.runId) {
            const targetRunId = parsed.runId;
            const status: HandoffStatus = HANDOFF_STATUSES.includes(parsed.state as HandoffStatus)
              ? (parsed.state as HandoffStatus)
              : "done";
            setMessages((prev) =>
              prev.map((m) => {
                if (m.role !== "handoff" || !m.handoff || m.handoff.runId !== targetRunId) return m;
                return { ...m, handoff: { ...m.handoff, status } };
              })
            );
          }
          return false;
        }

        case "input_request": {
          setInputRequest(parsed.inputRequest ?? null);
          return false;
        }

        case "proposal": {
          if (parsed.proposal) setProposals((prev) => [...prev, parsed.proposal!]);
          return false;
        }

        case "run_state": {
          // Reconcile-after-reconnect status text — folds into the same phase-message slot a
          // live `status` event would use.
          if (parsed.message) setCurrentPhaseMessage(parsed.message);
          return false;
        }

        case "run_cancelled": {
          setIsStreaming(false);
          clearTypewriter();
          return true;
        }

        case "error": {
          setMessages((prev) => [
            ...prev,
            {
              role: "error",
              content: parsed.errorMessage ?? "Something went wrong",
              timestamp: new Date().toISOString(),
            },
          ]);
          setIsStreaming(false);
          return true;
        }

        default:
          return false;
      }
    },
    [clearTypewriter, kickTypewriter]
  );

  // Reads one SSE response body to completion (or until a terminal event), dispatching each
  // parsed event. Shared by `sendMessage` (POST) and `reconnectRun` (GET) — both just build a
  // different request and hand the resulting Response here.
  const consumeStream = useCallback(
    async (response: Response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      console.log("🔥 SSE status:", JSON.stringify({ status: response.status }, null, 2));
      console.log("🔥 SSE headers:", JSON.stringify([...response.headers.entries()], null, 2));
      if (!response.body) throw new Error("Streaming not supported");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let chunkIndex = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        chunkIndex += 1;
        console.log(
          "🔥 SSE chunk",
          JSON.stringify({ idx: chunkIndex, bytes: value?.length ?? 0, at: new Date().toISOString() }, null, 2)
        );

        bufferRef.current += decoder.decode(value, { stream: true });

        const rawEvents = bufferRef.current.split("\n\n");
        bufferRef.current = rawEvents.pop() || ""; // keep incomplete chunk

        for (const raw of rawEvents) {
          if (!raw.trim()) continue;

          const lines = raw.split("\n");
          const eventLine = lines.find((l) => l.startsWith("event:"));
          const dataLine = lines.find((l) => l.startsWith("data:"));
          if (!dataLine) continue;

          const eventType = eventLine?.replace("event:", "").trim();
          const parsed: AgentStreamEvent = JSON.parse(dataLine.replace("data:", "").trim());
          const resolvedEventType = eventType ?? parsed.eventType ?? "message";

          // Claim every runId this connection directly carries — the originating run and, once a
          // handoff fires, its specialist's own targetRunId too — so the SignalR mirror (which
          // broadcasts to the sender as well as other viewers) knows to skip these and defer to
          // this connection's own live delivery instead of reprocessing a duplicate.
          if (parsed.runId) ownRunIdsRef.current.add(parsed.runId);
          if (parsed.handoff?.targetRunId) ownRunIdsRef.current.add(parsed.handoff.targetRunId);

          console.log(
            "🔥 SSE event:",
            JSON.stringify(
              {
                at: new Date().toISOString(),
                eventType: resolvedEventType,
                contentLength: (parsed.message ?? "").length,
                event: parsed,
                raw,
              },
              null,
              2
            )
          );

          const isTerminal = dispatchStreamEvent(parsed, resolvedEventType);

          // `final_response` itself now sets completePendingRef/kicks the typewriter (it carries
          // the fields that go with completion), so this just needs the query invalidation.
          if (parsed.state === "complete") {
            queryClient.invalidateQueries({ queryKey: ["ai-conversations"] });
          }

          if (isTerminal) {
            streamDoneRef.current = true;
            kickTypewriter();
            return;
          }
        }
      }

      // The reader loop exited because the server actually closed the connection — the whole
      // exchange (including any handoff turns multiplexed onto it) is over.
      streamDoneRef.current = true;
      kickTypewriter();
    },
    [dispatchStreamEvent, kickTypewriter, queryClient]
  );

  const sendMessage = useCallback(
    async (message: string) => {
      setIsStreaming(true);
      // Set immediately, not just once the server's own `status` event arrives — the request can
      // sit pending for a while before the first byte comes back, and that gap needs a visible
      // "Thinking…" state too, not a blank one.
      setCurrentPhase("submitted");
      setCurrentPhaseMessage(null);
      setProgress(null);
      setInputRequest(null);
      setStreamingText("");
      clearTypewriter();
      responseAccRef.current = "";
      finalResponseRef.current = null;
      streamDoneRef.current = false;
      // Clear the previous run's id up front rather than leaving it until the new run's own
      // `run_queued` event overwrites it. Without this, `activeRunId` stays pointed at the just-
      // finished run for the gap between this request going out and that event coming back —
      // during which the composer's steer path (`canSteer` in detail-route) would read it as "a
      // run exists to steer" and POST a steer against a run the backend already considers done,
      // getting rejected with "Run already finished." instead of ever reaching the new run.
      // Confirmed live 2026-09-27: a message sent ~50ms after the prior run's completion carried
      // the stale id and was rejected exactly this way.
      setActiveRunId(null);

      // Optimistic user message
      setMessages((prev) => [
        ...prev,
        { role: "user", content: message, timestamp: new Date().toISOString() },
      ]);

      const token = getCookie(COOKIE_KEYS.AUTH_TOKEN);
      abortRef.current = new AbortController();

      try {
        const res = await fetch(API_ENDPOINTS.AI_CONVERSATIONS.SEND_MESSAGE, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "text/event-stream",
            "X-Flolyt-Agent-Contract": "v3",
          },
          body: JSON.stringify({ conversationId: conversationIdRef.current, message }),
          signal: abortRef.current.signal,
          credentials: "include",
        });

        await consumeStream(res);
      } catch (err: unknown) {
        streamDoneRef.current = true;
        if (err instanceof DOMException && err.name === "AbortError") return;
        console.error("❌ Send message failed:", err);
        const errorMessage = err instanceof Error ? err.message : "Something went wrong";
        setMessages((prev) => [
          ...prev,
          { role: "error", content: errorMessage, timestamp: new Date().toISOString() },
        ]);
      } finally {
        // Safety net: a connection that ended (streamDoneRef set in the try/catch paths above)
        // with nothing left to animate or finalize should never leave isStreaming stuck true —
        // the normal path already handles this via kickTypewriter's own drained/streamDone check.
        if (!pendingCharsRef.current.length && !completePendingRef.current) {
          setIsStreaming(false);
          clearTypewriter();
        }
        // Unconditional, not just on a `state: "complete"` event — the sidebar's conversation
        // list (title/lastMessagePreview/messageCount) needs refreshing whenever a send finishes,
        // however the stream actually signals that it's done.
        queryClient.invalidateQueries({ queryKey: ["ai-conversations"] });
      }
    },
    [clearTypewriter, consumeStream, queryClient]
  );

  // Steers the active run through the same composer instead of the standalone `/runs/{id}/steer`
  // route. Per the v3 handoff, posting `{ conversationId, activeRunId, message }` to the normal
  // messages endpoint validates the run belongs to this conversation, appends the instruction to
  // it, and returns a synchronous result — it does not open a new stream or touch the run's own
  // ongoing SSE connection, so this is a plain JSON request, not `consumeStream`.
  const steerMessage = useCallback(
    async (message: string) => {
      const conversationId = conversationIdRef.current;
      const runId = activeRunId;
      if (!conversationId || !runId) return;

      // Rendered as a normal "steering"-role entry, styled identically to a user bubble — no
      // separate widget, no delivery indicator (see detail-route).
      setMessages((prev) => [
        ...prev,
        { role: "steering", content: message, timestamp: new Date().toISOString() },
      ]);

      const token = getCookie(COOKIE_KEYS.AUTH_TOKEN);

      try {
        const res = await fetch(API_ENDPOINTS.AI_CONVERSATIONS.SEND_MESSAGE, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "X-Flolyt-Agent-Contract": "v3",
          },
          body: JSON.stringify({ conversationId, activeRunId: runId, message }),
          credentials: "include",
        });

        const data = await res.json().catch(() => null);
        if (!res.ok || data?.succeeded === false) {
          throw new Error(data?.messages?.[0] || `HTTP ${res.status}`);
        }
      } catch (err: unknown) {
        console.error("❌ Steer failed:", err);
        const errorMessage = err instanceof Error ? err.message : "Failed to send the steering note";
        setMessages((prev) => [
          ...prev,
          { role: "error", content: errorMessage, timestamp: new Date().toISOString() },
        ]);
      }
    },
    [activeRunId]
  );

  // Reopens an existing run's own stream — the reconnect half of the v3 handoff's recipe: load
  // the conversation, check `activeRunId`, and if it's still queued/running/awaiting_approval,
  // resume here instead of leaving the page with nothing (e.g. after a refresh mid-run). Doesn't
  // push an optimistic user message — there's no new message being sent, just an existing run
  // being watched again.
  const reconnectRun = useCallback(
    async (runId: string) => {
      setIsStreaming(true);
      setCurrentPhase("submitted");
      setCurrentPhaseMessage(null);
      setProgress(null);
      setInputRequest(null);
      setStreamingText("");
      // Known up front, unlike a fresh send — reconnect is only ever called with a runId already
      // read from GET /conversations/{id}, not learned from a `run_queued` event on this
      // connection (the stream for an existing run doesn't re-emit one). Set directly so
      // Stop/steer are available immediately instead of waiting for an event that never comes.
      setActiveRunId(runId);
      clearTypewriter();
      responseAccRef.current = "";
      finalResponseRef.current = null;
      streamDoneRef.current = false;

      const token = getCookie(COOKIE_KEYS.AUTH_TOKEN);
      abortRef.current = new AbortController();

      try {
        const res = await fetch(API_ENDPOINTS.AGENT_RUNS.STREAM.replace("{id}", runId), {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "text/event-stream",
            "X-Flolyt-Agent-Contract": "v3",
          },
          signal: abortRef.current.signal,
          credentials: "include",
        });

        await consumeStream(res);
      } catch (err: unknown) {
        streamDoneRef.current = true;
        if (err instanceof DOMException && err.name === "AbortError") return;
        console.error("❌ Reconnect failed:", err);
        const errorMessage = err instanceof Error ? err.message : "Something went wrong";
        setMessages((prev) => [
          ...prev,
          { role: "error", content: errorMessage, timestamp: new Date().toISOString() },
        ]);
      } finally {
        if (!pendingCharsRef.current.length && !completePendingRef.current) {
          setIsStreaming(false);
          clearTypewriter();
        }
        queryClient.invalidateQueries({ queryKey: ["ai-conversations"] });
      }
    },
    [clearTypewriter, consumeStream, queryClient]
  );

  const abortStream = useCallback(() => {
    streamDoneRef.current = true;
    abortRef.current?.abort();
    setIsStreaming(false);
    clearTypewriter();
  }, [clearTypewriter]);

  useEffect(() => abortStream, [abortStream]);

  // `/hubs/presence` — mirrors this conversation's run events to everyone else who has it open
  // (a shared room thread), not just the tab that sent the message. Runs alongside the SSE
  // connection above, not instead of it: a brand-new/not-yet-sent conversation has no id to join
  // yet, so this only activates once `conversationId` is real. Best-effort — the persisted
  // timeline remains authoritative per the v3 handoff ("polling is recovery, not the normal
  // handoff experience"), so a failed/dropped hub connection is logged, not surfaced as a chat
  // error; the conversation still works entirely off its own SSE connection and history refetch.
  useEffect(() => {
    if (!conversationId) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(PRESENCE_HUB_URL, {
        accessTokenFactory: () => getCookie(COOKIE_KEYS.AUTH_TOKEN) ?? "",
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    hubConnectionRef.current = connection;

    const applyRunEvent = (event: ConversationRunEvent) => {
      console.log(
        "🛰️ run_activity:",
        JSON.stringify({ kind: event.kind, runId: event.runId, mine: ownRunIdsRef.current.has(event.runId ?? "") })
      );
      if (!event?.runId || event.conversationId !== conversationId) return;

      // This tab's own SSE connection already delivers this run live and first-party (see
      // `ownRunIdsRef`) — the mirror is for everyone else watching, not a second copy for the
      // sender. Skipping here, rather than merging two live sources for one run, is what keeps
      // the existing single-active-turn accumulator (`responseAccRef` etc.) valid unchanged.
      if (ownRunIdsRef.current.has(event.runId)) return;

      switch (event.kind) {
        // No nested payload — mirrors `dispatchStreamEvent`'s own `run_started` case (advance the
        // matching handoff card to running) directly against the envelope's own runId, since
        // there's no streamEvent here to route through the shared reducer for this kind.
        case "run_started": {
          setMessages((prev) =>
            prev.map((m) => {
              if (m.role !== "handoff" || !m.handoff || m.handoff.runId !== event.runId) return m;
              return { ...m, handoff: { ...m.handoff, status: "running" as const } };
            })
          );
          return;
        }

        case "run_event": {
          if (!event.streamEvent) return;

          // The hub doesn't guarantee delivery order across a reconnect/replay — drop anything
          // that isn't strictly newer than the last sequence already applied for this runId.
          if (typeof event.sequence === "number") {
            const last = lastSequenceRef.current.get(event.runId) ?? -Infinity;
            if (event.sequence <= last) return;
            lastSequenceRef.current.set(event.runId, event.sequence);
          }

          // Agent attribution comes from the outer envelope, not the inner streamEvent — a
          // single-recipient SSE connection carries it on every event already, but a group
          // broadcast needs it lifted up a level.
          const merged: AgentStreamEvent = {
            ...event.streamEvent,
            agentKey: event.agentKey ?? event.streamEvent.agentKey ?? null,
            agentLabel: event.agentLabel ?? event.streamEvent.agentLabel ?? null,
          };
          dispatchStreamEvent(merged, merged.eventType || "message");
          return;
        }

        // Older compatibility/recovery signal: the whole committed response in one shot, flattened
        // directly onto `text` (not nested under `streamEvent`, which is null for this kind).
        // Confirmed live 2026-09-29: the hub sends this right after `run_event`'s own
        // final_response, but that one's push is deliberately deferred behind the typewriter
        // reveal animation — so without the `finalResponseRef` check below, this fallback's plain
        // text (no findings/actions/etc.) would win the race and permanently pre-empt the richer
        // structured push that's already in flight, since the later one then finds a message for
        // this runId already there and skips itself. Deferring to a final_response that's already
        // pending keeps `run_event` authoritative, per the doc, regardless of arrival order.
        case "run_message": {
          if (!event.text) return;
          if (finalResponseRef.current?.runId === event.runId) return;
          setMessages((prev) => {
            if (prev.some((m) => m.role === "assistant" && m.runId === event.runId)) return prev;
            return [
              ...prev,
              {
                role: "assistant",
                content: event.text as string,
                timestamp: event.atUtc,
                structuredResponse: null,
                responseContractVersion: null,
                agentKey: event.agentKey ?? null,
                agentLabel: event.agentLabel ?? null,
                runId: event.runId,
              },
            ];
          });
          return;
        }

        // No nested payload — mirrors `dispatchStreamEvent`'s own `run_ended` case, reading the
        // terminal state straight off the envelope instead of a streamEvent. Confirmed live this
        // actually fires over SignalR even though the equivalent never arrives over this tab's own
        // SSE connection (see the `final_response`-arrival fallback above, built for that gap).
        case "run_ended": {
          const normalized = (event.state ?? "").toLowerCase();
          const status: HandoffStatus = HANDOFF_STATUSES.includes(normalized as HandoffStatus)
            ? (normalized as HandoffStatus)
            : "done";
          setMessages((prev) =>
            prev.map((m) => {
              if (m.role !== "handoff" || !m.handoff || m.handoff.runId !== event.runId) return m;
              return { ...m, handoff: { ...m.handoff, status } };
            })
          );
          return;
        }

        default:
          return;
      }
    };

    connection.on("run_activity", applyRunEvent);

    connection.onreconnected(() => {
      connection.invoke("Join", "conversation", conversationId).catch((err) => {
        console.error("❌ SignalR rejoin failed:", err);
      });
      // Ephemeral feed — a drop can silently lose events in the gap, so a reconnect refetches the
      // persisted conversation instead of assuming the socket picked back up exactly where it
      // left off.
      queryClient.invalidateQueries({ queryKey: AI_CONVERSATION_QUERY_KEY(conversationId) });
    });

    connection
      .start()
      .then(() => connection.invoke("Join", "conversation", conversationId))
      .catch((err) => {
        console.error("❌ SignalR connect/join failed:", err);
      });

    return () => {
      hubConnectionRef.current = null;
      connection.stop();
    };
  }, [conversationId, dispatchStreamEvent, queryClient]);

  return {
    conversationId,
    messages,
    proposals,
    streamingText,
    animatedStreamingText,
    isStreaming,
    currentPhase, // "submitted" | "readingSource" | "streaming" | null
    currentPhaseMessage,
    progress,
    activeRunId,
    inputRequest,
    sendMessage,
    steerMessage,
    reconnectRun,
    abortStream,
  };
};
