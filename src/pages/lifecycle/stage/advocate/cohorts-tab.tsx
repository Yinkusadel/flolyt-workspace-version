import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Callout } from "@/pages/lifecycle/stage/rail";
import { WideBarRow } from "@/pages/lifecycle/stage/bar";
import { DataTable, type Column } from "@/pages/lifecycle/stage/data-table";
import { OpenARoomModal } from "@/pages/lifecycle/stage/modals/open-a-room-modal";
import { EYEBROW_CLASS } from "@/pages/lifecycle/data";
import {
  ADVOCATE_COHORTS_OPEN_ROOM_PRESET,
  ADVOCATE_COHORT_CLOSING,
  ADVOCATE_COHORT_MARCH_BREAK_ROWS,
  ADVOCATE_COHORT_ROWS,
  type AdvocateCohortRow,
} from "@/pages/lifecycle/stage/advocate/data";

const RATE_TONE_CLASS: Record<AdvocateCohortRow["rateTone"], string> = { teal: "text-teal", rose: "text-rose", neutral: "text-ink-4" };
const VS_FEB_TONE_CLASS: Record<AdvocateCohortRow["vsFebTone"], string> = { teal: "text-teal", rose: "text-rose", neutral: "text-ink-4" };

const COLUMNS: Column<AdvocateCohortRow>[] = [
  { key: "cohort", header: "Cohort", render: (row) => <span className="font-semibold text-ink-2">{row.cohort}</span> },
  { key: "reached180", header: "Reached 180 days", align: "right", render: (row) => <span className={row.reached180 === "Unavailable" ? "font-mono text-ink-4" : "font-mono text-ink"}>{row.reached180}</span> },
  { key: "referredAnyone", header: "Referred anyone", align: "right", render: (row) => <span className={row.referredAnyone === "Unavailable" ? "font-mono text-ink-4" : "font-mono text-ink"}>{row.referredAnyone}</span> },
  { key: "rate", header: "Rate", align: "right", render: (row) => <span className={row.rate === "Unavailable" ? "font-mono text-ink-4" : RATE_TONE_CLASS[row.rateTone]}>{row.rate}</span> },
  { key: "referralsEach", header: "Referrals each", align: "right", render: (row) => <span className={row.referralsEach === "Unavailable" ? "font-mono text-ink-4" : RATE_TONE_CLASS[row.referralsEachTone]}>{row.referralsEach}</span> },
  { key: "referredCustomers", header: "Referred customers", align: "right", render: (row) => <span className={row.referredCustomers === "Unavailable" ? "font-mono text-ink-4" : "font-mono text-ink"}>{row.referredCustomers}</span> },
  { key: "vsFeb", header: "vs Feb", align: "right", render: (row) => <span className={VS_FEB_TONE_CLASS[row.vsFebTone]}>{row.vsFeb}</span> },
];

/**
 * AV06 — Advocate's Cohorts tab (stage-specific layout, not the shared
 * CohortsTab template — AV06 measures referral behaviour by acquisition
 * cohort at 180 days, not Acquire's CAC/day30-90, confirmed by reading AV06
 * directly).
 */
const AdvocateCohortsTab = () => {
  const [openRoom, setOpenRoom] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <Button type="button" size="sm" onClick={() => setOpenRoom(true)}>
          Open a war room
        </Button>
      </div>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Referral behaviour by acquisition cohort · measured at 180 days</p>
        <DataTable columns={COLUMNS} rows={ADVOCATE_COHORT_ROWS} />
      </section>

      <Callout tone="rose" title={ADVOCATE_COHORT_CLOSING.title}>
        {ADVOCATE_COHORT_CLOSING.body}
      </Callout>

      <section className="space-y-5">
        <p className={EYEBROW_CLASS}>What the March break cost across two generations</p>
        <div className="space-y-5">
          {ADVOCATE_COHORT_MARCH_BREAK_ROWS.map((row) => (
            <WideBarRow key={row.label} label={row.label} value={row.value} percent={row.percent} tone={row.tone} />
          ))}
        </div>
      </section>

      <OpenARoomModal preset={ADVOCATE_COHORTS_OPEN_ROOM_PRESET} open={openRoom} onOpenChange={setOpenRoom} />
    </div>
  );
};

export default AdvocateCohortsTab;
