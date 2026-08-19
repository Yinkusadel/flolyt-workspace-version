import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { WideBarRow } from "@/pages/everyday/lifecycle/stage/bar";
import { DataTable, type Column } from "@/pages/everyday/lifecycle/stage/data-table";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import {
  RETAIN_COHORT_BREAK_ROWS,
  RETAIN_COHORT_CLOSING,
  RETAIN_COHORT_FOOTNOTE,
  RETAIN_COHORT_ROWS,
  type RetainCohortRow,
} from "@/pages/everyday/lifecycle/stage/retain/data";

const DAY90_TONE_CLASS: Record<RetainCohortRow["day90Tone"], string> = { teal: "text-teal", rose: "text-rose", neutral: "text-ink-4" };
const MEDIAN_TONE_CLASS: Record<RetainCohortRow["medianDaysTone"], string> = { ink: "text-ink", rose: "text-rose" };
const VS_FEB_TONE_CLASS: Record<RetainCohortRow["vsFebTone"], string> = { teal: "text-teal", rose: "text-rose", neutral: "text-ink-4" };

const COLUMNS: Column<RetainCohortRow>[] = [
  { key: "cohort", header: "Cohort", render: (row) => <span className="font-semibold text-ink-2">{row.cohort}</span> },
  { key: "acquired", header: "Acquired", align: "right", render: (row) => <span className="font-mono text-ink">{row.acquired}</span> },
  { key: "day30", header: "30 day", align: "right", render: (row) => <span className="font-mono text-ink">{row.day30}</span> },
  { key: "day60", header: "60 day", align: "right", render: (row) => <span className="font-mono text-ink">{row.day60}</span> },
  { key: "day90", header: "90 day", align: "right", render: (row) => <span className={DAY90_TONE_CLASS[row.day90Tone]}>{row.day90}</span> },
  { key: "medianDays", header: "Median days", align: "right", render: (row) => <span className={MEDIAN_TONE_CLASS[row.medianDaysTone]}>{row.medianDays}</span> },
  { key: "vsFeb", header: "vs Feb", align: "right", render: (row) => <span className={VS_FEB_TONE_CLASS[row.vsFebTone]}>{row.vsFeb}</span> },
];

/**
 * RT07 — Retain's Cohorts tab (stage-specific layout, not the shared
 * CohortsTab template — RT07's columns are 30/60/90-day repeat rate and
 * median days, not Acquire's CAC/value-per-customer, confirmed by reading
 * RT07 directly).
 */
const RetainCohortsTab = () => {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Every acquisition cohort, measured at the same ages</p>
        <DataTable columns={COLUMNS} rows={RETAIN_COHORT_ROWS} />
      </section>

      <Callout tone="neutral" title={RETAIN_COHORT_FOOTNOTE.title}>
        {RETAIN_COHORT_FOOTNOTE.body}
      </Callout>

      <section className="space-y-5">
        <p className={EYEBROW_CLASS}>The break is dated, and it is a step</p>
        <div className="space-y-5">
          {RETAIN_COHORT_BREAK_ROWS.map((row) => (
            <WideBarRow key={row.label} label={row.label} value={row.value} percent={row.percent} tone={row.tone} />
          ))}
        </div>
      </section>

      <Callout tone="rose" title={RETAIN_COHORT_CLOSING.title}>
        {RETAIN_COHORT_CLOSING.body}
      </Callout>
    </div>
  );
};

export default RetainCohortsTab;
