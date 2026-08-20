import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { VL01_ROWS, VL_TONE_CLASS } from "@/pages/revenue/value/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** VL01 — before any room has closed. Wired but unreachable with VALUE_STATE's current default. */
export function NothingRecoveredYetState() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Value</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">Nine rooms open · none closed · the ledger starts when a person says a room is finished</p>
      </div>

      <div className="rounded-surface border border-dashed border-line bg-paper p-8 text-center sm:p-10">
        <h2 className="text-[16px] font-semibold text-ink sm:text-[17px]">Nothing has been recovered yet</h2>
        <p className="mx-auto mt-3 max-w-xl text-[11.5px] leading-relaxed text-ink-3">
          Nine rooms are open and none has closed. A room enters this ledger when somebody decides it is finished
          and says how the result was measured — which means the first figure here arrives on a person's judgement,
          not on a schedule.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <Button type="button">See the open rooms</Button>
          <Button type="button" variant="outline">
            How the ledger works
          </Button>
        </div>
        <p className="mx-auto mt-5 max-w-lg text-[10px] text-ink-4">
          The oldest open room is 27 days old. Nothing closes on its own.
        </p>
      </div>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Open now · what each one will be able to put in the ledger</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[760px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Room</th>
                <th className={`${HEAD_CLASS} text-right`}>At risk</th>
                <th className={`${HEAD_CLASS} text-right`}>Open</th>
                <th className={HEAD_CLASS}>How it will be measured</th>
                <th className={`${HEAD_CLASS} text-right`}>Will produce a figure?</th>
              </tr>
            </thead>
            <tbody>
              {VL01_ROWS.map((row) => (
                <tr key={row.room} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.room}</td>
                  <td className={`px-4 py-3 text-right font-mono ${VL_TONE_CLASS[row.atRiskTone]}`}>{row.atRisk}</td>
                  <td className="px-4 py-3 text-right text-ink-4">{row.open}</td>
                  <td className="px-4 py-3 text-ink-2">{row.howMeasured}</td>
                  <td className={`px-4 py-3 text-right ${VL_TONE_CLASS[row.willProduceTone]}`}>{row.willProduce}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="amber" title="Three of four will produce a number and the biggest one has not decided how">
        The ₦412M room is two days old and the holdout is still a sentence rather than a design. That is the normal
        order of things and it is worth naming, because a room that starts running before its measurement exists is
        a room that closes as unmeasurable — which is how the Accra campaign ended up with GHS 380k nobody can
        attribute.
      </Callout>
    </div>
  );
}
