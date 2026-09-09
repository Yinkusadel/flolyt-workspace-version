import { useCallback, useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { API_ENDPOINTS } from "@/config/apiConfig";
import { COOKIE_KEYS, getCookie } from "@/utils/cookies";
import type { AgentStreamEvent, AiConversationMessage, ReasoningStep } from "./ai-conversation-types";

interface UseAiConversationMessagesOptions {
  onReasoningStep?: (step: ReasoningStep) => void;
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
  const [reasoningSteps, setReasoningSteps] = useState<ReasoningStep[]>([]);
  const [streamingText, setStreamingText] = useState("");
  const [animatedStreamingText, setAnimatedStreamingText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<string | null>(null);

  const conversationIdRef = useRef<string | null>(initialConversationId ?? null);
  const abortRef = useRef<AbortController | null>(null);
  const responseAccRef = useRef("");
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
    bufferRef.current = "";
    pendingCharsRef.current = "";
    if (typewriterTimerRef.current) window.clearTimeout(typewriterTimerRef.current);
    if (typewriterRafRef.current !== null) window.cancelAnimationFrame(typewriterRafRef.current);
    typewriterTimerRef.current = null;
    typewriterRafRef.current = null;

    conversationIdRef.current = nextConversationId;
    setConversationId(nextConversationId);
    setMessages([]);
    setReasoningSteps([]);
    setStreamingText("");
    setAnimatedStreamingText("");
    setIsStreaming(false);
    setCurrentPhase(null);
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

        const finalText = responseAccRef.current;
        if (finalText) {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: finalText, timestamp: new Date().toISOString() },
          ]);
          setStreamingText("");
        }
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
      setReasoningSteps([]);
      setStreamingText("");
      clearTypewriter();
      responseAccRef.current = "";

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
          },
          body: JSON.stringify({ conversationId: conversationIdRef.current, message }),
          signal: abortRef.current.signal,
          credentials: "include",
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        if (!res.body) throw new Error("Streaming not supported");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

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

            switch (resolvedEventType) {
              case "status": {
                setCurrentPhase(parsed.state);

                if (parsed.message?.startsWith("conversation_id:") && !conversationIdRef.current) {
                  const id = parsed.message.replace("conversation_id:", "");
                  setConversationId(id);
                  conversationIdRef.current = id;
                  optionsRef.current?.onConversationCreated?.(id);
                }
                break;
              }

              case "tool_call": {
                const step = parsed.reasoningSteps?.[0];
                if (step) setReasoningSteps((prev) => [...prev, { ...step, kind: "tool_call" }]);
                setCurrentPhase("readingSource");
                break;
              }

              case "reasoning_step": {
                const step = parsed.reasoningSteps?.[0];
                if (step) {
                  const tagged: ReasoningStep = { ...step, kind: "reasoning_step" };
                  setReasoningSteps((prev) => [...prev, tagged]);
                  optionsRef.current?.onReasoningStep?.(tagged);
                }
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

              case "error": {
                setMessages((prev) => [
                  ...prev,
                  {
                    role: "assistant",
                    content: `Error: ${parsed.errorMessage ?? "Unknown error"}`,
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
        const errorMessage = err instanceof Error ? err.message : "Something went wrong";
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `Error: ${errorMessage}`, timestamp: new Date().toISOString() },
        ]);
      } finally {
        if (!completePendingRef.current) {
          setIsStreaming(false);
          clearTypewriter();
        }
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
    reasoningSteps,
    streamingText,
    animatedStreamingText,
    isStreaming,
    currentPhase, // "submitted" | "readingSource" | "streaming" | null
    sendMessage,
    abortStream,
  };
};
