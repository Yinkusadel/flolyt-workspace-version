import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { TeammatesTabs } from "@/pages/agents/ai-teammates/tabs";
import { TM06_ROWS, TM_TONE_CLASS } from "@/pages/agents/ai-teammates/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** TM06 — /ai-teammates/conflicts. */
const ConflictsRoute = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Disagreements</h1>
          <p className="mt-1 text-[11.5px] text-ink-3">Four conflicts raised, none resolved · two of them are in front of nobody</p>
        </div>
        <Button type="button" size="sm" onClick={() => toast.info("Assigning conflict owners lives in Lifecycle settings")}>
          Assign an owner
        </Button>
      </div>

      <TeammatesTabs active="Disagreements" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Where two agents read the same thing differently</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[900px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>The disagreement</th>
                <th className={`${HEAD_CLASS} text-right`}>Between</th>
                <th className={`${HEAD_CLASS} text-right`}>Raised</th>
                <th className={`${HEAD_CLASS} text-right`}>Orchestrator</th>
                <th className={`${HEAD_CLASS} text-right`}>Waiting on</th>
                <th className={`${HEAD_CLASS} text-right`}>Age</th>
              </tr>
            </thead>
            <tbody>
              {TM06_ROWS.map((row) => (
                <tr key={row.disagreement} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink">{row.disagreement}</td>
                  <td className="px-4 py-3 text-right text-ink-4">{row.between}</td>
                  <td className="px-4 py-3 text-right text-ink-4">{row.raised}</td>
                  <td className="px-4 py-3 text-right text-ultra">{row.orchestrator}</td>
                  <td className={`px-4 py-3 text-right ${TM_TONE_CLASS[row.waitingOnTone]}`}>{row.waitingOn}</td>
                  <td className={`px-4 py-3 text-right font-mono ${TM_TONE_CLASS[row.ageTone]}`}>{row.age}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="The Orchestrator has raised four conflicts and resolved none, which is the whole of its job">
        It names the disagreement, prices it where a price exists, and hands it to the people who own the two
        sides. It will not average two readings into a compromise nobody proposed, and it cannot propose anything of
        its own — including the tie-break that would make three of these disappear this afternoon.
      </Callout>

      <Callout tone="rose" title="Two of the four are waiting on nobody, and have been for three weeks">
        The Expand-versus-Price disagreement is ₦16M held out of the ledger. The Support-versus-Churn one is about
        the earliest churn signal in the workspace. Both route to owners who do not exist, so the conflict sits
        correctly raised, correctly unresolved, and permanently in front of no one.
      </Callout>
    </div>
  );
};

export default ConflictsRoute;
