import { useCallback, useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { API_ENDPOINTS } from "@/config/apiConfig";
import { COOKIE_KEYS, getCookie } from "@/utils/cookies";
import type {
  AgentProgressEvent,
  AgentStreamEvent,
  AiConversationMessage,
  StreamProposal,
} from "./ai-conversation-types";
import type { AgentResponseV2 } from "./agent-response-types";

interface UseAiConversationMessagesOptions {
  onConversationCreated?: (id: string) => void;
}

const TYPEWRITER_INTERVAL_MS = 8;
const TYPEWRITER_CHUNK_SIZE = 4;

// Fallback key for the rare/legacy event that arrives with no `runId` at all — keeps it isolated
// from any real run's own accumulator instead of crashing or silently merging into one.
const NO_RUN_ID_KEY = "__no_run_id__";

type HandoffStatus = NonNullable<AiConversationMessage["handoff"]>["status"];
const HANDOFF_STATUSES: HandoffStatus[] = [
  "queued",
  "running",
  "awaiting_approval",
  "done",
  "failed",
  "cancelled",
];

// Per-run streaming state. A handoff to multiple specialists multiplexes all of their events onto
// one SSE connection, interleaved — per the v3 handoff, they "must be reduced independently by
// runId; never assume all events for one specialist arrive before another specialist starts." A
// single shared accumulator (the pre-2026-09-30 design) would garble two runs' text together if
// their response_chunks interleaved, and could silently drop one run's final_response if both
// completed close together. Keying every run's own text/typewriter/completion state here is what
// keeps concurrent specialists from corrupting or losing each other's answers.
interface RunAccumulator {
  responseAcc: string;
  pendingChars: string;
  completePending: boolean;
  finalResponse: {
    structuredResponse: AgentResponseV2 | null;
    responseContractVersion: string | null;
    agentKey: string | null;
    agentLabel: string | null;
  } | null;
  typewriterTimer: number | null;
  typewriterRaf: number | null;
}

function createRunAccumulator(): RunAccumulator {
  return {
    responseAcc: "",
    pendingChars: "",
    completePending: false,
    finalResponse: null,
    typewriterTimer: null,
    typewriterRaf: null,
  };
}

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
  const bufferRef = useRef("");
  // One accumulator per runId currently in flight on this connection — see RunAccumulator's own
  // comment for why this can't be a single shared set of refs anymore.
  const runAccumulatorsRef = useRef<Map<string, RunAccumulator>>(new Map());
  // Whichever run most recently produced a response_chunk — the single `streamingText`/
  // `animatedStreamingText` preview slot mirrors this one. If a second specialist is also
  // streaming concurrently, its text keeps accumulating correctly in its own accumulator in the
  // background (never lost or garbled); it just doesn't get its own separate live preview area —
  // a deliberate scope line, not a bug, since only one specialist's text can realistically occupy
  // the single legacy preview slot the UI has today.
  const displayedRunIdRef = useRef<string | null>(null);
  // True once the HTTP connection itself has actually ended (server closed it, or it errored/was
  // aborted) — per the v3 handoff, a handoff keeps the *same* connection open for every linked
  // specialist's own run_started/progress/response_chunk/final_response after Maestro's own turn
  // finishes, closing only once every linked run is terminal. "A turn completed" (per-run
  // completePending) and "the whole exchange is over" are therefore not the same moment. Only this
  // ref gates flipping isStreaming back to idle.
  const streamDoneRef = useRef(false);

  const getAccumulator = useCallback((runId: string | null | undefined) => {
    const key = runId ?? NO_RUN_ID_KEY;
    const map = runAccumulatorsRef.current;
    let acc = map.get(key);
    if (!acc) {
      acc = createRunAccumulator();
      map.set(key, acc);
    }
    return acc;
  }, []);

  const clearAllAccumulators = useCallback(() => {
    runAccumulatorsRef.current.forEach((acc) => {
      if (acc.typewriterTimer) window.clearTimeout(acc.typewriterTimer);
      if (acc.typewriterRaf !== null) window.cancelAnimationFrame(acc.typewriterRaf);
    });
    runAccumulatorsRef.current = new Map();
    displayedRunIdRef.current = null;
  }, []);

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
    streamDoneRef.current = false;
    bufferRef.current = "";
    clearAllAccumulators();

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

  // Clears just one run's typewriter loop/buffer — used when a whole connection resets (abort,
  // fresh send) rather than a single run finishing normally (which drains on its own).
  const clearTypewriter = useCallback(() => {
    clearAllAccumulators();
    setAnimatedStreamingText("");
  }, [clearAllAccumulators]);

  const kickTypewriter = useCallback(
    (runId: string | null | undefined) => {
      const key = runId ?? NO_RUN_ID_KEY;
      const acc = getAccumulator(runId);
      if (acc.typewriterRaf !== null) return;

      const step = () => {
        let advanced = false;

        if (acc.pendingChars.length) {
          const next = acc.pendingChars.slice(0, TYPEWRITER_CHUNK_SIZE);
          acc.pendingChars = acc.pendingChars.slice(TYPEWRITER_CHUNK_SIZE);
          if (displayedRunIdRef.current === key) {
            setAnimatedStreamingText((prev) => prev + next);
          }
          advanced = true;
        }

        if (!acc.pendingChars.length && acc.completePending) {
          acc.completePending = false;

          // `final_response` carries the validated structured payload — prefer its markdown (and
          // attach the structured fields for findings/caveats/actions) over the plain accumulated
          // response_chunk text once it's arrived. Falls back to the accumulated text if the run
          // finished without one (e.g. an older/legacy-path response).
          const final = acc.finalResponse;
          const finalText = final?.structuredResponse?.markdown || acc.responseAcc;
          if (finalText) {
            const finishedRunId = runId ?? null;
            setMessages((prev) => {
              // A run's `final_response` shouldn't normally arrive twice, but this stays
              // idempotent by runId regardless (e.g. a reconnect replaying the tail of a run).
              if (finishedRunId && prev.some((m) => m.role === "assistant" && m.runId === finishedRunId)) {
                return prev;
              }
              return [
                ...prev.map((m) => {
                  // Fallback for a handoff card that's still showing "running" once its
                  // specialist's own final_response has actually landed — `run_ended` is
                  // documented to advance it to a terminal status, but isn't reliably observed on
                  // the wire yet, so this treats arrival of the matching answer as its own
                  // completion signal rather than leaving the card stuck on "running" until the
                  // next history refetch.
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
                  runId: finishedRunId,
                },
              ];
            });
            // Clear the live preview once this run's own text has been finalized into a real
            // message — otherwise it sits on screen unchanged (isStreaming stays true whenever
            // another linked run is still going, e.g. a second specialist), showing this run's
            // already-posted answer a second time until some other run's chunks eventually
            // overwrite it. Confirmed live 2026-09-30 with two simultaneous specialists: Maestro's
            // own acknowledgement rendered twice — once as the pushed message, once as this
            // leftover preview — because only `streamingText`, not `animatedStreamingText`, was
            // being reset here.
            if (displayedRunIdRef.current === key) {
              setStreamingText("");
              setAnimatedStreamingText("");
              displayedRunIdRef.current = null;
            }
          }
          acc.finalResponse = null;
          // Reset this run's own accumulation — irrelevant once pushed, and guards against a
          // stray late duplicate event for the same runId re-appending its text.
          acc.responseAcc = "";
        }

        if (!acc.pendingChars.length && !acc.completePending) {
          // Only flip the whole exchange back to idle once the connection itself has actually
          // ended — a handoff (single or multi-specialist) means more turns can still follow on
          // this same stream, and the "Working" status should stay up through all of them.
          // Checked here (rather than only right after a completion) so a `kickTypewriter()` call
          // that finds nothing left to animate — e.g. the one `consumeStream` makes once the
          // connection closes, after every run already finished draining on its own — still flips
          // it off.
          if (streamDoneRef.current) {
            const stillPending = Array.from(runAccumulatorsRef.current.values()).some(
              (a) => a.pendingChars.length || a.completePending
            );
            if (!stillPending) {
              setIsStreaming(false);
              setCurrentPhase(null);
              setProgress(null);
            }
          }
          acc.typewriterRaf = null;
          return;
        }

        if (!advanced && acc.typewriterTimer === null) {
          acc.typewriterTimer = window.setTimeout(() => {
            acc.typewriterTimer = null;
            acc.typewriterRaf = window.requestAnimationFrame(step);
          }, TYPEWRITER_INTERVAL_MS);
          return;
        }

        acc.typewriterRaf = window.requestAnimationFrame(step);
      };

      acc.typewriterRaf = window.requestAnimationFrame(step);
    },
    [getAccumulator]
  );

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
        // card instead of a duplicate, by matching on that id. Fires once per specialist, so a
        // multi-handoff turn produces one card per target — nothing extra needed here for that.
        case "agent_handoff": {
          const h = parsed.handoff;
          if (h) {
            setMessages((prev) => {
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
          const key = parsed.runId ?? NO_RUN_ID_KEY;
          const acc = getAccumulator(parsed.runId);
          const text = parsed.message ?? "";
          acc.responseAcc += text;
          acc.pendingChars += text;
          // This run becomes (or stays) the one shown in the single live-preview slot — see
          // `displayedRunIdRef`'s own comment for why concurrent specialists don't each get their
          // own preview area.
          displayedRunIdRef.current = key;
          setStreamingText(acc.responseAcc);
          kickTypewriter(parsed.runId);
          setCurrentPhase("streaming");
          return false;
        }

        case "final_response": {
          const acc = getAccumulator(parsed.runId);
          acc.finalResponse = {
            structuredResponse: parsed.structuredResponse ?? null,
            responseContractVersion: parsed.responseContractVersion ?? null,
            agentKey: parsed.agentKey ?? null,
            agentLabel: parsed.agentLabel ?? null,
          };
          acc.completePending = true;
          kickTypewriter(parsed.runId);
          return false;
        }

        // Marks a runId as actually running — fires for the originating run and, once a handoff
        // keeps the connection open, for each specialist's own run too (one `run_started` per
        // linked run on a multi-handoff turn). Used to advance the matching handoff card past
        // "Queued" the moment that specific specialist's turn actually starts, without waiting on
        // a history refetch.
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
        // stuck on a stale status. Scoped to `parsed.runId` alone, so two linked runs finishing
        // independently each only ever touch their own card.
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
    [clearTypewriter, getAccumulator, kickTypewriter]
  );

  // Flushes every run accumulator that still has work pending — used once the connection itself
  // closes. In the well-behaved case (server closes only after every linked run is terminal, per
  // the v3 handoff) this is a no-op; it's a safety net for a connection that ends mid-run anyway.
  const kickAllPendingTypewriters = useCallback(() => {
    runAccumulatorsRef.current.forEach((acc, key) => {
      if (acc.pendingChars.length || acc.completePending) {
        kickTypewriter(key === NO_RUN_ID_KEY ? null : key);
      }
    });
    // Nothing was mid-stream at all (e.g. a run that only ever sent status/progress) — still need
    // one call to let the idle-reset check in `kickTypewriter`'s step function run.
    if (runAccumulatorsRef.current.size === 0) {
      kickTypewriter(null);
    }
  }, [kickTypewriter]);

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

          // `final_response` itself now sets completePending/kicks the typewriter (it carries
          // the fields that go with completion), so this just needs the query invalidation.
          if (parsed.state === "complete") {
            queryClient.invalidateQueries({ queryKey: ["ai-conversations"] });
          }

          if (isTerminal) {
            streamDoneRef.current = true;
            kickAllPendingTypewriters();
            return;
          }
        }
      }

      // The reader loop exited because the server actually closed the connection — the whole
      // exchange (including every linked handoff run multiplexed onto it) is over.
      streamDoneRef.current = true;
      kickAllPendingTypewriters();
    },
    [dispatchStreamEvent, kickAllPendingTypewriters, queryClient]
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
        // with nothing left to animate or finalize on ANY run should never leave isStreaming stuck
        // true — the normal path already handles this via kickTypewriter's own drained/streamDone
        // check, per-run.
        const anyPending = Array.from(runAccumulatorsRef.current.values()).some(
          (acc) => acc.pendingChars.length || acc.completePending
        );
        if (!anyPending) {
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
        const anyPending = Array.from(runAccumulatorsRef.current.values()).some(
          (acc) => acc.pendingChars.length || acc.completePending
        );
        if (!anyPending) {
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
