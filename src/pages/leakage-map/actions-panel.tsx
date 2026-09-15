import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight, ChevronUp } from "lucide-react";

import { Chip } from "@/components/ui/chip";
import { Callout } from "@/components/ui/rail";
import { ACTIONS_PANEL, type ActionRow } from "@/pages/leakage-map/data";

function ActionRowItem({ row }: { row: ActionRow }) {
  return (
    <div className="flex flex-wrap items-center gap-3 border-t border-line py-3 first:border-0 first:pt-0">
      <Chip tone={row.severity === "S1" ? "rose" : "amber"}>{row.severity}</Chip>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[12.5px] font-medium text-ink">{row.cellLabel}</p>
        <p className="mt-0.5 text-[11px] text-ink-3">{row.accountsLine}</p>
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[12px] text-ink-2">{row.action}</p>
        <p className="mt-0.5 text-[10.5px] text-ink-4">{row.sla}</p>
      </div>
      <p className="shrink-0 text-[13px] font-semibold text-ink">{row.amount}</p>
      <Link
        to={row.roomId ? `/rooms/${row.roomId}` : "/rooms/new"}
        className="flex shrink-0 items-center gap-0.5 text-[11.5px] font-medium text-ultra hover:underline"
      >
        Open queue
        <ChevronRight className="size-3.5" />
      </Link>
    </div>
  );
}

/** "ACTIONS TRIGGERED" (08-actions-panel.svg) — every figure routed to a named owner with an
 * action and an SLA, so exposure never sits on the page as a scoreboard nobody moves. */
export function ActionsPanel() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-card border border-line bg-paper p-5">
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        aria-expanded={expanded}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <div>
          <h2 className="text-[14.5px] font-semibold text-ink">Actions triggered</h2>
          <p className="mt-0.5 text-[11.5px] text-ink-3">{ACTIONS_PANEL.summary}</p>
        </div>
        <span className="flex shrink-0 items-center gap-1 text-[11.5px] font-medium text-ink-2">
          {expanded ? "Collapse" : "Expand"}
          {expanded ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
        </span>
      </button>

      {expanded && (
        <div className="mt-4 border-t border-line pt-4">
          <p className="text-[10.5px] text-ink-4">{ACTIONS_PANEL.filterSummary}</p>

          <div className="mt-2">
            {ACTIONS_PANEL.rows.map((row) => (
              <ActionRowItem key={`${row.cellLabel}-${row.action}`} row={row} />
            ))}
          </div>
          <p className="border-t border-line pt-3 text-[11px] text-ink-3">
            {ACTIONS_PANEL.moreAtS3} more at S3
          </p>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3 text-[12px]">
            <span className="text-ink-3">
              Total actionable exposure <span className="font-semibold text-ink">{ACTIONS_PANEL.totalActionableExposure}</span>
            </span>
            <span className="text-ink-3">
              Expected save, recovery-adjusted{" "}
              <span className="font-semibold text-teal">{ACTIONS_PANEL.expectedSaveRecoveryAdjusted}</span>
            </span>
          </div>

          <div className="mt-4">
            <Callout tone="ultra" title={ACTIONS_PANEL.calloutTitle}>
              {ACTIONS_PANEL.calloutBody}
            </Callout>
          </div>
        </div>
      )}
    </div>
  );
}
