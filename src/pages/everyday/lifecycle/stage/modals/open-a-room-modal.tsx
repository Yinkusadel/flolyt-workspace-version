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

export type OpenRoomPreset = {
  condition: string;
  carriedIn: { label: string; value: string }[];
  countedSummary: string;
  countedNote: string;
  participants: { initials: string; kind: "human" | "agent"; color?: string }[];
  participantsNote: string;
};

/** A13 — "open a war room" modal, prefilled from wherever it's triggered (a leak row, a history row, the header button). */
export function OpenARoomModal({
  preset,
  open,
  onOpenChange,
}: {
  preset: OpenRoomPreset;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const navigate = useNavigate();

  const confirm = () => {
    onOpenChange(false);
    toast.success("Room opened");
    navigate("/rooms");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Open a war room</DialogTitle>
          <DialogDescription>Everything below was carried in from the stage — change any of it</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">
              The condition
            </p>
            <div className="mt-1.5 rounded-panel border border-line bg-paper px-3.5 py-2.5">
              <p className="text-[12px] font-semibold text-ink">{preset.condition}</p>
            </div>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">
              Who is in it · carried in from the stage
            </p>
            <div className="mt-1.5 divide-y divide-line overflow-hidden rounded-panel border border-line bg-paper-2">
              {preset.carriedIn.map((row) => (
                <div key={row.label} className="flex items-baseline justify-between gap-3 px-3.5 py-2">
                  <span className="text-[10px] text-ink-3">{row.label}</span>
                  <span className="font-mono text-[10px] font-semibold text-ink">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-panel border border-ultra-border bg-ultra-bg px-3.5 py-2.5">
            <p className="text-[12.5px] font-semibold text-ultra">{preset.countedSummary}</p>
            <p className="mt-1 font-mono text-[9.5px] text-ink-3">{preset.countedNote}</p>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">
              Who is in the room
            </p>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex -space-x-1.5">
                {preset.participants.map((p, i) => (
                  <PersonAvatar
                    key={`${p.initials}-${i}`}
                    kind={p.kind}
                    initials={p.initials}
                    size="default"
                    style={p.color ? { backgroundColor: p.color } : undefined}
                  />
                ))}
              </div>
              <p className="text-[9.5px] text-ink-3">{preset.participantsNote}</p>
            </div>
          </div>
        </DialogBody>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" onClick={confirm}>
              Open the room
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
