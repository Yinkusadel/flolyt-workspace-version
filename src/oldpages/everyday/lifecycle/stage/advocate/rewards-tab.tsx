import { useState } from "react";

import { Callout } from "@/components/ui/rail";
import { DataTable, type Column } from "@/oldpages/everyday/lifecycle/stage/data-table";
import { KpiCards } from "@/components/ui/kpi-cards";
import { OpenARoomModal } from "@/oldpages/everyday/lifecycle/stage/modals/open-a-room-modal";
import { EYEBROW_CLASS } from "@/lib/lifecycle-data";
import {
  ADVOCATE_REWARDS_HOLDOUT_INSIGHT,
  ADVOCATE_REWARDS_KPIS,
  ADVOCATE_REWARDS_OPEN_ROOM_PRESET,
  ADVOCATE_REWARDS_TRADE_INSIGHT,
  ADVOCATE_REWARDS_WARNING,
  ADVOCATE_REWARD_CHANGE_ROWS,
  type AdvocateRewardChangeRow,
} from "@/oldpages/everyday/lifecycle/stage/advocate/data";

const CHANGE_TONE_CLASS: Record<AdvocateRewardChangeRow["changeTone"], string> = { teal: "text-teal", rose: "text-rose", neutral: "text-ink-4" };

const COLUMNS: Column<AdvocateRewardChangeRow>[] = [
  { key: "what", header: "What", render: (row) => <span className="font-semibold text-ink-2">{row.what}</span> },
  { key: "before", header: "Before Apr · ₦500", align: "right", render: (row) => <span className="font-mono text-ink">{row.before}</span> },
  { key: "after", header: "After Apr · ₦1,000", align: "right", render: (row) => <span className="font-mono text-ink">{row.after}</span> },
  { key: "change", header: "Change", align: "right", render: (row) => <span className={CHANGE_TONE_CLASS[row.changeTone]}>{row.change}</span> },
  { key: "reading", header: "Reading", align: "right", render: (row) => <span className="text-ink-2">{row.reading}</span> },
];

/** AV05 — Advocate's unique Rewards tab. */
const AdvocateRewardsTab = () => {
  const [openRoom, setOpenRoom] = useState(false);

  return (
    <div className="space-y-8">
      {/* "Open a room" header button removed for now, per explicit request — inconsistent
          across tabs; only the /lifecycle map page's own button stays. */}

      <KpiCards items={ADVOCATE_REWARDS_KPIS} />

      <Callout tone="rose" title={ADVOCATE_REWARDS_WARNING.title}>
        {ADVOCATE_REWARDS_WARNING.body}
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What is known, and what the April increase actually showed</p>
        <DataTable columns={COLUMNS} rows={ADVOCATE_REWARD_CHANGE_ROWS} />
      </section>

      <Callout tone="rose" title={ADVOCATE_REWARDS_TRADE_INSIGHT.title}>
        {ADVOCATE_REWARDS_TRADE_INSIGHT.body}
      </Callout>

      <Callout tone="amber" title={ADVOCATE_REWARDS_HOLDOUT_INSIGHT.title}>
        {ADVOCATE_REWARDS_HOLDOUT_INSIGHT.body}
      </Callout>

      <OpenARoomModal preset={ADVOCATE_REWARDS_OPEN_ROOM_PRESET} open={openRoom} onOpenChange={setOpenRoom} />
    </div>
  );
};

export default AdvocateRewardsTab;
