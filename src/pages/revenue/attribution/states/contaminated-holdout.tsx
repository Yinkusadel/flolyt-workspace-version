import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { KpiCards } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { AttributionKvList } from "@/pages/revenue/attribution/kv-list";
import { AttributionTabs } from "@/pages/revenue/attribution/tabs";
import { AT14_ALERT, AT14_OPTIONS, AT14_OTHER_KV, AT14_STATS, AT_CHIP_TONE, AT_KPI_TONE, AT_TONE_CLASS } from "@/pages/revenue/attribution/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** AT14 — a holdout compromised by a resend that ignored the hold list. Wired but unreachable with HOLDOUT_STATE's current default. */
export function ContaminatedHoldoutState() {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Holdouts</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">1 of 4 holdouts compromised · 1,204 of 10,000 held customers were treated · the ₦9.1M figure is withdrawn, not adjusted</p>
        </div>
        <Button type="button" onClick={() => toast.info("Ifeoma has been asked to decide")}>
          Ask Ifeoma to decide
        </Button>
      </div>

      <AttributionTabs active="Holdouts" />

      <div className="rounded-card border border-rose-border bg-rose-bg p-4">
        <p className="text-[12px] font-semibold text-ink">{AT14_ALERT.title}</p>
        <p className="mt-1.5 text-[10.5px] leading-relaxed text-ink-2">{AT14_ALERT.body}</p>
      </div>

      <KpiCards items={AT14_STATS.map((s) => ({ eyebrow: s.eyebrow, value: s.value, note: s.note, tone: s.tone ? AT_KPI_TONE[s.tone] : "ink" }))} />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Three ways this can be handled, and what each one costs</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[860px] text-left text-[11.5px]">
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
              {AT14_OPTIONS.map((row) => (
                <tr key={row.option} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.option}</td>
                  <td className="px-4 py-3 text-ink-2">{row.whatItDoes}</td>
                  <td className={`px-4 py-3 text-right ${AT_TONE_CLASS[row.answerByTone]}`}>{row.answerBy}</td>
                  <td className={`px-4 py-3 ${AT_TONE_CLASS[row.costTone]}`}>{row.cost}</td>
                  <td className="px-4 py-3">
                    <Chip tone={AT_CHIP_TONE[row.stateTone]}>{row.state}</Chip>
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
        and no causal figure from wave one, and the screen will not pick for her.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What happened to the other three holdouts</p>
        <AttributionKvList rows={AT14_OTHER_KV} />
      </section>
    </div>
  );
}
