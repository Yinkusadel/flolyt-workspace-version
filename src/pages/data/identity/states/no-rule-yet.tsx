import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { ID01_QUESTION_ROWS, ID_TONE_CLASS } from "@/pages/data/identity/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";
const HEAD_RIGHT_CLASS = "px-4 py-2.5 text-right font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** ID01 — before any identity rule has been set. Wired but unreachable with IDENTITY_STATE's current default. */
export function NoIdentityRuleState() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Identity</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">
          Four questions · no correct answers · every count depends on them
        </p>
      </div>

      <div className="rounded-surface border border-dashed border-line bg-paper p-8 text-center sm:p-10">
        <h2 className="text-[16px] font-semibold text-ink sm:text-[17px]">Nothing has been decided about what counts as one customer</h2>
        <p className="mx-auto mt-3 max-w-xl text-[11.5px] leading-relaxed text-ink-3">
          Two accounts with the same email may be one person or two. An order with no account may be a customer
          nobody can name. Every population figure in this product depends on the answer, and there is no answer
          that is right for every business.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <Button type="button" onClick={() => navigate("/identity/rule")}>
            Set the identity rule
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate("/identity/dependencies")}>
            See what is at stake
          </Button>
        </div>
        <p className="mx-auto mt-5 max-w-lg text-[10px] text-ink-4">
          Every count, cohort, segment and rate in the product resolves through this decision.
        </p>
      </div>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What the rule decides</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[760px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Question</th>
                <th className={HEAD_CLASS}>What depends on it</th>
                <th className={HEAD_RIGHT_CLASS}>If unanswered</th>
              </tr>
            </thead>
            <tbody>
              {ID01_QUESTION_ROWS.map((row) => (
                <tr key={row.question} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.question}</td>
                  <td className="px-4 py-3 text-ink-2">{row.dependsOn}</td>
                  <td className={`px-4 py-3 text-right ${ID_TONE_CLASS[row.ifUnansweredTone]}`}>{row.ifUnanswered}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="There is no correct answer here, only a stated one">
        A marketplace, a subscription business and a delivery service each answer these differently and all three
        are right. What the product requires is that the answer is written, versioned and visible on every figure
        that depends on it — because the failure mode is not choosing wrongly, it is four teams each assuming a
        different answer.
      </Callout>
    </div>
  );
}
