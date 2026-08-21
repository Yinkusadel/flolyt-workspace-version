import { cn } from "@/lib/utils";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { PersonDot } from "@/pages/everyday/rooms/actor";
import { BusinessMemoryTabs } from "@/pages/knowledge/business-memory/tabs";
import { BM_CHIP_TONE, BM_TONE_CLASS, CHALLENGED_ROWS, ME09_NOTES } from "@/pages/knowledge/business-memory/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** ME09 — /business-memory/challenged. */
const ChallengedRoute = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Business memory</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">Four challenges · three open</p>
      </div>

      <BusinessMemoryTabs active="Challenged" />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>Learnings somebody has disagreed with, in writing</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[900px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Learning</th>
                <th className={HEAD_CLASS}>Challenged by</th>
                <th className={HEAD_CLASS}>The argument</th>
                <th className={`${HEAD_CLASS} text-right`}>Since</th>
                <th className={`${HEAD_CLASS} text-right`}>State</th>
                <th className={HEAD_CLASS}>Resolves how</th>
              </tr>
            </thead>
            <tbody>
              {CHALLENGED_ROWS.map((row) => (
                <tr key={row.learning} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.learning}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1.5 whitespace-nowrap text-ink-2">
                      <PersonDot person={row.by} size="sm" />
                      {row.by.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ink-3">{row.argument}</td>
                  <td className="px-4 py-3 text-right font-mono text-ink-4">{row.since}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={BM_CHIP_TONE[row.stateTone]}>{row.state}</Chip>
                  </td>
                  <td className={cn("px-4 py-3", BM_TONE_CLASS[row.stateTone])}>{row.resolvesHow}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="A challenged learning stays cited and carries the challenge with it">
        {ME09_NOTES.staysCited}
      </Callout>

      <Callout tone="teal" title="Three of four challenges are unresolved and one resolves itself">
        {ME09_NOTES.noAdjudication}
      </Callout>
    </div>
  );
};

export default ChallengedRoute;
