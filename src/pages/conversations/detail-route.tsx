import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AlertTriangle, ArrowUp, CheckCircle2, ChevronDown, Database, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { usePageBreadcrumb } from "@/components/breadcrumb-context";
import { Skeleton } from "@/components/ui/skeleton";
import { useAiConversationMessages } from "@/features/ai-conversations/use-ai-conversation-messages";
import { useGetAiConversationById } from "@/features/ai-conversations/use-get-ai-conversation-by-id";
import type { AiConversationMessage, ReasoningStep } from "@/features/ai-conversations/ai-conversation-types";
import { useGetAiProposals } from "@/features/ai-proposals/use-get-ai-proposals";
import { ProposalCard, type ProposalCardData } from "./proposal-card";
import { PromptToggles } from "./prompt-toggles";
import { SuggestedActions, type SuggestedAction } from "./suggested-actions";
import flolytLogo from "../../../assets/logo.png";

// ❌ Backend does NOT provide a suggested-next-actions endpoint yet — mocked until one exists.
const MOCK_SUGGESTED_ACTIONS: SuggestedAction[] = [
  { id: "1", label: "Summarize the key changes in this conversation so far" },
  { id: "2", label: "Suggest what I should prioritize next" },
  { id: "3", label: "Draft a follow-up message based on this" },
];

