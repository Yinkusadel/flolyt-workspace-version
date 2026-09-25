import { ArrowRight, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

import type { SuggestedActionV2 } from "@/features/ai-conversations/agent-response-types";
import { resolveSuggestedActionRoute } from "@/features/ai-conversations/map-suggested-action-target";

interface AiResponseActionsProps {
  actions: SuggestedActionV2[];
  onAskAgent: (label: string) => void;
}

// "AskAgent" actions don't navigate — they're a suggested follow-up prompt, sent the same way as
// a suggested-next-action chip elsewhere on this page. Every other kind resolves through
// resolveSuggestedActionRoute; hidden entirely (not rendered) when that returns null or the
// backend marked it ineligible, per the handoff doc's explicit instruction not to guess a URL.
export function AiResponseActions({ actions, onAskAgent }: AiResponseActionsProps) {
  const navigate = useNavigate();

  const visible = actions.filter((action) => {
    if (action.eligibility?.eligible === false) return false;
    if (action.kind === "AskAgent") return true;
    return resolveSuggestedActionRoute(action) !== null;
  });

  if (!visible.length) return null;

  return (
    <div className="flex w-full max-w-[85%] min-w-0 flex-wrap gap-2">
      {visible.map((action) =>
        action.kind === "AskAgent" ? (
          <button
            key={action.id}
            type="button"
            onClick={() => onAskAgent(action.label)}
            className="inline-flex items-center gap-1.5 rounded-chip border border-ultra-border bg-ultra-bg px-3 py-1.5 text-[11px] font-medium text-ultra transition-colors hover:bg-ultra-bg/70"
          >
            <MessageCircle className="size-3" />
            {action.label}
          </button>
        ) : (
          <button
            key={action.id}
            type="button"
            onClick={() => {
              const route = resolveSuggestedActionRoute(action);
              if (route) navigate(route);
            }}
            className="inline-flex items-center gap-1.5 rounded-chip border border-line bg-paper px-3 py-1.5 text-[11px] font-medium text-ink transition-colors hover:border-ink-4"
          >
            {action.label}
            <ArrowRight className="size-3 text-ink-4" />
          </button>
        )
      )}
    </div>
  );
}
