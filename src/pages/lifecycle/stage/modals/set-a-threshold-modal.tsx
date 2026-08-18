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

export type ThresholdField = { label: string; value: string; note: string };

export type ThresholdPreset = {
  condition: ThresholdField;
  byMoreThan: ThresholdField;
  sustainedFor: ThresholdField;
  segmentedBy: ThresholdField;
  routesTo: { name: string; note?: string };
  simulation: { title: string; body: string };
};

function Field({ field }: { field: ThresholdField }) {
  return (
    <div>
      <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">{field.label}</p>
      <div className="mt-1.5 rounded-panel border border-line bg-paper px-3.5 py-2.5">
        <p className="text-[12px] font-semibold text-ink">{field.value}</p>
        <p className="mt-0.5 text-[9px] text-ink-4">{field.note}</p>
      </div>
    </div>
  );
}

/** A11 — "set a threshold" modal, shared by every stage's Agents tab. */
export function SetThresholdModal({
  stageName,
  preset,
  open,
  onOpenChange,
}: {
  stageName: string;
  preset: ThresholdPreset;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const confirm = () => {
    onOpenChange(false);
    toast.success("Threshold added");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>New threshold</DialogTitle>
          <DialogDescription>What should make an agent open a room in {stageName}</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <Field field={preset.condition} />
          <Field field={preset.byMoreThan} />
          <Field field={preset.sustainedFor} />
          <Field field={preset.segmentedBy} />

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">
              And opens a room for
            </p>
            <div className="mt-1.5 rounded-panel border border-amber-border bg-amber-bg px-3.5 py-2.5">
              <p className="text-[11.5px] font-semibold text-ink">{preset.routesTo.name}</p>
              {preset.routesTo.note && <p className="mt-0.5 text-[9px] text-amber">{preset.routesTo.note}</p>}
            </div>
          </div>

          <div className="rounded-card border border-ultra-border bg-ultra-bg">
            <div className="p-3.5">
              <p className="text-[12px] font-semibold text-ink">{preset.simulation.title}</p>
              <p className="mt-1.5 text-[10.5px] leading-relaxed text-ink-2">{preset.simulation.body}</p>
            </div>
          </div>
        </DialogBody>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" onClick={confirm}>
              Add the threshold
            </Button>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="text-[12px] font-semibold text-ink-3 hover:text-ink"
            >
              Cancel
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
