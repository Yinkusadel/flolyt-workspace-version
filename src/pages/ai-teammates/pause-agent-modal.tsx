import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AgentDot } from "@/pages/rooms/actor";
import type { AgentRef } from "@/pages/rooms/types";

export type PauseAgentContext = {
  openRooms: number;
  evidenceRooms: number;
  dismissals: number;
  /** The specific room this pause was triggered from, if any — shown as "stays open" reassurance. */
  highlightRoom?: { title: string; amount: string };
};

const DEFAULT_CONTEXT: PauseAgentContext = { openRooms: 1, evidenceRooms: 12, dismissals: 3 };

/** Screen 121 (pause an agent) — see flolyt-kit-122/121-pause-an-agent.svg. */
export function PauseAgentModal({
  agent,
  context = DEFAULT_CONTEXT,
  open,
  onOpenChange,
}: {
  agent: AgentRef;
  context?: PauseAgentContext;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const confirm = () => {
    onOpenChange(false);
    toast.success(`${agent.name} paused`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader className="flex-row items-start gap-3 space-y-0">
          <AgentDot agent={agent} size="lg" />
          <div>
            <span className="font-mono text-[9px] font-medium tracking-[0.85px] text-ink-4 uppercase">
              {agent.name}
            </span>
            <DialogTitle>Pause this agent</DialogTitle>
            <DialogDescription className="mt-1">What stops, and what does not</DialogDescription>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-6 px-5 py-5 sm:grid-cols-2 sm:px-7 sm:py-6">
          <div>
            <p className="font-mono text-[9px] font-medium tracking-[0.85px] text-rose uppercase">Stops</p>
            <ul className="mt-2.5 space-y-2 text-[11.5px] text-ink-2">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-rose" />
                New runs
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-rose" />
                New rooms
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-rose" />
                New drafts and proposals
              </li>
            </ul>
          </div>
          <div>
            <p className="font-mono text-[9px] font-medium tracking-[0.85px] text-teal uppercase">Continues</p>
            <ul className="mt-2.5 space-y-2 text-[11.5px] text-ink-2">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-teal" />
                The {context.openRooms} {context.openRooms === 1 ? "room" : "rooms"} it already opened
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-teal" />
                All {context.evidenceRooms} rooms of evidence
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-teal" />
                Its record and its {context.dismissals} dismissals
              </li>
            </ul>
          </div>
        </div>

        {context.highlightRoom && (
          <div className="mx-5 mb-2 rounded-card border border-line bg-paper pl-3.5 sm:mx-7">
            <div className="border-l-[3px] border-amber py-3.5 pr-3.5 pl-2.5 -ml-3.5">
              <p className="font-mono text-[9px] font-medium tracking-[0.85px] text-ink-4 uppercase">
                The {context.highlightRoom.amount} room stays open
              </p>
              <p className="mt-2 text-[11.5px] leading-relaxed text-ink-2">
                Pausing an agent does not close its findings. "{context.highlightRoom.title}" keeps its owner, its
                evidence and its deadline. Silence from an agent is not the same as the problem going away.
              </p>
            </div>
          </div>
        )}

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" onClick={confirm}>
              Pause the agent
            </Button>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="text-[12px] font-semibold text-ink-3 hover:text-ink"
            >
              Cancel
            </button>
          </div>
          <p className="hidden font-mono text-[10.5px] text-ink-4 sm:block">
            Any Admin can restart it · resumes at the next nightly run
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
