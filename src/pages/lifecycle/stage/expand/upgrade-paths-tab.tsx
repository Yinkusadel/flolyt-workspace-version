import { useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Chip } from "@/pages/lifecycle/stage/chip";
import { DataTable, type Column } from "@/pages/lifecycle/stage/data-table";
import { InsightCards } from "@/pages/lifecycle/stage/activate/insight-cards";
import { ModelAnUpgradeModal } from "@/pages/lifecycle/stage/modals/model-an-upgrade-modal";
import { EYEBROW_CLASS } from "@/pages/lifecycle/data";
import {
  EXPAND_MODEL_UPGRADE_PRESET,
  EXPAND_UPGRADE_PATH_CARDS,
  EXPAND_UPGRADE_PATH_DETAILS,
  EXPAND_UPGRADE_PATH_ROWS,
  type UpgradePathRow,
} from "@/pages/lifecycle/stage/expand/data";

const RATE_TONE_CLASS: Record<UpgradePathRow["rateTone"], string> = { teal: "text-teal", amber: "text-amber", rose: "text-rose", neutral: "text-ink-4" };
const VALUE_TONE_CLASS: Record<UpgradePathRow["valuePerUpgradeTone"], string> = { teal: "text-teal", rose: "text-rose", neutral: "text-ink-4" };

const COLUMNS: Column<UpgradePathRow>[] = [
  {
    key: "fromTo",
    header: "From → to",
    render: (row) =>
      EXPAND_UPGRADE_PATH_DETAILS[row.id] ? (
        <Link to={`/lifecycle/expand/upgrade-paths/${row.id}`} className="font-semibold text-ultra hover:underline">
          {row.fromTo}
        </Link>
      ) : (
        <span className="font-semibold text-ink-2">{row.fromTo}</span>
      ),
  },
  { key: "eligible", header: "Eligible", align: "right", render: (row) => <span className="font-mono text-ink">{row.eligible}</span> },
  { key: "upgraded", header: "Upgraded", align: "right", render: (row) => <span className="font-mono text-ink">{row.upgraded}</span> },
  { key: "rate", header: "Rate", align: "right", render: (row) => <span className={RATE_TONE_CLASS[row.rateTone]}>{row.rate}</span> },
  { key: "valuePerUpgrade", header: "Value per upgrade", align: "right", render: (row) => <span className={VALUE_TONE_CLASS[row.valuePerUpgradeTone]}>{row.valuePerUpgrade}</span> },
  { key: "prompted", header: "Prompted?", align: "right", render: (row) => <Chip tone={row.promptedTone}>{row.prompted}</Chip> },
  { key: "verdict", header: "Verdict", align: "right", render: (row) => <Chip tone={row.verdictTone}>{row.verdict}</Chip> },
];

/** EX03 — Expand's unique Upgrade paths tab. */
const ExpandUpgradePathsTab = () => {
  const [modelOpen, setModelOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <Button type="button" size="sm" onClick={() => setModelOpen(true)}>
          Model an upgrade offer
        </Button>
      </div>

      <section className="space-y-3">
        <DataTable columns={COLUMNS} rows={EXPAND_UPGRADE_PATH_ROWS} />
      </section>

      <section className="space-y-4">
        <p className={EYEBROW_CLASS}>The 5.1% that decides this stage</p>
        <InsightCards cards={EXPAND_UPGRADE_PATH_CARDS} />
      </section>

      <ModelAnUpgradeModal preset={EXPAND_MODEL_UPGRADE_PRESET} open={modelOpen} onOpenChange={setModelOpen} />
    </div>
  );
};

export default ExpandUpgradePathsTab;
