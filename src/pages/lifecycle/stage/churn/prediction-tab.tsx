import { useState } from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/button";
import { Callout } from "@/pages/lifecycle/stage/rail";
import { Chip } from "@/pages/lifecycle/stage/chip";
import { DataTable, type Column } from "@/pages/lifecycle/stage/data-table";
import { KpiCards } from "@/pages/lifecycle/stage/kpi-cards";
import { useStageContext } from "@/pages/lifecycle/stage/layout";
import { InsightCards } from "@/pages/lifecycle/stage/activate/insight-cards";
import { OpenARoomModal } from "@/pages/lifecycle/stage/modals/open-a-room-modal";
import { EYEBROW_CLASS } from "@/pages/lifecycle/data";
import {
  CHURN_PREDICTION_CARDS,
  CHURN_PREDICTION_INSIGHT,
  CHURN_PREDICTION_KPIS,
  CHURN_PREDICTION_OPEN_ROOM_PRESET,
  CHURN_PREDICTION_SIGNAL_ROWS,
  type ChurnPredictionSignalRow,
} from "@/pages/lifecycle/stage/churn/data";

const LEAD_TIME_TONE_CLASS: Record<ChurnPredictionSignalRow["leadTimeTone"], string> = { teal: "text-teal", rose: "text-rose", neutral: "text-ink-4" };

const COLUMNS: Column<ChurnPredictionSignalRow>[] = [
  { key: "signal", header: "Signal", render: (row) => <span className="font-semibold text-ink-2">{row.signal}</span> },
  { key: "weight", header: "Weight", align: "right", render: (row) => <span className={row.weight === "—" ? "font-mono text-ink-4" : "font-mono text-ink"}>{row.weight}</span> },
  { key: "available", header: "Available?", align: "right", render: (row) => <Chip tone={row.availableTone}>{row.available}</Chip> },
  {
    key: "stage",
    header: "Stage it comes from",
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
  { key: "leadTime", header: "Lead time", align: "right", render: (row) => <span className={LEAD_TIME_TONE_CLASS[row.leadTimeTone]}>{row.leadTime}</span> },
];

/** CH04 — Churn's unique Prediction tab. */
const ChurnPredictionTab = () => {
  const { headerActionsEl } = useStageContext();
  const [openRoom, setOpenRoom] = useState(false);

  return (
    <div className="space-y-8">
      {headerActionsEl &&
        createPortal(
          <Button type="button" size="sm" onClick={() => setOpenRoom(true)}>
            Open a war room
          </Button>,
          headerActionsEl
        )}

      <KpiCards items={CHURN_PREDICTION_KPIS} />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What the prediction is actually built from</p>
        <DataTable columns={COLUMNS} rows={CHURN_PREDICTION_SIGNAL_ROWS} />
      </section>

      <Callout tone="rose" title={CHURN_PREDICTION_INSIGHT.title}>
        {CHURN_PREDICTION_INSIGHT.body}
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>A prediction nobody has ever acted on</p>
        <InsightCards cards={CHURN_PREDICTION_CARDS} />
      </section>

      <OpenARoomModal preset={CHURN_PREDICTION_OPEN_ROOM_PRESET} open={openRoom} onOpenChange={setOpenRoom} />
    </div>
  );
};

export default ChurnPredictionTab;
