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
import useSaveRoomDecision from "@/features/rooms/use-save-room-decision";
import type { RoomDecisionData } from "@/services/api/rooms/get-room-decision";

const FIELD_LABEL = "mb-1.5 block text-[11px] font-semibold text-ink-2";
const AREA =
  "w-full resize-y rounded-panel border border-line bg-paper-2 px-2.5 py-2 text-[12.5px] text-ink outline-none placeholder:text-ink-4 focus:border-ring disabled:opacity-60";

/**
 * POST /rooms/{roomId}/decision: writes a NEW revision (append-only). The summary must say what the
 * revision changed; the statement and guardrails are optional and an omitted one stays as it is, so
 * only the fields that actually differ from the current decision are sent.
 */
export function ReviseDialog({
  roomId,
  decision,
  hasDraft,
  open,
  onOpenChange,
}: {
  roomId: string;
  decision: RoomDecisionData;
  hasDraft: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [summary, setSummary] = React.useState("");
  const [statement, setStatement] = React.useState(decision.statement ?? "");
  const [guardrails, setGuardrails] = React.useState(decision.guardrails ?? "");

  const { saveRoomDecision, isPending } = useSaveRoomDecision({ onSuccess: () => onOpenChange(false) });

  const currentStatement = decision.statement ?? "";
  const currentGuardrails = decision.guardrails ?? "";
  const nextStatement = statement.trim();
  const nextGuardrails = guardrails.trim();

  // A first draft has to say what it decides; a revision only has to say what it changed.
  const canSave = summary.trim().length > 0 && (hasDraft || nextStatement.length > 0) && !isPending;

  const submit = () => {
    saveRoomDecision({
      roomId,
      summary: summary.trim(),
      ...(nextStatement !== currentStatement ? { statement: nextStatement } : {}),
      ...(nextGuardrails !== currentGuardrails ? { guardrails: nextGuardrails } : {}),
    });
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !isPending && onOpenChange(next)}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{hasDraft ? "Revise the decision" : "Draft the decision"}</DialogTitle>
          <DialogDescription>
            Revisions are append-only: the earlier ones stay readable, and each one says what it changed.
          </DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div>
            <label htmlFor="revise-summary" className={FIELD_LABEL}>
              What changed (required)
            </label>
            <textarea
              id="revise-summary"
              rows={2}
              value={summary}
              disabled={isPending}
              onChange={(event) => setSummary(event.currentTarget.value)}
              placeholder={hasDraft ? "e.g. Narrowed free delivery to failed-first-delivery customers only." : "e.g. First draft."}
              className={AREA}
            />
          </div>
          <div>
            <label htmlFor="revise-statement" className={FIELD_LABEL}>
              The decision {hasDraft ? "" : "(required)"}
            </label>
            <textarea
              id="revise-statement"
              rows={4}
              value={statement}
              disabled={isPending}
              onChange={(event) => setStatement(event.currentTarget.value)}
              className={AREA}
            />
          </div>
          <div>
            <label htmlFor="revise-guardrails" className={FIELD_LABEL}>
              Guardrails stated
            </label>
            <textarea
              id="revise-guardrails"
              rows={2}
              value={guardrails}
              disabled={isPending}
              onChange={(event) => setGuardrails(event.currentTarget.value)}
              className={AREA}
            />
          </div>
        </DialogBody>

        <DialogFooter>
          <div className="flex items-center gap-4">
            <Button type="button" onClick={submit} disabled={!canSave}>
              {isPending ? "Saving…" : hasDraft ? "Save revision" : "Save draft"}
            </Button>
            <button
              type="button"
              disabled={isPending}
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
