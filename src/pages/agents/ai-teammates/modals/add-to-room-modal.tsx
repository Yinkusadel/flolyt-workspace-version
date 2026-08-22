import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AgentDot } from "@/pages/everyday/rooms/actor";
import { TM15_PRESET, TM_TONE_CLASS } from "@/pages/agents/ai-teammates/data";

const TONE_BORDER_CLASS = {
  ok: "border-l-teal",
  warn: "border-l-amber",
  risk: "border-l-rose",
  ai: "border-l-ultra",
  muted: "border-l-ink-4",
  neutral: "border-l-ink-4",
  num: "border-l-ink-4",
} as const;

/** TM15 — "Add one to a room", hardcoded to adding Support Signal to room 8f2c, opened from Coverage. */
export function AddToRoomModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const preset = TM15_PRESET;

  const confirm = () => {
    onOpenChange(false);
    toast.success(`${preset.agent.name} added to the room`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Add an agent to a room</DialogTitle>
          <DialogDescription>It reads, states and may disagree · it still cannot act</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div className="flex items-center gap-2.5 rounded-panel border border-line bg-paper-2 px-3.5 py-3">
            <AgentDot agent={preset.agent} />
            <div className="min-w-0">
              <p className="text-[12px] font-semibold text-ink">{preset.roomLabel}</p>
              <p className="mt-0.5 truncate font-mono text-[9.5px] text-ink-4">{preset.roomMeta}</p>
            </div>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">Why it is being added</p>
            <div className="mt-1.5 rounded-panel border border-line bg-white p-3.5">
              <p className="text-[10.5px] leading-relaxed text-ink-2">{preset.why}</p>
            </div>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">What it will do in this room</p>
            <div className="mt-1.5 space-y-2">
              {preset.willDo.map((item) => (
                <div key={item.label} className={`rounded-panel border border-l-[3px] border-line bg-paper px-3.5 py-2.5 ${TONE_BORDER_CLASS[item.tone]}`}>
                  <p className="text-[11px] font-semibold text-ink">{item.label}</p>
                  <p className={`mt-0.5 text-[9.5px] ${TM_TONE_CLASS[item.tone]}`}>{item.sub}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-card border border-amber-border bg-amber-bg p-3.5">
            <p className="text-[12px] font-semibold text-ink">A fourth agent in a room is not free and the cost is not the compute</p>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-ink-2">
              Three agents already produce more findings than four people are reading. Adding one that disagrees
              with the lead agent will raise a conflict the Orchestrator will name and hand to Ifeoma, who has
              fourteen rooms. That is worth doing here and is worth thinking about, which is why the room's agent
              count is on the header of every room screen.
            </p>
          </div>
        </DialogBody>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" onClick={confirm}>
              Add {preset.agent.name}
            </Button>
            <button type="button" onClick={() => onOpenChange(false)} className="text-[12px] font-semibold text-ink-3 hover:text-ink">
              Cancel
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
