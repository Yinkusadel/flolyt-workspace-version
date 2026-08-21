import { cn } from "@/lib/utils";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { CommunityTabs } from "@/pages/knowledge/community/tabs";
import { CM05_NOTES, CM_CHIP_TONE, CM_TONE_CLASS, CONSTRAINT_ROWS } from "@/pages/knowledge/community/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** CM05 — /community/constraints. */
const ConstraintsRoute = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Community</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">
          Six shared constraints · this workspace has hit all six · one nobody has ever solved
        </p>
      </div>

      <CommunityTabs active="Constraints" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Walls other companies have hit · the most useful thing in this section</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[900px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Constraint</th>
                <th className={`${HEAD_CLASS} text-right`}>Companies</th>
                <th className={HEAD_CLASS}>What it blocks</th>
                <th className={`${HEAD_CLASS} text-right`}>Have you hit it?</th>
                <th className={`${HEAD_CLASS} text-right`}>Anyone solved it?</th>
              </tr>
            </thead>
            <tbody>
              {CONSTRAINT_ROWS.map((row) => (
                <tr key={row.constraint} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.constraint}</td>
                  <td className={cn("px-4 py-3 text-right font-mono", CM_TONE_CLASS[row.companiesTone])}>{row.companies}</td>
                  <td className="px-4 py-3 text-ink-3">{row.blocks}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={CM_CHIP_TONE[row.haveYouHitTone]}>{row.haveYouHit}</Chip>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={CM_CHIP_TONE[row.anyoneSolvedTone]}>{row.anyoneSolved}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="rose" title="Every constraint on this list is one this workspace has also hit, which is the finding">
        {CM05_NOTES.sixForSix}
      </Callout>

      <Callout tone="ultra" title="Only one row has nobody who has solved it, and it is the honest one">
        {CM05_NOTES.oneUnsolved}
      </Callout>
    </div>
  );
};

export default ConstraintsRoute;
