import { useState } from "react";
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
import { Callout } from "@/components/ui/rail";
import { DEPARTMENT_COLORS, type Department } from "@/lib/lifecycle-data";

/** A colored dot + label used for obligation "goes to" team identity — reuses the same department palette as human avatars. */
function TeamDot({ team }: { team: Department }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="size-1.5 shrink-0 rounded-full" style={{ backgroundColor: DEPARTMENT_COLORS[team] }} aria-hidden />
      <span className="text-ink-2">{team}</span>
    </span>
  );
}

const DECISION_DRAFTED_OBLIGATIONS = [
  { id: "instrument-fee-shown", title: "Instrument checkout.fee_shown", team: "Engineering" as const, due: "14 Aug" },
  { id: "fee-at-basket", title: "Show the fee at basket, not checkout", team: "Product" as const, due: "7 Aug" },
  { id: "renewal-reforecast", title: "Re-forecast the August renewal book", team: "Customer Success" as const, due: "9 Aug" },
  { id: "hold-releases", title: "Hold every release against revenue 14 days", team: "Engineering" as const, due: "in effect" },
];

/**
 * Creates handoffs from a decision (opened from a room's Decision tab). Self-contained here (not
 * shared with the archived Handoff section under src/oldpages) so Rooms keeps working standalone.
 */
export function CreateFromDecisionModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [checked, setChecked] = useState<Set<string>>(new Set(DECISION_DRAFTED_OBLIGATIONS.map((o) => o.id)));

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const create = () => {
    onOpenChange(false);
    toast.success(checked.size > 0 ? `Created ${checked.size} obligation${checked.size === 1 ? "" : "s"}` : "No obligations created");
  };

  const skip = () => {
    onOpenChange(false);
    toast.info("Skipped · nobody obliged");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>This decision obliges other teams</DialogTitle>
          <DialogDescription>Drafted from the decision doc · edit or remove any</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div className="rounded-panel border border-ultra-border bg-ultra-bg px-3.5 py-2.5">
            <p className="text-[12px] font-semibold text-ink">This decision obliges four other teams</p>
            <p className="mt-1 text-[10.5px] text-ink-3">
              Repeat &amp; Decay drafted them from the decision doc · edit or remove any
            </p>
          </div>

          <div className="space-y-1.5">
            {DECISION_DRAFTED_OBLIGATIONS.map((o) => (
              <label
                key={o.id}
                className="flex cursor-pointer items-center gap-3 rounded-panel border border-line bg-paper px-3.5 py-2.5"
              >
                <input
                  type="checkbox"
                  checked={checked.has(o.id)}
                  onChange={() => toggle(o.id)}
                  className="size-3.5 shrink-0 accent-ultra"
                />
                <TeamDot team={o.team} />
                <span className="min-w-0 flex-1 text-[12px] font-semibold text-ink">{o.title}</span>
                <span className="shrink-0 font-mono text-[10px] text-ink-4">{o.due}</span>
              </label>
            ))}
          </div>

          <div className="rounded-card border border-amber-border bg-amber-bg p-3.5">
            <p className="text-[11.5px] font-semibold text-ink">The fourth is a process change, not a task</p>
            <p className="mt-1 text-[10.5px] leading-relaxed text-amber">
              It will very likely be disputed by Engineering, and it should be — it needs Ada.
            </p>
          </div>

          <Callout tone="teal" title="Nothing is created without a name and a date on it">
            Each of these goes to a named person who must accept, dispute, re-date or pass it on. None of them can
            be read and quietly ignored — which is the one behaviour this whole section exists to prevent.
          </Callout>
        </DialogBody>

        <DialogFooter>
          <div className="flex w-full items-center justify-between gap-4">
            <button type="button" onClick={skip} className="text-[12px] font-semibold text-ink-3 hover:text-ink">
              Skip · oblige nobody
            </button>
            <Button type="button" onClick={create} disabled={checked.size === 0} className={cn(checked.size === 0 && "opacity-50")}>
              Create {checked.size || ""} obligation{checked.size === 1 ? "" : "s"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
