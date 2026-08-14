import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Eyebrow, StageDetailLayout } from "@/pages/lifecycle/stage/layout";
import { Rail, RailCallout, RailInsight } from "@/pages/lifecycle/stage/rail";

const LOOP = [
  { label: "Retained customer", value: "1.1M", tone: "teal" as const },
  { label: "Asked at the right moment", value: "412k", tone: "ultra" as const },
  { label: "Referred someone", value: "124k", tone: "teal" as const },
  { label: "Referral signed up", value: "271k", tone: "teal" as const },
  { label: "Referral retained at M6", value: "46%", tone: "teal" as const },
];

const MOMENTS = [
  { label: "Right after a delivery arrives early", value: "18.4%", note: "best moment we have", tone: "teal" as const },
  { label: "After a second order", value: "11.2%", note: "strong", tone: "teal" as const },
  { label: "After a resolved complaint", value: "9.8%", note: "surprisingly strong", tone: "teal" as const },
  { label: "On a random Tuesday", value: "1.1%", note: "the default most tools do", tone: "ink" as const },
  { label: "After a failed delivery", value: "0.2%", note: "and 4% unsubscribe", tone: "rose" as const },
  { label: "While a complaint is open", value: "0.1%", note: "and 9% unsubscribe", tone: "rose" as const },
];

const TONE_TEXT = { teal: "text-teal", ultra: "text-ultra", ink: "text-ink-4", rose: "text-rose" } as const;

/** Screen 24 (stage advocate) — see flolyt-kit-122/24-stage-advocate.svg. */
const StageAdvocate = () => {
  return (
    <StageDetailLayout
      title="Advocate"
      subtitle="124,000 people brought someone else · ₦124M of revenue at a CAC of zero"
      rail={
        <Rail heading="WHY THIS IS THE LAST STAGE">
          <RailCallout tone="teal" title="31% of new customers last quarter came from existing ones">
            At ₦0 acquisition cost and better retention than any paid channel. Advocacy is not a
            nice-to-have at the end of the lifecycle; it is the cheapest thing at the start of it.
          </RailCallout>
          <RailInsight title="Referral fell for the first time in two years">
            In the same week as the fee change. Advocacy is the slowest signal and the most
            honest one.
          </RailInsight>
          <RailInsight title="It is measured, not surveyed">
            Referrals that convert, not NPS scores. A promoter who never refers anyone is a
            number, not revenue.
          </RailInsight>
          <RailInsight title="The loop closes here">
            Everything upstream — activation, support, delivery — shows up in whether anyone
            recommends you.
          </RailInsight>
        </Rail>
      }
    >
      <section>
        <Eyebrow>The loop · advocacy is an acquisition channel that starts inside retention</Eyebrow>
        <div className="mt-4 flex flex-wrap items-stretch gap-1">
          {LOOP.map((node, i) => (
            <div key={node.label} className="flex items-center gap-1">
              <div className="w-32 rounded-card border border-line bg-paper-2 p-3">
                <p className="text-[11px] leading-snug text-ink-2">{node.label}</p>
                <p className={cn("mt-3 text-[17px] font-semibold", TONE_TEXT[node.tone])}>
                  {node.value}
                </p>
              </div>
              {i < LOOP.length - 1 && (
                <ChevronRight className="size-3.5 shrink-0 text-ink-4" aria-hidden />
              )}
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-panel border border-teal-border bg-teal-bg px-4 py-2.5">
          <p className="text-[11px] text-teal">
            Referred customers retain 15 points better than paid social — and they refer at twice
            the rate themselves
          </p>
        </div>
      </section>

      <section>
        <Eyebrow>When asking works · and when it costs you</Eyebrow>
        <div className="mt-3 divide-y divide-line rounded-card border border-line bg-paper">
          {MOMENTS.map((m) => (
            <div key={m.label} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3">
              <span className="text-[12px] text-ink-2">{m.label}</span>
              <span className={cn("ml-auto font-mono text-[12.5px] font-semibold", TONE_TEXT[m.tone])}>
                {m.value}
              </span>
              <span className={cn("w-44 text-right text-[11px]", TONE_TEXT[m.tone])}>{m.note}</span>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-card border border-amber-border bg-amber-bg p-5">
          <h3 className="text-[12.5px] font-semibold text-ink">Asking is not free</h3>
          <p className="mt-2 text-[11.5px] leading-relaxed text-ink-2">
            Two of these moments cost more in unsubscribes than they earn in referrals. Agents
            may not ask during an open complaint or after a failed delivery — that is a block,
            not a recommendation.
          </p>
        </div>
      </section>
    </StageDetailLayout>
  );
};

export default StageAdvocate;
