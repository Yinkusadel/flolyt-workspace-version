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
  } | null>(null);
  const bufferRef = useRef("");
  const pendingCharsRef = useRef("");
  const typewriterTimerRef = useRef<number | null>(null);
  const typewriterRafRef = useRef<number | null>(null);
  const completePendingRef = useRef(false);

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
    responseAccRef.current = "";
    finalResponseRef.current = null;
    bufferRef.current = "";
    pendingCharsRef.current = "";
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
        setIsStreaming(false);
        setCurrentPhase(null);
        setProgress(null);

        // `final_response` carries the validated structured payload — prefer its markdown (and
        // attach the structured fields for findings/caveats/actions) over the plain accumulated
        // response_chunk text once it's arrived. Falls back to the accumulated text if the run
        // finished without one (e.g. an older/legacy-path response).
        const final = finalResponseRef.current;
        const finalText = final?.structuredResponse?.markdown || responseAccRef.current;
        if (finalText) {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: finalText,
              timestamp: new Date().toISOString(),
              structuredResponse: final?.structuredResponse ?? null,
              responseContractVersion: final?.responseContractVersion ?? null,
            },
          ]);
          setStreamingText("");
        }
        finalResponseRef.current = null;
      }

      if (!pendingCharsRef.current.length && !completePendingRef.current) {
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

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        console.log("🔥 SSE status:", JSON.stringify({ status: res.status }, null, 2));
        console.log("🔥 SSE headers:", JSON.stringify([...res.headers.entries()], null, 2));
        if (!res.body) throw new Error("Streaming not supported");

        const reader = res.body.getReader();
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
                break;
              }

              case "run_queued": {
                if (parsed.runId) setActiveRunId(parsed.runId);
                break;
              }

              // Deliberately no `tool_call`/`reasoning_step` cases — v3 says not to render those
              // for agent runs; `progress` below is the sanctioned replacement. If the backend
              // still sends them (compatibility with other surfaces), the switch just ignores them.

              case "progress": {
                if (parsed.progress) setProgress(parsed.progress);
                break;
              }

              case "response_chunk": {
                const text = parsed.message ?? "";
                responseAccRef.current += text;
                setStreamingText(responseAccRef.current);
                pendingCharsRef.current += text;
                kickTypewriter();
                setCurrentPhase("streaming");
                break;
              }

              case "final_response": {
                finalResponseRef.current = {
                  structuredResponse: parsed.structuredResponse ?? null,
                  responseContractVersion: parsed.responseContractVersion ?? null,
                };
                break;
              }

              case "input_request": {
                setInputRequest(parsed.inputRequest ?? null);
                break;
              }

              case "proposal": {
                if (parsed.proposal) setProposals((prev) => [...prev, parsed.proposal!]);
                break;
              }

              case "run_state": {
                // Reconcile-after-reconnect status text — no reconnect flow is built yet, but a
                // stray run_state on the live connection still gets a real phase message instead
                // of being silently dropped.
                if (parsed.message) setCurrentPhaseMessage(parsed.message);
                break;
              }

              case "run_cancelled": {
                setIsStreaming(false);
                clearTypewriter();
                return;
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
                return;
              }
            }

            if (parsed.state === "complete") {
              completePendingRef.current = true;
              queryClient.invalidateQueries({ queryKey: ["ai-conversations"] });
              kickTypewriter();
            }
          }
        }
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        console.error("❌ Send message failed:", err);
        const errorMessage = err instanceof Error ? err.message : "Something went wrong";
        setMessages((prev) => [
          ...prev,
          { role: "error", content: errorMessage, timestamp: new Date().toISOString() },
        ]);
      } finally {
        if (!completePendingRef.current) {
          setIsStreaming(false);
          clearTypewriter();
        }
        // Unconditional, not just on a `state: "complete"` event — the sidebar's conversation
        // list (title/lastMessagePreview/messageCount) needs refreshing whenever a send finishes,
        // however the stream actually signals that it's done.
        queryClient.invalidateQueries({ queryKey: ["ai-conversations"] });
      }
    },
    [clearTypewriter, kickTypewriter, queryClient]
  );

  const abortStream = useCallback(() => {
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
    abortStream,
  };
};
