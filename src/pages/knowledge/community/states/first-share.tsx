import { cn } from "@/lib/utils";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { KpiCards } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { QuoteCard } from "@/pages/knowledge/business-memory/quote-card";
import { CM02_NOTE, CM02_QUOTE, CM02_REMOVED_ROWS, CM02_STATS, CM_CHIP_TONE, CM_KPI_TONE } from "@/pages/knowledge/community/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** CM02 — 20 minutes after the first thing was shared. Wired but unreachable with COMMUNITY_STATE's current default. */
export function FirstShareState() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Community</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">1 · shared 20 minutes ago</p>
      </div>

      <QuoteCard text={CM02_QUOTE.text} source={CM02_QUOTE.source} />

      <KpiCards items={CM02_STATS.map((s) => ({ eyebrow: s.eyebrow, value: s.value, note: s.note, tone: CM_KPI_TONE[s.tone] }))} />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>What was removed before it left, and why</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[720px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>In your workspace</th>
                <th className={`${HEAD_CLASS} text-right`}>What left</th>
                <th className={`${HEAD_CLASS} text-right`}>Why</th>
              </tr>
            </thead>
            <tbody>
              {CM02_REMOVED_ROWS.map((row) => (
                <tr key={row.inWorkspace} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.inWorkspace}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={CM_CHIP_TONE[row.whatLeftTone]}>{row.whatLeft}</Chip>
                  </td>
                  <td className={cn("px-4 py-3 text-right", row.whatLeftTone === "risk" ? "text-rose" : "text-teal")}>
                    {row.why}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="The first thing this company gave the community came out of its least successful room">
        {CM02_NOTE}
      </Callout>
    </div>
  );
}
