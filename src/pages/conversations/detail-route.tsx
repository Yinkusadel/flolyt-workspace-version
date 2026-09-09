import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowUp, ChevronDown, Loader2, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import { usePageBreadcrumb } from "@/components/breadcrumb-context";
import { Skeleton } from "@/components/ui/skeleton";
import { useAiConversationMessages } from "@/features/ai-conversations/use-ai-conversation-messages";
import { useGetAiConversationById } from "@/features/ai-conversations/use-get-ai-conversation-by-id";
import type { AiConversationMessage, ReasoningStep } from "@/features/ai-conversations/ai-conversation-types";

// Guards the bootstrap prompt (arriving via nav state from /new-conversation) against being
// re-sent by a StrictMode double-invoke or an accidental remount — same idiom as the reference
// implementation's `consumedBootstrapTokens`.
const consumedBootstrapTokens = new Set<string>();

const PHASE_LABEL: Record<string, string> = {
  submitted: "Thinking…",
  readingSource: "Reading source…",
  streaming: "Responding…",
};

type ChatMessage = AiConversationMessage & { key: string };

function dedupeMessages(messages: AiConversationMessage[]): ChatMessage[] {
  const seen = new Set<string>();
  const result: ChatMessage[] = [];
  messages.forEach((m, idx) => {
    const key = `${m.role}-${m.timestamp}-${m.content}`;
    if (seen.has(key)) return;
    seen.add(key);
    result.push({ ...m, key: `${key}-${idx}` });
  });
  return result;
}

