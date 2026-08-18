import * as React from "react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
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
import { ActorAvatar } from "@/pages/rooms/actor";
import { SADE, SAM, SAMUEL } from "@/pages/rooms/data";
import type { PersonRef } from "@/pages/rooms/types";

const RESULTS: { person: PersonRef; note: string; matched?: boolean }[] = [
  { person: SAM, note: "Shipped the 4 March release · named in the evidence", matched: true },
  { person: SADE, note: "On Sam's team · no connection to this room" },
  { person: SAMUEL, note: "Nigeria billing · no connection to this room" },
];

/** R29 — Invite people to a room (modal on `/rooms/:id/people`). */
export function InvitePeopleModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [query, setQuery] = React.useState("sam");

  const confirm = () => {
    onOpenChange(false);
    toast.success(`Added ${RESULTS[0].person.name.split(" ")[0]}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Add someone to this room</DialogTitle>
          <DialogDescription>Adding is not the only option, and it is the widest one</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <input
            value={query}
            onChange={(e) => setQuery(e.currentTarget.value)}
            className="w-full rounded-control border border-line bg-paper px-3.5 py-2.5 text-[12px] font-semibold text-ink outline-none focus:border-ultra-border"
          />

          <div className="space-y-1.5">
            {RESULTS.map((row) => (
              <div
                key={row.person.initials + row.person.name}
                className={cn(
                  "flex items-center gap-3 rounded-panel border px-3.5 py-2.5",
                  row.matched ? "border-ultra-border bg-ultra-bg" : "border-line bg-paper"
                )}
              >
                <ActorAvatar actor={{ kind: "human", person: row.person }} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-semibold text-ink">{row.person.name}</p>
                  <p className="text-[10.5px] text-ink-3">{row.note}</p>
                </div>
                <span className="shrink-0 rounded-chip border border-ultra-border bg-ultra-bg px-2 py-0.5 text-[10px] font-semibold text-ultra">
                  Add
                </span>
              </div>
            ))}
          </div>

          <div className="rounded-card border border-amber-border bg-amber-bg p-3.5">
            <p className="text-[11.5px] font-semibold text-ink">Everyone in a room sees everything in it</p>
            <p className="mt-1 text-[10px] leading-relaxed text-ink-2">
              They would see the evidence, the decision doc, the plays and the full customer cohort. There is no
              partial membership — if they should see the finding but not the customers, send a handoff instead.
            </p>
          </div>

          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">
              Instead of adding them, you could
            </p>
            <div className="mt-1.5 divide-y divide-line rounded-panel border border-line">
              {[
                { label: "Send a handoff", value: "an owned, dated obligation · they see the ask, not the room" },
                { label: "Share a view", value: "read-only, no customer data, expires in 7 days" },
                { label: "@-mention them", value: "adds them to this room · same as adding", warn: true },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between px-3.5 py-2.5 text-[11.5px]">
                  <span className="text-ink-2">{row.label}</span>
                  <span className={row.warn ? "text-amber" : "text-ink-3"}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </DialogBody>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" onClick={confirm}>
              Add {RESULTS[0].person.name.split(" ")[0]}
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
