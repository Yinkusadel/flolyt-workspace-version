import { WideBarRow } from "@/pages/everyday/lifecycle/stage/bar";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { DataTable, type Column } from "@/pages/everyday/lifecycle/stage/data-table";
import {
  ACTIVATE_TIME_TO_VALUE_COHORT_ROWS,
  ACTIVATE_TIME_TO_VALUE_ROWS,
  type TimeToValueCohortRow,
} from "@/pages/everyday/lifecycle/stage/activate/data";

const RATE_TONE_CLASS: Record<"teal" | "rose", string> = { teal: "text-teal", rose: "text-rose" };
const MEDIAN_TONE_CLASS: Record<"teal" | "rose" | "neutral", string> = { teal: "text-teal", rose: "text-rose", neutral: "text-ink-4" };
const SAME_DAY_TONE_CLASS: Record<"ink" | "amber", string> = { ink: "text-ink", amber: "text-amber" };

const COLUMNS: Column<TimeToValueCohortRow>[] = [
  { key: "cohort", header: "Cohort", render: (row) => <span className="font-semibold text-ink-2">{row.cohort}</span> },
  { key: "activated", header: "Activated", align: "right", render: (row) => <span className="font-mono text-ink">{row.activated}</span> },
  { key: "rate", header: "Rate", align: "right", render: (row) => <span className={RATE_TONE_CLASS[row.rateTone]}>{row.rate}</span> },
  { key: "medianDays", header: "Median days", align: "right", render: (row) => <span className={MEDIAN_TONE_CLASS[row.medianTone]}>{row.medianDays}</span> },
  { key: "sameDay", header: "Same-day", align: "right", render: (row) => <span className={SAME_DAY_TONE_CLASS[row.sameDayTone]}>{row.sameDay}</span> },
  { key: "vsFeb", header: "vs Feb", align: "right", render: (row) => <span className={MEDIAN_TONE_CLASS[row.vsFebTone]}>{row.vsFeb}</span> },
];

/** AC03 — Activate's unique Time to value tab. */
const ActivateTimeToValueTab = () => {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          Days from first order to activation · 366,000 who got there
        </p>
        <div className="space-y-5">
          {ACTIVATE_TIME_TO_VALUE_ROWS.map((row) => (
            <WideBarRow key={row.label} label={row.label} value={row.value} percent={row.percent} tone={row.tone} />
          ))}
        </div>
      </section>

      <Callout tone="ultra" title="The 14-day window is a choice, and it costs 84,000 customers">
        84,000 people returned between day 15 and day 45 and are counted as never activated. Widening the window would
        raise the activation rate to 50.4% and would not change a single customer&apos;s behaviour. The narrow window is
        kept because 14 days is where the signal stops predicting a second order.
      </Callout>

      <section className="space-y-3">
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          Time to value is getting worse, and it is not gradual
        </p>
        <DataTable columns={COLUMNS} rows={ACTIVATE_TIME_TO_VALUE_COHORT_ROWS} />
      </section>

      <Callout tone="rose" title="Median time to value nearly doubled in the week of 4 March">
        3.4 days to 6.0 days, and it has not recovered in twenty weeks. A customer deciding more slowly is a customer
        deciding less certainly — this is the same event that shows up as −11 points in Retain, seen from one stage
        earlier.
      </Callout>
    </div>
  );
};

export default ActivateTimeToValueTab;
