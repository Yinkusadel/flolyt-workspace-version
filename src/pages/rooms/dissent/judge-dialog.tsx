import * as React from "react";

import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import useJudgeDissent from "@/features/rooms/use-judge-dissent";
import useWithdrawDissent from "@/features/rooms/use-withdraw-dissent";
import type { RoomAllDissentRowDto } from "@/services/api/rooms/get-all-dissent";

type Action = "borne-out" | "shown-wrong" | "withdraw";

const ACTIONS: Record<Action, { title: string; blurb: string; confirm: string; cta: string }> = {
  "borne-out": {
    title: "Borne out",
    blurb: "The result showed this objection was right.",
    confirm: "Record this objection as borne out?",
    cta: "Record as borne out",
  },
  "shown-wrong": {
    title: "Shown wrong",
    blurb: "The result showed this objection was wrong. It stays on the record.",
    confirm: "Record this objection as shown wrong?",
    cta: "Record as shown wrong",
  },
  withdraw: {
    title: "Withdraw",
    blurb: "Take your own objection back. The wording stays on the record, marked withdrawn.",
    confirm: "Withdraw this objection?",
    cta: "Withdraw objection",
  },
};

/**
 * One dialog per objection: pick Borne out, Shown wrong or (author only) Withdraw, then confirm.
 * Nothing is sent until the confirm step; a refusal from the backend shows as a toast and the
 * dialog stays open. The API says nothing about undoing either action, so the copy doesn't promise it.
 */
export function JudgeDialog({
  row,
  canWithdraw,
  open,
  onOpenChange,
}: {
  row: RoomAllDissentRowDto;
  canWithdraw: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [action, setAction] = React.useState<Action | null>(null);
  const close = () => onOpenChange(false);

  const judge = useJudgeDissent({ onSuccess: close });
  const withdraw = useWithdrawDissent({ onSuccess: close });
  const pending = judge.isPending || withdraw.isPending;

  const submit = () => {
    if (action === "borne-out") judge.judgeDissent({ dissentId: row.id, borneOut: true });
    else if (action === "shown-wrong") judge.judgeDissent({ dissentId: row.id, borneOut: false });
    else if (action === "withdraw") withdraw.withdrawDissent(row.id);
  };

  const options: Action[] = canWithdraw ? ["borne-out", "shown-wrong", "withdraw"] : ["borne-out", "shown-wrong"];

  return (
    <Dialog open={open} onOpenChange={(next) => !pending && onOpenChange(next)}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{action ? ACTIONS[action].confirm : "Judge this objection"}</DialogTitle>
          <DialogDescription>{row.roomTitle}</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <blockquote className="rounded-panel border border-line bg-paper-2 px-3.5 py-3 text-[12.5px] text-ink">
            “{row.wording}”
            <footer className="mt-1.5 text-[11.5px] text-ink-3">{row.byLabel}</footer>
          </blockquote>

          {action === null ? (
            <ul className="space-y-2">
              {options.map((key) => (
                <li key={key}>
                  <button
                    type="button"
                    onClick={() => setAction(key)}
                    className="w-full rounded-panel border border-line bg-paper px-3.5 py-3 text-left hover:border-ink-4 hover:bg-paper-2"
                  >
                    <p className="text-[12.5px] font-semibold text-ink">{ACTIONS[key].title}</p>
                    <p className="mt-0.5 text-[11.5px] text-ink-3">{ACTIONS[key].blurb}</p>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[12px] text-ink-2">{ACTIONS[action].blurb}</p>
          )}
        </DialogBody>

        <DialogFooter>
          <div className="flex items-center gap-4">
            {action !== null && (
              <Button type="button" onClick={submit} disabled={pending}>
                {pending ? "Saving…" : ACTIONS[action].cta}
              </Button>
            )}
            <button
              type="button"
              disabled={pending}
              onClick={() => (action === null ? close() : setAction(null))}
              className="text-[12px] font-semibold text-ink-3 hover:text-ink"
            >
              {action === null ? "Cancel" : "Back"}
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
