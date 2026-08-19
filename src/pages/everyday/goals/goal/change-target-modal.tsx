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
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import type { GoalDetail } from "@/pages/everyday/goals/types";

const WHAT_THIS_DOES = [
  { label: "Keeps the old target", consequence: "36.4% stays on the history, struck through", tone: "text-amber" },
  { label: "Keeps every credited contribution", consequence: "measured against the number in force at the time", tone: "text-teal" },
  { label: "Writes to the audit log", consequence: "old value, new value, reason, your name, the date", tone: "text-ink-3" },
  { label: "Tells everyone on the cascade", consequence: "four team goals sit under this one", tone: "text-amber" },
];

/** G12 — "change the target" modal, opened from a goal's own detail page. */
export function ChangeTargetModal({
  goal,
  open,
  onOpenChange,
}: {
  goal: GoalDetail;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const confirm = () => {
    onOpenChange(false);
    toast.success("Target changed");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Change the target</DialogTitle>
          <DialogDescription>
            {goal.metric} · owner {goal.owner.name}
          </DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">Metric</p>
            <div className="mt-1.5 rounded-panel border border-line bg-paper-2 px-3.5 py-2.5">
              <p className="text-[12px] font-semibold text-ink">{goal.metric}</p>
              <p className="mt-0.5 text-[9px] text-ink-4">orders feed · cannot change mid-quarter</p>
            </div>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">Baseline</p>
            <div className="mt-1.5 rounded-panel border border-line bg-paper-2 px-3.5 py-2.5">
              <p className="text-[12px] font-semibold text-ink">
                {goal.baseline} · {goal.baselineLockedDate}
              </p>
              <p className="mt-0.5 text-[9px] text-ink-4">changing it would rewrite every credited contribution</p>
            </div>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">Target</p>
            <div className="mt-1.5 flex items-center rounded-control border-2 border-ultra-border bg-paper px-3.5 py-2.5">
              <input
                defaultValue="32.0%"
                className="min-w-0 flex-1 bg-transparent text-[13px] font-semibold text-ink outline-none"
              />
              <span className="shrink-0 text-[10.5px] text-ink-4">was {goal.target}</span>
            </div>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">
              Why it is changing
            </p>
            <textarea
              defaultValue="The fee fix shipped 14 August, six weeks later than this target assumed. Ada and Ifeoma agreed a revised target on 12 August."
              rows={3}
              className="mt-1.5 w-full resize-none rounded-panel border border-line bg-paper px-3.5 py-2.5 text-[11.5px] text-ink outline-none focus:border-ultra-border"
            />
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">
              What this change does
            </p>
            <dl className="mt-1.5 divide-y divide-line rounded-card border border-line bg-paper">
              {WHAT_THIS_DOES.map((row) => (
                <div key={row.label} className="flex flex-col gap-1 px-3.5 py-2.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                  <dt className="shrink-0 text-[11px] text-ink-3">{row.label}</dt>
                  <dd className={`text-[10.5px] sm:text-right ${row.tone}`}>{row.consequence}</dd>
                </div>
              ))}
            </dl>
          </div>

          <Callout tone="amber" title="Lowering a target is allowed. Doing it quietly is not.">
            This is the one action in Goals that changes how the quarter will be judged, so it is the one that
            leaves the most trace.
          </Callout>
        </DialogBody>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" onClick={confirm}>
              Change the target
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
