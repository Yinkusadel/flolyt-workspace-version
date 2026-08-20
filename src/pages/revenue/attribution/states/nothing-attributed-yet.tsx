import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { AT01_ROWS, AT_TONE_CLASS } from "@/pages/revenue/attribution/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** AT01 — before any holdout has closed. Wired but unreachable with ATTRIBUTION_STATE's current default. */
export function NothingAttributedYetState() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Attribution</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">Nothing attributed yet · no holdout has closed</p>
      </div>

      <div className="rounded-surface border border-dashed border-line bg-paper p-8 text-center sm:p-10">
        <h2 className="text-[16px] font-semibold text-ink sm:text-[17px]">Nothing has been attributed to anything yet</h2>
        <p className="mx-auto mt-3 max-w-xl text-[11.5px] leading-relaxed text-ink-3">
          Three interventions are running and none of them has finished. Attribution needs a group that did not
          receive the thing, and every holdout in the workspace is still open. The first figure lands when the
          first one closes.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <Button type="button">See the holdouts</Button>
          <Button type="button" variant="outline">
            How attribution works here
          </Button>
        </div>
        <p className="mx-auto mt-5 max-w-lg text-[10px] text-ink-4">
          Nine days is the shortest holdout running. It closes on 2 April.
        </p>
      </div>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Running now · what each one will be able to claim, and what it will not</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[760px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Intervention</th>
                <th className={`${HEAD_CLASS} text-right`}>Started</th>
                <th className={`${HEAD_CLASS} text-right`}>Holdout</th>
                <th className={`${HEAD_CLASS} text-right`}>Closes</th>
                <th className={`${HEAD_CLASS} text-right`}>What it will be able to say</th>
              </tr>
            </thead>
            <tbody>
              {AT01_ROWS.map((row) => (
                <tr key={row.intervention} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.intervention}</td>
                  <td className="px-4 py-3 text-right text-ink-4">{row.started}</td>
                  <td className={`px-4 py-3 text-right font-mono ${AT_TONE_CLASS[row.holdoutTone]}`}>{row.holdout}</td>
                  <td className="px-4 py-3 text-right text-ink-4">{row.closes}</td>
                  <td className={`px-4 py-3 text-right ${AT_TONE_CLASS[row.willSayTone]}`}>{row.willSay}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="teal" title="The third one will never produce a number and it was still the right thing to run">
        Withholding an apology from 310 people to measure the other 3,100 was refused by Amara on the day. The
        refund will show up in the ledger as money returned and in this section as unattributable, and both of
        those are true at once. A product that only counts what it can measure teaches people to stop doing the
        rest.
      </Callout>
    </div>
  );
}
