import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AlertTriangle, ArrowUp, Link2, Loader2, MessageSquarePlus, Square } from "lucide-react";

import { cn } from "@/lib/utils";
import { usePageBreadcrumb } from "@/components/breadcrumb-context";
import { Skeleton } from "@/components/ui/skeleton";
import { useAiConversationMessages } from "@/features/ai-conversations/use-ai-conversation-messages";
import { useGetAiConversationById } from "@/features/ai-conversations/use-get-ai-conversation-by-id";
import type { AiConversationMessage } from "@/features/ai-conversations/ai-conversation-types";
import { useGetAiProposals } from "@/features/ai-proposals/use-get-ai-proposals";
import { useGetAgentRun } from "@/features/agent-runs/use-get-agent-run";
import { useCancelAgentRun } from "@/features/agent-runs/use-cancel-agent-run";
import { useSteerAgentRun } from "@/features/agent-runs/use-steer-agent-run";
import { ProposalCard, type ProposalCardData } from "./proposal-card";
import { PromptToggles } from "./prompt-toggles";
import { SuggestedActions, type SuggestedAction } from "./suggested-actions";
import { AiResponseRenderer } from "./ai-response/response-renderer";
import { AiResponseCaveats } from "./ai-response/response-caveats";
import { AiResponseActions } from "./ai-response/response-actions";
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

