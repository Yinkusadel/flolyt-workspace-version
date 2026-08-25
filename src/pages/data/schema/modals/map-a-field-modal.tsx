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
import { SM10_COMMITS, SM_TONE_CLASS } from "@/pages/data/schema/data";

const TONE_BAR_CLASS = {
  ok: "bg-teal",
  warn: "bg-amber",
  risk: "bg-rose",
  ai: "bg-ultra",
  muted: "bg-ink-4",
  neutral: "bg-ink-3",
  num: "bg-ink-3",
} as const;

/** SM10 — "Map a field", hardcoded to `orders.line_count`, triggered from a header button on the empty/first/Fields states. */
export function MapAFieldModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const confirm = () => {
    onOpenChange(false);
    toast.success("Mapped · `orders.line_count`");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Map this field</DialogTitle>
          <DialogDescription>A meaning is required · a column name is not a definition</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div className="rounded-panel border border-line bg-paper-2 px-3.5 py-3">
            <p className="font-mono text-[12px] font-semibold text-ink">Map `orders.line_count`</p>
            <p className="mt-1 font-mono text-[9.5px] text-ink-4">
              integer · 1.24M rows · 0.0% empty · available since December
            </p>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">What it means here · required</p>
            <div className="mt-1.5 rounded-panel border border-line2 bg-white p-3.5">
              <p className="text-[10.5px] leading-relaxed text-ink-2">
                Number of distinct products in the order. Not units — two of the same item counts as one line.
              </p>
            </div>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">What this commits to</p>
            <div className="mt-1.5 space-y-2">
              {SM10_COMMITS.map((item) => (
                <div key={item.label} className="relative overflow-hidden rounded-panel border border-line bg-paper py-2.5 pr-3.5 pl-4">
                  <span className={cn("absolute inset-y-0 left-0 w-[3px]", TONE_BAR_CLASS[item.tone])} aria-hidden />
                  <p className="text-[11px] font-semibold text-ink">{item.label}</p>
                  <p className={cn("mt-0.5 text-[9.5px]", SM_TONE_CLASS[item.tone])}>{item.sub}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[10.5px] leading-relaxed text-ink-3">
            A field cannot be mapped without a sentence saying what it means. The form will not accept an empty
            meaning, because the alternative is ninety-four column names and two teams computing different numbers
            from the same one. Writing it takes a minute and settles an argument that otherwise happens in October
            in front of a board.
          </p>
        </DialogBody>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" onClick={confirm}>
              Map it
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
