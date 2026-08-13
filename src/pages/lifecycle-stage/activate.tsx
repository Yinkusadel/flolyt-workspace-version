import { cn } from "@/lib/utils";
import { Eyebrow, StageDetailLayout } from "@/pages/lifecycle-stage/layout";
import { Rail, RailAgentNote } from "@/pages/lifecycle-stage/rail";

const FUNNEL = [
  { label: "Signed up", value: "74,500", percent: 100, tone: "ink" as const, trailing: null },
  { label: "Completed profile", value: "61,200", percent: 82, tone: "ultra" as const, trailing: "−13,300" },
  { label: "Added to basket", value: "48,900", percent: 66, tone: "ultra" as const, trailing: "−12,300" },
  { label: "Reached checkout", value: "39,100", percent: 52, tone: "ultra" as const, trailing: "−9,800" },
  { label: "Saw the delivery fee", value: "39,100", percent: 52, tone: "amber" as const, trailing: "the surprise" },
  { label: "First order placed", value: "30,500", percent: 41, tone: "teal" as const, trailing: "−8,600" },
];

const TONE_BAR_CLASSES = {
  ink: "bg-ink-4",
  ultra: "bg-ultra",
  amber: "bg-amber",
  teal: "bg-teal",
  rose: "bg-rose",
} as const;

const TIME_TO_VALUE = [
  { label: "Same day", bucket: "38%", percent: 84, tone: "teal" as const, trailing: "44% still ordering at M6" },
  { label: "Within 3 days", bucket: "24%", percent: 53, tone: "teal" as const, trailing: "31% still ordering at M6" },
  { label: "Within 2 weeks", bucket: "19%", percent: 42, tone: "amber" as const, trailing: "18% still ordering at M6" },
  { label: "Later, or never", bucket: "19%", percent: 42, tone: "rose" as const, trailing: "4% still ordering at M6" },
];

const TONE_TEXT_CLASSES = {
  teal: "text-teal",
  amber: "text-amber",
  rose: "text-rose",
} as const;

/** Screen 17 (stage activate) — see flolyt-kit-122/17-stage-activate.svg. */
const StageActivate = () => {
  return (
    <StageDetailLayout
      title="Activate"
      subtitle="Only 41% of new customers reach first value · ₦188M never starts earning"
      rail={
        <Rail heading="WHAT PRODUCT OWNS HERE">
          <div className="rounded-card border border-amber-border bg-amber-bg p-4">
            <h3 className="text-[12.5px] font-semibold text-ink">
              Show the fee at basket, not at checkout
            </h3>
            <p className="mt-2 text-[11px] leading-relaxed text-ink-2">
              One release. Modelled at +6.4 points of activation and ₦188M a year.
            </p>
            <span className="mt-3 inline-flex rounded-chip border border-amber-border bg-paper px-2 py-1 text-[9.5px] font-semibold text-amber">
              Highest expected value
            </span>
          </div>

          <div className="rounded-card border border-line bg-paper p-4">
            <h3 className="text-[12.5px] font-semibold text-ink">
              Cut the profile step to two fields
            </h3>
            <p className="mt-2 text-[11px] leading-relaxed text-ink-3">
              13,300 leave before they see a product. Nine of the fields are never read again.
            </p>
          </div>

          <div className="rounded-card border border-line bg-paper p-4">
            <h3 className="text-[12.5px] font-semibold text-ink">
              Guarantee same-day delivery in Lagos
            </h3>
            <p className="mt-2 text-[11px] leading-relaxed text-ink-3">
              Same-day customers retain at 44%. Everyone else falls off a cliff.
            </p>
          </div>

          <RailAgentNote label="ACTIVATION AGENT">
            These are ranked by expected revenue, not by effort. Engineering&rsquo;s estimate goes
            on top of this, not instead of it.
          </RailAgentNote>
        </Rail>
      }
    >
      <section>
        <Eyebrow>From signup to first value</Eyebrow>
        <div className="mt-4 space-y-3">
          {FUNNEL.map((step) => (
            <div key={step.label} className="grid grid-cols-[140px_1fr_90px] items-center gap-3">
              <span className="text-[12px] font-medium text-ink">{step.label}</span>
              <div className="relative h-page rounded-control bg-paper">
                <div
                  className={cn("flex h-page items-center rounded-control px-2", TONE_BAR_CLASSES[step.tone])}
                  style={{ width: `${step.percent}%` }}
                >
                  <span className="font-mono text-[11px] font-semibold text-white">{step.value}</span>
                </div>
              </div>
              <span
                className={cn(
                  "text-right font-mono text-[11px]",
                  step.tone === "amber" ? "text-amber" : "text-ink-4"
                )}
              >
                {step.trailing}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-card border border-rose-border bg-rose-bg p-5">
          <h3 className="text-[12.5px] font-semibold text-ink">
            The largest single drop is the last one
          </h3>
          <p className="mt-2 text-[11.5px] leading-relaxed text-ink-2">
            8,600 people a month reach checkout, see a fee they were not shown earlier, and leave.
            Before 4 March the same step lost 2,800.
          </p>
        </div>
      </section>

      <section>
        <Eyebrow>Time to first value · and what it predicts</Eyebrow>
        <div className="mt-4 space-y-3.5">
          {TIME_TO_VALUE.map((row) => (
            <div key={row.label} className="grid grid-cols-[130px_36px_1fr_170px] items-center gap-3">
              <span className="text-[12px] font-medium text-ink">{row.label}</span>
              <span className="font-mono text-[12px] text-ink-2">{row.bucket}</span>
              <div className="h-2.5 rounded-full bg-paper">
                <div
                  className={cn("h-2.5 rounded-full", TONE_BAR_CLASSES[row.tone])}
                  style={{ width: `${row.percent}%` }}
                />
              </div>
              <span className={cn("text-[11.5px]", TONE_TEXT_CLASSES[row.tone] ?? "text-ink-3")}>
                {row.trailing}
              </span>
            </div>
          ))}
        </div>
      </section>
    </StageDetailLayout>
  );
};

export default StageActivate;
