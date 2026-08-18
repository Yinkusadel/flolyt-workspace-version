import { Callout } from "@/pages/lifecycle/stage/rail";
import { DataTable, type Column } from "@/pages/lifecycle/stage/data-table";
import { InsightCards } from "@/pages/lifecycle/stage/activate/insight-cards";
import { ACTIVATE_COHORT_CAUSE_CARDS, ACTIVATE_COHORT_ROWS, type ActivateCohortRow } from "@/pages/lifecycle/stage/activate/data";

const RATE_TONE_CLASS: Record<"teal" | "rose", string> = { teal: "text-teal", rose: "text-rose" };
const MEDIAN_TONE_CLASS: Record<"teal" | "rose" | "neutral", string> = { teal: "text-teal", rose: "text-rose", neutral: "text-ink-4" };
const GUEST_SHARE_TONE_CLASS: Record<"ink" | "amber", string> = { ink: "text-ink", amber: "text-amber" };

const COLUMNS: Column<ActivateCohortRow>[] = [
  { key: "cohort", header: "Cohort", render: (row) => <span className="font-semibold text-ink-2">{row.cohort}</span> },
  { key: "acquired", header: "Acquired", align: "right", render: (row) => <span className="font-mono text-ink">{row.acquired}</span> },
  { key: "activated", header: "Activated", align: "right", render: (row) => <span className="font-mono text-ink">{row.activated}</span> },
  { key: "rate", header: "Rate", align: "right", render: (row) => <span className={RATE_TONE_CLASS[row.rateTone]}>{row.rate}</span> },
  { key: "medianDays", header: "Median days", align: "right", render: (row) => <span className={MEDIAN_TONE_CLASS[row.medianTone]}>{row.medianDays}</span> },
  { key: "guestShare", header: "Guest share", align: "right", render: (row) => <span className={GUEST_SHARE_TONE_CLASS[row.guestShareTone]}>{row.guestShare}</span> },
  { key: "vsFeb", header: "vs Feb", align: "right", render: (row) => <span className={MEDIAN_TONE_CLASS[row.vsFebTone]}>{row.vsFeb}</span> },
];

/** AC06 — Activate's Cohorts tab (stage-specific layout, not the shared CohortsTab template). */
const ActivateCohortsTab = () => {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          Activation by acquisition cohort, measured at the same ages
        </p>
        <DataTable columns={COLUMNS} rows={ACTIVATE_COHORT_ROWS} />
      </section>

      <section className="space-y-4">
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          Two things changed at once, and they are separable
        </p>
        <InsightCards cards={ACTIVATE_COHORT_CAUSE_CARDS} />
      </section>

      <Callout tone="ultra" title="This stage's problem is 70% someone else's release and 30% someone else's campaign">
        Product owns Activate and caused neither. The number that will be reviewed at Zainab&apos;s stage review is
        almost entirely the output of decisions made in Engineering and Marketing — which is exactly the shape of
        failure the handoff chain exists to make visible.
      </Callout>
    </div>
  );
};

export default ActivateCohortsTab;
