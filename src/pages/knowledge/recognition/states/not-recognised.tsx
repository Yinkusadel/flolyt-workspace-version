import { cn } from "@/lib/utils";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { RC01_ACT_ROWS, RC01_NOTE, RC_CHIP_TONE, RC_TONE_CLASS } from "@/pages/knowledge/recognition/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** RC01 — before anything has been recognised. Wired but unreachable with RECOGNITION_STATE's current default. */
export function NotRecognisedState() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Recognition</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">0 · nothing recognised yet</p>
      </div>

      <div className="rounded-surface border border-dashed border-line bg-paper p-8 text-center sm:p-10">
        <h2 className="text-[16px] font-semibold text-ink sm:text-[17px]">
          Nothing has been recognised yet, and this will never be a leaderboard
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-[11.5px] leading-relaxed text-ink-3">
          Recovery is credited to a metric here and never to a person. This section exists for the other thing — the
          acts that make the numbers trustworthy and would score badly in any system that counted them.
        </p>
        <p className="mx-auto mt-5 max-w-lg text-[10px] text-ink-4">
          The value ledger already knows who recovered what. It will not tell this section, and this section will
          not ask.
        </p>
      </div>

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What this section recognises, and what it deliberately cannot see</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[720px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Kind of act</th>
                <th className={HEAD_CLASS}>Example</th>
                <th className={`${HEAD_CLASS} text-right`}>Recognised?</th>
                <th className={`${HEAD_CLASS} text-right`}>Why</th>
              </tr>
            </thead>
            <tbody>
              {RC01_ACT_ROWS.map((row) => (
                <tr key={row.kind} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2 whitespace-nowrap">{row.kind}</td>
                  <td className="px-4 py-3 text-ink-3">{row.example}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={RC_CHIP_TONE[row.recognisedTone]}>{row.recognised}</Chip>
                  </td>
                  <td className={cn("px-4 py-3 text-right", RC_TONE_CLASS[row.whyTone])}>{row.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="rose" title="The fifth row is not an oversight and it is the row people argue about">
        {RC01_NOTE}
      </Callout>
    </div>
  );
}
