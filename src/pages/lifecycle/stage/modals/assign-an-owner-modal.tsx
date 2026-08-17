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
import { PersonAvatar } from "@/components/person-avatar";
import { cn } from "@/lib/utils";

export type AssignOwnerCandidate = {
  id: string;
  initials: string;
  color: string;
  name: string;
  reason: string;
  selected?: boolean;
};

export type AssignOwnerPreset = {
  description: string;
  unownedTitle: string;
  statsLine: string;
  candidatesEyebrow: string;
  candidates: AssignOwnerCandidate[];
  consequencesEyebrow: string;
  consequences: { label: string; value: string; tone: "amber" | "teal" }[];
  closingTitle: string;
  closingBody: string;
  confirmLabel: string;
};

const CONSEQUENCE_TONE_CLASS: Record<"amber" | "teal", string> = { amber: "text-amber", teal: "text-teal" };

/** AV12 — Advocate's "assign an owner" modal, opened from the Definition, Overview and Agents header CTA. */
export function AssignAnOwnerModal({
  preset,
  open,
  onOpenChange,
}: {
  preset: AssignOwnerPreset;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const confirm = () => {
    onOpenChange(false);
    toast.success("Owner assigned");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Assign an owner</DialogTitle>
          <DialogDescription>{preset.description}</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div className="rounded-panel border border-amber-border bg-amber-bg px-3.5 py-3">
            <p className="text-[12.5px] font-semibold text-ink">{preset.unownedTitle}</p>
            <p className="mt-1 font-mono text-[9.5px] font-semibold text-amber">{preset.statsLine}</p>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">{preset.candidatesEyebrow}</p>
            <div className="mt-1.5 space-y-2">
              {preset.candidates.map((candidate) => (
                <div
                  key={candidate.id}
                  className={cn(
                    "flex items-center justify-between gap-3 rounded-panel border px-3.5 py-3",
                    candidate.selected ? "border-ultra-border bg-ultra-bg" : "border-line bg-paper"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <PersonAvatar kind="human" initials={candidate.initials} size="default" style={{ backgroundColor: candidate.color }} />
                    <div>
                      <p className="text-[11.5px] font-semibold text-ink">{candidate.name}</p>
                      <p className="mt-0.5 text-[9.5px] text-ink-4">{candidate.reason}</p>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "size-3 shrink-0 rounded-full border",
                      candidate.selected ? "border-ultra bg-ultra" : "border-line bg-paper"
                    )}
                    aria-hidden
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">{preset.consequencesEyebrow}</p>
            <div className="mt-1.5 divide-y divide-line overflow-hidden rounded-panel border border-line bg-paper-2">
              {preset.consequences.map((row) => (
                <div key={row.label} className="flex flex-col gap-1 px-3.5 py-2.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                  <span className="text-[10.5px] text-ink-2">{row.label}</span>
                  <span className={cn("font-mono text-[10px] font-semibold", CONSEQUENCE_TONE_CLASS[row.tone])}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-card border border-teal-border bg-teal-bg pl-4">
            <span className="absolute inset-y-0 left-0 w-[3px] bg-teal" aria-hidden />
            <div className="p-3.5 pl-1">
              <p className="text-[12px] font-semibold text-ink">{preset.closingTitle}</p>
              <p className="mt-1.5 text-[10.5px] leading-relaxed text-ink-2">{preset.closingBody}</p>
            </div>
          </div>
        </DialogBody>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" onClick={confirm}>
              {preset.confirmLabel}
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
