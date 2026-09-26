import { ArrowRight, Loader2, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import type { SuggestedActionV2 } from "@/features/ai-conversations/agent-response-types";
import {
  extractLeakRoomParams,
  resolveSuggestedActionRoute,
} from "@/features/ai-conversations/map-suggested-action-target";
import { useOpenRoomFromLeak } from "@/features/ai-conversations/use-open-room-from-leak";

interface AiResponseActionsProps {
  actions: SuggestedActionV2[];
  onAskAgent: (label: string) => void;
}

// All three action kinds share this look — the ultra accent (this app's existing AI/primary
// color) plus a real shadow, so an AI-suggested action reads as clearly clickable at rest, not
// just on hover discovery. First pass used a flat gray border-only style here, which a live look
// confirmed was indistinguishable from plain bordered text — corrected 2026-09-26.
const ACTION_BUTTON_CLASS =
  "inline-flex items-center gap-1.5 rounded-chip border border-ultra-border bg-ultra-bg px-3 py-1.5 text-[11px] font-semibold text-ultra shadow-xs transition-all hover:bg-ultra-bg/70 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none";

// Three kinds of action, three different click behaviors:
// - "AskAgent" doesn't navigate — it's a suggested follow-up prompt, sent the same way as a
//   suggested-next-action chip elsewhere on this page.
// - A resourceless "room" action carrying grid/rowKey/conditionKey/currency resolves through the
//   same leakage-cell → open-room flow the leakage map's own "Start a room" button uses
//   (`extractLeakRoomParams` + `useOpenRoomFromLeak`) — an async action, not a plain link.
// - Everything else resolves through `resolveSuggestedActionRoute`.
// Hidden entirely (not rendered) when none of the above applies or the backend marked it
// ineligible, per the handoff doc's explicit instruction not to guess a URL.
export function AiResponseActions({ actions, onAskAgent }: AiResponseActionsProps) {
  const navigate = useNavigate();
  const { mutate: openRoomFromLeak, isPending: isOpeningRoom } = useOpenRoomFromLeak();

  const visible = actions.filter((action) => {
    if (action.eligibility?.eligible === false) return false;
    if (action.kind === "AskAgent") return true;
    if (extractLeakRoomParams(action)) return true;
    return resolveSuggestedActionRoute(action) !== null;
  });

  if (!visible.length) return null;

  return (
    <div className="flex w-full max-w-[85%] min-w-0 flex-wrap gap-2">
      {visible.map((action) => {
        if (action.kind === "AskAgent") {
          return (
            <button
              key={action.id}
              type="button"
              onClick={() => onAskAgent(action.label)}
              className={ACTION_BUTTON_CLASS}
            >
              <MessageCircle className="size-3 shrink-0" />
              {action.label}
            </button>
          );
        }

        const leakParams = extractLeakRoomParams(action);
        if (leakParams) {
          return (
            <button
              key={action.id}
              type="button"
              disabled={isOpeningRoom}
              onClick={() => {
                console.log("🏠 Open room from leak requested:", leakParams);
                openRoomFromLeak(leakParams, {
                  onSuccess: (roomId) => {
                    console.log("🏠 Open room from leak resolved:", { ...leakParams, roomId });
                    if (roomId) navigate(`/rooms/${roomId}`);
                    else toast.error("This leak doesn't have enough data to open a room yet.");
                  },
                });
              }}
              className={ACTION_BUTTON_CLASS}
            >
              {action.label}
              {isOpeningRoom ? (
                <Loader2 className="size-3 shrink-0 animate-spin" />
              ) : (
                <ArrowRight className="size-3 shrink-0" />
              )}
            </button>
          );
        }

        return (
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
        );
      })}
    </div>
  );
}
