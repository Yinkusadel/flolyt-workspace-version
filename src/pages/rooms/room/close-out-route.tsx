import * as React from "react";
import { useNavigate } from "react-router-dom";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { StageSubpageHeader } from "@/pages/lifecycle/stage/stage-subpage-header";
import { useRoomContext } from "@/pages/rooms/room/room-layout";
import { TONE_TEXT_CLASS } from "@/pages/rooms/tone";
import type { RoomOutcome } from "@/pages/rooms/types";

const OUTCOMES: { value: RoomOutcome; label: string; sub: string }[] = [
  { value: "money_recovered", label: "Money recovered", sub: "Measured against the held-back group" },
  { value: "no_action_needed", label: "No action needed", sub: "The reading was real, the cost of acting was higher" },
  { value: "superseded", label: "Superseded", sub: "Another room took this over" },
  { value: "disproven", label: "Disproven", sub: "The evidence stopped supporting it" },
  { value: "unmeasurable", label: "Unmeasurable", sub: "It ended, and no honest number can be attached" },
];

/** R34 — Room · close-out (`/rooms/:id/close`). */
export const CloseOutRoute = () => {
  const { room } = useRoomContext();
  const navigate = useNavigate();
  const [outcome, setOutcome] = React.useState<RoomOutcome>("money_recovered");
  const form = room.closeForm;

  const close = () => {
    navigate(`/rooms/${room.id}`);
  };

  return (
    <div className="space-y-6">
      <StageSubpageHeader
        crumbs={[{ label: "Rooms", to: "/rooms" }, { label: room.title, to: `/rooms/${room.id}` }, { label: "Close" }]}
        title="Close this room"
        subtitle="₦318M recovered against a holdout · the day-one prediction is checked automatically"
        action={<Button onClick={close}>Close the room</Button>}
      />

      {form && (
        <div className="rounded-card border-2 border-teal-border bg-teal-bg p-4">
          <p className="text-[12.5px] font-semibold text-ink">{form.summary}</p>
          <p className="mt-1 text-[10.5px] leading-relaxed text-ink-2">
            Closing writes one line into the value ledger, one learning into business memory, and checks the
            dissent and the prediction you made on day one.
          </p>
        </div>
      )}

      <div>
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">How did this end?</p>
        <div className="mt-2 space-y-2">
          {OUTCOMES.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setOutcome(opt.value)}
              className={cn(
                "flex w-full items-center gap-3 rounded-panel border px-4 py-3 text-left",
                outcome === opt.value ? "border-ultra-border bg-ultra-bg" : "border-line bg-paper"
              )}
            >
              <span
                className={cn(
                  "flex size-4 shrink-0 items-center justify-center rounded-full border",
                  outcome === opt.value ? "border-ultra bg-ultra" : "border-line"
                )}
              >
                {outcome === opt.value && <span className="size-1.5 rounded-full bg-white" />}
              </span>
              <span>
                <span className="block text-[12.5px] font-semibold text-ink">{opt.label}</span>
                <span className="block text-[10.5px] text-ink-3">{opt.sub}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {form && (
        <>
          <div>
            <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
              The number, and how you got it
            </p>
            <div className="mt-2 divide-y divide-line rounded-card border border-line bg-paper">
              {form.ledger.map((row) => (
                <div key={row.label} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-[12px]">
                  <span className="text-ink-2">{row.label}</span>
                  <span className={cn("font-mono font-semibold", row.tone === "ink" ? "text-ink" : TONE_TEXT_CLASS[row.tone])}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-card border border-teal-border bg-teal-bg p-4">
            <div>
              <p className="text-[12px] font-semibold text-ink">{form.closingTitle}</p>
              <p className="mt-1 text-[10.5px] leading-relaxed text-ink-2">{form.closingBody}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
