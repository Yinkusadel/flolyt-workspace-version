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
import { cn } from "@/lib/utils";

export type SendReasonUpstreamPreset = {
  description: string;
  findingTitle: string;
  findingMeta: string;
  sendToEyebrow: string;
  recipients: { id: string; color: string; name: string; reason: string; selected?: boolean }[];
  arrivesEyebrow: string;
  arrivesRows: { label: string; value: string; tone?: "teal" }[];
  closingTitle: string;
  closingBody: string;
  confirmLabel: string;
};

const ARRIVES_VALUE_TONE_CLASS: Record<"teal" | "neutral", string> = { teal: "text-teal", neutral: "text-ink-2" };

/**
 * CH12 — Churn's "send the reason upstream" modal, opened from a reason row
 * on the Reasons tab. Churn-only per the rebuild plan: the primary control
 * on the reasons screen sends a finding to the stage that can act on it,
 * rather than starting a campaign, since nothing can be fixed in Churn
 * itself. Only the "Never activated" row has full modal content, per CH12.
 */
export function SendReasonUpstreamModal({
  preset,
  open,
  onOpenChange,
}: {
  preset: SendReasonUpstreamPreset;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const confirm = () => {
    onOpenChange(false);
    toast.success("Finding sent upstream");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Send this upstream</DialogTitle>
          <DialogDescription>{preset.description}</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">The finding</p>
            <div className="mt-1.5 rounded-panel border border-line bg-paper-2 px-3.5 py-3">
              <p className="text-[12.5px] font-semibold text-ink">{preset.findingTitle}</p>
              <p className="mt-1 font-mono text-[9.5px] text-ink-4">{preset.findingMeta}</p>
            </div>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">{preset.sendToEyebrow}</p>
            <div className="mt-1.5 space-y-2">
              {preset.recipients.map((recipient) => (
                <div
                  key={recipient.id}
                  className={cn(
                    "flex items-start gap-3 rounded-panel border px-3.5 py-3",
                    recipient.selected ? "border-ultra-border bg-ultra-bg" : "border-line bg-paper"
                  )}
                >
                  <span
                    className="mt-0.5 size-3 shrink-0 rounded-full border"
                    style={{
                      backgroundColor: recipient.selected ? recipient.color : "transparent",
                      borderColor: recipient.color,
                    }}
                    aria-hidden
                  />
                  <div>
                    <p className="text-[11.5px] font-semibold text-ink">{recipient.name}</p>
                    <p className="mt-0.5 text-[9.5px] text-ink-4">{recipient.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">{preset.arrivesEyebrow}</p>
            <div className="mt-1.5 divide-y divide-line overflow-hidden rounded-panel border border-line bg-paper-2">
              {preset.arrivesRows.map((row) => (
                <div key={row.label} className="flex flex-col gap-1 px-3.5 py-2.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                  <span className="text-[10.5px] text-ink-2">{row.label}</span>
                  <span className={cn("font-mono text-[10px]", ARRIVES_VALUE_TONE_CLASS[row.tone ?? "neutral"])}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-card border border-ultra-border bg-ultra-bg">
            <div className="p-3.5">
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
