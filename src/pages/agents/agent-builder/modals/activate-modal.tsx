import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { PersonAvatar } from "@/components/person-avatar";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AB13_PRESET, AB_TONE_CLASS } from "@/pages/agents/agent-builder/data";

const TONE_BORDER_CLASS = {
  ok: "border-l-teal",
  warn: "border-l-amber",
  risk: "border-l-rose",
  ai: "border-l-ultra",
  muted: "border-l-ink-4",
  neutral: "border-l-ink-4",
  num: "border-l-ink-4",
} as const;

/** AB13 — "Activate a built agent", hardcoded to Release Watch, opened from the waiting-for-approval queue. */
export function ActivateModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const preset = AB13_PRESET;

  const confirm = () => {
    onOpenChange(false);
    toast.success("Release Watch activated");
  };

  const decline = () => {
    onOpenChange(false);
    toast.info("Declined, with a reason logged");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Activate this agent</DialogTitle>
          <DialogDescription>A re-authentication from somebody who did not build it</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div className="rounded-panel border border-line bg-paper-2 px-3.5 py-3">
            <p className="text-[12px] font-semibold text-ink">{preset.title}</p>
            <p className="mt-1 font-mono text-[9.5px] text-ink-4">{preset.meta}</p>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">What you are approving</p>
            <div className="mt-1.5 space-y-2">
              {preset.approving.map((item) => (
                <div key={item.label} className={`rounded-panel border border-l-[3px] border-line bg-paper px-3.5 py-2.5 ${TONE_BORDER_CLASS[item.tone]}`}>
                  <p className="text-[11px] font-semibold text-ink">{item.label}</p>
                  <p className={`mt-0.5 text-[9.5px] ${AB_TONE_CLASS[item.tone]}`}>{item.sub}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-card border border-amber-border bg-amber-bg p-3.5">
            <p className="text-[12px] font-semibold text-ink">{preset.warnTitle}</p>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-amber">{preset.warnBody}</p>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">Re-authenticate to activate</p>
            <div className="mt-1.5 flex items-center justify-between rounded-panel border border-line2 bg-white px-3.5 py-3">
              <span className="flex items-center gap-2.5">
                <PersonAvatar kind="human" initials="AD" team={3} />
                <span>
                  <span className="block text-[11.5px] font-semibold text-ink">{preset.approverName}</span>
                  <span className="block text-[9.5px] text-ink-4">{preset.approverNote}</span>
                </span>
              </span>
              <Button type="button" size="sm" variant="outline" onClick={() => toast.info("Re-authenticated")}>
                Re-authenticate
              </Button>
            </div>
          </div>

          <div className="rounded-card border border-line bg-paper-2 p-3.5">
            <p className="text-[12px] font-semibold text-ink">Activating is harder than pausing on purpose</p>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-ink-2">{preset.footnote}</p>
          </div>
        </DialogBody>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" onClick={confirm}>
              Activate it
            </Button>
            <button type="button" onClick={decline} className="text-[12px] font-semibold text-ink-3 hover:text-ink">
              Decline with a reason
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
