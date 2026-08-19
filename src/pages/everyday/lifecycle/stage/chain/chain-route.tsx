import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { DataTable, type Column } from "@/pages/everyday/lifecycle/stage/data-table";
import { useStageContext } from "@/pages/everyday/lifecycle/stage/layout";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";

type ChainRow = {
  id: string;
  stage: string;
  saw: string;
  effect: string;
  effectTone: "teal" | "rose";
  value: string;
  valueTone: "teal" | "rose" | "amber";
  calledIt: string;
  daysToDetect: string;
  daysTone: "teal" | "rose" | "neutral";
};

const CH13_ROWS: ChainRow[] = [
  { id: "acquire", stage: "Acquire", saw: "CAC rose, volume rose faster", effect: "+35.6% CAC", effectTone: "rose", value: "₦48M", valueTone: "rose", calledIt: "a campaign mix problem", daysToDetect: "never", daysTone: "rose" },
  { id: "activate", stage: "Activate", saw: "Abandonment at the fee step ×3.1", effect: "−7.4 pts", effectTone: "rose", value: "₦124M", valueTone: "rose", calledIt: "seasonality", daysToDetect: "151", daysTone: "rose" },
  { id: "price", stage: "Price", saw: "Effective price +₦350 on 61% of orders", effect: "+16.4%", effectTone: "rose", value: "₦31M", valueTone: "rose", calledIt: "never reviewed as a price", daysToDetect: "151", daysTone: "rose" },
  { id: "adopt", stage: "Adopt", saw: "Scheduled delivery second use 71% → 45%", effect: "−26 pts", effectTone: "rose", value: "₦24M", valueTone: "rose", calledIt: "a feature nobody owned", daysToDetect: "151", daysTone: "rose" },
  { id: "retain", stage: "Retain", saw: "Second-order rate fell", effect: "−11.0 pts", effectTone: "rose", value: "₦412M", valueTone: "rose", calledIt: "a weak campaign", daysToDetect: "151", daysTone: "rose" },
  { id: "expand", stage: "Expand", saw: "Rate held, population fell 14%", effect: "0.0 pts", effectTone: "teal", value: "₦0", valueTone: "teal", calledIt: "nothing · correctly", daysToDetect: "n/a", daysTone: "neutral" },
  { id: "support", stage: "Support", saw: "“Where is my order” became top driver", effect: "+41%", effectTone: "rose", value: "₦9M", valueTone: "amber", calledIt: "a delivery issue", daysToDetect: "7", daysTone: "teal" },
  { id: "renew", stage: "Renew", saw: "Pauses +22% · “too expensive” 19% → 37%", effect: "+1.5 pts", effectTone: "rose", value: "₦88M", valueTone: "rose", calledIt: "no cause found", daysToDetect: "151", daysTone: "rose" },
  { id: "advocate", stage: "Advocate", saw: "Referral rate fell, first time in 2 years", effect: "−3.9 pts", effectTone: "rose", value: "₦31M", valueTone: "rose", calledIt: "nobody was looking", daysToDetect: "never", daysTone: "rose" },
  { id: "churn", stage: "Churn", saw: "Median days alive 70 → 48", effect: "+10.4 pts", effectTone: "rose", value: "₦61M", valueTone: "rose", calledIt: "nobody was looking", daysToDetect: "never", daysTone: "rose" },
];

const EFFECT_TONE_CLASS: Record<"teal" | "rose", string> = { teal: "text-teal", rose: "text-rose" };
const VALUE_TONE_CLASS: Record<"teal" | "rose" | "amber", string> = { teal: "text-teal", rose: "text-rose", amber: "text-amber" };
const DAYS_TONE_CLASS: Record<"teal" | "rose" | "neutral", string> = { teal: "text-teal", rose: "text-rose", neutral: "text-ink-4" };

const COLUMNS: Column<ChainRow>[] = [
  { key: "stage", header: "Stage", render: (row) => <span className="font-semibold text-ink-2">{row.stage}</span> },
  { key: "saw", header: "What that stage saw", render: (row) => <span className="text-ink-2">{row.saw}</span> },
  { key: "effect", header: "Effect", align: "right", render: (row) => <span className={EFFECT_TONE_CLASS[row.effectTone]}>{row.effect}</span> },
  { key: "value", header: "Value", align: "right", render: (row) => <span className={VALUE_TONE_CLASS[row.valueTone]}>{row.value}</span> },
  { key: "calledIt", header: "What they called it", align: "right", render: (row) => <span className="font-mono text-ink-4">{row.calledIt}</span> },
  { key: "daysToDetect", header: "Days to detect", align: "right", render: (row) => <span className={DAYS_TONE_CLASS[row.daysTone]}>{row.daysToDetect}</span> },
];

/** CH13 — "the whole lifecycle, closed": every stage's read of the same 4 March release, side by side. */
const ChainRoute = () => {
  const { stage } = useStageContext();

  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Lifecycle", to: "/lifecycle" }, { label: stage.name, to: `/lifecycle/${stage.slug}` }, { label: "Where it all went" }]}
        title="Where it all went"
        subtitle="One release · ten stages · ₦1.08B · detected in 7 days, understood in 151"
      />

      <Callout tone="ultra" title="One release, ten stages, ₦1.08B, twenty weeks">
        Every figure below was measured inside the stage that owns it and none of them are double counted. This
        screen exists because the delivery fee that shipped on 4 March could be seen from ten different desks and
        was correctly diagnosed from none of them.
      </Callout>

      <section className="space-y-3">
        <p className="font-mono text-[9.5px] font-medium tracking-[1.05px] text-ink-4 uppercase">
          The 4 March release, stage by stage
        </p>
        <DataTable columns={COLUMNS} rows={CH13_ROWS} />
      </section>

      <Callout tone="rose" title="Support was right in seven days and it took another 144 for anyone to hear">
        The earliest correct signal in this entire chain came from the stage with the smallest number and the
        least power to act. Three stages never detected it at all, and two of those three have no owner. Nothing
        here was a reporting failure — every number was correct in its own tool, on its own screen, all along.
      </Callout>
    </div>
  );
};

export default ChainRoute;
