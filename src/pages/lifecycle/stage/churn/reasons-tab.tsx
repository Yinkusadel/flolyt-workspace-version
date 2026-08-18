import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Callout } from "@/pages/lifecycle/stage/rail";
import { CHIP_INTERACTIVE_CLASS, Chip } from "@/pages/lifecycle/stage/chip";
import { DataTable, type Column } from "@/pages/lifecycle/stage/data-table";
import { OpenARoomModal } from "@/pages/lifecycle/stage/modals/open-a-room-modal";
import { SendReasonUpstreamModal } from "@/pages/lifecycle/stage/modals/send-reason-upstream-modal";
import { EYEBROW_CLASS } from "@/pages/lifecycle/data";
import {
  CHURN_OPEN_ROOM_PRESET,
  CHURN_REASON_ROWS,
  CHURN_REASONS_INSIGHT,
  CHURN_REASONS_SPLIT_ROWS,
  type ChurnReasonRow,
} from "@/pages/lifecycle/stage/churn/data";

const SHARE_TONE_CLASS: Record<ChurnReasonRow["shareTone"], string> = { rose: "text-rose", amber: "text-amber", neutral: "text-ink-4" };
const HOW_WE_KNOW_TONE_CLASS: Record<ChurnReasonRow["howWeKnowTone"], string> = { ultra: "text-ultra", teal: "text-teal", rose: "text-rose", amber: "text-amber" };
const VS_FEB_TONE_CLASS: Record<ChurnReasonRow["vsFebTone"], string> = { rose: "text-rose", teal: "text-teal", neutral: "text-ink-4" };
const SPLIT_VALUE_TONE_CLASS: Record<"teal" | "ultra" | "amber" | "neutral", string> = { teal: "text-teal", ultra: "text-ultra", amber: "text-amber", neutral: "text-ink-2" };

/** CH03 — Churn's unique Reasons tab (route path "reasons", matches its tab label). */
const ChurnReasonsTab = () => {
  const [openRoom, setOpenRoom] = useState(false);
  const [upstreamRow, setUpstreamRow] = useState<ChurnReasonRow | null>(null);

  const columns: Column<ChurnReasonRow>[] = [
    { key: "reason", header: "Reason", render: (row) => <span className="font-semibold text-ink-2">{row.reason}</span> },
    { key: "customers", header: "Customers", align: "right", render: (row) => <span className={row.customers === "Unavailable" ? "font-mono text-ink-4" : "font-mono text-ink"}>{row.customers}</span> },
    { key: "share", header: "Share", align: "right", render: (row) => <span className={row.share === "Unavailable" ? "font-mono text-ink-4" : SHARE_TONE_CLASS[row.shareTone]}>{row.share}</span> },
    { key: "howWeKnow", header: "How we know", align: "right", render: (row) => <span className={HOW_WE_KNOW_TONE_CLASS[row.howWeKnowTone]}>{row.howWeKnow}</span> },
    {
      key: "stage",
      header: "Stage that owns it",
      render: (row) =>
        row.department ? (
          <span className="flex items-center gap-2 whitespace-nowrap text-ink-2">
            <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: row.department.color }} aria-hidden />
            <span className="font-medium" style={{ color: row.department.color }}>{row.department.name}</span>
          </span>
        ) : row.departmentChip ? (
          <Chip tone={row.departmentChip.tone}>{row.departmentChip.label}</Chip>
        ) : null,
    },
    { key: "vsFeb", header: "vs Feb", align: "right", render: (row) => <span className={row.vsFeb === "—" ? "font-mono text-ink-4" : VS_FEB_TONE_CLASS[row.vsFebTone]}>{row.vsFeb}</span> },
    {
      key: "actionable",
      header: "Actionable",
      align: "right",
      render: (row) =>
        row.sendUpstreamPreset ? (
          <button type="button" onClick={() => setUpstreamRow(row)}>
            <Chip tone={row.actionableTone} className={CHIP_INTERACTIVE_CLASS}>
              {row.actionable}
            </Chip>
          </button>
        ) : (
          <Chip tone={row.actionableTone}>{row.actionable}</Chip>
        ),
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <Button type="button" size="sm" onClick={() => setOpenRoom(true)}>
          Open a war room
        </Button>
      </div>

      <DataTable columns={columns} rows={CHURN_REASON_ROWS} />

      <Callout tone="amber" title={CHURN_REASONS_INSIGHT.title}>
        {CHURN_REASONS_INSIGHT.body}
      </Callout>

      <section className="space-y-1">
        <p className={`pb-2 ${EYEBROW_CLASS}`}>Stated against inferred, and why both are kept separate</p>
        <div className="divide-y divide-line rounded-card border border-line bg-paper">
          {CHURN_REASONS_SPLIT_ROWS.map((row) => (
            <div key={row.label} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
              <span className="text-[11.5px] text-ink-2">{row.label}</span>
              <span className={`font-mono text-[11px] ${SPLIT_VALUE_TONE_CLASS[row.tone]}`}>{row.value}</span>
            </div>
          ))}
        </div>
      </section>

      <OpenARoomModal preset={CHURN_OPEN_ROOM_PRESET} open={openRoom} onOpenChange={setOpenRoom} />
      {upstreamRow?.sendUpstreamPreset && (
        <SendReasonUpstreamModal preset={upstreamRow.sendUpstreamPreset} open={upstreamRow !== null} onOpenChange={(open) => setUpstreamRow(open ? upstreamRow : null)} />
      )}
    </div>
  );
};

export default ChurnReasonsTab;
