import { Callout } from "@/pages/lifecycle/stage/rail";
import { WideBarRow } from "@/pages/lifecycle/stage/bar";
import { DataTable, type Column } from "@/pages/lifecycle/stage/data-table";
import { EYEBROW_CLASS } from "@/pages/lifecycle/data";
import {
  SUPPORT_COHORT_CLOSING,
  SUPPORT_COHORT_COST_CLOSING,
  SUPPORT_COHORT_COST_ROWS,
  SUPPORT_COHORT_ROWS,
  type SupportCohortRow,
} from "@/pages/lifecycle/stage/support/data";

const RATE_TONE_CLASS: Record<"teal" | "rose", string> = { teal: "text-teal", rose: "text-rose" };
const VS_FEB_TONE_CLASS: Record<SupportCohortRow["vsFebTone"], string> = { teal: "text-teal", rose: "text-rose", neutral: "text-ink-4" };

const COLUMNS: Column<SupportCohortRow>[] = [
  { key: "cohort", header: "Cohort", render: (row) => <span className="font-semibold text-ink-2">{row.cohort}</span> },
  { key: "acquired", header: "Acquired", align: "right", render: (row) => <span className="font-mono text-ink">{row.acquired}</span> },
  { key: "contactedUs", header: "Contacted us", align: "right", render: (row) => <span className="font-mono text-ink">{row.contactedUs}</span> },
  { key: "rate", header: "Rate", align: "right", render: (row) => <span className={RATE_TONE_CLASS[row.rateTone]}>{row.rate}</span> },
  { key: "topDriver", header: "Top driver", align: "right", render: (row) => <span className="text-ink-2">{row.topDriver}</span> },
  { key: "repeatAfterContact", header: "Repeat after contact", align: "right", render: (row) => <span className={row.repeatAfterContact === "Unavailable" ? "font-mono text-ink-4" : RATE_TONE_CLASS[row.repeatAfterContactTone]}>{row.repeatAfterContact}</span> },
  { key: "vsFeb", header: "vs Feb", align: "right", render: (row) => <span className={VS_FEB_TONE_CLASS[row.vsFebTone]}>{row.vsFeb}</span> },
];

/**
 * SU06 — Support's Cohorts tab (stage-specific layout, not the shared
 * CohortsTab template — SU06's columns are contact rate/top driver/repeat
 * after contact, not Acquire's CAC/day30-90, confirmed by reading SU06
 * directly).
 */
const SupportCohortsTab = () => {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Contact rate and outcome by acquisition cohort · first 90 days</p>
        <DataTable columns={COLUMNS} rows={SUPPORT_COHORT_ROWS} />
      </section>

      <Callout tone="ultra" title={SUPPORT_COHORT_CLOSING.title}>
        {SUPPORT_COHORT_CLOSING.body}
      </Callout>

      <section className="space-y-5">
        <p className={EYEBROW_CLASS}>What it cost to handle, and what it cost in revenue</p>
        <div className="space-y-5">
          {SUPPORT_COHORT_COST_ROWS.map((row) => (
            <WideBarRow key={row.label} label={row.label} value={row.value} percent={row.percent} tone={row.tone} />
          ))}
        </div>
      </section>

      <Callout tone="rose" title={SUPPORT_COHORT_COST_CLOSING.title}>
        {SUPPORT_COHORT_COST_CLOSING.body}
      </Callout>
    </div>
  );
};

export default SupportCohortsTab;
