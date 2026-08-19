import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { WideBarRow } from "@/pages/everyday/lifecycle/stage/bar";
import { DataTable, type Column } from "@/pages/everyday/lifecycle/stage/data-table";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { RETAIN_CURVE_COMPARE_ROWS, RETAIN_CURVE_ROWS, type RetainCurveCompareRow } from "@/pages/everyday/lifecycle/stage/retain/data";

const CHANGE_TONE_CLASS: Record<RetainCurveCompareRow["changeTone"], string> = { teal: "text-teal", rose: "text-rose", amber: "text-amber", neutral: "text-ink-4" };

const COLUMNS: Column<RetainCurveCompareRow>[] = [
  { key: "window", header: "Window", render: (row) => <span className="font-semibold text-ink-2">{row.window}</span> },
  { key: "before", header: "Before · share", align: "right", render: (row) => <span className="font-mono text-ink">{row.before}</span> },
  { key: "after", header: "After · share", align: "right", render: (row) => <span className="font-mono text-ink">{row.after}</span> },
  { key: "change", header: "Change", align: "right", render: (row) => <span className={CHANGE_TONE_CLASS[row.changeTone]}>{row.change}</span> },
  { key: "meaning", header: "What it means", align: "right", render: (row) => <span className="text-ink-2">{row.meaning}</span> },
];

/** RT03 — Retain's unique Repeat curve tab. */
const RetainRepeatCurveTab = () => {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <p className={EYEBROW_CLASS}>When the second order happens · 243,000 who placed one</p>
        <div className="space-y-5">
          {RETAIN_CURVE_ROWS.map((row) => (
            <WideBarRow key={row.label} label={row.label} value={row.value} percent={row.percent} tone={row.tone} />
          ))}
        </div>
      </section>

      <Callout tone="amber" title="Two thirds of all second orders happen within thirty days">
        Which means reactivation aimed at the 31–90 day window is fishing in a shrinking pool, and anything aimed
        past 90 days is fishing in an empty one. The company&apos;s only reactivation campaign currently starts at
        day 60.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>The curve before and after 4 March</p>
        <DataTable columns={COLUMNS} rows={RETAIN_CURVE_COMPARE_ROWS} />
      </section>

      <Callout tone="ultra" title="The customers who still come back take longer to decide">
        The shape shifted as well as the level. Before March, a third of second orders came within a week. Now they
        arrive later and in smaller numbers — which is what hesitation looks like in a dataset, and it matches the
        2.7 extra days Activate reports on time to value.
      </Callout>
    </div>
  );
};

export default RetainRepeatCurveTab;
