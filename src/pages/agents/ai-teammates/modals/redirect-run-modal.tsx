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
import { TM14_PRESET, TM_TONE_CLASS } from "@/pages/agents/ai-teammates/data";

const TONE_BORDER_CLASS = {
  ok: "border-l-teal",
  warn: "border-l-amber",
  risk: "border-l-rose",
  ai: "border-l-ultra",
  muted: "border-l-ink-4",
  neutral: "border-l-ink-4",
  num: "border-l-ink-4",
} as const;

/** TM14 — "Redirect a run", hardcoded to Repeat & Decay's turn-4 run, opened from its row on /ai-teammates/runs. */
export function RedirectRunModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const preset = TM14_PRESET;

  const confirm = () => {
    onOpenChange(false);
    toast.success("Redirect queued · lands at the start of turn 5");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Redirect this run</DialogTitle>
          <DialogDescription>It lands at the next turn, and your words stay on the record</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div className="rounded-panel border border-line bg-paper-2 px-3.5 py-3">
            <p className="text-[12px] font-semibold text-ink">{preset.label}</p>
            <p className="mt-1 font-mono text-[9.5px] text-ink-4">{preset.meta}</p>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">What you are sending it</p>
            <div className="mt-1.5 rounded-panel border border-line bg-white p-3.5">
              <p className="text-[10.5px] leading-relaxed text-ink-2">{preset.instruction}</p>
            </div>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">What happens to it</p>
            <div className="mt-1.5 space-y-2">
              {preset.effects.map((effect) => (
                <div key={effect.label} className={`rounded-panel border border-l-[3px] border-line bg-paper px-3.5 py-2.5 ${TONE_BORDER_CLASS[effect.tone]}`}>
                  <p className="text-[11px] font-semibold text-ink">{effect.label}</p>
                  <p className={`mt-0.5 text-[9.5px] ${TM_TONE_CLASS[effect.tone]}`}>{effect.sub}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-card border border-ultra-border bg-ultra-bg p-3.5">
            <p className="text-[12px] font-semibold text-ink">Six people have redirected this agent and four of the redirects changed nothing</p>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-ink-2">
              That record is kept on the agent, not on the people. It is the only honest way to know whether an
              agent's conclusions survive correction — and the two that did change something are the reason anybody
              bothers reading its output closely.
            </p>
          </div>
        </DialogBody>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" onClick={confirm}>
              Queue the redirect
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
