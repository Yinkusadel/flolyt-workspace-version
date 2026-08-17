import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Callout } from "@/pages/lifecycle/stage/rail";
import { DataTable, type Column } from "@/pages/lifecycle/stage/data-table";
import { useStageContext } from "@/pages/lifecycle/stage/layout";
import { StageSubpageHeader } from "@/pages/lifecycle/stage/stage-subpage-header";
import { ACQUIRE_COMPARE_BUILD_ROWS, ACQUIRE_COMPARE_ROWS, type CompareRow } from "@/pages/lifecycle/stage/acquire/data";
import { ACTIVATE_COMPARE_ROWS } from "@/pages/lifecycle/stage/activate/data";
import { PRICE_COMPARE_ROWS } from "@/pages/lifecycle/stage/price/data";
import { ADOPT_COMPARE_ROWS } from "@/pages/lifecycle/stage/adopt/data";
import { RETAIN_COMPARE_ROWS } from "@/pages/lifecycle/stage/retain/data";
import { EXPAND_COMPARE_ROWS } from "@/pages/lifecycle/stage/expand/data";

type CompareData = {
  headline: string;
  periodLabel: string;
  periodOptions: string[];
  rows: CompareRow[];
  insightTitle: string;
  insightBody: string;
  buildEyebrow?: string;
  buildRows?: { label: string; value: string; tone: "neutral" | "amber" }[];
};

const COMPARE_DATA: Record<string, CompareData> = {
  acquire: {
    headline: "Before and after 4 March · every quality measure down, volume up 21%",
    periodLabel: "4 Feb – 3 Mar  vs  4 Mar – 2 Aug",
    periodOptions: ["This quarter vs last", "Year on year", "Custom"],
    rows: ACQUIRE_COMPARE_ROWS,
    insightTitle: "Everything on this screen got worse except the one number anyone was targeted on",
    insightBody:
      "Volume is up 21% and every quality measure is down. The acquisition team hit its goal every month of this period. That is not a people problem — it is what happens when a stage is measured on its output and damaged by something four stages away.",
    buildEyebrow: "How this comparison is built",
    buildRows: ACQUIRE_COMPARE_BUILD_ROWS,
  },
  activate: {
    headline: "Before and after 4 March · 21% more in, 4% fewer through",
    periodLabel: "4 Feb – 3 Mar  vs  4 Mar – 2 Aug",
    periodOptions: ["This quarter vs last", "Year on year", "Nigeria vs Kenya", "Custom"],
    rows: ACTIVATE_COMPARE_ROWS,
    insightTitle: "21% more customers entered this stage and 4% fewer came out of it",
    insightBody:
      "That is the whole quarter in one line. Acquisition delivered exactly what it was asked for, activation was damaged by a release nobody held against revenue, and the two facts sat in separate dashboards owned by separate teams for twenty weeks.",
  },
  price: {
    headline: "Effective price up 16.4% · basket size unchanged · nobody in Finance changed a price",
    periodLabel: "4 Feb – 3 Mar  vs  4 Mar – 2 Aug",
    periodOptions: ["This quarter vs last", "Year on year", "Ghana vs Nigeria", "Custom"],
    rows: PRICE_COMPARE_ROWS,
    insightTitle: "The effective price rose 16% in a quarter in which nobody in Finance changed a price",
    insightBody:
      "A delivery fee shipped by Engineering, a discount depth raised by Marketing, and a plan launched without verification. Three teams, three reasonable decisions, one price nobody set. That is what this stage exists to make visible, and it took twenty weeks.",
  },
  adopt: {
    headline: "One feature fell 26 points · another moved 0.4 · that contrast is the finding",
    periodLabel: "4 Feb – 3 Mar  vs  4 Mar – 2 Aug",
    periodOptions: ["This quarter vs last", "Year on year", "Kenya vs Nigeria", "Custom"],
    rows: ADOPT_COMPARE_ROWS,
    insightTitle: "One feature moved 26 points and one moved 0.4, and that is the finding",
    insightBody:
      "If the March change had made the whole product worse, saved addresses would have fallen too. It did not move at all. A single feature took the entire hit, and it was the one that meets the checkout most often — which is what makes this a specific, fixable cause rather than a vague decline.",
  },
  retain: {
    headline: "Repeat rate −10.2 points · second orders −15.6% while acquisition rose 21%",
    periodLabel: "4 Feb – 3 Mar  vs  4 Mar – 2 Aug",
    periodOptions: ["This quarter vs last", "Year on year", "Nigeria vs Kenya", "Custom"],
    rows: RETAIN_COMPARE_ROWS,
    insightTitle: "The last row is the one that looks like growth and is not",
    insightBody:
      "The reactivable population more than doubled. That is not a bigger opportunity, it is a bigger hole — 124,000 additional customers who bought once and stopped. Any dashboard that reports “reactivation audience” as a positive number is reporting the size of the failure.",
  },
  expand: {
    headline: "Rate up 0.6 points · 10.6% fewer customers expanding · both are true",
    periodLabel: "4 Feb – 3 Mar  vs  4 Mar – 2 Aug",
    periodOptions: ["This quarter vs last", "Year on year", "Consumer vs accounts", "Custom"],
    rows: EXPAND_COMPARE_ROWS,
    insightTitle: "A stage can hit every one of its own targets and be worth 10% less",
    insightBody:
      "The rate is up, the multiple is flat, and 500 fewer customers expand every month. Nobody in this stage did anything wrong and nobody in this stage can fix it. Expansion is downstream of survival, and this quarter there were fewer survivors.",
  },
};

