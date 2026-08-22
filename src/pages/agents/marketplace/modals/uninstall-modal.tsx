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
import { MK09_PRESET, MK_TONE_CLASS } from "@/pages/agents/marketplace/data";

const TONE_BORDER_CLASS = {
  ok: "border-l-teal",
  warn: "border-l-amber",
  risk: "border-l-rose",
  ai: "border-l-ultra",
  muted: "border-l-ink-4",
  neutral: "border-l-ink-4",
  num: "border-l-ink-4",
} as const;

/** MK09 — "Uninstall one", hardcoded to Subscription cohorting, opened from its row on /marketplace/installed. */
export function UninstallModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const preset = MK09_PRESET;

  const confirm = () => {
    onOpenChange(false);
    toast.success("Subscription cohorting uninstalled");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Uninstall this agent</DialogTitle>
          <DialogDescription>The publisher learns a count and, if you send it, a precondition</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div className="rounded-panel border border-line bg-paper-2 px-3.5 py-3">
            <p className="text-[12px] font-semibold text-ink">{preset.title}</p>
            <p className="mt-1 font-mono text-[9.5px] text-ink-4">{preset.meta}</p>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">Why · typed, and it is the only thing the publisher sees</p>
            <div className="mt-1.5 rounded-panel border border-line bg-white p-3.5">
              <p className="text-[10.5px] leading-relaxed text-ink-2">{preset.reason}</p>
            </div>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">What the publisher receives</p>
            <div className="mt-1.5 space-y-2">
              {preset.publisherSees.map((item) => (
                <div key={item.label} className={`rounded-panel border border-l-[3px] border-line bg-paper px-3.5 py-2.5 ${TONE_BORDER_CLASS[item.tone]}`}>
                  <p className="text-[11px] font-semibold text-ink">{item.label}</p>
                  <p className={`mt-0.5 text-[9.5px] ${MK_TONE_CLASS[item.tone]}`}>{item.sub}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-card border border-ultra-border bg-ultra-bg p-3.5">
            <p className="text-[12px] font-semibold text-ink">The most useful thing you can tell a publisher is a precondition they did not state</p>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-ink-2">
              "It assumes plan terms vary" is a fact about the agent and travels safely. "It did not work for us" is
              a result about your customers and does not. Fifty-one companies see the same listing tomorrow, and
              the honest version of this feedback makes it better for the next one.
            </p>
          </div>
        </DialogBody>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" variant="destructive" onClick={confirm}>
              Uninstall it
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
