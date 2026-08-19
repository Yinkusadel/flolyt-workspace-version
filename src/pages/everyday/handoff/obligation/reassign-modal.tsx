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
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { PersonDot } from "@/pages/everyday/rooms/actor";
import { JOY, PETER, RAVI } from "@/pages/everyday/handoff/data";
import type { PersonRef } from "@/pages/everyday/rooms/types";

const CANDIDATES: { person: PersonRef; note: string }[] = [
  { person: JOY, note: "Built the July forecast · lowest load on the team" },
  { person: RAVI, note: "Owns the number downstream · already has 9 items" },
  { person: PETER, note: "Knows the Kenya book · currently overloaded" },
];

/** H09 — Reassign an obligation (`modal · /handoff/:id/o/:oid`). Hardcoded to the section's one canonical demo obligation, "Re-forecast the August renewal book" — same single-instance pattern as every other modal in this app. */
export function ReassignModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [candidate, setCandidate] = useState<PersonRef>(JOY);

  const pass = () => {
    onOpenChange(false);
    toast.success(`Passed to ${candidate.name.split(" ")[0]}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Pass this on</DialogTitle>
          <DialogDescription>The original owner and date stay on the record</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div className="rounded-panel border border-rose-border bg-rose-bg px-3.5 py-2.5">
            <p className="text-[12px] font-semibold text-ink">Re-forecast the August renewal book</p>
            <p className="mt-1 text-[10.5px] text-rose">Four days overdue · ₦88M is being forecast on the old number</p>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">Pass it to</p>
            <div className="mt-1.5 space-y-1.5">
              {CANDIDATES.map(({ person, note }) => (
                <button
                  key={person.initials}
                  type="button"
                  onClick={() => setCandidate(person)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-panel border px-3.5 py-2.5 text-left",
                    candidate.initials === person.initials ? "border-ultra-border bg-ultra-bg" : "border-line bg-paper"
                  )}
                >
                  <PersonDot person={person} size="sm" />
                  <span className="min-w-0 flex-1">
                    <p className="text-[12px] font-semibold text-ink">{person.name}</p>
                    <p className="mt-0.5 text-[10px] text-ink-3">{note}</p>
                  </span>
                  <span
                    className={cn(
                      "size-3.5 shrink-0 rounded-full border-2",
                      candidate.initials === person.initials ? "border-ultra bg-ultra" : "border-line"
                    )}
                    aria-hidden
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">New date</p>
            <div className="mt-1.5 flex items-center justify-between rounded-panel border border-ultra-border bg-ultra-bg px-3.5 py-2.5">
              <span className="text-[12px] font-semibold text-ink">20 August</span>
              <span className="text-[10px] text-rose">was 9 August · 11 days late</span>
            </div>
          </div>

          <Callout tone="amber" title="The original date and the original owner both stay on the record">
            Kunle accepted this on 2 August and did not do it. Passing it to Joy does not erase that — the
            obligation keeps its full history, and the chain still shows eleven days lost. Reassigning fixes the
            future, not the past.
          </Callout>
        </DialogBody>

        <DialogFooter>
          <div className="flex w-full items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="text-[12px] font-semibold text-ink-3 hover:text-ink"
            >
              Cancel
            </button>
            <Button type="button" onClick={pass}>
              Pass to {candidate.name.split(" ")[0]}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
