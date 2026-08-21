import { Callout } from "@/pages/everyday/lifecycle/stage/rail";
import { Chip } from "@/pages/everyday/lifecycle/stage/chip";
import { KpiCards } from "@/pages/everyday/lifecycle/stage/kpi-cards";
import { EYEBROW_CLASS } from "@/pages/everyday/lifecycle/data";
import { QuoteCard } from "@/pages/knowledge/business-memory/quote-card";
import { BM_CHIP_TONE, BM_KPI_TONE, ME02_LINES_ROWS, ME02_QUOTE, ME02_STATS } from "@/pages/knowledge/business-memory/data";

const HEAD_CLASS = "px-4 py-2.5 font-mono text-[8.5px] font-medium tracking-[0.8px] text-ink-4 uppercase";

/** ME02 — written by a room that claimed ₦0. Wired but unreachable with MEMORY_STATE's current default. */
export function FirstLearningState() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[17px] font-semibold text-ink">Business memory</h1>
        <p className="mt-1 text-[11.5px] text-ink-3">1 learning · written by a room that claimed ₦0</p>
      </div>

      <QuoteCard text={ME02_QUOTE.text} source={ME02_QUOTE.source} />

      <KpiCards items={ME02_STATS.map((s) => ({ eyebrow: s.eyebrow, value: s.value, note: s.note, tone: BM_KPI_TONE[s.tone] }))} />

      <section className="space-y-3">
        <p className={EYEBROW_CLASS}>The two lines that room wrote, and why they are different</p>
        <div className="overflow-x-auto rounded-card border border-line bg-paper">
          <table className="w-full min-w-[720px] text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className={HEAD_CLASS}>Line</th>
                <th className={`${HEAD_CLASS} text-right`}>State</th>
                <th className={HEAD_CLASS}>Why</th>
                <th className={`${HEAD_CLASS} text-right`}>Can it be cited as evidence?</th>
              </tr>
            </thead>
            <tbody>
              {ME02_LINES_ROWS.map((row) => (
                <tr key={row.line} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-semibold text-ink-2">{row.line}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={BM_CHIP_TONE[row.stateTone]}>{row.state}</Chip>
                  </td>
                  <td className="px-4 py-3 text-ink-3">{row.why}</td>
                  <td className="px-4 py-3 text-right">
                    <Chip tone={BM_CHIP_TONE[row.citableTone]}>{row.citable}</Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout tone="ultra" title="The first thing in this workspace's memory came from its least successful room">
        Weekend push fatigue almost certainly worked, claimed nothing, and produced the most reused line in the
        section. A memory that only recorded wins would have nothing in it from that room, and the next four people
        designing a frequency test would each have spent three weeks finding out the same thing.
      </Callout>

      <Callout tone="amber" title="An observation and a constraint look similar and behave completely differently">
        The 41% is real and cannot be used to argue for anything, because nobody can separate it from Ramadan. The
        constraint is a fact about how the product is built and can be cited as evidence tomorrow. Both are kept,
        marked differently, and the difference is enforced when somebody tries to cite them.
      </Callout>
    </div>
  );
}