function formatElapsed(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

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

// No card, no click-to-expand — mirrors Claude's own in-progress status: a single "is working"
// header with a live timer, and one current-activity line underneath that swaps out as new SSE
// events arrive rather than accumulating into a list. Past activity is intentionally discarded
// once replaced (see `progress` in useAiConversationMessages — only the latest is kept, there's
// no history-of-steps display).
function WorkingStatus({ elapsedSeconds, subline, isPhaseOnly }: { elapsedSeconds: number; subline: string; isPhaseOnly: boolean }) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <div className="flex items-center gap-1.5 text-[11px] font-medium text-ink-3">
        <img src={flolytLogo} alt="" className="size-3.5 object-contain" />
        Working · {formatElapsed(elapsedSeconds)}
      </div>
      <div className="flex min-w-0 items-start gap-1.5 pl-0.5">
        {isPhaseOnly ? (
          <Loader2 className="mt-0.5 size-3 shrink-0 animate-spin text-ink-4" />
        ) : (
          <Link2 className="mt-0.5 size-3 shrink-0 text-ink-4" />
        )}
        <span className="min-w-0 flex-1 animate-text-shimmer text-[11px] leading-relaxed wrap-break-word">
          {subline}
        </span>
      </div>
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

  const [steerOpen, setSteerOpen] = useState(false);
  const [steerText, setSteerText] = useState("");

  const {
    messages: streamedMessages,
    progress,
    proposals: streamedProposals,
    animatedStreamingText,
    isStreaming,
    currentPhase,
    currentPhaseMessage,
    activeRunId,
    sendMessage,
    reconnectRun,
    abortStream,
  } = useAiConversationMessages(isNew ? undefined : id, {
    onConversationCreated: (newId) => {
      navigate(`/conversations/${newId}`, { replace: true });
    },
  });

  const { data: history, isLoading: isHistoryLoading } = useGetAiConversationById(
    !isNew ? id : undefined
  );

  // Reconnect recipe from the v3 handoff: if the persisted conversation says a run is still
  // active, reopen its stream instead of leaving the page blank after a refresh mid-run. Guarded
  // against `isStreaming` so this never double-connects over a send already happening live in
  // this tab, and against re-firing for the same runId once it's been tried.
  const activeRunIdFromHistory = history?.data.activeRunId ?? null;
  const { data: agentRunData } = useGetAgentRun(activeRunIdFromHistory, {
    enabled: !isNew && !!activeRunIdFromHistory,
  });
  const reconnectedRunIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (isNew || isStreaming || !activeRunIdFromHistory) return;
    if (reconnectedRunIdRef.current === activeRunIdFromHistory) return;

    const status = agentRunData?.data.status;
    if (status !== "queued" && status !== "running" && status !== "awaiting_approval") return;

    reconnectedRunIdRef.current = activeRunIdFromHistory;
    reconnectRun(activeRunIdFromHistory);
  }, [isNew, isStreaming, activeRunIdFromHistory, agentRunData, reconnectRun]);

  const { cancelRun } = useCancelAgentRun();
  const { steerRun, isSteering } = useSteerAgentRun();

  const handleStop = () => {
    // Local stop always works, even in the brief window before `run_queued` has arrived and
    // `activeRunId` is still null — the button must respond the instant it's clicked, same as
    // Claude's own stop button, not only once a server-issued id happens to exist yet.
    abortStream();
    if (activeRunId) cancelRun(activeRunId);
  };

  const handleSteerSubmit = (e: FormEvent) => {
    e.preventDefault();
    const text = steerText.trim();
    if (!text || !activeRunId) return;
    steerRun({ runId: activeRunId, text });
    setSteerText("");
    setSteerOpen(false);
  };

  // No backend field for "how long has this run been going" — this is a plain wall-clock timer
  // tied to the real isStreaming lifecycle from the hook, restarted at 0 each time a send begins.
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  useEffect(() => {
    if (!isStreaming) {
      setElapsedSeconds(0);
      return;
    }
    const startedAt = Date.now();
    const interval = window.setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [isStreaming]);

  // The current-activity line always reflects the latest real SSE data. A `proposal` event is
  // just as much "activity" as a `progress` event, but it lands in its own array (streamedProposals,
  // below) — compare real timestamps across both to find whichever actually happened last, rather
  // than only ever looking at progress and silently dropping proposal activity. Falls back to the
  // current lifecycle phase before either has produced anything. (Previously compared against the
  // last `reasoningSteps` entry — removed along with tool_call/reasoning_step rendering, since v3
  // says not to render those for agent runs; `progress` is the sanctioned replacement signal.)
  const latestProposal = streamedProposals[streamedProposals.length - 1];
  const proposalIsLatest =
    !!latestProposal &&
    (!progress || new Date(latestProposal.createdAtUtc) >= new Date(progress.atUtc));

  const latestActivity = proposalIsLatest ? latestProposal : progress;
  // Prefer the backend's own phase copy ("Analyzing your request...", "Processing...") over the
  // PHASE_LABEL map — that map is only a fallback for a phase the backend didn't send text for.
  const workingSubline = proposalIsLatest
    ? `Preparing proposal: ${latestProposal!.toolName}`
    : (progress?.message ?? currentPhaseMessage ?? PHASE_LABEL[currentPhase ?? ""] ?? "Working…");

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

  const showSkeleton = isHistoryLoading && messages.length === 0 && !isStreaming;
  const showEmptyState = !isHistoryLoading && messages.length === 0 && !isStreaming;
  const showSuggestedActions = !showSkeleton && !showEmptyState && !isStreaming;

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
        {showSkeleton && (
          <div className="space-y-3">
            <Skeleton className="h-16 w-2/3 rounded-card" />
            <Skeleton className="ml-auto h-10 w-1/2 rounded-card" />
            <Skeleton className="h-16 w-3/5 rounded-card" />
            <Skeleton className="ml-auto h-10 w-2/5 rounded-card" />
            <Skeleton className="h-16 w-1/2 rounded-card" />
            <Skeleton className="ml-auto h-10 w-1/3 rounded-card" />
            <Skeleton className="h-16 w-3/4 rounded-card" />
            <Skeleton className="ml-auto h-10 w-3/5 rounded-card" />
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
            // w-full (not just items-start) matters here: without a definite width on this
            // wrapper, a table/chart segment's own max-w-[85%] has nothing real to resolve
            // against under shrink-to-fit flex sizing, and a wide table's min-w-max content can
            // then overflow straight past the pane's edge instead of being capped at 85%.
            <div key={message.key} className="flex w-full min-w-0 flex-col items-start gap-1.5">
              <AiResponseRenderer content={message.content} />
              {message.structuredResponse?.caveats?.length ? (
                <AiResponseCaveats caveats={message.structuredResponse.caveats} />
              ) : null}
              {message.structuredResponse?.actions?.length ? (
                <AiResponseActions
                  actions={message.structuredResponse.actions}
                  onAskAgent={handleSelectSuggestion}
                />
              ) : null}
            </div>
          )
        )}

        {isStreaming && (
          <div className="flex min-w-0 flex-col items-start gap-1.5">
            {/* This backend interleaves tool_call/reasoning_step events with response_chunk
                text rather than finishing all reasoning before it starts streaming an answer —
                confirmed live 2026-09-13 (tool calls kept arriving after the first words of text).
                So this status line has to stay up for the whole isStreaming window, not just
                until text starts, or later tool calls after the first word never get shown. */}
            <WorkingStatus
              elapsedSeconds={elapsedSeconds}
              subline={workingSubline}
              isPhaseOnly={!latestActivity}
            />

            {/* Stop lives on the composer's send button (it swaps to a stop icon in place while
                streaming, same as Claude's own chat UI) — not a separate control here. Steer is
                its own thing, only offered once a runId actually exists (the brief window right
                after hitting send, before `run_queued` arrives, has no run to steer yet). */}
            {activeRunId && !steerOpen && (
              <button
                type="button"
                onClick={() => setSteerOpen(true)}
                className="inline-flex items-center gap-1 self-start rounded-chip border border-line bg-paper px-2 py-1 text-[10.5px] font-medium text-ink-3 transition-colors hover:border-ink-4 hover:text-ink"
              >
                <MessageSquarePlus className="size-2.5" />
                Add a note
              </button>
            )}

            {activeRunId && steerOpen && (
              <form onSubmit={handleSteerSubmit} className="flex w-full max-w-[85%] min-w-0 items-center gap-1.5 pl-0.5">
                <input
                  autoFocus
                  value={steerText}
                  onChange={(e) => setSteerText(e.currentTarget.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      setSteerOpen(false);
                      setSteerText("");
                    }
                  }}
                  placeholder="Add a note for the next step…"
                  disabled={isSteering}
                  className="min-w-0 flex-1 rounded-chip border border-line bg-paper px-2.5 py-1 text-[11px] text-ink outline-none placeholder:text-ink-4 disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={!steerText.trim() || isSteering}
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-full transition-colors",
                    steerText.trim() && !isSteering ? "bg-ultra text-paper" : "bg-paper-2 text-ink-4"
                  )}
                >
                  <ArrowUp size={11} strokeWidth={2.5} />
                </button>
              </form>
            )}

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

        <div className="pt-1.5 pb-4">
          {showSkeleton ? (
            // Same footprint as the real composer below (rounded-card box, textarea-height row +
            // toolbar row) so nothing jumps once history loads and the real one swaps in. Keyed
            // distinctly from the real composer below so React fully unmounts/remounts on the
            // swap instead of patching this div in place — without a key, both branches render a
            // bare <div> in the same slot, so React reuses the DOM node and the real composer's
            // focus-glow div (the blue/purple gradient, normally opacity-0 until focused) could
            // briefly render with a stale transition state during the patch. Confirmed live 2026-09-13.
            <div key="composer-skeleton" className="rounded-card border border-line bg-paper-2 shadow-xs">
              <div className="px-4 pt-3 pb-1.5">
                <Skeleton className="h-4 w-2/5 rounded-full" />
              </div>
              <div className="flex items-center justify-between px-2.5 py-1.5">
                <div className="flex items-center gap-1.5">
                  <Skeleton className="size-6.5 rounded-md" />
                  <Skeleton className="size-6.5 rounded-md" />
                </div>
                <Skeleton className="size-6.5 rounded-md" />
              </div>
            </div>
          ) : (
            <div key="composer-real" className="group relative">
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

                <div className="flex items-center justify-between px-2.5 py-1.5">
                  <PromptToggles
                    askBeforeSpending={askBeforeSpending}
                    onAskBeforeSpendingChange={setAskBeforeSpending}
                    planMode={planMode}
                    onPlanModeChange={setPlanMode}
                  />

                  {/* Same control, two modes — mirrors Claude's own composer: this button IS the
                      stop button while a response is streaming, not a separate control elsewhere,
                      and swaps back the instant the run ends. */}
                  <button
                    type="button"
                    onClick={isStreaming ? handleStop : handleSend}
                    disabled={!isStreaming && !input.trim()}
                    title={isStreaming ? "Stop" : undefined}
                    className={cn(
                      "flex size-6.5 items-center justify-center rounded-md transition-all",
                      isStreaming
                        ? "bg-ink text-paper hover:opacity-90"
                        : input.trim() ? "bg-ultra text-paper hover:opacity-90" : "bg-paper text-ink-4"
                    )}
                  >
                    {isStreaming ? (
                      <Square className="size-2.75 fill-current" strokeWidth={0} />
                    ) : (
                      <ArrowUp size={13} strokeWidth={2.5} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