function ReasoningTrace({ steps, isStreaming }: { steps: ReasoningStep[]; isStreaming: boolean }) {
  const [open, setOpen] = useState(true);
  if (!steps.length) return null;

  return (
    <div className="max-w-[75%] rounded-card border border-line bg-paper-2">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left"
      >
        {isStreaming && <Loader2 className="size-3 shrink-0 animate-spin text-ultra" />}
        <span className="flex-1 truncate text-[11px] font-medium text-ink-3">
          {isStreaming ? "Working…" : `${steps.length} reasoning step${steps.length === 1 ? "" : "s"}`}
        </span>
        <ChevronDown className={cn("size-3.5 shrink-0 text-ink-4 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="space-y-2 border-t border-line px-3.5 py-2.5">
          {steps.map((step, idx) => (
            <div key={`${step.timestamp}-${idx}`} className="flex gap-2">
              <span className="mt-1 size-1 shrink-0 rounded-full bg-ink-4" aria-hidden />
              <p className="text-[11px] leading-relaxed text-ink-3">{step.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AiConversationDetailRoute() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isNew = id === "new";

  const bootstrapPrompt = isNew ? ((location.state as { prompt?: string } | null)?.prompt ?? null) : null;
  const bootstrapToken = isNew ? ((location.state as { bootstrapToken?: string } | null)?.bootstrapToken ?? null) : null;

  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [input, setInput] = useState("");

  const {
    messages: streamedMessages,
    reasoningSteps,
    animatedStreamingText,
    isStreaming,
    currentPhase,
    sendMessage,
  } = useAiConversationMessages(isNew ? undefined : id, {
    onConversationCreated: (newId) => {
      navigate(`/conversations/${newId}`, { replace: true });
    },
  });

  const { data: history, isLoading: isHistoryLoading } = useGetAiConversationById(
    !isNew ? id : undefined
  );

  usePageBreadcrumb([
    { label: "New conversation", to: "/new-conversation" },
    { label: history?.data.title || "Conversation" },
  ]);

  // Send the bootstrap prompt exactly once when we land here fresh from /new-conversation.
  useEffect(() => {
    if (!isNew || !bootstrapPrompt || !bootstrapToken) return;
    if (consumedBootstrapTokens.has(bootstrapToken)) return;

    consumedBootstrapTokens.add(bootstrapToken);
    sendMessage(bootstrapPrompt);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNew, bootstrapPrompt, bootstrapToken]);

  const messages = useMemo(() => {
    const fromHistory = history?.data.messages ?? [];
    return dedupeMessages([...fromHistory, ...streamedMessages]);
  }, [history, streamedMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, animatedStreamingText]);

  const handleSend = () => {
    const message = input.trim();
    if (!message || isStreaming) return;
    setInput("");
    sendMessage(message);
  };

  const showEmptyState = !isHistoryLoading && messages.length === 0 && !isStreaming;

  return (
    <div className="mx-auto flex h-full max-w-3xl flex-col">
      <div className="flex-1 space-y-5 overflow-y-auto py-6">
        {isHistoryLoading && (
          <div className="space-y-3">
            <Skeleton className="h-16 w-2/3 rounded-card" />
            <Skeleton className="ml-auto h-10 w-1/2 rounded-card" />
          </div>
        )}

        {showEmptyState && (
          <div className="flex flex-col items-center pt-16 text-center">
            <span className="flex size-9 items-center justify-center rounded-full border border-ultra-border bg-ultra-bg text-ultra">
              <Sparkles className="size-4" />
            </span>
            <p className="mt-4 text-[12.5px] text-ink-3">Ask Flolyt to look something up or take an action.</p>
          </div>
        )}

        {messages.map((message) =>
          message.role === "user" ? (
            <div key={message.key} className="flex justify-end">
              <div className="max-w-[75%] rounded-card border border-ultra-border bg-ultra-bg px-4 py-2.5 text-[12.5px] leading-relaxed text-ink">
                {message.content}
              </div>
            </div>
          ) : (
            <div key={message.key} className="flex flex-col items-start gap-1.5">
              <span className="flex size-5 items-center justify-center rounded-full border border-ultra-border bg-ultra-bg text-ultra">
                <Sparkles className="size-2.5" />
              </span>
              <p className="max-w-[85%] text-[12.5px] leading-relaxed whitespace-pre-wrap text-ink">
                {message.content}
              </p>
            </div>
          )
        )}

        {isStreaming && (
          <div className="flex flex-col items-start gap-1.5">
            <span className="flex size-5 items-center justify-center rounded-full border border-ultra-border bg-ultra-bg text-ultra">
              <Sparkles className="size-2.5" />
            </span>

            {currentPhase && currentPhase !== "streaming" && (
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-ink-3">
                <Loader2 className="size-3 animate-spin text-ultra" />
                {PHASE_LABEL[currentPhase] ?? "Working…"}
              </div>
            )}

            <ReasoningTrace steps={reasoningSteps} isStreaming={isStreaming} />

            {animatedStreamingText && (
              <p className="max-w-[85%] text-[12.5px] leading-relaxed whitespace-pre-wrap text-ink">
                {animatedStreamingText}
              </p>
            )}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="sticky bottom-0 border-t border-line bg-paper py-4">
        <div className="group relative">
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-px rounded-card opacity-0 transition-opacity duration-300 group-focus-within:opacity-100"
            style={{
              background:
                "linear-gradient(120deg, var(--color-ultra), var(--color-ultra-border), var(--color-ultra))",
              backgroundSize: "300% 300%",
              animation: "border-gradient-pan 5s ease infinite",
            }}
          />

          <div className="relative rounded-card border border-line bg-paper-2 shadow-xs transition-colors group-focus-within:border-transparent">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              rows={2}
              placeholder="Ask a follow-up…"
              disabled={isStreaming}
              className="w-full resize-none rounded-t-card bg-transparent px-4 pt-3 pb-1.5 text-[12.5px] text-ink outline-none placeholder:text-ink-4 disabled:opacity-60"
            />

            <div className="flex items-center justify-end border-t border-line px-2.5 py-1.5">
              <button
                type="button"
                onClick={handleSend}
                disabled={!input.trim() || isStreaming}
                className={cn(
                  "flex size-6.5 items-center justify-center rounded-md transition-all",
                  input.trim() && !isStreaming ? "bg-ultra text-paper hover:opacity-90" : "bg-paper text-ink-4"
                )}
              >
                {isStreaming ? <Loader2 className="size-3.25 animate-spin" /> : <ArrowUp size={13} strokeWidth={2.5} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
