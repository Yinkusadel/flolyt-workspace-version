import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { WideBarRow } from "@/pages/everyday/lifecycle/stage/bar";
import { DataTable, type Column } from "@/pages/everyday/lifecycle/stage/data-table";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import {
  EXPAND_COHORT_CLOSING,
  EXPAND_COHORT_MOVED_CLOSING,
  EXPAND_COHORT_MOVED_ROWS,
  EXPAND_COHORT_ROWS,
  type ExpandCohortRow,
} from "@/pages/everyday/lifecycle/stage/expand/data";

const RATE_TONE_CLASS: Record<"teal" | "rose", string> = { teal: "text-teal", rose: "text-rose" };
const VS_FEB_TONE_CLASS: Record<ExpandCohortRow["vsFebTone"], string> = { teal: "text-teal", rose: "text-rose", neutral: "text-ink-4" };

const COLUMNS: Column<ExpandCohortRow>[] = [
  { key: "cohort", header: "Cohort", render: (row) => <span className="font-semibold text-ink-2">{row.cohort}</span> },
  { key: "reached180Days", header: "Reached 180 days", align: "right", render: (row) => <span className="font-mono text-ink">{row.reached180Days}</span> },
  { key: "expanded", header: "Expanded", align: "right", render: (row) => <span className="font-mono text-ink">{row.expanded}</span> },
  { key: "rate", header: "Rate", align: "right", render: (row) => <span className={RATE_TONE_CLASS[row.rateTone]}>{row.rate}</span> },
  { key: "arpuMultiple", header: "ARPU multiple", align: "right", render: (row) => <span className={RATE_TONE_CLASS[row.arpuMultipleTone]}>{row.arpuMultiple}</span> },
  { key: "onPaidPlan", header: "On a paid plan", align: "right", render: (row) => <span className={RATE_TONE_CLASS[row.onPaidPlanTone]}>{row.onPaidPlan}</span> },
  { key: "vsFeb", header: "vs Feb", align: "right", render: (row) => <span className={VS_FEB_TONE_CLASS[row.vsFebTone]}>{row.vsFeb}</span> },
];

/**
 * EX07 — Expand's Cohorts tab (stage-specific layout, not the shared
 * CohortsTab template — EX07's columns are expansion rate/ARPU multiple/
 * on a paid plan, not Acquire's CAC/day30-90, confirmed by reading EX07
 * directly).
 */
const ExpandCohortsTab = () => {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Expansion by acquisition cohort · measured at 180 days</p>
        <DataTable columns={COLUMNS} rows={EXPAND_COHORT_ROWS} />
      </section>

      <Callout tone="ultra" title={EXPAND_COHORT_CLOSING.title}>
        {EXPAND_COHORT_CLOSING.body}
      </Callout>

      <section className="space-y-5">
        <p className={EYEBROW_CLASS}>The one row that did move</p>
        <div className="space-y-5">
          {EXPAND_COHORT_MOVED_ROWS.map((row) => (
            <WideBarRow key={row.label} label={row.label} value={row.value} percent={row.percent} tone={row.tone} />
          ))}
        </div>
      </section>

      <Callout tone="amber" title={EXPAND_COHORT_MOVED_CLOSING.title}>
        {EXPAND_COHORT_MOVED_CLOSING.body}
      </Callout>
    </div>
  );
};

export default ExpandCohortsTab;
