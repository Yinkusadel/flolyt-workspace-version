import { useState } from "react";

import { Button } from "@/components/ui/button";
import { WideBarRow } from "@/pages/lifecycle/stage/bar";
import { Callout } from "@/pages/lifecycle/stage/rail";
import { DataTable, type Column } from "@/pages/lifecycle/stage/data-table";
import { OpenARoomModal } from "@/pages/lifecycle/stage/modals/open-a-room-modal";
import { EYEBROW_CLASS } from "@/pages/lifecycle/data";
import {
  CHURN_COHORT_ATTRIBUTION_ROWS,
  CHURN_COHORT_CLOSING,
  CHURN_COHORT_ROWS,
  CHURN_COHORTS_OPEN_ROOM_PRESET,
  type ChurnCohortRow,
} from "@/pages/lifecycle/stage/churn/data";

const TONE_CLASS: Record<"teal" | "rose" | "neutral", string> = { teal: "text-teal", rose: "text-rose", neutral: "text-ink-4" };

const COLUMNS: Column<ChurnCohortRow>[] = [
  { key: "cohort", header: "Cohort", render: (row) => <span className="font-semibold text-ink-2">{row.cohort}</span> },
  { key: "acquired", header: "Acquired", align: "right", render: (row) => <span className="font-mono text-ink">{row.acquired}</span> },
  { key: "churnedBy180d", header: "Churned by 180d", align: "right", render: (row) => <span className={row.churnedBy180d === "Unavailable" ? "font-mono text-ink-4" : "font-mono text-ink"}>{row.churnedBy180d}</span> },
  { key: "rate", header: "Rate", align: "right", render: (row) => <span className={TONE_CLASS[row.rateTone]}>{row.rate}</span> },
  { key: "neverActivated", header: "Never activated", align: "right", render: (row) => <span className={TONE_CLASS[row.neverActivatedTone]}>{row.neverActivated}</span> },
  { key: "medianDaysAlive", header: "Median days alive", align: "right", render: (row) => <span className={TONE_CLASS[row.medianDaysAliveTone]}>{row.medianDaysAlive}</span> },
  { key: "vsFeb", header: "vs Feb", align: "right", render: (row) => <span className={TONE_CLASS[row.vsFebTone]}>{row.vsFeb}</span> },
];

/**
 * CH06 — Churn's Cohorts tab. Not the shared CohortsTab template: CH06 uses
 * churned-by-180d/rate/never-activated/median-days-alive columns instead of
 * CAC/day30-90, and closes with a "the ten-point rise, attributed" bar
 * breakdown ahead of a footnote callout rather than after one — a
 * different shape, confirmed by reading CH06 directly.
 */
const ChurnCohortsTab = () => {
  const [openRoom, setOpenRoom] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <Button type="button" size="sm" onClick={() => setOpenRoom(true)}>
          Open a war room
        </Button>
      </div>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Churn by acquisition cohort · measured at 180 days</p>
        <DataTable columns={COLUMNS} rows={CHURN_COHORT_ROWS} />
      </section>

      <Callout tone="ultra" title={CHURN_COHORT_CLOSING.title}>
        {CHURN_COHORT_CLOSING.body}
      </Callout>

      <section className="space-y-5">
        <p className={EYEBROW_CLASS}>The ten-point rise, attributed</p>
        <div className="space-y-5">
          {CHURN_COHORT_ATTRIBUTION_ROWS.map((row) => (
            <WideBarRow key={row.label} label={row.label} value={row.value} percent={row.percent} tone={row.tone} />
          ))}
        </div>
      </section>

      <OpenARoomModal preset={CHURN_COHORTS_OPEN_ROOM_PRESET} open={openRoom} onOpenChange={setOpenRoom} />
    </div>
  );
};

export default ChurnCohortsTab;
