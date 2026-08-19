import { useNavigate } from "react-router-dom";
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
import { DEPARTMENT_COLORS } from "@/pages/everyday/lifecycle/data";
import { LK14_OPEN_ROOM_PRESET } from "@/pages/revenue/leakage-map/data";

/** LK14 — "Open a room from a line", hardcoded to the Adopt · feature depth reference row (the map's own "none" room). */
export function OpenARoomFromLineModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const navigate = useNavigate();
  const preset = LK14_OPEN_ROOM_PRESET;

  const confirm = () => {
    onOpenChange(false);
    toast.success("Room opened");
    navigate("/rooms");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Open a room from a line</DialogTitle>
          <DialogDescription>A room is about a cohort, not an account — and it needs a person before it can exist</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div className="rounded-panel border border-line bg-paper-2 px-3.5 py-3">
            <p className="text-[12px] font-semibold text-ink">{preset.subject}</p>
            <p className="mt-1 font-mono text-[9.5px] text-ink-4">{preset.subjectDetail}</p>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">The condition the room is about</p>
            <div className="mt-1.5 rounded-panel border border-line bg-white px-3.5 py-2.5">
              <p className="text-[11px] font-semibold text-ink">{preset.condition}</p>
            </div>
          </div>

          <div className="rounded-panel border border-amber-border bg-amber-bg px-3.5 py-2.5">
            <p className="text-[11.5px] font-semibold text-ink">A room is about a cohort, not an account</p>
            <p className="mt-1 text-[10.5px] font-semibold text-amber">{preset.cohortWarning}</p>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">Who decides · required, and it cannot be an agent</p>
            <div className="mt-1.5 space-y-2">
              {preset.candidates.map((candidate) => (
                <div
                  key={candidate.person.initials}
                  className={cn(
                    "flex items-center justify-between gap-3 rounded-panel border px-3.5 py-3",
                    candidate.selected ? "border-ultra-border bg-ultra-bg" : "border-line bg-paper"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <PersonAvatar
                      kind="human"
                      initials={candidate.person.initials}
                      style={{ backgroundColor: DEPARTMENT_COLORS[candidate.person.department] }}
                    />
                    <div>
                      <p className="text-[11.5px] font-semibold text-ink">{candidate.person.name}</p>
                      <p className="mt-0.5 text-[9.5px] text-ink-4">{candidate.reason}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[9px] text-ink-4">{candidate.load}</span>
                    <span
                      className={cn(
                        "size-3 shrink-0 rounded-full border",
                        candidate.selected ? "border-ultra bg-ultra" : "border-line bg-paper"
                      )}
                      aria-hidden
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-card border border-teal-border bg-teal-bg p-3.5">
            <p className="text-[12px] font-semibold text-ink">Opening this ends the 214 days and nothing else</p>
            <p className="mt-1.5 text-[10.5px] leading-relaxed text-ink-2">{preset.closingNote}</p>
          </div>
        </DialogBody>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" onClick={confirm}>
              Open the room
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
