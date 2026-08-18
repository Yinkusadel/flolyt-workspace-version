import { Link } from "react-router-dom";

import { Chip } from "@/pages/lifecycle/stage/chip";
import { DataTable, type Column } from "@/pages/lifecycle/stage/data-table";
import { InsightCards } from "@/pages/lifecycle/stage/activate/insight-cards";
import {
  ACTIVATE_PATH_DETAILS,
  ACTIVATE_PATH_INSIGHT_CARDS,
  ACTIVATE_PATH_ROWS,
  type PathRow,
} from "@/pages/lifecycle/stage/activate/data";

const TONE_CLASS: Record<"teal" | "amber" | "rose" | "neutral", string> = {
  teal: "text-teal",
  amber: "text-amber",
  rose: "text-rose",
  neutral: "text-ink-4",
};

const COLUMNS: Column<PathRow>[] = [
  {
    key: "path",
    header: "How they arrived at a first order",
    render: (row) =>
      ACTIVATE_PATH_DETAILS[row.id] ? (
        <Link to={`/lifecycle/activate/paths/${row.id}`} className="font-semibold text-ultra hover:underline">
          {row.path}
        </Link>
      ) : (
        <span className="font-semibold text-ink-2">{row.path}</span>
      ),
  },
  { key: "customers", header: "Customers", align: "right", render: (row) => <span className="font-mono text-ink">{row.customers}</span> },
  { key: "activate", header: "Activate", align: "right", render: (row) => <span className={TONE_CLASS[row.activateTone]}>{row.activate}</span> },
  { key: "medianDays", header: "Median days", align: "right", render: (row) => <span className={TONE_CLASS[row.medianTone]}>{row.medianDays}</span> },
  { key: "secondOrder", header: "Second order", align: "right", render: (row) => <span className={TONE_CLASS[row.secondOrderTone]}>{row.secondOrder}</span> },
  { key: "atStake", header: "At stake", align: "right", render: (row) => <span className={TONE_CLASS[row.atStakeTone]}>{row.atStake}</span> },
  { key: "verdict", header: "Verdict", align: "right", render: (row) => <Chip tone={row.verdictTone}>{row.verdict}</Chip> },
];

/** AC04 — Activate's unique Paths tab. */
const ActivatePathsTab = () => {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <DataTable columns={COLUMNS} rows={ACTIVATE_PATH_ROWS} />
      </section>

      <section className="space-y-4">
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          Guest checkout is 21% of first orders and 39% of the leak
        </p>
        <InsightCards cards={ACTIVATE_PATH_INSIGHT_CARDS} />
      </section>
    </div>
  );
};

export default ActivatePathsTab;
