import { cn } from "@/lib/utils";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { RecognitionTabs } from "@/pages/knowledge/recognition/tabs";
import { WhoCell } from "@/pages/knowledge/recognition/who-cell";
import { CONTRIBUTION_ROWS, RC06_NOTES, RC_CHIP_TONE, RC_TONE_CLASS } from "@/pages/knowledge/recognition/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** RC06 — /recognition/contributions. */
const ContributionsRoute = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Recognition</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">
          Six written contributions · the most cited one is a note about what a word means
        </p>
      </div>

      <RecognitionTabs active="Contributions" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Learnings and constraints, and who wrote them</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[860px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Written</th>
                <th className={HEAD_CLASS}>By</th>
                <th className={`${HEAD_CLASS} text-right`}>Cited</th>
                <th className={HEAD_CLASS}>What it saves</th>
                <th className={`${HEAD_CLASS} text-right`}>Kind</th>
              </tr>
            </thead>
            <tbody>
              {CONTRIBUTION_ROWS.map((row) => (
                <tr key={row.written} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.written}</td>
                  <td className="px-4 py-3">
                    <WhoCell actor={row.who} />
                  </td>
                  <td className={cn("px-4 py-3 text-right font-mono", RC_TONE_CLASS[row.citedTone])}>{row.cited}</td>
                  <td className="px-4 py-3 text-ink-3">{row.saves}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={RC_CHIP_TONE[row.kindTone]}>{row.kind}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="The most cited thing anybody has written is a note about what a word means">
        {RC06_NOTES.mostCited}
      </Callout>

      <Callout tone="amber" title="The citation counts are shown and are not a score">
        {RC06_NOTES.notAScore}
      </Callout>
    </div>
  );
};

export default ContributionsRoute;
