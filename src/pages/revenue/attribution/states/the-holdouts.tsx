import { useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { AttributionTabs } from "@/pages/revenue/attribution/tabs";
import { CreditARecoveryModal } from "@/pages/revenue/attribution/modals/credit-a-recovery-modal";
import { AT05_ROWS, AT_EXCLUDED_ROWS, AT_TONE_CLASS } from "@/pages/revenue/attribution/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** AT05 — /attribution/holdouts, the clean (default) state. */
export function TheHoldoutsState() {
  const [creditOpen, setCreditOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Holdouts</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">Four running · every one dated · eight thousand people permanently excluded from all of them</p>
        </div>
        <Button asChild type="button" size="sm">
          <Link to="/attribution/holdouts/new">Design a holdout</Link>
        </Button>
      </div>

      <AttributionTabs active="Holdouts" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Running now · who is being held back from what, and for how long</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[920px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Intervention</th>
                <th className={`${HEAD_CLASS} text-right`}>Held</th>
                <th className={`${HEAD_CLASS} text-right`}>Of</th>
                <th className={`${HEAD_CLASS} text-right`}>Day</th>
                <th className={`${HEAD_CLASS} text-right`}>Ends</th>
                <th className={HEAD_CLASS}>What the held group gets instead</th>
                <th className={`${HEAD_CLASS} text-right`}>Cost of holding</th>
                <th className={HEAD_CLASS} />
              </tr>
            </thead>
            <tbody>
              {AT05_ROWS.map((row) => (
                <tr key={row.intervention} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.intervention}</td>
                  <td className="px-4 py-3 text-right font-mono text-teal">{row.held}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink">{row.of}</td>
                  <td className="px-4 py-3 text-right text-ink-4">{row.day}</td>
                  <td className={`px-4 py-3 text-right ${AT_TONE_CLASS[row.endsTone]}`}>{row.ends}</td>
                  <td className="px-4 py-3 text-ink-2">{row.instead}</td>
                  <td className={`px-4 py-3 text-right font-mono ${AT_TONE_CLASS[row.costTone]}`}>{row.cost}</td>
                  <td className="px-4 py-3 text-right">
                    {row.intervention === "Kenya retry window" && (
                      <Button type="button" size="sm" variant="outline" onClick={() => setCreditOpen(true)}>
                        Credit
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="teal" title="Every holdout has an end date and none of them can be extended quietly">
        A holdout that runs indefinitely stops being a measurement and becomes a group of customers permanently
        receiving less. Extending one takes the same approval as starting it, the extension appears here as a
        separate row, and the person who approved the original is told. Two have been extended since January and
        both are in the history.
      </Callout>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Who is never held back, in any experiment, ever</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[820px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Group</th>
                <th className={`${HEAD_CLASS} text-right`}>Size</th>
                <th className={HEAD_CLASS}>Why</th>
                <th className={HEAD_CLASS}>Set by</th>
                <th className={`${HEAD_CLASS} text-right`}>Can it be overridden?</th>
              </tr>
            </thead>
            <tbody>
              {AT_EXCLUDED_ROWS.map((row) => (
                <tr key={row.group} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.group}</td>
                  <td className={`px-4 py-3 text-right font-mono ${AT_TONE_CLASS[row.sizeTone]}`}>{row.size}</td>
                  <td className="px-4 py-3 text-ink-2">{row.why}</td>
                  <td className="px-4 py-3 text-ink-4">{row.setBy}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone="rose">no</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="amber" title="Eight thousand people are permanently outside every experiment the company runs">
        That biases every result slightly and knowably: the most upset, the most owed and the most opted-out are
        never in a treated or a held group. It is a real limitation on all ₦93M of the causal figures, it is
        written here rather than in a footnote, and it is not going to be fixed by making the exclusion list
        shorter.
      </Callout>

      <CreditARecoveryModal open={creditOpen} onOpenChange={setCreditOpen} />
    </div>
  );
}