const CHANGE_TONE_CLASS: Record<CompareRow["changeTone"], string> = { teal: "text-teal", rose: "text-rose", neutral: "text-ink-4" };
const BUILD_TONE_CLASS: Record<"neutral" | "amber", string> = { neutral: "text-ink-2", amber: "text-amber" };

/** Screen A16 (and the shared Compare-periods template for every stage) — has its own header, never shows the tab bar. */
const CompareRoute = () => {
  const { stage } = useStageContext();
  const [activePeriod, setActivePeriod] = useState<"custom" | number>("custom");
  const data = COMPARE_DATA[stage.slug];
  if (!data) return null;

  const columns: Column<CompareRow>[] = [
    { key: "metric", header: "Metric", render: (row) => <span className="font-semibold text-ink-2">{row.metric}</span> },
    { key: "before", header: "Before 4 Mar", align: "right", render: (row) => <span className="font-mono text-ink">{row.before}</span> },
    { key: "after", header: "After", align: "right", render: (row) => <span className="font-mono text-ink">{row.after}</span> },
    { key: "change", header: "Change", align: "right", render: (row) => <span className={CHANGE_TONE_CLASS[row.changeTone]}>{row.change}</span> },
    { key: "whatMovedIt", header: "What moved it", align: "right", render: (row) => <span className="text-ink-2">{row.whatMovedIt}</span> },
  ];

  return (
    <div className="space-y-6">
      <StageSubpageHeader
        crumbs={[{ label: "Lifecycle", to: "/lifecycle" }, { label: stage.name, to: `/lifecycle/${stage.slug}` }, { label: "Compare" }]}
        title={`${stage.name} · compare`}
        subtitle={data.headline}
        action={
          <Button type="button" size="sm">
            Change period
          </Button>
        }
      />

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActivePeriod("custom")}
          className={cn(
            "rounded-panel border px-3 py-1.5 text-[11px] font-semibold whitespace-nowrap",
            activePeriod === "custom" ? "border-ultra-border bg-ultra-bg text-ultra" : "border-line bg-paper-2 text-ink-3"
          )}
        >
          {data.periodLabel}
        </button>
        {data.periodOptions.map((option, i) => (
          <button
            key={option}
            type="button"
            onClick={() => setActivePeriod(i)}
            className={cn(
              "rounded-panel border px-3 py-1.5 text-[11px] whitespace-nowrap",
              activePeriod === i ? "border-ultra-border bg-ultra-bg font-semibold text-ultra" : "border-line bg-paper-2 text-ink-3"
            )}
          >
            {option}
          </button>
        ))}
      </div>

      <DataTable columns={columns} rows={data.rows} />

      <Callout tone="rose" title={data.insightTitle}>
        {data.insightBody}
      </Callout>

      {data.buildEyebrow && data.buildRows && (
        <section className="space-y-1">
          <p className="pb-2 font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">{data.buildEyebrow}</p>
          <div className="divide-y divide-line rounded-card border border-line bg-paper">
            {data.buildRows.map((row) => (
              <div key={row.label} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                <span className="text-[11.5px] text-ink-2">{row.label}</span>
                <span className={cn("font-mono text-[11px]", BUILD_TONE_CLASS[row.tone])}>{row.value}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default CompareRoute;
