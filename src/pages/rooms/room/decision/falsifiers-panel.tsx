import * as React from "react";

import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { cn } from "@/lib/utils";
import useCreateFalsifier from "@/features/rooms/use-create-falsifier";
import useMarkFalsifierMet from "@/features/rooms/use-mark-falsifier-met";
import type { RoomDecisionFalsifierDto } from "@/services/api/rooms/get-room-decision";
import { formatDayTime } from "@/pages/rooms/convening/format";
import { CollapsiblePanel } from "@/pages/rooms/room/decision/collapsible-panel";

const INPUT =
  "mt-1.5 h-9 w-full rounded-control border border-line bg-paper px-3 text-[12px] text-ink outline-none placeholder:text-ink-4 focus:border-ultra disabled:opacity-60";

function Falsifier({ roomId, index, falsifier }: { roomId: string; index: number; falsifier: RoomDecisionFalsifierDto }) {
  const { markFalsifierMet, isPending } = useMarkFalsifierMet();
  const met = falsifier.metAtUtc !== null;

  return (
    <li className={cn("px-5 py-4", met && "bg-amber-bg/40")}>
      <p className="text-[13px] leading-relaxed text-ink">
        <span className="font-semibold">If</span> {falsifier.condition},
      </p>
      <p className="mt-1 text-[13px] leading-relaxed text-ink-2">
        <span className="font-semibold text-ink">then</span> {falsifier.thenWhat}
      </p>
      <div className="mt-2.5">
        {met ? (
          <Chip tone="amber">Met {formatDayTime(falsifier.metAtUtc!)}</Chip>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isPending}
            onClick={() => markFalsifierMet({ roomId, index })}
          >
            {isPending ? "Saving…" : "Mark as met"}
          </Button>
        )}
      </div>
    </li>
  );
}

/** Conditions named in advance (Room · Decision & dissent.png, "What would change this"). */
export function FalsifiersPanel({ roomId, falsifiers }: { roomId: string; falsifiers: RoomDecisionFalsifierDto[] }) {
  const [condition, setCondition] = React.useState("");
  const [thenWhat, setThenWhat] = React.useState("");
  const { createFalsifier, isPending } = useCreateFalsifier({
    onSuccess: () => {
      setCondition("");
      setThenWhat("");
    },
  });

  const canAdd = condition.trim().length > 0 && thenWhat.trim().length > 0 && !isPending;

  return (
    <CollapsiblePanel
      title="What would change this"
      count={falsifiers.length}
      footer={
        <div className="space-y-3 px-5 py-4">
          <div>
            <label htmlFor="falsifier-condition" className="block text-[11px] font-semibold text-ink-2">
              If...
            </label>
            <input
              id="falsifier-condition"
              value={condition}
              disabled={isPending}
              onChange={(event) => setCondition(event.currentTarget.value)}
              placeholder="A condition someone can check"
              className={INPUT}
            />
          </div>
          <div>
            <label htmlFor="falsifier-then" className="block text-[11px] font-semibold text-ink-2">
              ...then
            </label>
            <input
              id="falsifier-then"
              value={thenWhat}
              disabled={isPending}
              onChange={(event) => setThenWhat(event.currentTarget.value)}
              placeholder="What the recommendation becomes"
              className={INPUT}
            />
          </div>
          <p className="text-[11.5px] text-ink-3">
            Both halves are required. A condition without a consequence is a caveat, not a test.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!canAdd}
            onClick={() => createFalsifier({ roomId, condition: condition.trim(), thenWhat: thenWhat.trim() })}
          >
            {isPending ? "Adding…" : "Add"}
          </Button>
        </div>
      }
    >
      {falsifiers.length === 0 ? (
        <p className="px-5 py-5 text-[12.5px] text-ink-3">
          Nothing named yet. Add a condition someone can check, and what the recommendation becomes if it comes true.
        </p>
      ) : (
        <ul className="divide-y divide-line">
          {falsifiers.map((falsifier, index) => (
            <Falsifier key={`${index}-${falsifier.addedAtUtc}`} roomId={roomId} index={index} falsifier={falsifier} />
          ))}
        </ul>
      )}
    </CollapsiblePanel>
  );
}
