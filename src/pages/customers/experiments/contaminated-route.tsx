import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { KpiCards } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { ExperimentsTabs } from "@/pages/customers/experiments/tabs";
import { EX_KPI_TONE, XP08_OPTION_ROWS, XP08_STATS } from "@/pages/customers/experiments/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** XP08 — /experiments/contaminated, reached from Running's "contaminated" state chip on wave one. */
const ExperimentsContaminatedRoute = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">When one breaks</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">1,204 of 10,000 held customers were treated · the figure is withdrawn, not adjusted</p>
        </div>
        <Button type="button" onClick={() => toast.info("Sent to Ifeoma · awaiting her decision")}>
          Ask Ifeoma to decide
        </Button>
      </div>

      <ExperimentsTabs active="Running" />

      <div className="rounded-card border border-rose-border bg-rose-bg p-4">
        <p className="text-[12px] font-semibold text-ink">1,204 people in the wave one holdout received the message anyway</p>
        <p className="mt-1.5 text-[10.5px] leading-relaxed text-ink-2">
          A resend on 14 August was built outside the play and ignored the hold list. Twelve per cent of the held
          group is now treated, and the comparison this experiment exists to produce is no longer clean.
        </p>
      </div>

      <KpiCards items={XP08_STATS.map((s) => ({ eyebrow: s.eyebrow, value: s.value, note: s.note, tone: EX_KPI_TONE[s.tone] }))} />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Three ways this can be handled, and what each one costs</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[920px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Option</th>
                <th className={HEAD_CLASS}>What it does</th>
                <th className={`${HEAD_CLASS} text-right`}>Answer by</th>
                <th className={HEAD_CLASS}>Cost</th>
                <th className={HEAD_CLASS}>State</th>
              </tr>
            </thead>
            <tbody>
              {XP08_OPTION_ROWS.map((row) => (
                <tr key={row.option} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.option}</td>
                  <td className="px-4 py-3 text-ink-3">{row.whatItDoes}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink-4">{row.answerBy}</td>
                  <td className="px-4 py-3 text-amber">{row.cost}</td>
                  <td className="px-4 py-3">
                    <Chip tone={row.stateTone === "risk" ? "rose" : "neutral"}>{row.state}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="rose" title="The first option is the tempting one and it is the one that quietly breaks the method">
        Dropping 1,204 people leaves 8,796 people who were held and also happened not to be resent to, which is a
        group selected by the failure itself rather than at random. It would produce a number, and the number
        would be biased in a direction nobody could estimate. Ifeoma has to choose between twenty-four more days
        and no causal figure from wave one, and this screen will not pick for her.
      </Callout>

      <Callout tone="teal" title="The other three experiments were checked and are clean">
        Wave two used a different send, Kenya is a different channel entirely and the basket prompt had not
        started. The overlap check runs nightly against every hold list, which is how this was found in fourteen
        hours rather than at close-out — and it is why the other three can be stated as clean rather than assumed
        to be.
      </Callout>
    </div>
  );
};

export default ExperimentsContaminatedRoute;