// Hysteresis band for the scroll-driven reveal: reopen only within OPEN px of the bottom, close
// only once scrolled past CLOSE px away. The gap between them must clear the panel's own
// open/closed height difference (~140px) — collapsing/expanding it resizes the scroll container,
// which shifts the distance-from-bottom reading; a single shared threshold sits inside that swing
// and re-crosses itself on every resize, oscillating open/closed in a tight loop.
const NEAR_BOTTOM_OPEN_THRESHOLD = 40;
const NEAR_BOTTOM_CLOSE_THRESHOLD = 220;

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
    // Timestamp deliberately left out of the key: the same logical message shows up with two
    // different timestamps — a browser-side one from the optimistic/streamed copy, a server-side
    // one once it comes back from GET_BY_ID history — so keying on it let both through as if they
    // were two separate messages. Confirmed live 2026-09-10.
    const key = `${m.role}-${m.content}`;
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
    <div className="max-w-[75%] min-w-0 rounded-card border border-line bg-paper-2">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full min-w-0 items-center gap-2 px-3.5 py-2.5 text-left"
      >
        {isStreaming && <Loader2 className="size-3 shrink-0 animate-spin text-ultra" />}
        <span className="min-w-0 flex-1 truncate text-[11px] font-medium text-ink-3">
          {isStreaming ? "Working…" : `${steps.length} reasoning step${steps.length === 1 ? "" : "s"}`}
        </span>
        <ChevronDown className={cn("size-3.5 shrink-0 text-ink-4 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="space-y-2 border-t border-line px-3.5 py-2.5">
          {steps.map((step, idx) => {
            const isLast = idx === steps.length - 1;
            const isActive = isStreaming && isLast;
            return (
              <div key={`${step.timestamp}-${idx}`} className="flex min-w-0 items-start gap-2">
                <span
                  className={cn(
                    "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full",
                    isActive ? "text-ultra" : "bg-teal-bg text-teal"
                  )}
                >
                  {isActive ? (
                    <Loader2 className="size-3 animate-spin" />
                  ) : step.kind === "tool_call" ? (
                    <Database className="size-2.5" />
                  ) : (
                    <CheckCircle2 className="size-3" />
                  )}
                </span>
                <p className="min-w-0 flex-1 text-[11px] leading-relaxed wrap-break-word text-ink-3">
                  {step.description}
                </p>
              </div>
            );
          })}
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  // Toggling the panel resizes the scroll container, which fires a real (not spurious) native
  // "scroll" event of its own as the browser re-clamps scrollTop — briefly ignore the scroll
  // listener right after a manual toggle so that reflow-echo doesn't immediately undo it.
  const suppressScrollAutoRef = useRef(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [input, setInput] = useState("");
  const [askBeforeSpending, setAskBeforeSpending] = useState(true);
  const [planMode, setPlanMode] = useState(true);
  const [suggestedActionsOpen, setSuggestedActionsOpen] = useState(true);

  const {
    messages: streamedMessages,
    reasoningSteps,
    proposals: streamedProposals,
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

  // The SSE `proposal` event is a live nudge, not the source of truth — GET /ai/proposals is,
  // and is what makes a still-pending proposal survive a page reload. Merge the two: prefer the
  // fetched copy (it carries the real `status`), fall back to the streamed one until the refetch
  // (triggered by accept/defer/reject) catches up.
  const { data: proposalsData } = useGetAiProposals(
    { conversationId: !isNew ? id : undefined },
    { enabled: !isNew }
  );

  const pendingProposals = useMemo<ProposalCardData[]>(() => {
    const fetched = proposalsData?.data ?? [];
    const fetchedIds = new Set(fetched.map((p) => p.id));
    const streamedOnly = streamedProposals.filter((p) => !fetchedIds.has(p.proposalId));

    return [
      ...fetched.map((p) => ({
        id: p.id,
        toolName: p.toolName,
        argumentsJson: p.argumentsJson,
        status: p.status,
      })),
      ...streamedOnly.map((p) => ({
        id: p.proposalId,
        toolName: p.toolName,
        argumentsJson: p.argumentsJson,
        status: "Pending",
      })),
    ];
  }, [proposalsData, streamedProposals]);

  usePageBreadcrumb([
    { label: "Home", to: "/" },
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
    // "context" rows (tool-call/data-context summaries the backend logs into history) aren't part
    // of the conversation — drop them rather than rendering them as an assistant bubble.
    const fromHistory = (history?.data.messages ?? []).filter((m) => m.role !== "context");
    return dedupeMessages([...fromHistory, ...streamedMessages]);
  }, [history, streamedMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, animatedStreamingText, pendingProposals.length]);

  const handleSend = () => {
    const message = input.trim();
    if (!message || isStreaming) return;
    setInput("");
    sendMessage(message);
  };

  const handleSelectSuggestion = (label: string) => {
    if (isStreaming) return;
    sendMessage(label);
  };

  const handleChatScroll = () => {
    if (suppressScrollAutoRef.current) return;
    const el = scrollContainerRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setSuggestedActionsOpen((prev) => {
      if (prev && distanceFromBottom > NEAR_BOTTOM_CLOSE_THRESHOLD) return false;
      if (!prev && distanceFromBottom < NEAR_BOTTOM_OPEN_THRESHOLD) return true;
      return prev;
    });
  };

  const handleToggleSuggestedActions = (open: boolean) => {
    suppressScrollAutoRef.current = true;
    setSuggestedActionsOpen(open);
    window.setTimeout(() => {
      suppressScrollAutoRef.current = false;
    }, 400);
  };

  const showEmptyState = !isHistoryLoading && messages.length === 0 && !isStreaming;
  const showSuggestedActions = !showEmptyState && !isStreaming;

  return (
    <div className="mx-auto flex h-full max-w-3xl flex-col">
      <div
        ref={scrollContainerRef}
        onScroll={handleChatScroll}
        className="min-w-0 flex-1 space-y-5 overflow-x-hidden overflow-y-auto py-6"
      >
        {/* Only for a cold visit to an existing conversation with nothing on screen yet — not
            during a bootstrap send, where the history query flips from disabled to enabled the
            moment the new id resolves (mid-stream) and would otherwise pop this in above the
            prompt/response that are already showing. */}
        {isHistoryLoading && messages.length === 0 && !isStreaming && (
          <div className="space-y-3">
            <Skeleton className="h-16 w-2/3 rounded-card" />
            <Skeleton className="ml-auto h-10 w-1/2 rounded-card" />
          </div>
        )}

        {showEmptyState && (
          <div className="flex flex-col items-center pt-16 text-center">
            <span className="flex size-12 items-center justify-center rounded-full border border-ultra-border bg-ultra-bg">
              <img src={flolytLogo} alt="" className="size-7 object-contain" />
            </span>
            <p className="mt-4 text-[12.5px] text-ink-3">Ask Flolyt to look something up or take an action.</p>
          </div>
        )}

        {messages.map((message) =>
          message.role === "user" ? (
            <div key={message.key} className="flex justify-end">
              {/* pr-2 reserves room for the tail below so it sits inside this box's own edge
                  instead of overflowing past it (was forcing the whole page to scroll sideways). */}
              <div className="relative max-w-[75%] min-w-0 pr-2">
                {/* WhatsApp-style tail: a hard-cornered triangle butted against the bubble's
                    (deliberately unrounded) top-right corner, not just a smaller border-radius. */}
                <span
                  aria-hidden
                  className="absolute right-0 top-0 size-0"
                  style={{
                    borderStyle: "solid",
                    borderWidth: "8px 8px 0 0",
                    borderColor: "var(--color-ultra) transparent transparent transparent",
                  }}
                />
                <div className="rounded-2xl rounded-tr-none bg-ultra px-4 py-2.5 text-[12.5px] leading-relaxed wrap-break-word text-paper shadow-xs">
                  {message.content}
                </div>
              </div>
            </div>
          ) : message.role === "error" ? (
            <div key={message.key} className="flex min-w-0 justify-start">
              <div className="flex max-w-[85%] min-w-0 items-start gap-2 rounded-card border border-rose-border bg-rose-bg px-3.5 py-2.5">
                <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-rose" />
                <p className="min-w-0 text-[12.5px] leading-relaxed wrap-break-word whitespace-pre-wrap text-rose">
                  {message.content}
                </p>
              </div>
            </div>
          ) : (
            <div key={message.key} className="flex min-w-0 flex-col items-start gap-1.5">
              <p className="max-w-[85%] min-w-0 text-[12.5px] leading-relaxed wrap-break-word whitespace-pre-wrap text-ink">
                {message.content}
              </p>
            </div>
          )
        )}

        {isStreaming && (
          <div className="flex min-w-0 flex-col items-start gap-1.5">
            {currentPhase && currentPhase !== "streaming" && (
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-ink-3">
                <Loader2 className="size-3 animate-spin text-ultra" />
                {PHASE_LABEL[currentPhase] ?? "Working…"}
              </div>
            )}

            <ReasoningTrace steps={reasoningSteps} isStreaming={isStreaming} />

            {animatedStreamingText && (
              <p className="max-w-[85%] min-w-0 text-[12.5px] leading-relaxed wrap-break-word whitespace-pre-wrap text-ink">
                {animatedStreamingText}
              </p>
            )}
          </div>
        )}

        {pendingProposals.map((proposal) => (
          <div key={proposal.id} className="flex max-w-[85%] min-w-0 justify-start">
            <ProposalCard proposal={proposal} />
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      <div className="sticky bottom-0 flex flex-col bg-paper">
        {showSuggestedActions && (
          <SuggestedActions
            actions={MOCK_SUGGESTED_ACTIONS}
            isOpen={suggestedActionsOpen}
            onOpenChange={handleToggleSuggestedActions}
            onSelect={handleSelectSuggestion}
          />
        )}

        <div className="group relative border-t border-line pt-4 pb-4">
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

            <div className="flex items-center justify-between border-t border-line px-2.5 py-1.5">
              <PromptToggles
                askBeforeSpending={askBeforeSpending}
                onAskBeforeSpendingChange={setAskBeforeSpending}
                planMode={planMode}
                onPlanModeChange={setPlanMode}
              />

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
