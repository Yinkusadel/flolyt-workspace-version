import { cn } from "@/lib/utils";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { StageSubpageHeader } from "@/pages/everyday/lifecycle/stage/stage-subpage-header";
import { ABSENT_ROWS, RC08_HERO, RC08_NOTES, RC_CHIP_TONE, RC_TONE_CLASS } from "@/pages/knowledge/recognition/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** RC08 — /recognition/absent, "Who never appears here". Own header, no tab bar. */
const AbsentRoute = () => {
  return (
    <div className="space-y-8">
      <StageSubpageHeader
        crumbs={[{ label: "Recognition", to: "/recognition" }, { label: "Who never appears here" }]}
        title="Who never appears here"
        subtitle="Five of fourteen people have nothing recognised · one of them is the person everything waits on"
      />

      <div className="rounded-card border border-line bg-paper p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">{RC08_HERO.label}</p>
            <p className="mt-1.5 text-[24px] font-semibold text-ink">{RC08_HERO.big}</p>
            <p className="mt-1 max-w-lg text-[11px] text-ink-3">{RC08_HERO.sub}</p>
          </div>
          <div className="sm:text-right">
            <p className="font-mono text-[8.5px] font-medium tracking-[0.85px] text-ink-4 uppercase">{RC08_HERO.rightLabel}</p>
            <p className="mt-1.5 text-[18px] font-semibold text-ink">{RC08_HERO.rightBig}</p>
            <p className="mt-1 font-mono text-[9.5px] text-amber">{RC08_HERO.rightSub}</p>
          </div>
        </div>
      </div>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Who is not here, and what that appears to mean</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[860px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Person</th>
                <th className={`${HEAD_CLASS} text-right`}>Team</th>
                <th className={`${HEAD_CLASS} text-right`}>Entries</th>
                <th className={HEAD_CLASS}>What their work looks like in this product</th>
                <th className={HEAD_CLASS}>Reading</th>
              </tr>
            </thead>
            <tbody>
              {ABSENT_ROWS.map((row) => (
                <tr key={row.person} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.person}</td>
                  <td className="px-4 py-3 text-right text-ink-4">{row.team}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={RC_CHIP_TONE[row.entriesTone]}>{row.entries}</Chip>
                  </td>
                  <td className="px-4 py-3 text-ink-3">{row.workLooksLike}</td>
                  <td className={cn("px-4 py-3", RC_TONE_CLASS[row.readingTone])}>{row.reading}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="rose" title="Sam Iyer has nothing recognised and everything in this workspace is waiting on him">
        {RC08_NOTES.sam}
      </Callout>

      <Callout tone="amber" title="Absence from this screen is not evidence of anything and the screen says so twice">
        {RC08_NOTES.absenceNotEvidence}
      </Callout>
    </div>
  );
};

export default AbsentRoute;
