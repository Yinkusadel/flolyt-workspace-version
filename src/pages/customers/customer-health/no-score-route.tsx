import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { HL04_CARDS, HL04_QUESTION_ROWS, HL04_WEIGHT_ROWS, HL_TONE_CLASS } from "@/pages/customers/customer-health/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

const CARD_ACCENT_CLASS = {
  muted: "border-line bg-paper",
  warn: "border-amber-border bg-amber-bg",
  ai: "border-ultra-border bg-ultra-bg",
} as const;

/** HL04 — /customer-health/no-score. */
const CustomerHealthNoScoreRoute = () => {
  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Customer health", to: "/customer-health" }, { label: "Why there is no score" }]}
        title="Why there is no score"
        subtitle="Asked for five times · five signals, five weights nobody would own"
        action={
          <Button type="button" asChild>
            <Link to="/customer-health">See the signals</Link>
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {HL04_CARDS.map((card) => (
          <div key={card.k} className={cn("rounded-card border p-4", CARD_ACCENT_CLASS[card.acc])}>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase">{card.k}</p>
            <h3 className="mt-1.5 text-[13.5px] font-semibold text-ink">{card.b}</h3>
            <p className="mt-2 text-[10.5px] leading-relaxed text-ink-3">{card.t}</p>
            <p className="mt-2.5 border-t border-dashed border-line pt-2.5 font-mono text-[10px] text-ink-4">{card.f}</p>
          </div>
        ))}
      </div>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>The weights nobody can defend</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[760px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Signal</th>
                <th className={`${HEAD_CLASS} text-right`}>Effect on repeat</th>
                <th className={HEAD_CLASS}>What weight would it get?</th>
                <th className={`${HEAD_CLASS} text-right`}>Whose call</th>
                <th className={`${HEAD_CLASS} text-right`}>Reviewed when?</th>
              </tr>
            </thead>
            <tbody>
              {HL04_WEIGHT_ROWS.map((row) => (
                <tr key={row.signal} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.signal}</td>
                  <td className={`px-4 py-3 text-right font-mono ${HL_TONE_CLASS[row.effectTone]}`}>{row.effect}</td>
                  <td className="px-4 py-3 text-ink-3">{row.weight}</td>
                  <td className="px-4 py-3 text-right text-rose">{row.whoseCall}</td>
                  <td className="px-4 py-3 text-right text-rose">{row.reviewed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="rose" title="The weights are the whole product and nobody would own them">
        Every column in that table would have to be a number somebody chose, and once chosen it would be applied to
        4.2 million people and reviewed by nobody. Two of the five signals overlap, one is causal and four are not,
        and one predicts something other than churn entirely. There is no honest weighting, and an unweighted
        average is a weighting that says all five are equal.
      </Callout>

      <Callout tone="ultra" title="A score is not refused because it is inaccurate · it is refused because it cannot be argued with">
        Somebody looking at a customer at 34 out of 100 has no way to disagree with it. Somebody looking at “used
        one feature, ordered once, no card failures” can say the second one is wrong and check. Everything in Flolyt
        is built to be disagreed with, and a composite is the one shape that cannot be.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What people actually wanted when they asked for a score</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[720px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>The question behind the request</th>
                <th className={`${HEAD_CLASS} text-right`}>Asked by</th>
                <th className={HEAD_CLASS}>What answers it here</th>
                <th className={HEAD_CLASS}>Where</th>
              </tr>
            </thead>
            <tbody>
              {HL04_QUESTION_ROWS.map((row) => (
                <tr key={row.question} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 text-ink-2">{row.question}</td>
                  <td className="px-4 py-3 text-right text-ink-4">{row.askedBy}</td>
                  <td className="px-4 py-3 text-ink-2">{row.answer}</td>
                  <td className={`px-4 py-3 ${HL_TONE_CLASS[row.whereTone]}`}>{row.where}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="teal" title="Three of the four questions have an answer and the second one never will">
        Nobody can tell you whether one particular account is about to leave, and a score would have produced a
        confident number for exactly that question. The requests are recorded here with what does answer them, so
        the fifth time somebody asks, the conversation starts from the question rather than from the feature.
      </Callout>
    </div>
  );
};

export default CustomerHealthNoScoreRoute;
