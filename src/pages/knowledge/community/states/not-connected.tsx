import { cn } from "@/lib/utils";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { CM01_NOTE, CM01_TRAVEL_ROWS, CM_CHIP_TONE, CM_TONE_CLASS } from "@/pages/knowledge/community/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** CM01 — before the workspace is connected. Wired but unreachable with COMMUNITY_STATE's current default. */
export function NotConnectedState() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Community</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">Off · nothing has left this workspace</p>
      </div>

      <div className="rounded-surface border border-dashed border-line bg-paper p-8 text-center sm:p-10">
        <h2 className="text-[16px] font-semibold text-ink sm:text-[17px]">
          This workspace is not connected to the community
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-[11.5px] leading-relaxed text-ink-3">
          Other companies using Flolyt have written down methods that worked and constraints they hit. None of it is
          visible here until somebody turns this on, and nothing about your customers, your markets or your numbers
          leaves when they do.
        </p>
        <p className="mx-auto mt-5 max-w-lg text-[10px] text-ink-4">
          88 companies are connected. What they can see of you is a list you approve, line by line.
        </p>
      </div>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What can travel between companies, and what never can</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[760px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Kind of thing</th>
                <th className={HEAD_CLASS}>Example</th>
                <th className={`${HEAD_CLASS} text-right`}>Travels?</th>
                <th className={`${HEAD_CLASS} text-right`}>Why</th>
              </tr>
            </thead>
            <tbody>
              {CM01_TRAVEL_ROWS.map((row) => (
                <tr key={row.kind} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2 whitespace-nowrap">{row.kind}</td>
                  <td className="px-4 py-3 text-ink-3">{row.example}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={CM_CHIP_TONE[row.travelsTone]}>{row.travels}</Chip>
                  </td>
                  <td className={cn("px-4 py-3 text-right", CM_TONE_CLASS[row.whyTone])}>{row.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="rose" title="The fourth and fifth rows are the whole reason this section has a wall around it">
        {CM01_NOTE}
      </Callout>
    </div>
  );
}
