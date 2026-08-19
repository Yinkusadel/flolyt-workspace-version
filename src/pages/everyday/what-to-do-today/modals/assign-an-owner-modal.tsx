import * as React from "react";
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
import { PersonDot } from "@/pages/everyday/rooms/actor";
import { cn } from "@/lib/utils";
import type { OwnerCandidate } from "@/pages/everyday/what-to-do-today/data";

/** T07 — opened from a "no owner" row's Assign action (currently wired only for the Ghana signup room). */
export function AssignAnOwnerModal({
  open,
  onOpenChange,
  roomTitle,
  roomMeta,
  candidates,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roomTitle: string;
  roomMeta: string;
  candidates: OwnerCandidate[];
}) {
  const [selectedId, setSelectedId] = React.useState(
    candidates.find((c) => c.recommended)?.person.initials ?? candidates[0]?.person.initials
  );
  const selected = candidates.find((c) => c.person.initials === selectedId) ?? candidates[0];

  const confirm = () => {
    onOpenChange(false);
    toast.success(`${selected.person.name.split(" ")[0]} assigned`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Assign an owner</DialogTitle>
          <DialogDescription>A room with no owner is the state that costs the most</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">The room</p>
            <div className="mt-1.5 rounded-panel border border-amber-border bg-amber-bg px-3.5 py-3">
              <p className="text-[12.5px] font-semibold text-ink">{roomTitle}</p>
              <p className="mt-1 font-mono text-[9.5px] font-semibold text-amber">{roomMeta}</p>
            </div>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">Who should own it</p>
            <div className="mt-1.5 space-y-2">
              {candidates.map((candidate) => {
                const isSelected = candidate.person.initials === selectedId;
                return (
                  <button
                    key={candidate.person.initials}
                    type="button"
                    onClick={() => setSelectedId(candidate.person.initials)}
                    className={cn(
                      "flex w-full items-center justify-between gap-3 rounded-panel border px-3.5 py-3 text-left",
                      isSelected ? "border-ultra-border bg-ultra-bg" : "border-line bg-paper"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <PersonDot person={candidate.person} />
                      <div>
                        <p className="text-[11.5px] font-semibold text-ink">{candidate.person.name}</p>
                        <p className="mt-0.5 text-[9.5px] text-ink-4">
                          {candidate.reason} · {candidate.roomCount} rooms
                        </p>
                      </div>
                    </div>
                    <span
                      className={cn(
                        "size-3 shrink-0 rounded-full border",
                        isSelected ? "border-ultra bg-ultra" : "border-line bg-paper"
                      )}
                      aria-hidden
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <Callout tone="teal" title="What the owner is taking on">
            Not the work — the decision. The room keeps running either way. An owner is the person who says yes or
            no when a play needs a human, and whose name is on it in the handoff chain. {selected.person.name.split(" ")[0]} is told
            immediately, with the reason and your name.
          </Callout>
        </DialogBody>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" onClick={confirm}>
              Assign {selected.person.name.split(" ")[0]}
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
