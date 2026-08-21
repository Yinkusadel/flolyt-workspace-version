import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { XP01_CANDIDATE_ROWS, EX_TONE_CLASS } from "@/pages/customers/experiments/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** XP01 — before any holdout is running. Wired but unreachable with EXPERIMENTS_STATE's current default. */
export function NothingToMeasureState() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Experiments</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">No holdouts running · four candidates, one of which should never be run</p>
      </div>

      <div className="rounded-surface border border-dashed border-line bg-paper p-8 text-center sm:p-10">
        <h2 className="text-[16px] font-semibold text-ink sm:text-[17px]">Nothing is being held back, so nothing is being measured</h2>
        <p className="mx-auto mt-3 max-w-2xl text-[11.5px] leading-relaxed text-ink-3">
          An experiment here is one thing: a group of customers deliberately left out of something, so that the
          people who received it can be compared against somebody. Until a group is held, every result this
          workspace produces is a before-and-after.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <Button type="button" onClick={() => navigate("/experiments/new")}>
            Design an experiment
          </Button>
          <Button type="button" variant="outline" onClick={() => toast.info("A room, a cohort, a holdout, a failure condition and one named signer")}>
            What an experiment needs here
          </Button>
        </div>
        <p className="mx-auto mt-5 max-w-lg text-[10px] text-ink-4">
          Six campaigns could carry a holdout today. None of them does.
        </p>
      </div>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What could be measured, and what it would cost to measure it</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[860px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Campaign that could carry one</th>
                <th className={`${HEAD_CLASS} text-right`}>Audience</th>
                <th className={`${HEAD_CLASS} text-right`}>A 10% holdout would be</th>
                <th className={`${HEAD_CLASS} text-right`}>Answer in</th>
                <th className={`${HEAD_CLASS} text-right`}>What holding costs</th>
              </tr>
            </thead>
            <tbody>
              {XP01_CANDIDATE_ROWS.map((row) => (
                <tr key={row.campaign} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.campaign}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink">{row.audience}</td>
                  <td className={`px-4 py-3 text-right font-mono ${EX_TONE_CLASS[row.holdoutTone]}`}>{row.holdout}</td>
                  <td className={`px-4 py-3 text-right ${EX_TONE_CLASS[row.answerInTone]}`}>{row.answerIn}</td>
                  <td className={`px-4 py-3 text-right ${EX_TONE_CLASS[row.costTone]}`}>{row.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="rose" title="The last row is the one that should never be run and it is listed anyway">
        Holding 310 people back from an apology they are owed would produce a clean number and would be
        indefensible. Leaving it off this list would let somebody discover the idea later without the argument
        attached. It is shown, priced in the same column as the others, and Amara has already refused it once.
      </Callout>
    </div>
  );
}
